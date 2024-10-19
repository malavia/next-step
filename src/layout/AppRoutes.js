import React from 'react';
import { Routes, Route } from 'react-router-dom';




import { useAuth } from '../context/AuthProvider'; 


import Accueil from '../pages/user/Accueil';
import SuitePageAccueil from '../pages/user/ObjectifWithSteps/SuitePageAccueil';




const AppRoutes = () => {
  const { isAuthenticated } = useAuth(); // Utiliser le contexte

  return (
          <Routes>
            <Route path="/" element={<Accueil />} />

            <Route path="/SuitePageAccueil" element= {<SuitePageAccueil />} />

          </Routes>
  );
};

export default AppRoutes;