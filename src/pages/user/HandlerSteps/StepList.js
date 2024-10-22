import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StepItem from './StepItem';

/* Contient la logique du DragDropContext et la liste des étapes avec sous-étapes */
const StepList = ({ steps, onDragEnd, handleStepChange, toggleLock, deleteStep, addSubStep, handleSubStepChange, deleteSubStep, generateSubStep, isGeneratingSubStep }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef} className="list-none p-0">
            {steps.map((step, index) => (
              <Draggable key={step.id} draggableId={step.id} index={index}>
                {(provided, snapshot) => (
                  <li  className="mb-4">
                    <StepItem
                      step={step}
                      index={index}
                    provided={provided}
                    snapshot={snapshot}
                      handleStepChange={handleStepChange}
                      handleSubStepChange={handleSubStepChange}
                      deleteSubStep={deleteSubStep}
                      toggleLock={toggleLock}
                      deleteStep={deleteStep}
                      addSubStep={addSubStep}
                      generateSubStep={generateSubStep}
                      isGeneratingSubStep = {isGeneratingSubStep}
                    />


                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
    
  );
};

export default StepList;

