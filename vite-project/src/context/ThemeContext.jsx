import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);

  const toggleTheme = () => setDark(!dark);

  const theme = {
    dark,
    colors: dark
      ? {
          bg: "#020617",
          card: "rgba(30,41,59,0.7)",
          text: "#f8fafc",
          accent: "#38bdf8",
        }
      : {
          bg: "#f8fafc",
          card: "rgba(255,255,255,0.8)",
          text: "#020617",
          accent: "#2563eb",
        },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
