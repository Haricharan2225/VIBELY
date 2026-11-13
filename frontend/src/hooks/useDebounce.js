import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce value updates
 * @param {any} value - value to debounce
 * @param {number} delay - delay in milliseconds (default: 400ms)
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
