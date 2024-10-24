// src/pages/test/realtime.js
/* La page appelle le dosssier llm, les hooks steps, et le composant de steps / StepDisplay.
 * Le composant StepDisplay est un composant qui affiche les étapes. 
 */


import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useStepsGenerator  } from './hooks/useStepsGenerator';
import { useStepManager } from './hooks/useStepCRUD';
import { StepDisplay } from './compoenents/StepDisplay';
import {Wand2} from 'lucide-react';

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
const StepGeneratorWithDisplay = () => {
  const [steps, setSteps] = useState([]);
  const [title, setTitle] = useState([]);
  const { isGenerating, startGeneration, stopGeneration  } = useStepsGenerator ({ setSteps, title });
  const stepManager = useStepManager({steps, setSteps});

  return (

    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
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
          className={`px-4 py-2 rounded-lg font-medium ${
            isGenerating 
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

        {isGenerating && <CircularProgress />}
        </div>
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