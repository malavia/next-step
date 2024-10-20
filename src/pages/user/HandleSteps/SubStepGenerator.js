import React from 'react';

const SubStepGenerator = ({ stepId, steps, setSteps }) => {
  const generateSubStep = () => {
    const newSubStep = { id: Date.now().toString(), content: 'Nouvelle sous-étape' };
    
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId
          ? { ...step, subSteps: [...(step.subSteps || []), newSubStep] }
          : step
      )
    );
  };

  return (
    <button onClick={generateSubStep} className="text-blue-500">
      Ajouter une sous-étape
    </button>
  );
};

export default SubStepGenerator;
