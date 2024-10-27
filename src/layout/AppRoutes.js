import React from 'react';
import { Routes, Route } from 'react-router-dom';




//import { useAuth } from '../context/AuthProvider'; 


import Accueil from '../pages/user/Accueil';
import Llm from '../pages/test/llm';
import RealTimeStepManager from '../pages/user/StepManager/Wrapper';
import Settings from '../pages/user/Settings/wrapper';




const AppRoutes = () => {
  //const { isAuthenticated } = useAuth(); // Utiliser le contexte

  return (
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/Accueil" element={<Accueil />} />

            <Route path="/Llm" element= {<Llm />} />

            <Route path="/RealTimeStepManager" element={<RealTimeStepManager />} />
            <Route path="/RealTimeStepManager/:objectiveId" element={<RealTimeStepManager />} />
            <Route path="/Settings" element={<Settings />} />
     
          </Routes>
  );
};

export default AppRoutes;