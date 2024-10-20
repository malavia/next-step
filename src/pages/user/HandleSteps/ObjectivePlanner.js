import React, { useState } from 'react';
import StepList from './StepList';
import StepGenerator from './StepGenerator';
import ActionButtons from './ActionButtons';

const ObjectivePlanner = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState([]);
  const [isGenerate, setIsGenerate] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Gestion des erreurs
  const [error, setError] = useState(null);

  // Fonction appelée lors de la fin de la génération
  const onGenerateComplete = (newSteps) => {
    setSteps(newSteps);
    setIsGenerate(true);
  };

  return (
    <div className="max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Planificateur d'Objectifs</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Champs principaux */}
      <div className="space-y-4 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Mon objectif"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Je précise..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
        />
      </div>

      {/* Génération des étapes */}
      <StepGenerator
        title={title}
        steps={steps}
        setSteps={setSteps}
        setIsFetching={setIsFetching}
        setError={setError}
        onGenerateComplete={onGenerateComplete}
      />

      {/* Liste des étapes */}
      {steps.length > 0 && (
        <StepList
          steps={steps}
          setSteps={setSteps}
        />
      )}

      {/* Boutons d'action */}
      <ActionButtons
        title={title}
        isFetching={isFetching}
        isGenerate={isGenerate}
        setIsGenerate={setIsGenerate}
        steps={steps}
        setSteps={setSteps}
      />
    </div>
  );
};

export default ObjectivePlanner;
