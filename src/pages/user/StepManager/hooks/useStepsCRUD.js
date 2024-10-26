// useStepsManagement.js
import { useState, useEffect } from 'react';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthProvider';

/**
 * Custom hook to manage steps for a specific objective. It handles fetching,
 * updating, adding, deleting, and reordering steps and sub-steps for the 
 * specified objective. It also provides functionality to save the objective 
 * to the database.
 *
 * @param {Object} options - Options for the steps management.
 * @param {string|null} options.objectiveId - ID of the objective to manage.
 * @param {Array} options.initialSteps - Initial steps to load.
 * @param {string} options.initialTitle - Initial title of the objective.
 * @returns {Object} - Returns management functions and state variables.
 * @returns {Array} steps - Current list of steps.
 * @returns {Function} setSteps - Function to set the list of steps.
 * @returns {string} title - Current title of the objective.
 * @returns {Function} setTitle - Function to set the title.
 * @returns {boolean} loading - Loading state for fetching data.
 * @returns {string|null} error - Error message during fetch.
 * @returns {boolean} saveLoading - Loading state for saving data.
 * @returns {string|null} saveError - Error message during save.
 * @returns {Function} addStep - Function to add a new step.
 * @returns {Function} updateStep - Function to update an existing step.
 * @returns {Function} deleteStep - Function to delete a step.
 * @returns {Function} addSubStep - Function to add a sub-step.
 * @returns {Function} updateSubStep - Function to update a sub-step.
 * @returns {Function} deleteSubStep - Function to delete a sub-step.
 * @returns {Function} reorderSteps - Function to reorder steps.
 * @returns {Function} saveObjective - Function to save the objective.
 * @returns {Function} refreshObjective - Function to refresh the objective data.
 */
export const useStepsCRUD = ({ objectiveId = null, initialSteps = [], initialTitle = '' }) => {
  const [steps, setSteps] = useState(initialSteps);
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(objectiveId ? true : false);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { user } = useAuth();
  const db = getFirestore();

  // Fetch objective data
  const fetchObjective = async () => {
    if (!user || !objectiveId) return;

    console.log('Chargement des données... de fetchObjective dans usetepsmanagement.js', objectiveId);
    setLoading(true);
    setError(null);

    try {
      const objectiveRef = doc(db, `users/${user.uid}/objectives`, objectiveId);
      const objectiveDoc = await getDoc(objectiveRef);

      if (objectiveDoc.exists()) {
        const objectiveData = objectiveDoc.data();
        console.log('Données chargées:', objectiveData);
        setSteps(objectiveData.steps || []);
        setTitle(objectiveData.title || '');
      } else {
        setError("Objectif non trouvé");
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Save objective
  const saveObjective = async () => {
    if (!user || !title.trim() || !steps.length) return;
    console.log('sdq');
    setSaveLoading(true);
    setSaveError(null);

    try {
      const objectiveData = {
        title,
        steps,
        updatedAt: serverTimestamp(),
      };

      if (!objectiveId) {
        // Create new document
        const newDocRef = doc(collection(db, `users/${user.uid}/objectives`));
        await setDoc(newDocRef, {
          ...objectiveData,
          createdAt: serverTimestamp(),
        });
        return newDocRef.id; // Return new ID for navigation
      } else {
        // Update existing document
        const objectiveRef = doc(db, `users/${user.uid}/objectives`, objectiveId);
        await updateDoc(objectiveRef, objectiveData);
        
        console.log('Sauvegarde effectuée avec succes');
        return objectiveId;
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setSaveError("Erreur lors de la sauvegarde");
      return null;
    } finally {
      setSaveLoading(false);
    }
  };

  // Update step
  const updateStep = async (updatedStep) => {
    const updatedSteps = steps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    );
    setSteps(updatedSteps);
  };

  // Add step
  const addStep = (content) => {
    if (content.trim()) {
      const newStep = {
        id: Math.random().toString(36).substr(2, 9),
        content: content.trim(),
        isLocked: false,
        subSteps: []
      };
      setSteps([...steps, newStep]);
      return true;
    }
    return false;
  };

  // Delete step
  const deleteStep = (stepId) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  // Add sub-step
  const addSubStep = (stepId, newSubStep) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: [...step.subSteps, newSubStep]
        };
      }
      return step;
    }));
  };

  // Update sub-step
  const updateSubStep = (stepId, updatedSubStep) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: step.subSteps.map(subStep =>
            subStep.id === updatedSubStep.id ? updatedSubStep : subStep
          )
        };
      }
      return step;
    }));
  };

  // Delete sub-step
  const deleteSubStep = (stepId, subStepId) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: step.subSteps.filter(subStep => subStep.id !== subStepId)
        };
      }
      return step;
    }));
  };

  // Reorder steps
  const reorderSteps = (reorderedSteps) => {
    setSteps(reorderedSteps);
  };

  useEffect(() => {
    if (objectiveId) {
      fetchObjective();
    }
  }, [user, objectiveId]);

  return {
   // États
   steps,
   title,
   loading,
   error,
   saveLoading,
   saveError,
   
   // Setters
   setTitle,
   setSteps,
   
   // CRUD Steps
   addStep,
   updateStep,
   deleteStep,
   
   // CRUD Sub-steps
   addSubStep,
   updateSubStep,
   deleteSubStep,
   
   // Autres opérations
   reorderSteps,
   saveObjective,
   refreshObjective: fetchObjective
  };
};