import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  signInWithPhone,
  verifyOTP,
  signInWithGoogle,
  logout as authLogout,
  syncUserWithBackend,
  initRecaptcha,
} from '../services/authService';
import AuthLoadingScreen from '../components/auth/AuthLoadingScreen';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            setUser(firebaseUser);
            // Sync with backend API
            const synced = await syncUserWithBackend(firebaseUser);
            setDbUser(synced);
          } else {
            setUser(null);
            setDbUser(null);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Firebase Auth observer error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handlePhoneSignIn = async (phoneNumber, appVerifier) => {
    setError(null);
    try {
      const confirmationResult = await signInWithPhone(phoneNumber, appVerifier);
      return confirmationResult;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleVerifyOTP = async (confirmationResult, otp) => {
    setError(null);
    try {
      const confirmedUser = await verifyOTP(confirmationResult, otp);
      setUser(confirmedUser);
      const synced = await syncUserWithBackend(confirmedUser);
      setDbUser(synced);
      return confirmedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const googleUser = await signInWithGoogle();
      setUser(googleUser);
      const synced = await syncUserWithBackend(googleUser);
      setDbUser(synced);
      return googleUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleLogout = async () => {
    setError(null);
    try {
      await authLogout();
      setUser(null);
      setDbUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    dbUser,
    loading,
    error,
    setError,
    signInWithPhone: handlePhoneSignIn,
    verifyOTP: handleVerifyOTP,
    signInWithGoogle: handleGoogleSignIn,
    logout: handleLogout,
    initRecaptcha,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
