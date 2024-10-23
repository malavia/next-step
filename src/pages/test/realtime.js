import React, { useState, useRef } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
// Fonction externe pour gérer les messages envoyés au LLM
function getLLMMessages(title) {
    return [
      { 
        role: "system", 
        content: "Respond like a coach assistant. Provide the answer directly without any introductory text." 
      },
      {
        role: "user", 
        content: `Génère une liste d'étapes pour atteindre l'objectif suivant : "${title}". Chaque étape doit avoir 2 à 3 sous-étapes. Assure-toi que les étapes et les sous-étapes sont rédigées de manière réutilisable pour d'autres objectifs. Chaque étape et sous-étape doit être séparée par un saut de ligne. Les sous étapes doivent commencer par le texte "Sous-étape 1 :"` 
      }
    ];
  }
  
const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const isSubStep = (step) => {
  return step.toLowerCase().includes('sous-étape') || step.startsWith('-');
};

const clearStepContent = (step) => {
  return step.replace(/^\d+\.\s*/, '').trim();
};

const clearSubStepContent = (step) => {
  return step.replace(/^(-|Sous-étape \d+ :)\s*/, '').trim();
};


const EditableContent = ({ content, onSave }) => {
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
      {isEditing ? (
        <input
          type="text"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border rounded"
          autoFocus
        />
      ) : (
        <span className="cursor-text">{editedContent}</span>
      )}
    </div>
  );
};

const StepDisplay = ({ steps, onUpdateStep, onDeleteStep, onAddSubStep, onUpdateSubStep, onDeleteSubStep }) => {
  const handleAddStep = (content) => {
    if (content.trim()) {
      const newStep = {
        id: generateUniqueId(),
        content: content,
        isLocked: false,
        subSteps: []
      };
      onUpdateStep(newStep);
      return true;
    }
    return false;
  };

  const NewStepInput = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [newContent, setNewContent] = useState('');

    const handleSave = () => {
      if (handleAddStep(newContent)) {
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
                if (e.key === 'Enter') {
                  handleSave();
                }
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
  };

  return (
    <div className="mt-4 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Étapes générées en temps réel</h2>
      
      <NewStepInput />

      {steps.map((step, index) => (
        <div key={step.id} className="mb-4 border rounded-lg p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center font-bold">
              <span className="text-lg font-medium mr-2">{`${index + 1}.`}</span>
              <EditableContent
                content={step.content}
                onSave={(newContent) => onUpdateStep({ ...step, content: newContent })}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newSubStep = {
                    id: Math.random().toString(36).substr(2, 9),
                    content: 'Nouvelle sous-étape'
                  };
                  onAddSubStep(step.id, newSubStep);
                }}
                className="p-2 text-green-600 hover:text-green-800"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => onDeleteStep(step.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="ml-8 mt-2">
            {step.subSteps.map((subStep, subIndex) => (
              <div key={subStep.id} className="flex items-center gap-2 mb-1 text-gray-600">
                <div className="flex-1 flex items-center">
                  <EditableContent
                    content={subStep.content}
                    onSave={(newContent) => onUpdateSubStep(step.id, { ...subStep, content: newContent })}
                  />
                </div>
                <button
                  onClick={() => onDeleteSubStep(step.id, subStep.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {steps.length === 0 && (
        <div className="text-gray-500 text-center">Aucune étape générée pour le moment</div>
      )}
    </div>
  );
};

// Le reste du code reste identique (getLLMMessages et StepGeneratorWithDisplay)
const StepGeneratorWithDisplay = () => {
  const [steps, setSteps] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const currentStepRef = useRef(null);
  const bufferRef = useRef('');


  const updateSteps = (line) => {
    const trimmedLine = line.trim();

    if (isSubStep(trimmedLine)) {
      if (currentStepRef.current) {
        const subStep = {
          id: generateUniqueId(),
          content: clearSubStepContent(trimmedLine)
        };
        setSteps(prev => {
          const newSteps = [...prev];
          const lastStep = newSteps[newSteps.length - 1];
          lastStep.subSteps.push(subStep);
          return newSteps;
        });
      }
    } else if (trimmedLine) {
      const newStep = {
        id: generateUniqueId(),
        content: clearStepContent(trimmedLine),
        isLocked: false,
        subSteps: []
      };
      currentStepRef.current = newStep;
      setSteps(prev => [...prev, newStep]);
    }
  };

  const handleUpdateStep = (updatedStep) => {
    setSteps(prev => {
      if (prev.find(step => step.id === updatedStep.id)) {
        // Mise à jour d'une étape existante
        return prev.map(step => 
          step.id === updatedStep.id ? updatedStep : step
        );
      } else {
        // Ajout d'une nouvelle étape
        return [...prev, updatedStep];
      }
    });
  };

  const handleDeleteStep = (stepId) => {
    setSteps(prev => prev.filter(step => step.id !== stepId));
  };

  const handleAddSubStep = (stepId, newSubStep) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: [...step.subSteps, newSubStep]
        };
      }
      return step;
    }));
  };

  const handleUpdateSubStep = (stepId, updatedSubStep) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: step.subSteps.map(subStep =>
            subStep.id === updatedSubStep.id ? updatedSubStep : subStep
          )
        };
      }
      return step;
    }));
  };

  const handleDeleteSubStep = (stepId, subStepId) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: step.subSteps.filter(subStep => subStep.id !== subStepId)
        };
      }
      return step;
    }));
  };

  const processChunk = (content) => {
    const fullContent = bufferRef.current + content;
    const lines = fullContent.split('\n');
    
    bufferRef.current = lines.pop() || '';

    lines.forEach(line => {
      if (line.trim()) {
        updateSteps(line);
      }
    });
  };

  const startGeneration = async () => {
    setIsGenerating(true);
    setSteps([]);
    currentStepRef.current = null;
    bufferRef.current = '';

    try {
      const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "lmstudio-community/dolphin-2.8-mistral-7b-v02-GGUF/dolphin-2.8-mistral-7b-v02-Q4_0.gguf",
          messages: getLLMMessages("vivre"),
          temperature: 0.7,
          max_tokens: -1,
          stream: true
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (bufferRef.current.trim()) {
            updateSteps(bufferRef.current);
          }
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(5));
              const content = jsonData.choices?.[0]?.delta?.content || '';
              if (content) {
                processChunk(content);
              }
            } catch (error) {
              if (!line.includes('[DONE]')) {
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={startGeneration}
          disabled={isGenerating}
          className={`px-4 py-2 rounded-lg font-medium ${
            isGenerating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isGenerating ? 'Génération en cours...' : 'Générer les étapes'}
        </button>

        <StepDisplay 
          steps={steps}
          onUpdateStep={handleUpdateStep}
          onDeleteStep={handleDeleteStep}
          onAddSubStep={handleAddSubStep}
          onUpdateSubStep={handleUpdateSubStep}
          onDeleteSubStep={handleDeleteSubStep}
        />
      </div>
    </div>
  );
};

export default StepGeneratorWithDisplay;











