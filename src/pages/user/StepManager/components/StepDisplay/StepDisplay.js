/*// src/components/StepDisplay/index.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Save, X, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { EditableContent } from '@/components/ui/EditableContent';
import {NewStepInput} from './NewStepInput';

import {SubStep} from './SubStep';



export const StepDisplay = ({
    steps,
    loading,
    isGenerating,
    onUpdateStep,
    onDeleteStep,
    onAddStep,
    onAddSubStep,
    onUpdateSubStep,
    onDeleteSubStep,
    onReorderSteps
  }) => {


  const handleAddStep = (content) => {
    if (content.trim()) {
      onAddStep(content);
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

  if (loading) {
    return (
      <div className="mt-4 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }


  return (
    <div className="mt-4 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">Liste des {steps.length > 1 && steps.length} Étapes :</h2>
      
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
                      
                      
                      {/* Sub-Step list 
                      <div className="ml-8 mt-2">
                        {step.subSteps.map((subStep) => (
                          <SubStep stepId={step.id} subStep={subStep} onUpdate={onUpdateSubStep} onDelete={onDeleteSubStep} />
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
          {isGenerating ? "Génération en cours..." : "Aucune étape pour le moment"}
        </div>
      )}
    </div>
  );
};*/

// src/components/StepDisplay/index.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Save, X, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { EditableContent } from '@/components/ui/EditableContent';


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
    loading,
    isGenerating,
    onUpdateStep,
    onDeleteStep,
    onAddStep,
    onAddSubStep,
    onUpdateSubStep,
    onDeleteSubStep,
    onReorderSteps
  }) => {


  const handleAddStep = (content) => {
    if (content.trim()) {
      onAddStep(content);
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

  if (loading) {
    return (
      <div className="mt-4 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }


  return (
    <div className="mt-4 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">Liste des {steps.length > 1 && steps.length} Étapes :</h2>
      
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
                      
                      
                      {/* Sub-Step list */}
                      <div className="ml-8 mt-2">
                        {step.subSteps.map((subStep) => (
                          <div key={subStep.id} className="flex items-center gap-2 mb-1 text-gray-600">
                            <div className="flex-1 flex items-center">
                              <EditableContent
                                content={subStep.content}
                                placeholder={'Nouvelle sous-étape'}
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
          {isGenerating ? "Génération en cours..." : "Aucune étape pour le moment"}
        </div>
      )}
    </div>
  );
};