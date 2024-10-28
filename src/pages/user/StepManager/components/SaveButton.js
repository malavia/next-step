import React from 'react';
import { Save } from 'lucide-react';

const SaveButton = ({ onSave, saveLoading, isGenerating }) => (
  <button
    onClick={onSave}
    disabled={saveLoading || isGenerating}
    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
      !saveLoading && !isGenerating
        ? 'bg-green-500 hover:bg-green-600 text-white'
        : 'bg-gray-400 cursor-not-allowed'
    }`}
  >
    <Save className="h-4 w-4" />
    {saveLoading ? 'Sauvegarde...' : 'Enregistrer'}
  </button>
);

export default SaveButton;