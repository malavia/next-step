// RealTimeStepManager.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStepsGenerator } from './hooks/useStepsGenerator';
import { StepDisplay } from './components/StepDisplay';
import { CircularProgress } from '@mui/material';
import { Wand2, Save } from 'lucide-react';
import { useStepsCRUD } from './hooks/useStepsCRUD';

/**
 * Page pour gérer un objectif en temps réel.
 * Permet de saisir un titre, de générer des étapes et de les modifier.
 * Permet également d'enregistrer l'objectif.
 * 
 * @param {string} objectiveId - ID de l'objectif (facultatif)
 * @returns {ReactElement} Composant JSX pour la page de gestion d'objectif en temps réel
 */
const Wrapper = () => {
  const { objectiveId } = useParams();
  const navigate = useNavigate();

  const {
    steps,
    setSteps,
    title,
    setTitle,
    loading,
    error,
    saveLoading,
    saveError,
    addStep,
    updateStep,
    deleteStep,
    addSubStep,
    updateSubStep,
    deleteSubStep,
    reorderSteps,
    saveObjective
  } = useStepsCRUD({ objectiveId });

  const { 
    isGenerating, 
    startGeneration, 
    stopGeneration 
  } = useStepsGenerator({ 
    onStepsGenerated: setSteps,
    title 
  });

  const handleSave = async () => {
    const savedId = await saveObjective();
    if (savedId && !objectiveId) {
      navigate(`/test/realtime/${savedId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header avec titre et boutons */}
        <div className="flex gap-4 mb-6">
          
        <span className="text-3xl font-bold">Etapes</span>
        nombre : {steps.length}

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre de l'objectif"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button 
            onClick={startGeneration}
            disabled={isGenerating || !title.trim()}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isGenerating || !title.trim()
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Wand2 className="h-4 w-4" />
            {isGenerating ? 'Génération en cours...' : 'Générer les étapes'}
          </button>
          
          {isGenerating && (
            <button 
              onClick={stopGeneration}
              className="px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white"
            >
              Arrêter la génération
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saveLoading || isGenerating || !title.trim() || !steps.length}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              saveLoading || isGenerating || !title.trim() || !steps.length
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Save className="h-4 w-4" />
            {saveLoading ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {saveError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {saveError}
          </div>
        )}
        {/* Affichage des étapes */}

        
        {steps.map((subStep) => (
    <div key={subStep.id}>{subStep.content}</div>
  ))}

        <StepDisplay
          steps={steps}
          loading={loading}
          isGenerating={isGenerating}
          onAddStep={addStep}
          onUpdateStep={updateStep}
          onDeleteStep={deleteStep}
          onAddSubStep={addSubStep}
          onUpdateSubStep={updateSubStep}
          onDeleteSubStep={deleteSubStep}
          onReorderSteps={reorderSteps}
        />
      </div>
    </div>
  );
};

export default Wrapper;