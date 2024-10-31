/*// TestGenerationPage.jsx
import React, { useState } from 'react';
import { useStepsGenerator } from './hooks/useStepsGenerator';
import { useStepsCRUD } from './hooks/useStepsCRUD';
import { green } from '@mui/material/colors';


const TestGenerationPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Récupération des fonctions et états de useStepsCRUD et useStepsGenerator
  const { objectiveData, setObjectiveData, steps, setSteps, addStep } = useStepsCRUD({});
  const { startGeneration, stopGeneration } = useStepsGenerator({});

  // Handler pour déclencher la génération des étapes
  const handleGenerateSteps = async () => {
    console.log("Début de la génération des étapes...");

    // Déclenchement de la génération
    setIsGenerating(true);
    await startGeneration();
    setIsGenerating(false);

    // Affichage des données pour le débogage
    console.log("Données de l'objectif après génération:", objectiveData);
    console.log("Étapes après génération:", steps);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: green[50] }}>
      <h2>Test de Génération des Étapes</h2>

      <button onClick={handleGenerateSteps} disabled={isGenerating} style={{ marginTop: '20px', padding: '10px' , borderRadius: '5px', border: '1px solid #ccc'}}>
        {isGenerating ? 'Génération en cours...' : 'Lancer la Génération des Étapes'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Debug Information</h3>
        <pre>Objective Data: {JSON.stringify(objectiveData, null, 2)}</pre>
        <pre>Steps: {JSON.stringify(steps, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TestGenerationPage;
*/
// TestGenerationPage.jsx
import React from 'react';
import { useStepsGenerator } from './hooks/useStepsGenerator';
import { useStepsCRUD } from './hooks/useStepsCRUD';
import { green } from '@mui/material/colors';

const TestGenerationPage = () => {
  // Initialize useStepsCRUD first to get all the necessary functions and state
  const {
    objectiveData,
    steps,
    addStep,
    addSubStep,
    isLoading,
  } = useStepsCRUD({
    initialTitle: 'New Objective',
    initialSteps: []
  });

  // Pass the CRUD functions to useStepsGenerator
  const { 
    isGenerating, 
    startGeneration, 
    stopGeneration,
    error 
  } = useStepsGenerator({
    objectiveData,
    addStep,
    addSubStep
  });

  const handleGenerateSteps = async () => {
    console.log("Starting step generation...");
    await startGeneration();
    console.log("Step generation completed.", steps);
  };



  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: green[50] }}>
      <h2>Step Generation Test</h2>

      <button 
        onClick={handleGenerateSteps} 
        disabled={isGenerating}
        style={{ 
          marginTop: '20px', 
          padding: '10px',
          borderRadius: '5px', 
          border: '1px solid #ccc'
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate Steps'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          Error: {error.message}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Debug Information</h3>
        <pre>Objective Data: {JSON.stringify(objectiveData, null, 2)}</pre>
        <pre>Steps: {JSON.stringify(steps, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TestGenerationPage;
