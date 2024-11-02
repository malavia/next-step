// lineProcessing.js
import { createNewStep, createNewSubStep, addSubStepToLastStep, addNewStep } from './stepUtils';
import { isSubStep } from '../../../../utils/clearData';

import { clearStepContent, clearSubStepContent, extractStepAttributes } from '../../../../utils/clearData';

// Processus pour chaque ligne afin d'ajouter les étapes et sous-étapes avec attributs
export const processLine = (line, currentStepRef, setSteps) => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return;
  console.log('processLine - trimmedLine:', trimmedLine);
  if (isSubStep(trimmedLine) && currentStepRef.current) {
    const subStep = createNewSubStep(clearSubStepContent(trimmedLine));
    setSteps(prev => addSubStepToLastStep(prev, subStep));
  } else if (trimmedLine.startsWith('Priorité') || trimmedLine.startsWith('Type') || trimmedLine.startsWith('Deadline')) {
    // Attribut d'étape, on extrait et met à jour currentStepRef
    extractStepAttributes(trimmedLine, currentStepRef.current);
  } else {
    // Nouvelle étape
    const newStep = createNewStep(clearStepContent(trimmedLine));
    currentStepRef.current = newStep;
    setSteps(prev => addNewStep(prev, newStep));
  }
};

export const processLines = (lines, updateSteps) => {
  lines.forEach(line => {
    if (line.trim()) {
      updateSteps(line);
    }
  });
};
