
import { useDarkMode } from '../../../../context/DarkModeContext';

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 mt-4 ml-4 bg-gray-200 dark:bg-gray-700 rounded-full"
    >
      {isDarkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre'}
    </button>
  );
}

export function ResetThemeButton() {
  const { resetTheme } = useDarkMode();

  return (
    <button 
      className="p-2 mt-4 ml-4 bg-gray-200 dark:bg-gray-700 rounded-full" onClick={resetTheme}>
      Réinitialiser le thème
    </button>
  );
}

