import firebaseAdmin from '../config/firebase.js';

/**
 * Verify a Firebase ID token
 * @param {string} token
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken>}
 */
export const verifyFirebaseToken = async (token) => {
  if (!token) {
    throw new Error('No token provided');
  }
  return await firebaseAdmin.auth().verifyIdToken(token);
};

/**
 * Get Firebase user record by UID
 * @param {string} uid
 * @returns {Promise<import('firebase-admin/auth').UserRecord>}
 */
export const getFirebaseUser = async (uid) => {
  return await firebaseAdmin.auth().getUser(uid);
};

/**
 * Revoke all refresh tokens for a user
 * @param {string} uid
 * @returns {Promise<void>}
 */
export const revokeFirebaseTokens = async (uid) => {
  await firebaseAdmin.auth().revokeRefreshTokens(uid);
};

export default {
  verifyFirebaseToken,
  getFirebaseUser,
  revokeFirebaseTokens
};
