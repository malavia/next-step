// StepManager.jsx
import { useState, useCallback, useRef, useEffect } from 'react';
import { Wand2, Plus, Save } from 'lucide-react';
import  StepList  from './StepList';
import { StreamProcessor } from './LLMStepGenerator';
import { Button } from './Btn';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';

function StepManager({
  steps,
  setSteps,
  onDragEnd,
  handleStepChange,
  toggleLock,
  addStep,
  deleteStep,
  addSubStep,
  handleSubStepChange,
  deleteSubStep,
  generateSubStep,
  isLoadingRef,
  SaveObjective
}) {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shouldStartGeneration, setShouldStartGeneration] = useState(false);


  const handleStepsGenerated = useCallback((newSteps) => {
    const formattedSteps = newSteps.map((step, index) => ({
      id: `step-${Date.now()}-${index}`,
      content: step,
      isLocked: false,
      subSteps: []
    }));

    setSteps(formattedSteps);
    setIsGenerating(false);
    setShouldStartGeneration(false);
    
    isLoadingRef.current = false;
  }, [setSteps]);

  const generateSteps = useCallback(() => {
    if (title.trim()) {
      console.log('Démarrage de la génration des étapes...');
      isLoadingRef.current = true;
      setIsGenerating(true);
      setShouldStartGeneration(true);
      setSteps([]);
    }
  }, [title, setSteps]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre pour générer les étapes"
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button
          onClick={generateSteps}
          disabled={!title.trim() || isGenerating}
          variant="primary"
          className="gap-2"
        >
          <Wand2 className="h-4 w-4" />
          {isGenerating ? 'Génération...' : 'Générer les étapes'}
        </Button>
      </div>

      {isLoadingRef.current && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      )}


      <Button 
          onClick={addStep} 
          disabled={!title.trim() || isGenerating} 
          variant="secondary">
          <Plus size={18} className="mr-2" />
          Ajouter une étape
      </Button>

      {shouldStartGeneration && (
        <StreamProcessor
          title={title}
          onStepsGenerated={handleStepsGenerated}
          isGenerating={isGenerating}
        />
      )}

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


     {steps.length > 0 && <Button 
      onClick={SaveObjective}
      variant="finished"
         title={title}  >
        <Save className="h-4 w-4 mr-2" />
        Sauvegarder
      </Button>}
    </div>
  );
}

StepManager.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
    subSteps: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    }))
  })).isRequired,
  setSteps: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  handleStepChange: PropTypes.func.isRequired,
  toggleLock: PropTypes.func.isRequired,
  addStep: PropTypes.func.isRequired,
  deleteStep: PropTypes.func.isRequired,
  addSubStep: PropTypes.func.isRequired,
  handleSubStepChange: PropTypes.func.isRequired,
  deleteSubStep: PropTypes.func.isRequired,
  generateSubStep: PropTypes.func.isRequired
};

export default StepManager;