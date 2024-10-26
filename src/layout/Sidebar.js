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
  // Afficher un message pendant que l'authentification se charge
  if (loading) {
    return <div>Chargement...</div>;
  } 


  return (
    <aside style={{ width: '250px', padding: '20px', backgroundColor: '#f8f9fa', borderRight: '1px solid #e1e1e1' }}>    


      <ul style={{ listStyleType: 'none', padding: 0 }}>  
        <li>
          <Link to="/Accueil" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Accueil</Link>
        </li>
        <li>
          <Link to="/Llm" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>llm</Link>
        </li>
        <li>
          <Link to="/StepGenerator" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>StepGenerator</Link>
        </li>
        <li>
          <Link to="/test/realtime" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>realTimeStepManager</Link>
        </li>
      </ul>

    </aside>
  );
};

export default Sidebar;
