import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

// Fonction utilitaire pour détecter la préférence système
function getSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Fonction utilitaire pour récupérer le thème depuis le localStorage
function getStoredTheme() {
  const storedTheme = localStorage.getItem('theme');
  return storedTheme ? storedTheme === 'dark' : null;
}

// Fonction utilitaire pour sauvegarder le thème dans le localStorage
function saveTheme(isDarkMode) {
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Fonction utilitaire pour appliquer le thème au document
function applyTheme(isDarkMode) {
  document.documentElement.classList.toggle('dark', isDarkMode);
}

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(getStoredTheme() ?? getSystemPreference());

  useEffect(() => {
    applyTheme(isDarkMode);
    saveTheme(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    prefersDarkScheme.addEventListener('change', handleChange);
    return () => prefersDarkScheme.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

  // Fonction de réinitialisation du thème
  const resetTheme = () => {
    localStorage.removeItem('theme');
    setIsDarkMode(getSystemPreference());
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, resetTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
