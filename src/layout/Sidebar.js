// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; 



/**
 * Sidebar component. It displays a list of links to navigate the app.
 * The links are conditionally rendered based on the user's authentication status.
 * If the user is authenticated, the links to the settings page and the logout page are displayed.
 * Otherwise, the link to the login page is displayed.
 * The component also displays a link to the admin page if the user is an admin.
 */

const Sidebar = () => {

  const { user, loading } = useAuth();
  const linkClass =  "block py-2 px-4 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700";

  // Afficher un message pendant que l'authentification se charge
  if (loading) {
    return <div>Chargement...</div>;
  } 


  return (
    <aside className="w-64 p-5 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 h-full">



      <ul className="space-y-2">
        <li>  
          Hi, {user.email}
        </li>
        <li>
          <Link to="/Accueil" className={linkClass}>     Accueil </Link>
        </li>
        <li>
          <Link to="/Llm" className={linkClass}>       LLM </Link>
        </li>
        <li>
          <Link to="/realTimeStepManager" className={linkClass}>      RealTimeStepManager </Link>
        </li>
        <li>
          <Link to="/settings" className={linkClass}>     settings  </Link>
        </li>
      </ul>

    </aside>
  );
};

export default Sidebar;
