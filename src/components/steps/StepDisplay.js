// src/components/StepDisplay/index.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Save, X, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
};

export const StepDisplay = ({ 
  steps, 
  isGenerating,
  onUpdateStep,
  onDeleteStep,
  onAddSubStep,
  onUpdateSubStep,
  onDeleteSubStep,
  onReorderSteps
}) => {
  const handleAddStep = (content) => {
    if (content.trim()) {
      const newStep = {
        id: Math.random().toString(36).substr(2, 9),
        content: content,
        isLocked: false,
        subSteps: []
      };
      onUpdateStep(newStep);
      return true;
    }
    return false;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const reorderedSteps = Array.from(steps);
    const [removed] = reorderedSteps.splice(sourceIndex, 1);
    reorderedSteps.splice(destinationIndex, 0, removed);

    onReorderSteps(reorderedSteps);
  };

  return (
    <div className="mt-4 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Étapes générées en temps réel</h2>
      
      <NewStepInput onAddStep={handleAddStep} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="steps">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {steps.map((step, index) => (
                <Draggable 
                  key={step.id} 
                  draggableId={step.id} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`mb-4 border rounded-lg p-4 ${
                        snapshot.isDragging ? 'bg-gray-50 shadow-lg' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div 
                          {...provided.dragHandleProps}
                          className="cursor-grab hover:text-gray-600"
                        >
                          <GripVertical size={20} />
                        </div>
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {steps.length === 0 && (
        <div className="text-gray-500 text-center">
          {isGenerating ? "" : "Aucune étape générée pour le moment"}
        </div>
      )}
    </div>
  );
};






/*



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
};*/