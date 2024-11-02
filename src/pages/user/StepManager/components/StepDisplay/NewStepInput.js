import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import {  addNewStep, initialStepData } from '../../hooks/stepUtils';


export const NewStepInput = ({ onAddStep }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newStep, setNewStep] = useState(initialStepData());
  
    const handleSave = () => {
      console.log('NewStepInput - newStep:', newStep);
      console.log('NewStepInput - content type:', typeof newStep.content);
      
      // Ensure content is a string and not undefined/null before trimming
      const contentToSave = String(newStep.content || '');
      
      if (contentToSave) {
        
        const stepToAdd = {
          ...newStep,
          content: contentToSave
        };
        console.log('NewStepInput - stepToAdd:', stepToAdd);
        
        addNewStep([], stepToAdd);
        onAddStep(stepToAdd);

        // Reset state
        setNewStep(initialStepData()); 
        setIsAdding(false);
      }
    };
  
    return (
      <div className="mb-4">
        {isAdding ? (
          <div className="space-y-4 border rounded-lg p-4">
            <input
              type="text"
              value={newStep.content}
              onChange={(e) => setNewStep({...newStep, content: e.target.value})}
              placeholder="Nouvelle étape..."
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
              autoFocus
            />
            
            <div className="flex gap-4">
              <select 
                value={newStep.priority}
                onChange={(e) => setNewStep({...newStep, priority: e.target.value})}
                className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="low">Priorité basse</option>
                <option value="medium">Priorité moyenne</option>
                <option value="high">Priorité haute</option>
              </select>
              
              <select
                value={newStep.type}
                onChange={(e) => setNewStep({...newStep, type: e.target.value})}
                className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="sequential">Séquentiel</option>
                <option value="parallel">Parallèle</option>
              </select>
              
              <input
                type="date"
                value={newStep.deadline}
                onChange={(e) => setNewStep({...newStep, deadline: e.target.value})}
                className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Save size={20} />
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus size={20} />
            <span>Ajouter une étape</span>
          </button>
        )}
      </div>
    );
  };