/* Fournisseur de contexte autour de votre composant */


import React from 'react';
import  UserProvider  from './AuthProvider';  // Contexte pour gérer l'utilisateur
import { SnackbarProvider } from '../components/ui/Snackbar/SnackbarContext';


const ContextProvider = ({ children }) => {
  return (
    <SnackbarProvider> 
    <UserProvider> {/* Fournisseur pour l'utilisateur */}
        {children}
    </UserProvider>
    </SnackbarProvider>

  );
};

export default ContextProvider;
