/* Fournisseur de contexte autour de votre composant */


import React from 'react';
import  UserProvider  from './AuthProvider';  // Contexte pour gérer l'utilisateur
import { SnackbarProvider } from '../hooks/Snackbar/SnackbarContext'; // Contexte pour gérer le Snackbar


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
