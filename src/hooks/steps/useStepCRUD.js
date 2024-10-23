// src/hooks/steps/useStepCRUD.js
import { useCallback } from 'react';

export const useStepManager = ({initialSteps, setSteps}) => {
  const handleUpdateStep = useCallback((updatedStep) => {
    setSteps(prev => {
      if (prev.find(step => step.id === updatedStep.id)) {
        return prev.map(step => 
          step.id === updatedStep.id ? updatedStep : step
        );
      } else {
        return [...prev, updatedStep];
      }
    });
  }, []);

  const handleDeleteStep = useCallback((stepId) => {
    setSteps(prev => prev.filter(step => step.id !== stepId));
  }, []);

  const handleAddSubStep = useCallback((stepId, newSubStep) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: [...step.subSteps, newSubStep]
        };
      }
      return step;
    }));
  }, []);

  const handleUpdateSubStep = useCallback((stepId, updatedSubStep) => {
    setSteps(prev => prev.map(step => {
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
  }, []);

  const handleDeleteSubStep = useCallback((stepId, subStepId) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: step.subSteps.filter(subStep => subStep.id !== subStepId)
        };
      }
      return step;
    }));
  }, []);

  const handleReorderSteps = useCallback((newSteps) => {
    setSteps(newSteps);
  }, []);

  return {
    onUpdateStep: handleUpdateStep,
    onDeleteStep: handleDeleteStep,
    onAddSubStep: handleAddSubStep,
    onUpdateSubStep: handleUpdateSubStep,
    onDeleteSubStep: handleDeleteSubStep,
    onReorderSteps: handleReorderSteps
  };
};