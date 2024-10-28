
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
      <div className="flex-1" onClick={() => setIsEditing(true)}>
        {isEditing ? (
          <input
            type="text"
            value={editedContent === placeholder ? "" : editedContent}
            placeholder={placeholder}
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