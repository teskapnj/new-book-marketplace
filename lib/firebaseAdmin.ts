// lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import serviceAccount from './firebase/serviceAccountKey.json'; // Yolu güncelledik

// Firebase Admin SDK'yı başlat
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

// Gerekli modülleri export et
export const auth = admin.auth();
export const db = admin.firestore();