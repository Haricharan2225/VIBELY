import React, { useState } from 'react';
import { Phone, ChevronDown } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
];

export const PhoneNumberInput = ({
  phoneNumber,
  onChange,
  onSubmit,
  loading = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);

  const handleNumberChange = (e) => {
    // Only allow numbers
    const cleanNumber = e.target.value.replace(/\D/g, '');
    onChange(cleanNumber);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 7) return;
    const fullNumber = `${selectedCountry.code}${phoneNumber}`;
    onSubmit(fullNumber);
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2">
          Phone Number
        </label>
        <div className="flex items-center gap-2">
          {/* Country Code Dropdown */}
          <div className="relative">
            <select
              value={selectedCountry.code}
              onChange={(e) => {
                const found = COUNTRY_CODES.find((c) => c.code === e.target.value);
                if (found) setSelectedCountry(found);
              }}
              className="appearance-none bg-[#1A1A1D] border border-[#333336] focus:border-[#C6F432] text-white text-sm rounded-xl py-3 pl-3 pr-8 outline-none cursor-pointer"
            >
              {COUNTRY_CODES.map((c, i) => (
                <option key={`${c.code}-${i}`} value={c.code} className="bg-[#1A1A1D] text-white">
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
          </div>

          {/* Number Input */}
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <Phone size={18} />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handleNumberChange}
              placeholder="Enter mobile number"
              maxLength={15}
              disabled={loading}
              className="w-full bg-[#1A1A1D] border border-[#333336] focus:border-[#C6F432] text-white placeholder-neutral-500 text-sm rounded-xl py-3 pl-10 pr-4 outline-none tracking-wide transition-all"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !phoneNumber || phoneNumber.length < 7}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#C6F432] text-black hover:bg-[#b5e028] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#C6F432]/20 flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
            Sending OTP...
          </span>
        ) : (
          'Send OTP'
        )}
      </button>
    </form>
  );
};

export default PhoneNumberInput;
