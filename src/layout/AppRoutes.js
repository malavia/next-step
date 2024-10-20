import React from 'react';
import { Routes, Route } from 'react-router-dom';




//import { useAuth } from '../context/AuthProvider'; 


import Accueil from '../pages/user/Accueil';
import SuitePageAccueil from '../pages/user/ObjectifWithSteps/SuitePageAccueil';
import HandleSteps from '../pages/user/HandleSteps/ObjectivePlanner';
import Llm from '../pages/test/llm';
import Wrapper from '../pages/user/HandlerSteps/Wrapper';




const AppRoutes = () => {
  //const { isAuthenticated } = useAuth(); // Utiliser le contexte

  return (
          <Routes>
            <Route path="/" element={<Accueil />} />

            <Route path="/SuitePageAccueil" element= {<SuitePageAccueil />} />
            <Route path="/HandleSteps" element= {<HandleSteps />} />
            <Route path="/Llm" element= {<Llm />} />
            <Route path="/StepManager" element= {<Wrapper />} />

          </Routes>
  );
};

export default AppRoutes;