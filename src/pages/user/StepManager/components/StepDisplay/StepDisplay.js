// src/components/StepDisplay/index.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Save, X, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { EditableContent } from '@/components/ui/EditableContent';
import {NewStepInput} from './NewStepInput';
import {StepCard} from './StepCard';
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

  const handleAddStep = (step) => {
    console.log('StepDisplay - received content:', step.content);
    
    if (step) {
      onAddStep(step);
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
                    <StepCard
                      step={step}
                      index={index}
                      provided={provided}
                      snapshot={snapshot}
                      onUpdateStep={onUpdateStep}
                      onDeleteStep={onDeleteStep}
                      onAddSubStep={onAddSubStep}
                      onUpdateSubStep={onUpdateSubStep}
                      onDeleteSubStep={onDeleteSubStep}
                    />
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