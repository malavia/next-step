/**
 * Custom hook to manage steps for a specific objective. It handles fetching,
 * updating, adding, deleting, and reordering steps and sub-steps for the 
 * specified objective. It also provides functionality to save the objective 
 * to the database.
 */
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
import { initialObjectiveData, addNewStep } from './stepUtils';

export const useStepsCRUD = ({ objectiveId = null, initialSteps = [], initialTitle = '' }) => {
  const [steps, setSteps] = useState(initialSteps);
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(!!objectiveId);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [objectiveData, setObjectiveData] = useState(initialObjectiveData(initialTitle, initialSteps));
  

  const { user } = useAuth();
  const db = getFirestore();

  // Fetch objective data
  const fetchObjective = async () => {
    if (!user || !objectiveId) return;
    setLoading(true);
    setError(null);

    try {
      const objectiveRef = doc(db, `users/${user.uid}/objectives`, objectiveId);
      const objectiveDoc = await getDoc(objectiveRef);

      if (objectiveDoc.exists()) {
        const fetchedData = objectiveDoc.data();
        setObjectiveData(fetchedData);
        setSteps(fetchedData.steps || []);
        setTitle(fetchedData.title || '');
        setStatus(fetchedData.status || 'draft');
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

  const determineStatus = () => {
    return objectiveData.title.trim() && steps.length > 0 ? "complete" : "draft";
  };

  const CreateObjectiveInFirestore = async (dataToSave) => {
    const newDocRef = doc(collection(db, `users/${user.uid}/objectives`));
    await setDoc(newDocRef, { 
      ...dataToSave,
      createdAt: serverTimestamp() 
    });
    return newDocRef.id;
  };

  const UpdateObjectiveInFirestore = async (dataToSave) => {
    const objectiveRef = doc(db, `users/${user.uid}/objectives`, objectiveId);
    await updateDoc(objectiveRef, dataToSave);
    return objectiveId;
  };

  const saveObjective = async (dataToSave) => {
    if (!user) return;
    setSaveLoading(true);
    setSaveError(null);

    const data = dataToSave || objectiveData;
    const dataToSaveFinal = {
      ...data,
      updatedAt: serverTimestamp(),
      status: determineStatus(),
    };

    setStatus(determineStatus());

    try {
      return !objectiveId ? CreateObjectiveInFirestore(dataToSaveFinal) : UpdateObjectiveInFirestore(dataToSaveFinal);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setSaveError("Erreur lors de la sauvegarde");
      return null;
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    if (objectiveId) fetchObjective();
  }, [user, objectiveId]);

  return {
    objectiveData,
    steps,
    title,
    status,
    loading,
    error,
    saveLoading,
    saveError,
    setTitle,
    setSteps,
    setObjectiveData,
    addStep: (step) => setSteps(addNewStep(steps, step)),
    updateStep: (updatedStep) => setSteps(steps.map(step => step.id === updatedStep.id ? updatedStep : step)),
    deleteStep: (stepId) => setSteps(steps.filter(step => step.id !== stepId)),
    addSubStep: (stepId, newSubStep) => setSteps(steps.map(step => step.id === stepId ? { ...step, subSteps: [...step.subSteps, newSubStep] } : step)),
    updateSubStep: (stepId, updatedSubStep) => setSteps(steps.map(step => step.id === stepId ? { ...step, subSteps: step.subSteps.map(subStep => subStep.id === updatedSubStep.id ? updatedSubStep : subStep) } : step)),
    deleteSubStep: (stepId, subStepId) => setSteps(steps.map(step => step.id === stepId ? { ...step, subSteps: step.subSteps.filter(subStep => subStep.id !== subStepId) } : step)),
    reorderSteps: setSteps,
    saveObjective
  };
};


  

  /*

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
  */