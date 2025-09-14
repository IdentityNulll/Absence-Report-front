import { createContext, useContext, useEffect, useState } from "react";

// 1) Create the context
const ThemeContext = createContext();

// 2) Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme, fallback to "light"
    return localStorage.getItem("theme") || "light";
  });

  // Whenever theme changes, update <html> class + save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3) Custom hook (easier to use in components)
export const useTheme = () => useContext(ThemeContext);
