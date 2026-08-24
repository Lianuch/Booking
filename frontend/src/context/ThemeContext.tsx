import { createContext, useEffect, useState } from "react";



type ThemeContextType = {
  dark: boolean;
  toggleTheme: () => void;
};

/* eslint-disable react-refresh/only-export-components */
export const ThemeContext = createContext<ThemeContextType | null>(null);

const getThemeFromCookie = (): boolean => {
  const theme = document.cookie.split("; ").find((row)=> row.startsWith("theme="))?.split("=")[1];

  return theme !== "dark";
}

export const ThemeProvider = ({ children }: { children: React.ReactNode 
}) => {

  const [dark, setDark] = useState<boolean>(getThemeFromCookie);


  useEffect(() => {
    console.log(document.documentElement.className);
    if (!dark) {
      document.documentElement.classList.add("dark");
      document.cookie = "theme=dark; path=/; max-age=31536000"; 
    } else {
      document.documentElement.classList.remove("dark");
      document.cookie = "theme=light; path=/; max-age=31536000"; 

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