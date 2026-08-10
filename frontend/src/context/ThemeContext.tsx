import { createContext, useEffect, useState } from "react";



type ThemeContextType = {
  dark: boolean;
  toggleTheme: () => void;
};

/* eslint-disable react-refresh/only-export-components */
export const ThemeContext = createContext<ThemeContextType | null>(null);
export const ThemeProvider = ({ children }: { children: React.ReactNode 
}) => {

  const [dark, setDark] = useState<boolean>(true);


  useEffect(() => {
    console.log(document.documentElement.className);
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);


  return (
    <ThemeContext.Provider 
      value={{ 
        dark, 
        toggleTheme: () => setDark(prev => !prev)
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};