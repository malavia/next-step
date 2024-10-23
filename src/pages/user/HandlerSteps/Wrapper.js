import React, { useState, useCallback, useEffect, useRef } from 'react';
import StepManager from './StepManagerUI';
import LLMStepGenerator from './LLMStepGenerator';
import { v4 as uuidv4 } from 'uuid';
import StepGeneratorWithDisplay from '../../test/realtime';

const generateUniqueId = () => {
  return uuidv4(); // Génère un identifiant unique
};

function Wrapper() {
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSubStep, setIsGeneratingSubStep] = useState(false);
  const [currentStepId, setCurrentStepId] = useState(null); // Pour savoir quelle étape génère une sous-étape
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    isLoadingRef.current = isLoading;
    console.log("isLoading est maintenant :", isLoadingRef.current);
  }, [isLoading]);

  const handleSetSteps = useCallback((newSteps) => {
    console.log('Mise à jour des étapes:', newSteps);
    setSteps(newSteps);
  }, []);

  const handleStepChange = useCallback((id, newContent) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === id ? { ...step, content: newContent } : step
      )
    );
  }, []);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    setSteps(prevSteps => {
      const items = Array.from(prevSteps);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      return items;
    });
  }, []);

  const toggleLock = useCallback((id) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === id ? { ...step, isLocked: !step.isLocked } : step
      )
    );
  }, []);

  const addStep = useCallback(() => {
    const newStep = {
      id: `step-${Date.now()}`,
      content: '',
      isLocked: false,
      subSteps: []
    };
    setSteps(prevSteps => [...prevSteps, newStep]);
  }, []);

  const deleteStep = useCallback((id) => {
    setSteps(prevSteps => prevSteps.filter(step => step.id !== id));
  }, []);

  const addSubStep = useCallback((stepId) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId
          ? {
            ...step,
            subSteps: [...(step.subSteps || []), {
              id: generateUniqueId(), // Utilise la fonction pour générer un ID unique
              content: ''
            }]
          }
          : step
      )
    );
  }, []);

  const generateSubStep = useCallback((stepId) => {
    setIsGeneratingSubStep(true);
    setCurrentStepId(stepId); // Sauvegarde l'ID de l'étape en cours

    const handleSubStepsGenerated = (newSubSteps) => {
      setSteps(prevSteps =>
        prevSteps.map(step =>
          step.id === stepId
            ? { ...step, subSteps: [...(step.subSteps || []), ...newSubSteps.map(subStep => ({ id: generateUniqueId(), content: subStep }))] }
            : step
        )
      );
      setIsGeneratingSubStep(false);
      setCurrentStepId(null); // Réinitialise l'ID courant
    };

    return (
      <LLMStepGenerator
        title="Sous-étape"
        onStepsGenerated={handleSubStepsGenerated}
        isGenerating={isGeneratingSubStep}
        isSubStep={true}
        parentStepId={stepId}
      />
    );
  }, []);

  // ** Récupérer le contenu de l'étape actuelle **
  const getStepContent = (stepId) => {
    const currentStep = steps.find(step => step.id === stepId);
    return currentStep ? currentStep.content : '';
  };

  const handleSubStepChange = useCallback((stepId, subStepId, newContent) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId
          ? {
              ...step,
              subSteps: step.subSteps.map(subStep =>
                subStep.id === subStepId ? { ...subStep, content: newContent } : subStep
              )
            }
          : step
      )
    );
  }, []);

  const deleteSubStep = useCallback((stepId, subStepId) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId
          ? {
              ...step,
              subSteps: step.subSteps.filter(subStep => subStep.id !== subStepId)
            }
          : step
      )
    );
  }, []);

  return (
    <>
      <h1>HandlerSteps</h1>
      <StepGeneratorWithDisplay />
      <StepManager
        steps={steps}
        setSteps={handleSetSteps}
        onDragEnd={handleDragEnd}
        handleStepChange={handleStepChange}
        toggleLock={toggleLock}
        addStep={addStep}
        deleteStep={deleteStep}
        addSubStep={addSubStep}
        handleSubStepChange={handleSubStepChange}
        deleteSubStep={deleteSubStep}
        generateSubStep={generateSubStep}
        isLoadingRef={isLoadingRef}
        SaveObjective={() => console.log('Objectif sauvegardé')}
      />
      {isGeneratingSubStep && currentStepId && (
        <LLMStepGenerator
          title="Sous-étape"
          onStepsGenerated={(newSubSteps) => {
            setSteps(prevSteps =>
              prevSteps.map(step =>
                step.id === currentStepId
                  ? { ...step, subSteps: [...(step.subSteps || []), ...newSubSteps.map(subStep => ({ id: Date.now().toString(), content: subStep }))] }
                  : step
              )
            );
            setIsGeneratingSubStep(false);
            setCurrentStepId(null);
          }}
          isGenerating={isGeneratingSubStep}
          isSubStep={true}
          parentStepId={currentStepId}
          parentStepContent={getStepContent(currentStepId)}  
        />
      )}
    </>
  );
}

export default Wrapper;
