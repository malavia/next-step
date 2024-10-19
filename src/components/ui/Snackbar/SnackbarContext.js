// SnackbarContext.js
import React, { createContext, useContext, useState } from 'react';
import GenericSnackbar from './GenericSnackbar';

// Crée un contexte pour gérer le Snackbar
const SnackbarContext = createContext();

/**
 * Hook pour utiliser le contexte Snackbar
 *
 * Retourne la fonction showSnackbar qui permet d'afficher le
 * Snackbar avec un message et une sévérité (success, error, warning, info)
 *
 * Example :
 * const showSnackbar = useSnackbar();
 * showSnackbar('Un petit message', 'success');
 *
 * @returns {function} showSnackbar
 */
export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

// Fournisseur de contexte pour afficher le Snackbar
export const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarState({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbarState(prevState => ({ ...prevState, open: false }));
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <GenericSnackbar
        message={snackbarState.message}
        severity={snackbarState.severity}
        open={snackbarState.open}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};
