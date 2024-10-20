import React from 'react';
import { Lock, Unlock, Trash, Plus } from 'lucide-react';

import { Trash2, Wand2 } from 'lucide-react';
const StepItem = ({ 
  step, 
  index, 
  provided, 
  snapshot, 
  handleStepChange, 
  handleSubStepChange, 
  deleteStep, 
  toggleLock, 
  addSubStep, 
  deleteSubStep,
  generateSubStep 
}) => {
  return (


          <div       
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          key={step.id} className="bg-white border border-gray-200 rounded-lg">
            
            {/* En-tête de l'étape */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
              
              <span className="mr-2 font-bold text-gray-700">{index + 1}.</span>
              <input 
                value={step.content}
                onChange={(e) => handleStepChange(step.id, e.target.value)}
                className="flex-1 font-medium border-none focus:outline-none bg-transparent"
                placeholder="Contenu de l'étape"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => toggleLock(step.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label={step.isLocked ? 'Unlock' : 'Lock'}
                >
                  {step.isLocked ? <Lock className="h-4 w-4 text-gray-500" /> : <Unlock className="h-4 w-4 text-gray-500" />}
                </button>

                <button
                  onClick={() => deleteStep(step.id)}
                  className="p-1 hover:bg-gray-100 rounded">
                  <Trash className="h-4 w-4 text-red-500" />
                </button>

              </div>
            </div>

            {/* Sous-étapes */}
            <div className="p-4 space-y-2">
              {step.subSteps && step.subSteps.map((subStep, subIndex) => (
                <div key={subStep.id} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-8">{index + 1}.{subIndex + 1}</span>
                  <input 
                    value={subStep.content}
                    onChange={(e) => handleSubStepChange(step.id, subStep.id, e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => deleteSubStep(step.id, subStep.id)}
                    className="p-1 hover:bg-gray-100 rounded">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}

              {/* Boutons d'action pour les sous-étapes */}
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => addSubStep(step.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-white border border-gray-200 rounded-3xl hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                  Ajouter une sous-étape
                </button>
                <button 

                  onClick={() => generateSubStep(step.id)} 
                  className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 bg-white border border-gray-200 rounded-3xl hover:bg-gray-50">
                  <Wand2 className="h-4 w-4" />
                  Générer une sous-étape
                </button>
              </div>
            </div>
          </div>
  
  );
};



export default StepItem;



