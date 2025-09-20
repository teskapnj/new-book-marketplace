// app/api/admin/verify-access/route.ts - Secure Admin Verification
import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK initialization
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

interface RequestBody {
  uid: string;
  email: string;
  requestedLevel: 'basic' | 'full';
}

interface SecurityIncident {
  type: string;
  uid?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  requestedUid?: string;
  tokenEmail?: string;
  requestedEmail?: string;
  requestedLevel?: string;
  currentLevel?: string;
  details?: Record<string, unknown>;
}

interface AdminAccessLog {
  uid: string;
  email: string;
  adminLevel: string;
  ip: string;
  userAgent: string;
  sessionToken: string;
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (identifier: string, maxRequests = 5, windowMs = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const limit = rateLimitStore.get(identifier);
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (limit.count >= maxRequests) {
    return false;
  }
  
  limit.count += 1;
  return true;
};

// Admin level definitions
// Admin email'i environment'tan al
const getAdminConfig = (): Record<string, 'basic' | 'full'> => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminLevel = process.env.ADMIN_LEVEL || 'full';
  
  if (!adminEmail) {
    return {};
  }
  
  return {
    [adminEmail.toLowerCase()]: adminLevel as 'basic' | 'full'
  };
};

const ADMIN_LEVELS = getAdminConfig();

const ADMIN_PERMISSIONS = {
  full: [
    'listings:view',
    'listings:approve',
    'listings:reject', 
    'listings:delete',
    'orders:view',
    'orders:update',
    'orders:cancel',
    'sellers:view',
    'sellers:manage',
    'analytics:view',
    'system:manage',
    'audit:view'
  ],
  basic: [
    'listings:view',
    'listings:approve', 
    'listings:reject',
    'orders:view',
    'sellers:view'
  ]
};

export async function POST(request: NextRequest) {
  try {
    // Email ve UID format kontrolü
    const validateEmail = (email: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
    };

    const validateUID = (uid: string): boolean => {
      return /^[a-zA-Z0-9]{28}$/.test(uid);
    };
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Rate limiting per IP
    if (!checkRateLimit(`admin_verify_${clientIp}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json({
        isAdmin: false,
        adminLevel: 'none',
        verified: false,
        permissions: [],
        sessionToken: '',
        error: 'Rate limit exceeded'
      }, { status: 429 });
    }

    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json({
        isAdmin: false,
        adminLevel: 'none',
        verified: false,
        permissions: [],
        sessionToken: '',
        error: 'Method not allowed'
      }, { status: 405 });
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        isAdmin: false,
        adminLevel: 'none',
        verified: false,
        permissions: [],
        sessionToken: '',
        error: 'Authorization header missing'
      }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await auth().verifyIdToken(idToken, true); // Check if revoked
    } catch (error) {
      console.error('Token verification failed:', error);
      
      // Log security incident
      await logSecurityIncident({
        type: 'invalid_token',
        ip: clientIp,
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: { error: 'Token verification failed' }
      });

      return NextResponse.json({
        isAdmin: false,
        adminLevel: 'none',
        verified: false,
        permissions: [],
        sessionToken: '',
        error: 'Invalid token'
      }, { status: 401 });
    }

    // Parse request body
    const body: RequestBody = await request.json();
    const { uid, email, requestedLevel } = body;
    
    // Validate request data
    if (!uid || !email || !validateEmail(email) || !validateUID(uid) || decodedToken.uid !== uid) {
      await logSecurityIncident({
        type: 'uid_mismatch',
        uid: decodedToken.uid,
        requestedUid: uid,
        ip: clientIp,
        details: { email }
      });

      return NextResponse.json({
        isAdmin: false,
        adminLevel: 'none',
        verified: false,
        permissions: [],
        sessionToken: '',
        error: 'Invalid request data'
      }, { status: 400 });
    }

    // Check if email matches token
    if (decodedToken.email !== email) {
      await logSecurityIncident({
        type: 'email_mismatch',
        uid: uid,
        tokenEmail: decodedToken.email,
        requestedEmail: email,
        ip: clientIp
      });

      return NextResponse.json({
        isAdmin: false,
        adminLevel: 'none',
        verified: false,
        permissions: [],
        sessionToken: '',
        error: 'Email mismatch'
      }, { status: 403 });
    }

    // Check admin status from multiple sources
    let adminLevel: 'none' | 'basic' | 'full' = 'none';
    
    // 1. Check hardcoded admin emails
    if (email in ADMIN_LEVELS) {
      adminLevel = ADMIN_LEVELS[email as keyof typeof ADMIN_LEVELS] as 'basic' | 'full';
    } else {
      // 2. Check Firestore user document
      try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const userRole = userData?.role;
          const userAdminLevel = userData?.adminLevel;
          
          if (userRole === 'admin') {
            adminLevel = userAdminLevel === 'full' ? 'full' : 'basic';
          }
        }
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError);
        // Continue with hardcoded check only
      }
    }

    // Check if user has sufficient level for request
    if (adminLevel === 'none') {
      await logSecurityIncident({
        type: 'unauthorized_admin_access',
        uid: uid,
        email: email,
        ip: clientIp,
        requestedLevel: requestedLevel
      });

      return NextResponse.json({
        isAdmin: false,
        adminLevel: 'none',
        verified: false,
        permissions: [],
        sessionToken: '',
        error: 'Admin access denied'
      }, { status: 403 });
    }

    if (requestedLevel === 'full' && adminLevel !== 'full') {
      await logSecurityIncident({
        type: 'insufficient_admin_level',
        uid: uid,
        email: email,
        currentLevel: adminLevel,
        requestedLevel: requestedLevel,
        ip: clientIp
      });

      return NextResponse.json({
        isAdmin: true,
        adminLevel: adminLevel,
        verified: false,
        permissions: [],
        sessionToken: '',
        error: 'Insufficient admin level'
      }, { status: 403 });
    }

    // Generate session token
    const sessionToken = generateSessionToken(uid, adminLevel);
    
    // Get permissions for admin level
    const permissions = ADMIN_PERMISSIONS[adminLevel];

    // Log successful admin verification
    await logAdminAccess({
      uid: uid,
      email: email,
      adminLevel: adminLevel,
      ip: clientIp,
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionToken: sessionToken
    });

    // Update last login in Firestore
    try {
      await db.collection('users').doc(uid).update({
        lastAdminLogin: new Date(),
        lastAdminLevel: adminLevel,
        lastLoginIp: clientIp
      });
    } catch (error) {
      console.error('Failed to update last login:', error);
    }

    return NextResponse.json({
      isAdmin: true,
      adminLevel: adminLevel,
      verified: true,
      permissions: permissions,
      sessionToken: sessionToken
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    
    return NextResponse.json({
      isAdmin: false,
      adminLevel: 'none',
      verified: false,
      permissions: [],
      sessionToken: '',
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Helper function to generate secure session token
function generateSessionToken(uid: string, adminLevel: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 10);
  const payload = `${uid}:${adminLevel}:${timestamp}:${random}`;
  
  // In production, use proper JWT or encrypted tokens
  return Buffer.from(payload).toString('base64');
}

// Helper function to log security incidents
async function logSecurityIncident(incident: SecurityIncident) {
  try {
    await db.collection('security_incidents').add({
      ...incident,
      timestamp: new Date(),
      severity: 'high'
    });
  } catch (error) {
    console.error('Failed to log security incident:', error);
  }
}

// Helper function to log admin access
async function logAdminAccess(accessLog: AdminAccessLog) {
  try {
    await db.collection('admin_access_logs').add({
      ...accessLog,
      timestamp: new Date(),
      success: true
    });
  } catch (error) {
    console.error('Failed to log admin access:', error);
  }
}