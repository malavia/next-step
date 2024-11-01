
import {DarkModeToggle, ResetThemeButton} from './components/Theme';
function Wrapper() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DarkModeToggle />
          <ResetThemeButton />
        </div>
    );
  }
  
  export default Wrapper;