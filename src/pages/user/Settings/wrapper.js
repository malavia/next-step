
import DarkModeToggle from '../../../components/ui/DarkModeToggle';
function Wrapper() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DarkModeToggle />
          {/* Autres composants ici */}
        </div>
    );
  }
  
  export default Wrapper;