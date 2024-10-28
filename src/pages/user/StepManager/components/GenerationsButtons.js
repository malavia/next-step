import React from 'react';
import { Wand2 } from 'lucide-react';

const GenerationButtons = ({ startGeneration, stopGeneration, isGenerating, title }) => (
  <>
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
  </>
);

export default GenerationButtons;
