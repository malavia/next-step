
import React, { useState } from 'react';
import { Plus, Trash2, Save, X, GripVertical, Clock, AlertTriangle } from 'lucide-react';
import { EditableContent } from '@/components/ui/EditableContent';
import { Progress } from "@/components/ui/progress";
import {createNewSubStep} from '../../hooks/stepUtils';

import {SubStep} from './SubStep';

export const StepCard = ({
    step,
    index,
    provided,
    snapshot,
    onUpdateStep,
    onDeleteStep,
    onAddSubStep,
    onUpdateSubStep,
    onDeleteSubStep
  }) => {

    
    const PriorityBadge = ({ priority }) => {
        const colors = {
        high: "bg-red-100 text-red-800",
        medium: "bg-yellow-100 text-yellow-800",
        low: "bg-green-100 text-green-800"
        };  
        return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[priority]}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
        );
    };


    const progress = (step.subSteps.filter(sub => sub.completed).length / step.subSteps.length) * 100;
    const isOverdue = new Date(step.deadline) < new Date() && !step.completed;
  
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={`mb-4 border rounded-lg p-4 ${
          snapshot.isDragging ? 'bg-gray-50 shadow-lg' : ''
        } ${step.type === 'parallel' ? 'border-blue-200' : 'border-gray-200'}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div 
            {...provided.dragHandleProps}
            className="cursor-grab hover:text-gray-600"
          >
            <GripVertical size={20} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-medium">{`${index + 1}.`}</span>
              <EditableContent
                content={step.content}
                onSave={(newContent) => onUpdateStep({ ...step, content: newContent })}
              />
              <PriorityBadge priority={step.priority} />
              {step.type === 'parallel' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Parallèle
                </span>
              )}
            </div>
            
            {step.deadline && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock size={16} />
                <span>{new Date(step.deadline).toLocaleDateString()}</span>
                {isOverdue && (
                  <AlertTriangle size={16} className="text-red-500" />
                )}
              </div>
            )}
          </div>
  
          <div className="flex gap-2">
            <button
                onClick={() => {
                    onAddSubStep(step.id, createNewSubStep('Nouvelle sous-étape'));
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
  
        {step.subSteps.length > 0 && (
          <Progress value={progress} className="my-2" />
        )}

        <div className="ml-8 mt-2">
        {step.subSteps.map((subStep) => (
            <SubStep stepId={step.id} subStep={subStep} onUpdate={onUpdateSubStep} onDelete={onDeleteSubStep} />
        ))}
        </div>

        
    
      </div>
    );
  };

  /* contenu du substep précedent
      <div className="ml-8 mt-2">
          {step.subSteps.map((subStep) => (
            <div key={subStep.id} className="flex items-center gap-2 mb-1 text-gray-600">
              <input
                type="checkbox"
                checked={subStep.completed}
                onChange={(e) => onUpdateSubStep(step.id, { 
                  ...subStep, 
                  completed: e.target.checked 
                })}
                className="rounded"
              />
              <div className="flex-1">
                <EditableContent
                  content={subStep.content}
                  placeholder="Nouvelle sous-étape"
                  onSave={(newContent) => onUpdateSubStep(step.id, { 
                    ...subStep, 
                    content: newContent 
                  })}
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
        </div>*/

/* ccontenu du stepCard précedent, c'est à dire sans priorité, deadline...

  import React, { useState } from 'react';
  import { Plus, Trash2, Save, X, GripVertical, Clock, AlertTriangle } from 'lucide-react';
  import { EditableContent } from '@/components/ui/EditableContent';
  import { Progress } from "@/components/ui/progress";
  import {createNewSubStep} from '../../hooks/stepUtils';
  
import {SubStep} from './SubStep';
  
  export const StepCard = ({
      step,
      index,
      provided,
      snapshot,
      onUpdateStep,
      onDeleteStep,
      onAddSubStep,
      onUpdateSubStep,
      onDeleteSubStep
    }) => {
  
    
    
      return (
      
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
  {step.subSteps.map((subStep) => (
    <SubStep stepId={step.id} subStep={subStep} onUpdate={onUpdateSubStep} onDelete={onDeleteSubStep} />
  ))}
</div>
</div>


    );
  };
*/