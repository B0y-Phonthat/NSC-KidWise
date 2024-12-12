import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Theme {
  name: string;
  colors: string[];
}

const themes: Theme[] = [
  { name: "Blue", colors: ["#3F9FFA", "#96E5FC"] },
  { name: "Orange", colors: ["#FFB347", "#FFCC67"] },
  { name: "Green", colors: ["#4CAF50", "#81C784", "#A5D6A7"] },
  { name: "Purple", colors: ["#9C27B0", "#BA68C8", "#CE93D8"] },
  { name: "Red", colors: ["#F44336", "#E57373", "#FFCDD2"] },
  { name: "Yellow", colors: ["#FFEB3B", "#FFF176", "#FFF59D"] },
  { name: "Pink", colors: ["#E91E63", "#F06292", "#F8BBD0"] },
  { name: "Teal", colors: ["#009688", "#4DB6AC", "#80CBC4"] },
  { name: "Light Blue", colors: ["#03A9F4", "#4FC3F7", "#81D4FA"] },
  { name: "Amber", colors: ["#FFC107", "#FFD54F", "#FFE082"] },
];

interface ThemeContextProps {
  selectedTheme: Theme;
  setSelectedTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);

  return (
    <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
