/*import { useState } from 'react';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthProvider';


export const useSaveSteps = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { user } = useAuth();
  const db = getFirestore();

  const saveSteps = async (title, steps) => {
    if (!user) {
      setSaveError("Vous devez être connecté pour sauvegarder les étapes");
      return false;
    }

    if (!title || !steps.length) {
      setSaveError("Le titre et les étapes sont requis");
      return false;
    }

    setSaveLoading(true);
    setSaveError(null);

    try {
      // Créer une référence pour un nouvel objectif dans Firestore
      const objectiveRef = doc(collection(db, `users/${user.uid}/objectives`));

      // Préparer les données de l'objectif
      const objectiveData = {
        id: objectiveRef.id,
        title: title,
        createdAt: new Date().toISOString(),
        completed: false,
        steps: steps.map(step => ({
          id: step.id,
          content: step.content,
          isLocked: step.isLocked,
          subSteps: step.subSteps.map(subStep => ({
            id: subStep.id,
            content: subStep.content
          }))
        }))
      };

      // Sauvegarder les données
      await setDoc(objectiveRef, objectiveData);

      console.log('Objectif et étapes sauvegardés avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveError("Erreur lors de la sauvegarde. Veuillez réessayer.");
      return false;
    } finally {
      setSaveLoading(false);
    }
  };

  return {
    saveSteps,
    saveLoading,
    saveError
  };
};*/