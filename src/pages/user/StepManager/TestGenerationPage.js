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
    setSteps,
    title,
    loading,
    error
  } = useStepsCRUD({  });

  const { 
    isGenerating, 
    startGeneration, 
    stopGeneration 
  } = useStepsGenerator({ setSteps, title});


  const handleGenerateSteps = async () => {
    console.log("Starting step generation...");
    await startGeneration();
    console.log("Step generation completed.", steps);
  };


  if (loading) {
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
