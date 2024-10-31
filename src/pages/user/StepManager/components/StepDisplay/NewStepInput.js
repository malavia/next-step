import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Save } from 'lucide-react';
import { X } from 'lucide-react';

export const NewStepInput = ({ onAddStep }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newStep, setNewStep] = useState({
      content: '',
      priority: 'medium',
      deadline: '',
      duration: '',
      dependencies: [],
      type: 'sequential',
      subSteps: [] // Added this to match the expected structure
    });
  
    const handleSave = () => {
      console.log('NewStepInput - newStep:', newStep);
      console.log('NewStepInput - content type:', typeof newStep.content);
      
      // Ensure content is a string and not undefined/null before trimming
      const contentToSave = String(newStep.content || '');
      console.log('NewStepInput - contentToSave:', contentToSave);
      console.log('NewStepInput - contentToSave type:', typeof contentToSave);
      
      if (contentToSave.trim()) {
        const stepToAdd = {
          ...newStep,
          content: contentToSave,
          id: Date.now().toString()
        };
        console.log('NewStepInput - stepToAdd:', stepToAdd);
        
        onAddStep(stepToAdd);
        setNewStep({
          content: '',
          priority: 'medium',
          deadline: '',
          duration: '',
          dependencies: [],
          type: 'sequential',
          subSteps: []
        });
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
              className="w-full px-3 py-2 border rounded"
              autoFocus
            />
            
            <div className="flex gap-4">
              <select 
                value={newStep.priority}
                onChange={(e) => setNewStep({...newStep, priority: e.target.value})}
                className="px-3 py-2 border rounded"
              >
                <option value="low">Priorité basse</option>
                <option value="medium">Priorité moyenne</option>
                <option value="high">Priorité haute</option>
              </select>
              
              <select
                value={newStep.type}
                onChange={(e) => setNewStep({...newStep, type: e.target.value})}
                className="px-3 py-2 border rounded"
              >
                <option value="sequential">Séquentiel</option>
                <option value="parallel">Parallèle</option>
              </select>
              
              <input
                type="date"
                value={newStep.deadline}
                onChange={(e) => setNewStep({...newStep, deadline: e.target.value})}
                className="px-3 py-2 border rounded"
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

/* ancienne version
const NewStepInput = ({ onAddStep }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');

  const handleSave = () => {
    if (newContent.trim()) {
      onAddStep(newContent);
      setNewContent('');
      setIsAdding(false);
    }
  };

  return (
    <div className="mb-4">
      {isAdding ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Nouvelle étape..."
            className="flex-1 px-3 py-2 border rounded"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
          <button
            onClick={handleSave}
            className="p-2 text-green-600 hover:text-green-800"
          >
            <Save size={20} />
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="p-2 text-red-600 hover:text-red-800"
          >
            <X size={20} />
          </button>
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
};*/