import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import PhoneNumberInput from '../components/auth/PhoneNumberInput';
import OTPVerification from '../components/auth/OTPVerification';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, User, Sparkles } from 'lucide-react';

export const RegisterPage = () => {
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
  const [displayName, setDisplayName] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectPath = location.state?.from?.pathname || '/home';

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  useEffect(() => {
    setErrorMessage('');
    if (setAuthError) setAuthError(null);
  }, [step]);

  const handlePhoneSubmit = async (fullPhoneNumber) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const appVerifier = initRecaptcha('recaptcha-register-container');
      const result = await signInWithPhone(fullPhoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err) {
      console.error('Registration phone error:', err);
      setErrorMessage(
        err.message?.includes('invalid-phone-number')
          ? 'Invalid phone number format.'
          : err.message || 'Failed to send OTP code. Please try again.'
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

  const handleGoogleClick = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await signInWithGoogle();
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Google register error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join millions tuning into music, personalized vibes and Together rooms"
    >
      <div id="recaptcha-register-container" />

      {(errorMessage || authError) && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
          <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
          <span className="leading-relaxed">{errorMessage || authError}</span>
        </div>
      )}

      {step === 'phone' ? (
        <div className="flex flex-col gap-5">
          {/* Optional Display Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Your Name (Optional)
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                <User size={17} />
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full bg-[#1A1A1E] border border-[#2F2F36] hover:border-[#42424B] focus:border-[#C6F432] focus:ring-2 focus:ring-[#C6F432]/20 text-white placeholder-neutral-500 text-sm font-medium rounded-2xl py-3 pl-10 pr-4 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <PhoneNumberInput
            phoneNumber={phoneNumber}
            onChange={setPhoneNumber}
            onSubmit={handlePhoneSubmit}
            loading={loading}
          />

          <div className="flex items-center gap-3 my-1">
            <div className="h-px bg-[#26262B] flex-1" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 px-1">
              or
            </span>
            <div className="h-px bg-[#26262B] flex-1" />
          </div>

          <GoogleSignInButton
            onClick={handleGoogleClick}
            loading={loading}
            text="Sign up with Google"
          />

          {/* Perks list */}
          <div className="py-2.5 border-t border-[#222226] flex items-center justify-around text-[11px] text-neutral-400 font-medium">
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-[#C6F432]" /> Ad-free vibes
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-[#C6F432]" /> Together Mode
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-[#C6F432]" /> Hi-Fi Audio
            </span>
          </div>

          <p className="text-center text-xs text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C6F432] font-bold hover:underline ml-1">
              Log in
            </Link>
          </p>
        </div>
      ) : (
        <OTPVerification
          phoneNumber={phoneNumber}
          onVerify={handleVerifyOTP}
          onResend={() => handlePhoneSubmit(phoneNumber)}
          onBack={() => setStep('phone')}
          loading={loading}
        />
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
