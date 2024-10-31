import React from 'react';
import { Trash2 } from 'lucide-react';
import { EditableContent } from '@/components/ui/EditableContent';

export const SubStep = ({ stepId, subStep, onUpdate, onDelete }) => (
  <div className="flex items-center gap-2 mb-1 text-gray-600">
            <input
              type="checkbox"
              checked={subStep.completed}
              onChange={() => onUpdate(stepId, { ...subStep, completed: !subStep.completed })}       
              className="rounded"
            />
    <div className="flex-1 flex items-center">
      <EditableContent
        content={subStep.content}
        placeholder="Nouvelle sous-étape"
        onSave={(newContent) => onUpdate(stepId, { ...subStep, content: newContent })}
      />
    </div>
    <button
      onClick={() => onDelete(subStep.id)}
      className="p-2 text-red-600 hover:text-red-800"
    >
      <Trash2 size={16} />
    </button>
  </div>
);
