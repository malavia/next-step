import { fetchData } from './firebaseCrudService'; 
import { useAuth } from '../../context/AuthProvider';
import { useEffect, useState } from 'react';

// Service pour obtenir les intérêts et les objectifs de l'utilisateur
const UserDataService = () => {

  const { user, loadingUser } = useAuth();
  const [objectives, setObjectives] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loadingData, setLoadingData] = useState(true); 
  const [dataPath, setDataPath] = useState(null); 

  useEffect(() => {
    if (user) {
      setDataPath(`users/${user.uid}`); 
    }
  }, [user]); 

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setLoadingData(true); 
        try {
          const objectivesData = await fetchData(`users/${user.uid}/objectives`);
          setObjectives(objectivesData); 
          
          const interestsData = await fetchData(`users/${user.uid}/interests`);
          setInterests(interestsData); 
  
          console.log('useEffect - interests', interestsData);
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        } finally {
          setLoadingData(false); 
        }
      }
    };
    loadUserData();
  }, [user]);

  // Fonction pour obtenir les intérêts de l'utilisateur
  const getUserInterests = () => {
    if (!user || loadingData) {
      console.log('Les centres d\'intérêts sont en cours de chargement ou utilisateur non connecté.');
      return [];
    }
    console.log('getUserInterests', interests);
    return interests;
  };

  // Fonction pour obtenir les objectifs de l'utilisateur
  const getUserObjectives = () => {
    if (loadingData) {
      console.log('Les objectifs sont en cours de chargement...');
      return [];
    }
    console.log('getUserObjectives', objectives);
    return objectives;
  };

  

  // Ajoute une fonction pour filtrer les objectifs non complétés
  const getPendingObjectives = () => {
    return objectives.filter(obj => !obj.completed);
  };

  return {
    getUserInterests,
    getUserObjectives,
    getPendingObjectives,
    loadingUser,
    loadingData,
  };
};

export default UserDataService;
