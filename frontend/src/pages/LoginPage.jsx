import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import PhoneNumberInput from '../components/auth/PhoneNumberInput';
import OTPVerification from '../components/auth/OTPVerification';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const {
    user,
    signInWithPhone,
    verifyOTP,
    signInWithGoogle,
    initRecaptcha,
    error: authError,
    setError: setAuthError,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectPath = location.state?.from?.pathname || '/home';

  // If already authenticated, redirect
  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  // Clean errors when step changes
  useEffect(() => {
    setErrorMessage('');
    if (setAuthError) setAuthError(null);
  }, [step]);

  const handlePhoneSubmit = async (fullPhoneNumber) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const appVerifier = initRecaptcha('recaptcha-container');
      const result = await signInWithPhone(fullPhoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err) {
      console.error('Phone sign in error:', err);
      setErrorMessage(
        err.message?.includes('invalid-phone-number')
          ? 'Invalid phone number format. Please check the country code and number.'
          : err.message || 'Failed to send OTP. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    if (!confirmationResult) {
      setErrorMessage('Verification session expired. Please request a new OTP.');
      setStep('phone');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      await verifyOTP(confirmationResult, otp);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('OTP verification error:', err);
      setErrorMessage('Incorrect verification code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!phoneNumber) return;
    await handlePhoneSubmit(phoneNumber);
  };

  const handleGoogleClick = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await signInWithGoogle();
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Google sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 'phone' ? 'Welcome Back' : 'Verify Phone'}
      subtitle={
        step === 'phone'
          ? 'Log in to continue streaming your favourite Telugu, Hindi, Tamil & global tracks'
          : 'Enter the 6-digit code sent to your phone'
      }
    >
      {/* Hidden reCAPTCHA container for Firebase */}
      <div id="recaptcha-container" />

      {/* Error Alert */}
      {(errorMessage || authError) && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
          <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
          <span>{errorMessage || authError}</span>
        </div>
      )}

      {step === 'phone' ? (
        <div className="space-y-6">
          <PhoneNumberInput
            phoneNumber={phoneNumber}
            onChange={setPhoneNumber}
            onSubmit={handlePhoneSubmit}
            loading={loading}
          />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#2A2A2D] w-full" />
            <span className="bg-[#141416] px-3 text-xs text-neutral-500 font-medium uppercase tracking-wider absolute">
              or
            </span>
          </div>

          <GoogleSignInButton onClick={handleGoogleClick} loading={loading} />

          <p className="text-center text-xs text-neutral-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#C6F432] font-semibold hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      ) : (
        <OTPVerification
          phoneNumber={phoneNumber}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          onBack={() => setStep('phone')}
          loading={loading}
        />
      )}
    </AuthLayout>
  );
};

export default LoginPage;
