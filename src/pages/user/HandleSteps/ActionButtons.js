import React from 'react';
import { Plus, Save, RotateCw } from 'lucide-react';
import Btn from './Btn';

const ActionButtons = ({ title, isFetching, isGenerate, steps, setSteps }) => {
  const addStep = () => {
    const newStep = { id: `step${steps.length + 1}`, isLocked: false, subSteps: [] };
    setSteps([...steps, newStep]);
  };

  const SaveObjective = () => {
    // Logique pour sauvegarder l'objectif
  };

  return (
    <div className="flex gap-2 mt-6">
      {!isFetching && isGenerate && (
        <>
          <Btn onclick={addStep} title={title}>
            <Plus size={18} className="mr-2" />
            Ajouter une étape
          </Btn>
          <Btn onclick={SaveObjective} title={title} classnames={'bg-blue-500 text-white hover:bg-blue-600'}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Btn>
        </>
      )}
    </div>
  );
};

export default ActionButtons;
