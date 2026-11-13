import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export const OTPVerification = ({
  phoneNumber,
  onVerify,
  onResend,
  onBack,
  loading = false,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleResendClick = () => {
    if (timer === 0 && onResend) {
      setTimer(30);
      onResend();
    }
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-[#1A1A1D] hover:bg-[#2A2A2D] text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h3 className="text-lg font-bold text-white">Enter Verification Code</h3>
          <p className="text-xs text-neutral-400">
            Sent to <span className="text-neutral-200 font-medium">{phoneNumber}</span>
          </p>
        </div>
      </div>

      {/* 6 Digit Input Boxes */}
      <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 sm:w-13 sm:h-16 text-center text-xl font-bold bg-[#1A1A1D] text-white border border-[#333336] focus:border-[#C6F432] focus:ring-1 focus:ring-[#C6F432] rounded-xl outline-none transition-all shadow-inner"
          />
        ))}
      </div>

      {/* Resend Timer */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>Didn't receive code?</span>
        {timer > 0 ? (
          <span className="text-neutral-500 font-mono">Resend in {timer}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            className="text-[#C6F432] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={12} /> Resend OTP
          </button>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || !isComplete}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#C6F432] text-black hover:bg-[#b5e028] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#C6F432]/20 flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
            Verifying...
          </span>
        ) : (
          'Verify & Continue'
        )}
      </button>
    </div>
  );
};

export default OTPVerification;
