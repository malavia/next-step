// RealTimeStepManager.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStepsGenerator } from './hooks/useStepsGenerator';
import { StepDisplay } from './components/StepDisplay';
import { CircularProgress } from '@mui/material';
import { Edit } from 'lucide-react';
import { useStepsCRUD } from './hooks/useStepsCRUD';
import ObjectivePopup from './components/ObjectivePopup';

import ObjectiveTitleInput from './components/ObjectiveTitleInput';
import GenerationButtons from './components/GenerationsButtons';
import SaveButton from './components/SaveButton';

/**
 * Page pour gérer un objectif en temps réel.
 * Permet de saisir un titre, de générer des étapes et de les modifier.
 * Permet également d'enregistrer l'objectif.
 * 
 * @param {string} objectiveId - ID de l'objectif (facultatif)
 * @returns {ReactElement} Composant JSX pour la page de gestion d'objectif en temps réel
 */
const Wrapper = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { objectiveId } = useParams();
  const navigate = useNavigate();

  const {
    objectiveData,
    setObjectiveData,
    steps,
    setSteps,
    title,
    status,
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
  } = useStepsGenerator({ setSteps, title});

  const handleSaveGlobal = async () => {
    const updatedData = {
      ...objectiveData,
      steps: steps // Mettez à jour steps dans objectiveData
    };
    const savedId = await saveObjective(updatedData);
    if (savedId && !objectiveId) {
      navigate(`/realTimeStepManager/${savedId}`);
    }
  };

  const handleSavePopup = async () => {
    try {
      const savedId = await saveObjective();
      if (!objectiveId && savedId) {
        navigate(`/realTimeStepManager/${savedId}`);
      }
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'objectif : ", error);
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
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto">
        {/* Header avec titre et boutons */}
        <div className="flex gap-4 mb-6">

          <ObjectiveTitleInput
            title={objectiveData.title}
            onSave={(newTitle) => setObjectiveData({ ...objectiveData, title: newTitle })}
            status={status}
          />
          <button onClick={() => setIsPopupOpen(true)}>
            <Edit className="h-4 w-4" />
          </button>

          <ObjectivePopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onSave={handleSavePopup}
            objectiveData={objectiveData}
            setObjectiveData={setObjectiveData}
          />

          <GenerationButtons 
            startGeneration={startGeneration} 
            stopGeneration={stopGeneration} 
            isGenerating={isGenerating} 
            title={objectiveData.title}
          />

          <SaveButton onSave={handleSaveGlobal} saveLoading={saveLoading} isGenerating={isGenerating} />
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