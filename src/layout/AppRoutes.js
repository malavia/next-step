import React from 'react';
import { Routes, Route } from 'react-router-dom';




//import { useAuth } from '../context/AuthProvider'; 


import Accueil from '../pages/user/Accueil';
import Llm from '../pages/test/llm';
import StepGenerator from '../pages/user/StepManager/StepGenerator';




const AppRoutes = () => {
  //const { isAuthenticated } = useAuth(); // Utiliser le contexte

  return (
          <Routes>
            <Route path="/" element={<Accueil />} />

            <Route path="/StepGenerator" element= {<StepGenerator />} />
            <Route path="/Llm" element= {<Llm />} />

          </Routes>
  );
};

export default AppRoutes;