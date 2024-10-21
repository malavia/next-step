// StepManager.jsx
import { useState, useCallback } from 'react';
import StepList from './/StepList';
import StreamProcessor from './StreamProcessor';
import { Wand2 } from 'lucide-react';
import Btn from './Btn';

function StepManager({ steps = [], setSteps, onDragEnd, handleStepChange, toggleLock, addStep, deleteStep, addSubStep, handleSubStepChange, deleteSubStep, generateSubStep, setIsLoading }) {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shouldStartGeneration, setShouldStartGeneration] = useState(false);

  const handleStepsGenerated = useCallback((newSteps) => {
    console.log('Nouvelles étapes reçues:', newSteps);
    const formattedSteps = newSteps.map((step, index) => ({
      id: `step-${Date.now()}-${index}`,
      content: step,
      isLocked: false,
      subSteps: []
    }));

    
    setSteps(formattedSteps);    
    setIsGenerating(false);
    setShouldStartGeneration(false);
    setIsLoading(false); 
  }, [setSteps]);

  const generateSteps = useCallback(() => {
    if (title.trim()) {
      setIsGenerating(true);
      setShouldStartGeneration(true);
      setIsLoading(true); 
      setSteps([]);
      
    }
  }, [title, setSteps]);

  return (
    <div className="step-manager-container">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre pour générer les étapes"
          className="flex-1 p-2 border rounded"
        />

        <Btn
          onClick={generateSteps}
          className="flex items-center"
          isDisabled={!title.trim() || isGenerating}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          {isGenerating ? 'Génération...' : 'Générer les étapes'}
        </Btn>
      </div>

      <Btn onClick={addStep} className="mb-4"> {/* Ajout du bouton "Ajouter une étape" */}
        Ajouter une étape
      </Btn>

      {shouldStartGeneration && (
        <StreamProcessor
          title={title}
          onStepsGenerated={handleStepsGenerated}
          isGenerating={isGenerating}
        />
      )}

      {Array.isArray(steps) && (
        <StepList
          steps={steps}
          onDragEnd={onDragEnd}
          handleStepChange={handleStepChange}
          toggleLock={toggleLock}
          deleteStep={deleteStep}
          addSubStep={addSubStep}
          handleSubStepChange={handleSubStepChange}
          deleteSubStep={deleteSubStep}
          generateSubStep={generateSubStep}
        />
      )}
    </div>
  );
}

export default StepManager;