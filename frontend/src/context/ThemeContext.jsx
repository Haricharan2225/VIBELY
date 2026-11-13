import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_A, THEME_B } from '../utils/brand';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isTogether, setIsTogether] = useState(false);
  const theme = isTogether ? THEME_B : THEME_A;

  const toggleTogether = () => {
    setIsTogether((prev) => !prev);
  };

  const setTogether = (val) => {
    setIsTogether(!!val);
  };

  useEffect(() => {
    // Update body background according to theme
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.name === 'together' ? theme.textLight : theme.text;
  }, [theme]);

  const value = {
    theme,
    isTogether,
    toggleTogether,
    setTogether,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
