// RealTimeStepManager.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStepsGenerator } from './hooks/useStepsGenerator';
import { StepDisplay } from './components/StepDisplay';
import { CircularProgress } from '@mui/material';
import { Wand2, Save, Edit } from 'lucide-react';
import { useStepsCRUD } from './hooks/useStepsCRUD';
import ObjectivePopup from './components/ObjectivePopup';

const EditableContent = ({ content, placeholder, onSave }) => {
  const [editedContent, setEditedContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    if (editedContent.trim() !== content) {
      onSave(editedContent);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <div className="flex-1" onClick={() => setIsEditing(true)}>
      {isEditing || (!content && placeholder) ? (
        <input
          type="text"
          value={editedContent === placeholder ? "" : editedContent}
          placeholder={placeholder}
          onChange={(e) => setEditedContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-gray-100"
          autoFocus
        />
      ) : (
        <span className="cursor-pointer">{content}</span>
      )}
    </div>
  );
};

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
          <div className={`flex-1 ${status === 'draft' ? 'bg-red-100 dark:bg-red-900 p-2 rounded' : ''}`}>
            <EditableContent
              content={objectiveData.title}
              placeholder="Entrez le titre de l'objectif"
              onSave={(newTitle) => setObjectiveData({ ...objectiveData, title: newTitle })}
            />
          </div>
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
          <button 
            onClick={startGeneration}
            disabled={isGenerating || !objectiveData.title.trim()}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isGenerating || !objectiveData.title.trim()
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
            onClick={handleSaveGlobal}
            disabled={saveLoading || isGenerating}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              !saveLoading && !isGenerating
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-400 cursor-not-allowed'
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