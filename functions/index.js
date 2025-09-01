// functions/index.js - Complete Cloud Functions Code
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");
const {initializeApp} = require("firebase-admin/app");

// Firebase Admin SDK'yı başlat
initializeApp();

const db = getFirestore();
const auth = getAuth();

// Manuel olarak kullanıcı authentication durumunu değiştirme
exports.toggleUserAuthStatus = onCall(async (request) => {
  const {uid, disabled} = request.data;
  
  const callerUid = request.auth?.uid;
  if (!callerUid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  try {
    const callerDoc = await db.collection('users').doc(callerUid).get();
    if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
      throw new HttpsError('permission-denied', 'Only admins can perform this action');
    }
    
    // Önce kullanıcının Authentication'da olup olmadığını kontrol et
    let userExistsInAuth = true;
    try {
      await auth.getUser(uid);
    } catch (authError) {
      if (authError.code === 'auth/user-not-found') {
        userExistsInAuth = false;
        console.log(`User ${uid} not found in Authentication, skipping auth update`);
      } else {
        throw authError;
      }
    }
    
    // Eğer Authentication'da varsa durumu güncelle
    if (userExistsInAuth) {
      await auth.updateUser(uid, {
        disabled: disabled
      });
    }
    
    // Log işlemi
    await db.collection('admin_logs').add({
      action: disabled ? 'suspend_user' : 'activate_user',
      targetUserId: uid,
      adminId: callerUid,
      timestamp: new Date(),
      details: `User ${uid} was ${disabled ? 'suspended' : 'activated'}. Auth existed: ${userExistsInAuth}`
    });
    
    return {
      success: true,
      message: `User ${disabled ? 'suspended' : 'activated'} successfully`,
      authUpdated: userExistsInAuth
    };
    
  } catch (error) {
    console.error('Error updating user auth status:', error);
    throw new HttpsError('internal', `Failed to update user status: ${error.message}`);
  }
});

// Kullanıcıyı tamamen silme
exports.deleteUserAuth = onCall(async (request) => {
  const {uid} = request.data;
  
  const callerUid = request.auth?.uid;
  if (!callerUid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  try {
    const callerDoc = await db.collection('users').doc(callerUid).get();
    if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
      throw new HttpsError('permission-denied', 'Only admins can perform this action');
    }
    
    let userExistsInAuth = true;
    try {
      await auth.getUser(uid);
    } catch (authError) {
      if (authError.code === 'auth/user-not-found') {
        userExistsInAuth = false;
      } else {
        throw authError;
      }
    }
    
    if (userExistsInAuth) {
      await auth.deleteUser(uid);
    }
    
    await db.collection('users').doc(uid).update({
      status: 'deleted',
      deletedAt: new Date(),
      deletedBy: callerUid
    });
    
    return {
      success: true,
      message: 'User deleted successfully'
    };
    
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new HttpsError('internal', `Failed to delete user: ${error.message}`);
  }
});

// Kullanıcının tüm refresh token'larını iptal etme (aktif session'ları sonlandırma)
exports.revokeRefreshTokens = onCall(async (request) => {
  const {uid} = request.data;
  const callerUid = request.auth?.uid;
  
  if (!callerUid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  try {
    // Admin kontrolü
    const callerDoc = await db.collection('users').doc(callerUid).get();
    if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
      throw new HttpsError('permission-denied', 'Only admins can perform this action');
    }
    
    // Tüm refresh token'ları iptal et
    await auth.revokeRefreshTokens(uid);
    
    console.log(`Revoked refresh tokens for user: ${uid}`);
    
    return {
      success: true,
      message: 'User sessions revoked successfully'
    };
    
  } catch (error) {
    console.error('Error revoking refresh tokens:', error);
    throw new HttpsError('internal', 'Failed to revoke user sessions');
  }
});

// Firestore değişikliklerini dinleyen otomatik trigger
exports.onUserStatusChange = onDocumentUpdated('users/{userId}', async (event) => {
  const userId = event.params.userId;
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();
  
  // Status değişti mi?
  if (beforeData.status !== afterData.status) {
    try {
      switch (afterData.status) {
        case 'suspended':
          // Authentication'da kullanıcıyı devre dışı bırak
          await auth.updateUser(userId, {
            disabled: true
          });
          console.log(`User ${userId} disabled in Authentication`);
          break;
          
        case 'active':
          // Authentication'da kullanıcıyı aktif et
          await auth.updateUser(userId, {
            disabled: false
          });
          console.log(`User ${userId} enabled in Authentication`);
          break;
          
        case 'deleted':
          // Authentication'dan kullanıcıyı sil
          await auth.deleteUser(userId);
          console.log(`User ${userId} deleted from Authentication`);
          break;
      }
    } catch (error) {
      console.error(`Error updating auth status for user ${userId}:`, error);
    }
  }
});

// Kullanıcı giriş yaparken kontrol
exports.checkUserStatus = onCall(async (request) => {
  const callerUid = request.auth?.uid;
  if (!callerUid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  try {
    const userDoc = await db.collection('users').doc(callerUid).get();
    
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User not found');
    }
    
    const userData = userDoc.data();
    
    // Kullanıcı suspend edilmiş mi?
    if (userData.status === 'suspended') {
      // Authentication'da da devre dışı bırak
      await auth.updateUser(callerUid, {
        disabled: true
      });
      throw new HttpsError('permission-denied', 'Your account has been suspended');
    }
    
    // Kullanıcı silinmiş mi?
    if (userData.status === 'deleted') {
      // Authentication'dan da sil
      await auth.deleteUser(callerUid);
      throw new HttpsError('permission-denied', 'Your account has been deleted');
    }
    
    // Son giriş zamanını güncelle
    await db.collection('users').doc(callerUid).update({
      lastLogin: new Date()
    });
    
    return {
      success: true,
      user: userData
    };
    
  } catch (error) {
    console.error('Error checking user status:', error);
    throw error;
  }
});

// Güvenlik middleware - Her request'te kullanıcı durumunu kontrol et
exports.authMiddleware = onCall(async (request) => {
  const callerUid = request.auth?.uid;
  
  if (!callerUid) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }
  
  try {
    const userDoc = await db.collection('users').doc(callerUid).get();
    
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User profile not found');
    }
    
    const userData = userDoc.data();
    
    // Kullanıcı durumunu kontrol et
    if (userData.status === 'suspended') {
      // Authentication'da da disable et
      await auth.updateUser(callerUid, { disabled: true });
      throw new HttpsError('permission-denied', 'Account suspended');
    }
    
    if (userData.status === 'deleted') {
      // Authentication'dan sil
      await auth.deleteUser(callerUid);
      throw new HttpsError('permission-denied', 'Account deleted');
    }
    
    return {
      success: true,
      userStatus: userData.status,
      userRole: userData.role
    };
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    throw error;
  }
});/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
