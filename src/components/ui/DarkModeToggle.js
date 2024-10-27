// src/components/DarkModeToggle.js
import { useDarkMode } from '../../context/DarkModeContext';

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 mt-4 ml-4 bg-gray-200 dark:bg-gray-800 rounded-full"
    >
      {isDarkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre'}
    </button>
  );
}

export default DarkModeToggle;
