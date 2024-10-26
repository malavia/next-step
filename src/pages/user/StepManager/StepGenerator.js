// src/pages/test/realtime.js
/* La page appelle le dosssier llm, les hooks steps, et le composant de steps / StepDisplay.
 * Le composant StepDisplay est un composant qui affiche les étapes. 
 */

/**
 * StepGeneratorWithDisplay est un composant qui génère des étapes en fonction
 * d'un titre et qui les affiche.
 * Il utilise le hook useStepsGenerator pour générer les étapes et le hook
 * useStepManager pour gérer les étapes.
 * Le composant affiche un champ de saisie pour le titre, un bouton pour
 * lancer la génération et un bouton pour l'arrêter.
 * Le composant affiche également un indicateur de chargement en cas de
 * génération en cours.
 * Le composant utilise le composant StepDisplay pour afficher les étapes.
 * @returns {React.ReactElement} 
 */

import React from 'react';
import { useStepsGenerator } from './hooks/useStepsGenerator';
import { useStepsManagement } from './hooks/useStepsManagement';
import { StepDisplay } from './components/StepDisplay';
import { CircularProgress } from '@mui/material';
import { Wand2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * StepGeneratorWithDisplay est un composant qui génère des étapes en fonction
 * d'un titre et qui les affiche.
 * Utilise useStepsManagement pour gérer l'état et la persistence des étapes.
 * 
 * @returns {React.ReactElement} 
 */
const StepGeneratorWithDisplay = () => {
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
    saveObjective
  } = useStepsManagement({});
  
  const { isGenerating, startGeneration, stopGeneration } = useStepsGenerator({ 
    onStepsGenerated: setSteps,
    title 
  });

  const handleSave = async () => {
    const savedId = await saveObjective();
    if (savedId) {
      navigate(`/test/realtime/${savedId}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* En-tête avec titre et boutons */}
        <div className="flex gap-4 mb-6">
nombre : {steps.length}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre pour générer les étapes"
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
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <StepDisplay
            steps={steps}
            isGenerating={isGenerating}
          />
        )}
      </div>
    </div>
  );
};

export default StepGeneratorWithDisplay;