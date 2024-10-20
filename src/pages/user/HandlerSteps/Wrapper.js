// Wrapper.jsx
import React, { useState, useCallback } from 'react';
import StepManager from './StepManager';

function Wrapper() {
  const [steps, setSteps] = useState([]);

  const handleSetSteps = useCallback((newSteps) => {
    console.log('Mise à jour des étapes:', newSteps);
    setSteps(newSteps);
  }, []);
  

  const generateSubStep = useCallback((stepId) => {
    const newSubStep = { id: Date.now().toString(), content: 'Nouvelle sous-étape' };
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId
          ? { ...step, subSteps: [...(step.subSteps || []), newSubStep] }
          : step
      )
    );
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
              id: `substep-${Date.now()}`,
              content: ''
            }]
          }
          : step
      )
    );
  }, []);

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
    <StepManager
      steps={steps}
      setSteps={setSteps}
      onDragEnd={handleDragEnd}
      handleStepChange={handleStepChange}
      toggleLock={toggleLock}
      deleteStep={deleteStep}
      addSubStep={addSubStep}
      handleSubStepChange={handleSubStepChange}
      deleteSubStep={deleteSubStep}
      generateSubStep={generateSubStep}
    />
  );
}

export default Wrapper;