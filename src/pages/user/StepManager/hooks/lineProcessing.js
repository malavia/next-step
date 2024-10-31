// lineProcessing.js
import { createNewStep, createNewSubStep, addSubStepToLastStep, addNewStep } from './stepUtils';
import { isSubStep } from '../../../../utils/clearData';

export const processLine = (line, currentStepRef, setSteps) => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return;

  if (isSubStep(trimmedLine) && currentStepRef.current) {
    const subStep = createNewSubStep(trimmedLine);
    setSteps(prev => addSubStepToLastStep(prev, subStep));
  } else {
    const newStep = createNewStep(trimmedLine);
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
