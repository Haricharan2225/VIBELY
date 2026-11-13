import admin from 'firebase-admin';

let firebaseAdmin = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Handle escaped newlines in environment variable
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
    firebaseAdmin = admin;
  } else {
    console.warn('⚠️ Firebase credentials not fully configured in environment variables');
    // Create a stub that fast-fails token verification instead of hanging
    firebaseAdmin = {
      auth: () => ({
        verifyIdToken: () => Promise.reject(new Error('Firebase Admin SDK not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.')),
        getUser: () => Promise.reject(new Error('Firebase Admin SDK not configured.')),
        revokeRefreshTokens: () => Promise.reject(new Error('Firebase Admin SDK not configured.')),
      }),
      _isStub: true,
    };
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
}

export default firebaseAdmin;
