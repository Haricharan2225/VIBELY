import {
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  RecaptchaVerifier,
} from 'firebase/auth';
import { auth } from './firebase';
import api from './api';

/**
 * Initialize reCAPTCHA verifier for Phone Auth
 * @param {string} elementId - ID of HTML container or button
 * @param {Object} callbacks - callbacks for on-load or on-verify
 */
export const initRecaptcha = (elementId = 'recaptcha-container', callbacks = {}) => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Recaptcha clear error:', e);
    }
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: (response) => {
      if (callbacks.onVerify) callbacks.onVerify(response);
    },
    'expired-callback': () => {
      if (callbacks.onExpired) callbacks.onExpired();
    },
  });

  return window.recaptchaVerifier;
};

/**
 * Sign in with phone number and app verifier
 * @param {string} phoneNumber - Full phone number including country code (e.g., +919876543210)
 * @param {RecaptchaVerifier} appVerifier
 */
export const signInWithPhone = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Phone sign-in failed:', error);
    throw error;
  }
};

/**
 * Verify OTP entered by user
 * @param {Object} confirmationResult - Result returned by signInWithPhone
 * @param {string} otp - 6-digit verification code
 */
export const verifyOTP = async (confirmationResult, otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    console.error('OTP confirmation failed:', error);
    throw error;
  }
};

/**
 * Sign in with Google using popup
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

/**
 * Sign out user from Firebase session
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

/**
 * Get currently authenticated Firebase user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Get current user's Firebase ID token
 * @param {boolean} forceRefresh - Force token refresh
 */
export const getIdToken = async (forceRefresh = false) => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken(forceRefresh);
};

/**
 * Sync user profile with backend database
 * Calls POST /api/auth/session with Firebase ID token and user metadata
 * @param {Object} user - Firebase User object
 */
export const syncUserWithBackend = async (user) => {
  try {
    const token = await user.getIdToken();
    const payload = {
      uid: user.uid,
      phoneNumber: user.phoneNumber,
      email: user.email,
      displayName: user.displayName || user.phoneNumber || 'Vibely Listener',
      photoURL: user.photoURL,
    };

    const response = await api.post('/api/auth/session', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.warn('Backend sync warning (fallback local state used):', error?.message || error);
    // Return gracefully so UI is not blocked if backend is not yet running
    return {
      uid: user.uid,
      phoneNumber: user.phoneNumber,
      email: user.email,
      displayName: user.displayName || user.phoneNumber || 'Vibely Listener',
      photoURL: user.photoURL,
      isSynced: false,
    };
  }
};

export default {
  initRecaptcha,
  signInWithPhone,
  verifyOTP,
  signInWithGoogle,
  logout,
  getCurrentUser,
  getIdToken,
  syncUserWithBackend,
};
