// stepUtils.js
import { clearStepContent, clearSubStepContent } from '../../../../utils/clearData';

export const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

export const initialObjectiveData = (initialTitle = '', initialSteps = []) => ({
    title: initialTitle,
    description: '',
    metrics: '',
    term: {},
    deadline: '',
    steps: initialSteps,
    status: 'draft',
    createdAt: null,
    updatedAt: null,
  });

export const createNewStep = (content) => ({ //ancienne version utilisé pour le moment pour la génération
  id: generateUniqueId(),
  content: clearStepContent(content),
  isLocked: false,
  subSteps: []
});

export const initialStepData = () => ({ //new version
    id: generateUniqueId(),
    content: '',
    priority: 'medium',
    deadline: '',
    duration: '',
    dependencies: [],
    type: 'sequential',
    subSteps: []
});

export const createNewSubStep = (content) => ({
  id: generateUniqueId(),
  content: clearSubStepContent(content)
});

export const addSubStepToLastStep = (steps, subStep) => {
  const newSteps = [...steps];
  const lastStep = newSteps[newSteps.length - 1];
  lastStep.subSteps.push(subStep);
  return newSteps;
};

export const addNewStep = (steps, newStep) => [...steps, newStep];
