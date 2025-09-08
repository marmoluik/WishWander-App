import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

interface ThemeContextValue {
  scheme: ColorSchemeName;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  scheme: 'light',
  toggle: () => {},
});

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useColorScheme();
  const [scheme, setScheme] = useState<ColorSchemeName>(system ?? 'light');

  const value = useMemo(
    () => ({
      scheme,
      toggle: () => setScheme((s) => (s === 'dark' ? 'light' : 'dark')),
    }),
    [scheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => useContext(ThemeContext);
