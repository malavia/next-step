import { useState } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useAuth } from '../../../../context/AuthProvider';

export const useSaveSteps = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { user } = useAuth();
  const db = getDatabase();

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
      // Créer une nouvelle référence pour l'objectif
      const objectiveRef = ref(db, `users/${user.uid}/objectives`);
      const newObjectiveRef = push(objectiveRef);

      // Préparer les données de l'objectif
      const objectiveData = {
        id: newObjectiveRef.key,
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
      await set(newObjectiveRef, objectiveData);

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
};