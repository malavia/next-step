/*
utlisation :
  <EditableContent
    content={subStep.content}
    placeholder={'Nouvelle sous-étape'}
    onSave={(newContent) => onUpdateSubStep(step.id, { ...subStep, content: newContent })}
  />
*/
import React, { useState } from 'react';

export const EditableContent = ({ content, placeholder, onSave }) => {
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
      <div 
        className="flex-1 cursor-text" 
        onClick={() => setIsEditing(true)}
      >
        {isEditing || (!editedContent && placeholder) ? (
          <input
            type="text"
            value={editedContent === placeholder ? "" : editedContent}
            placeholder={placeholder}
            onChange={(e) => setEditedContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-gray-100"
            style={{
              lineHeight: '1.5',
              paddingTop: '0.375rem',
              paddingBottom: '0.375rem'
            }}
            autoFocus
          />
        ) : (
          <span 
            className="cursor-text"
            style={{
              lineHeight: '1.5',
              display: 'inline-block',
              paddingTop: '0.375rem',
              paddingBottom: '0.375rem'
            }}
          >
            {editedContent || placeholder}
          </span>
        )}
      </div>
    );
  };
  