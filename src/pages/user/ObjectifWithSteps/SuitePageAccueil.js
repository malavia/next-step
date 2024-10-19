import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import StepList from './StepList';
import {  Plus, Wand2, RotateCw, Save } from 'lucide-react';
import {GenerateTextViaIA} from '../../../services/llmService';
import { CircularProgress } from '@mui/material';

const ObjectivePlanner = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState([]);
  const [isGenerate, setIsGenerate] = useState(false);



  const [isFetching, setIsFetching] = useState(false);
  const [partialResponse, setPartialResponse] = useState(''); // Stocke les réponses partielles
  const stepCounter = useRef(0);
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [stepSet, setStepSet] = useState(new Set()); // Nouveau Set pour éviter les doublons d'étapes

  const generateUniqueId = () => {
    stepCounter.current += 1; // Incrémenter le compteur à chaque nouvelle étape
    return `step-${Date.now()}-${stepCounter.current}`;
  };

  const handlePartialResponse = (newPartialResponse) => {
    setPartialResponse((prev) => {
      const updatedResponse = prev + newPartialResponse;
      console.log('Réponse mise à jour :', updatedResponse);
  
      // Vérifier le format de la réponse au début
      if (prev.length === 0 && newPartialResponse[0] !== '[') {
        const errorMsg = "Erreur : la réponse doit commencer par un '['.";
        console.error(errorMsg);
        setError(errorMsg);
        return updatedResponse;
      }
  
      try {
        // Tenter de parser la réponse complète si elle se termine par ]
        if (updatedResponse.trim().endsWith(']')) {
          const parsedSteps = JSON.parse(updatedResponse);
          
          // Mettre à jour les étapes uniquement si c'est un tableau valide
          if (Array.isArray(parsedSteps)) {
            const newSteps = parsedSteps.map(stepContent => ({
              id: generateUniqueId(),
              content: stepContent,
              isLocked: false,
              subSteps: []
            }));
            
            setSteps(newSteps);
            setStepSet(new Set(parsedSteps));
          }
        } else {
          // Rechercher les étapes complètes dans la réponse partielle
          const completedStepMatch = updatedResponse.match(/\[(.*?)\]/);
          if (completedStepMatch) {
            const stepsString = completedStepMatch[1];
            const stepParts = stepsString.split('","').map(part => 
              part.replace(/^"|"$/g, '').replace(/^\["|"\]$/g, '')
            );
            
            const validSteps = stepParts.filter(step => 
              step && step.trim() && !step.includes('"') && !stepSet.has(step)
            );
  
            if (validSteps.length > 0) {
              const newSteps = validSteps.map(stepContent => ({
                id: generateUniqueId(),
                content: stepContent.trim(),
                isLocked: false,
                subSteps: []
              }));
  
              setSteps(prevSteps => {
                const uniqueNewSteps = newSteps.filter(newStep => 
                  !prevSteps.some(existingStep => 
                    existingStep.content === newStep.content
                  )
                );
                return [...prevSteps, ...uniqueNewSteps];
              });
  
              validSteps.forEach(step => {
                setStepSet(prev => new Set([...prev, step.trim()]));
              });
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors du traitement de la réponse:", error);
      }
  
      return updatedResponse;
    });
  };



  const generateSteps = async () => {
    console.log("Début de la génération des étapes...");
    
    // Réinitialiser l'état des étapes avant la nouvelle génération
    setSteps([]);
    setPartialResponse('');
    setStepSet(new Set());
    setError(null); // Réinitialiser les erreurs avant chaque génération
  
    let PrommptSupplementaire = `imagine et identifie les étapes nécessaires pour atteindre l'objectif "${title}".`;
    console.log(PrommptSupplementaire);
    
    await GenerateTextViaIA({
      setIsFetching, 
      PrommptSupplementaire: PrommptSupplementaire, 
      handlePartialResponse,
    });
  
    setIsGenerate(true);
    console.log("Génération des étapes terminée.");
  };


  
  const refreshUnlockedSteps = () => {
    generateSteps();
    /*
    setSteps(steps.map(step =>
      step.isLocked ? step : { ...step, content: `Étape rafraîchie: ${Math.random().toString(36).substring(7)}` }
    ));
    */
  };







  const generateSubStep = (stepId) => {
    // Génération d'une nouvelle sous-étape unique
    const newSubStep = { id: Date.now().toString(), content: 'Nouvelle sous-étape' };
    
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? { ...step, subSteps: [...(step.subSteps || []), newSubStep] }
          : step
      )
    );
  };

  // Gérer le changement d'une étape
  const handleStepChange = (id, newContent) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, content: newContent } : step
    ));
  };

  // Gérer le changement d'une sous-étape
  const handleSubStepChange = (stepId, subStepId, newContent) => {
    setSteps(steps.map(step => 
      step.id === stepId
        ? { 
            ...step, 
            subSteps: step.subSteps.map(subStep =>
              subStep.id === subStepId ? { ...subStep, content: newContent } : subStep
            ) 
          }
        : step
    ));
  };

  // Ajouter une sous-étape
  const addSubStep = (stepId) => {
    const newSubStep = { id: `substep${Math.random().toString(36).substring(7)}`, content: '' };
    setSteps(steps.map(step =>
      step.id === stepId
        ? { ...step, subSteps: [...step.subSteps, newSubStep] }
        : step
    ));
  };

  // Supprimer une sous-étape
  const deleteSubStep = (stepId, subStepId) => {
    setSteps(steps.map(step =>
      step.id === stepId
        ? { ...step, subSteps: step.subSteps.filter(subStep => subStep.id !== subStepId) }
        : step
    ));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newSteps = Array.from(steps);
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedItem);
    setSteps(newSteps);
  };

  const toggleLock = (id) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, isLocked: !step.isLocked } : step
    ));
  };

  const deleteStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const addStep = () => {
    const newStep = { id: `step${steps.length + 1}`, isLocked: false, subSteps: [] };
    setSteps([...steps, newStep]);
  };


  const SaveObjective = () => {
    // Logique pour sauvegarder l'objectif
  };

  const ButtonWithWave = ({ onClick, disabled, className, children }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <span className="absolute inset-0 bg-white opacity-30 rounded-3xl transform scale-x-0 transition-all duration-700 ease-in-out origin-center hover:scale-x-100"></span>
    </motion.button>
  );




  const Btn = ({onclick, title, classnames, children}) => {
    return (
      <ButtonWithWave
      onClick={onclick}
      disabled={title.length < 2}

      className={`flex items-center py-3 px-6 text-gray-700 rounded-3xl border border-gray-200 text-lg shadow-lg  transition-all duration-100 ease-in-out ${classnames} ${
        title.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      >
        {children}
      </ButtonWithWave>
    ); 
  }

 




  return (
    <div className="max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Planificateur d'Objectifs</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Champs principaux */}
      <div className="space-y-4 mb-8">
        <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Mon objectif"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea        
        value={description}
        onChange={(e) => setDescription(e.target.value)}
          placeholder="Je précise..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
        />
      </div>



      <div className="flex gap-2 mt-6">

      {isFetching && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      )}

{!isGenerate && (
  
  <Btn onclick={generateSteps} title={title} >
    <Wand2 className="h-4 w-4 mr-2" />
    Générer les étapes
  </Btn>

)}


{(!isFetching && isGenerate) && (
          <Btn onclick={refreshUnlockedSteps} title={title} >
          <RotateCw className="h-4 w-4 mr-2" />  
           Actualiser les étapes
        </Btn>

)}


</div>



      {/* Liste des étapes */}
      {steps.length > 0 && (
        <StepList
          steps={steps}
          onDragEnd={onDragEnd}
          handleStepChange={handleStepChange}
          handleSubStepChange={handleSubStepChange}
          toggleLock={toggleLock}
          deleteStep={deleteStep}
          addSubStep={addSubStep}
          deleteSubStep={deleteSubStep}
          generateSubStep={generateSubStep} 
        />
      )}


      

      {/* Boutons d'action principaux */}
      <div className="flex gap-2 mt-6">




        {(!isFetching && isGenerate) && (
          <>

<Btn onclick={addStep} title={title} >
    <Plus size={18} className="mr-2" /> 
    Ajouter une étape
  </Btn>

          
          <Btn onclick={SaveObjective} title={title} classnames={'bg-blue-500 text-white hover:bg-blue-600'} >
            <Save className="h-4 w-4 mr-2" />  
             Sauvegarder
          </Btn>
        </>
        )}
      

      </div>

    </div>
  );
};

export default ObjectivePlanner;