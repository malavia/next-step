import React, { useState } from 'react';
import StepManager from './StepManager';

function Wrapper() {


    const [steps, setSteps] = useState([]);
    

  const generateSubStep = (stepId) => {
    // Génération d'une nouvelle sous-étape unique
    const newSubStep = { id: Date.now().toString(), content: 'Nouvelle sous-étape' };
    
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? { ...step, subSteps: [...(step.subSteps || []), newSubStep] }
          : step
      )
    );
  };

  // Gérer le changement d'une étape
  const handleStepChange = (id, newContent) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, content: newContent } : step
    ));
  };

  // Gérer le changement d'une sous-étape
  const handleSubStepChange = (stepId, subStepId, newContent) => {
    setSteps(steps.map(step => 
      step.id === stepId
        ? { 
            ...step, 
            subSteps: step.subSteps.map(subStep =>
              subStep.id === subStepId ? { ...subStep, content: newContent } : subStep
            ) 
          }
        : step
    ));
  };

  // Ajouter une sous-étape
  const addSubStep = (stepId) => {
    const newSubStep = { id: `substep${Math.random().toString(36).substring(7)}`, content: '' };
    setSteps(steps.map(step =>
      step.id === stepId
        ? { ...step, subSteps: [...step.subSteps, newSubStep] }
        : step
    ));
  };

  // Supprimer une sous-étape
  const deleteSubStep = (stepId, subStepId) => {
    setSteps(steps.map(step =>
      step.id === stepId
        ? { ...step, subSteps: step.subSteps.filter(subStep => subStep.id !== subStepId) }
        : step
    ));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newSteps = Array.from(steps);
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedItem);
    setSteps(newSteps);
  };

  const toggleLock = (id) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, isLocked: !step.isLocked } : step
    ));
  };

  const deleteStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const addStep = () => {
    const newStep = { id: `step${steps.length + 1}`, isLocked: false, subSteps: [] };
    setSteps([...steps, newStep]);
  };



return (
    <StepManager 
  steps={steps}
  setSteps={setSteps}
  onDragEnd={onDragEnd}
  handleStepChange={handleStepChange}
  toggleLock={toggleLock}
  deleteStep={deleteStep}
  addSubStep={addSubStep}
  handleSubStepChange={handleSubStepChange}
  deleteSubStep={deleteSubStep}
  generateSubStep={generateSubStep}

/>
)
}

export default Wrapper;