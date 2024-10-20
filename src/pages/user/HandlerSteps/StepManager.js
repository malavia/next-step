import { useState } from 'react';
import StepList from '../HandleSteps/StepList';
import StreamProcessor from './StreamProcessor';
import { Wand2 } from 'lucide-react';
import Btn from './Btn';

function StepManager({ onDragEnd, handleStepChange, toggleLock, deleteStep, addSubStep, handleSubStepChange, deleteSubStep, generateSubStep, steps, setsteps }) {
  const [title, setTitle] = useState('');
  const [generatedSteps, setGeneratedSteps] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shouldStartGeneration, setShouldStartGeneration] = useState(false);

  // Fonction appelée lorsqu'il y a de nouvelles étapes générées
  const handleStepsGenerated = (newSteps) => {
    setGeneratedSteps(prev => [...prev, ...newSteps]);
    setIsGenerating(false);
    setShouldStartGeneration(false);
  };

  // Fonction pour déclencher la génération des étapes
  const generateSteps = () => {
    if (title.trim()) {
      setIsGenerating(true);
      setShouldStartGeneration(true);
      setGeneratedSteps([]); // Reset les étapes précédentes
    }
  };

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

      {shouldStartGeneration && (
        <StreamProcessor 
          title={title} 
          onStepsGenerated={handleStepsGenerated}
          isGenerating={isGenerating}
        />
      )}

{generatedSteps}
      <StepList
        steps={generatedSteps.map((step, index) => ({
          id: `step-${index}`,
          content: step,
          locked: false,
          subSteps: []
        }))}
        onDragEnd={onDragEnd}
        handleStepChange={handleStepChange}
        toggleLock={toggleLock}
        deleteStep={deleteStep}
        addSubStep={addSubStep}
        handleSubStepChange={handleSubStepChange}
        deleteSubStep={deleteSubStep}
        generateSubStep={generateSubStep}
      />
    </div>
  );
}

export default StepManager;