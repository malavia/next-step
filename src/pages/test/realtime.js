// src/pages/test/realtime.js
import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useStepStream } from '../../hooks/steps/useStepStream';
import { useStepManager } from '../../hooks/steps/useStepCRUD';
import { StepDisplay } from '../../components/steps/StepDisplay';
import {Wand2} from 'lucide-react';

const StepGeneratorWithDisplay = () => {
  const [steps, setSteps] = useState([]);
  const [title, setTitle] = useState([]);
  const { isGenerating, startGeneration } = useStepStream({ setSteps, title: "avoir un chien" });
  const stepManager = useStepManager({steps, setSteps});

  /*
  return (


    <div className="space-y-4 max-w-4xl mx-auto p-4 min-h-screen">
    <div className="flex gap-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entrez le titre pour générer les étapes"
        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={startGeneration}
        disabled={isGenerating}
        variant="primary"
        className="gap-2"
      >
        <Wand2 className="h-4 w-4" />
        {isGenerating ? 'Génération...' : 'Générer les étapes'}
      </button>
    </div>

    {isGenerating && (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </div>
    )}

        <StepDisplay 
          steps={steps}
          isGenerating={isGenerating} 
          {...stepManager}
        />
      </div>




  );
*/

  return (

    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={startGeneration}
          disabled={isGenerating}
          className={`px-4 py-2 rounded-lg font-medium ${
            isGenerating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Wand2 className="h-4 w-4" />
          {isGenerating ? 'Génération en cours...' : 'Générer les étapes'}
        </button>
        
        {isGenerating && <CircularProgress />}
        <StepDisplay 
          steps={steps}
          isGenerating={isGenerating} 
          {...stepManager}
        />
      </div>
    </div>
  );
};

export default StepGeneratorWithDisplay;





    /*

        <button 
        onClick={addStep} 
        disabled={!title.trim() || isGenerating} 
        variant="secondary">
        <Plus size={18} className="mr-2" />
        Ajouter une étape
    </button>
    */