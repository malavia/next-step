import React, { useState } from 'react';
import { getTermDate, formatDate } from '../../../../../utils/handleDate'; 
/**
 * Component for the second step of the New Version form, which asks the user to
 * select a term and input metrics for their objective.
 *
 * @param {function} onChange - Function to call when the user changes input.
 *                                  It is passed the new data as an argument.
 * @param {object} initialData - Initial values for the form fields. It should
 *                              contain the following fields:
 *                              - metrics: an object with three properties:
 *                                - initialValue: a number
 *                                - targetValue: a number
 *                                - unit: a string
 *                              - term: a string ('court', 'moyen', 'long', or 'custom')
 *                              - deadline: a date string (only if term === 'custom')
 * @returns {ReactElement} A React component with the form fields and a "Next"
 *                        button at the bottom.
 */


const Step2Metrics = ({ objectiveData, setObjectiveData  }) => {
  const [errors, setErrors] = useState({});

  const handleMetricsChange = (field, value) => {
    setObjectiveData(prev => ({
      ...prev,
      metrics: {
        initialValue: prev.metrics?.initialValue || 0,
        targetValue: prev.metrics?.targetValue || 0,
        unit: prev.metrics?.unit || '',
        [field]: value
      }
    }));
  };

  const handleTermSelection = (term) => {
    const termDate = getTermDate(term);
    setObjectiveData(prev => ({
      ...prev,
      term,
      deadline: term === 'custom' ? prev.deadline : termDate.toISOString().split('T')[0]
    }));
    setErrors({});
  };

  const handleDateChange = (value) => {
    setObjectiveData(prev => ({
      ...prev,
      deadline: value
    }));
    setErrors({});
  };


  const validateStep = () => {
    const newErrors = {};
    const selectedDate = new Date(objectiveData.deadline);

    if (!objectiveData.term && !objectiveData.deadline) {
      newErrors.term = 'Veuillez sélectionner un terme ou une date spécifique';
    }

    // Validation pour la date personnalisée
    if (objectiveData.term === 'custom') {
      if (!objectiveData.deadline || isNaN(selectedDate.getTime())) {
        newErrors.deadline = 'Veuillez choisir une date valide';
      } else {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 7);
        if (selectedDate < minDate) {
          newErrors.deadline = 'La date doit être au minimum dans une semaine';
        }
        const maxDate = new Date();
        maxDate.setDate(minDate.getDate() + 356*50);
        if (selectedDate > maxDate) {
          newErrors.deadline = 'Veuillez choisir une date valide';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
        <span className=" font-bold text-red-500">Ces valeurs sont pour évaluer la progression, mais ne sont pas adaptable à tout les cas, il faut re réflechir le truc</span>
      {/* Champs pour les métriques */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="initialValue" className="block text-sm font-medium text-gray-700 mb-2">
            Valeur initiale
          </label>
          <input
            id="initialValue"
            type="number"
            min="0" // Empêche les valeurs négatives
            value={objectiveData.metrics.initialValue}
            onChange={(e) => handleMetricsChange('initialValue', e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 mb-2">
            Objectif
          </label>
          <input
            id="targetValue"
            type="number"
            min="0" // Empêche les valeurs négatives
            value={objectiveData.metrics.targetValue}
            onChange={(e) => handleMetricsChange('targetValue', e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
            Unité
          </label>
          <input
            id="unit"
            type="text"
            value={objectiveData.metrics.unit}
            onChange={(e) => handleMetricsChange('unit', e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="kg, km, heures..."
          />
        </div>
      </div>

      {/* Choix du terme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Terme de l'objectif
        </label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button
            onClick={() => handleTermSelection('court')}
            className={`p-4 rounded-lg border-2 transition-all ${
              objectiveData.term === 'court' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <h3 className="font-medium mb-1">Court terme</h3>
            <p className="text-sm text-gray-500">1 mois</p>
          </button>
          <button
            onClick={() => handleTermSelection('moyen')}
            className={`p-4 rounded-lg border-2 transition-all ${
              objectiveData.term === 'moyen' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <h3 className="font-medium mb-1">Moyen terme</h3>
            <p className="text-sm text-gray-500">6 mois</p>
          </button>
          <button
            onClick={() => handleTermSelection('long')}
            className={`p-4 rounded-lg border-2 transition-all ${
              objectiveData.term === 'long' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <h3 className="font-medium mb-1">Long terme</h3>
            <p className="text-sm text-gray-500">1 an</p>
          </button>
        </div>

        {/* Affichage de la date sélectionnée */}
        {(objectiveData.term || objectiveData.deadline) && (
          <div className="mt-4 text-sm text-gray-500">
            <strong>Date choisie : </strong>
            {objectiveData.term === 'custom' ? formatDate(objectiveData.deadline) : formatDate(getTermDate(objectiveData.term))}
          </div>
        )}



        {/* Option de date personnalisée */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="customDate"
              checked={objectiveData.term === 'custom'}
              onChange={(e) => {
                if (e.target.checked) {
                  handleTermSelection('custom');
                } else {
                  //setLocalData({ ...formData, term: '', deadline: '' });
                }
              }}
              className="rounded border-gray-300"
            />
            <label htmlFor="customDate" className="text-sm font-medium text-gray-700">
              Choisir une date spécifique
            </label>
          </div>

          {objectiveData.term === 'custom' && (
            <div>
              <input
                type="date"
                value={objectiveData.deadline || ''} // Utilisez une chaîne vide si deadline est null ou undefined


                onChange={(e) => {
                  const newDate = e.target.value;                  
                  handleDateChange(newDate);
                  if (errors.deadline) {
                    setErrors({...errors, deadline: ''});
                  }
                }}

                min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className={`w-full p-2 border rounded-lg mt-2 ${errors.deadline ? 'border-red-500' : 'border-gray-200'}`}
              />

              {errors.deadline}
            </div>
          )}
        </div>


        {errors.term}
      </div>


    </div>
  );
};

export default Step2Metrics;
