import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'What do you want to play?',
  className = '',
  autoFocus = false,
}) => {
  const [internalVal, setInternalVal] = useState(value);

  const currentValue = onChange ? value : internalVal;

  const handleChange = (e) => {
    const val = e.target.value;
    if (onChange) {
      onChange(val);
    } else {
      setInternalVal(val);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
    } else {
      setInternalVal('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(currentValue);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-xl group ${className}`}
    >
      <div className="absolute left-3.5 text-neutral-400 group-focus-within:text-[#C6F432] transition-colors pointer-events-none">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-[#1A1A1D] hover:bg-[#222226] focus:bg-[#242429] text-white text-sm placeholder-neutral-500 rounded-full pl-10 pr-10 py-2.5 outline-none border border-[#333336] focus:border-[#C6F432] transition-all shadow-inner"
      />
      {currentValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
