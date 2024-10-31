// ObjectiveInput.jsx
import { EditableContent } from '../../../../components/ui/EditableContent';

const ObjectiveInput = ({ title, onSave, status }) => {
return (
    <div className={`flex-1 font-bold text-1xl ${!title.trim() ? 'bg-red-500 dark:bg-red-900  rounded' : ''}`}>
    <EditableContent
        content={title}
        placeholder="Entrez le titre de l'objectif"
        onSave={onSave}
    />
    </div>

  );
};

export default ObjectiveInput;
