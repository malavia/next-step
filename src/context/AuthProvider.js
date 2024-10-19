import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase/initFirebase';

const AuthContext = createContext();

// Hook pour utiliser le contexte utilisateur
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Définir l'authentification basée sur la présence de l'utilisateur Firebase
  const isAuthenticated = !!user;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Arrête le chargement une fois que l'utilisateur est déterminé
    });

    // Clean up le listener Firebase lors du démontage du composant
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      console.error('Email ou mot de passe manquant');
      return 'Email ou mot de passe manquant';
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Connexion réussie');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);
  
      // Gestion des différents types d'erreurs Firebase Auth
      switch (error.code) {
        case 'auth/invalid-email':
          return 'Email invalide';
        case 'auth/user-disabled':
          return 'Utilisateur désactivé';
        case 'auth/user-not-found':
          return 'Utilisateur non trouvé';
        case 'auth/wrong-password':
          return 'Mot de passe incorrect';
        case 'auth/invalid-credential':
          return 'Informations d\'identification invalides';
        default:
          return 'Erreur lors de la connexion';
      }
    }
  };
  

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error.message);
      return error.message; // Retourner le message d'erreur pour affichage (optionnel)
    }
  };

  const value = {
    user,                // Objet utilisateur Firebase
    isAuthenticated,      // Basé sur la présence de l'utilisateur
    loading,             // État de chargement pour la détermination initiale
    login,               // Fonction de connexion
    logout,              // Fonction de déconnexion
  };

  return (
    <AuthContext.Provider value={value}>
      {/* N'affiche les enfants que lorsque le chargement est terminé */}
      {!loading ? children : <div>Chargement...</div>}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 