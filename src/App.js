import React from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import AppRoutes from './layout/AppRoutes';

import ErrorBoundary from './components/ErrorBoundary'; 
import ContextProvider from './context/ContextProvider'; // Importation de l'enveloppe des contextes

import { DarkModeProvider } from './context/DarkModeContext';

const App = () => {

  return (
    <div>

    <DarkModeProvider>
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
       
        <Header />

        <ErrorBoundary>
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ flexGrow: 1, padding: '20px' }}>
              <ContextProvider>
              <AppRoutes />
              </ContextProvider>
            </main>
          </div>
        </ErrorBoundary>

        <Footer />
    </div>
    </DarkModeProvider>
    
    </div>
  );
};

export default App;


