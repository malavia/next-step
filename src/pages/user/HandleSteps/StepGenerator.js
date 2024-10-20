import React, { useRef, useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { GenerateTextViaIA } from '../../../services/llmService';
import Btn from './Btn';

const StepGenerator = ({ title, steps, setSteps, setIsFetching, setError, onGenerateComplete }) => {
  const stepCounter = useRef(0);
  const [partialResponse, setPartialResponse] = useState('');
  const [stepSet, setStepSet] = useState(new Set());
  const [isCollecting, setIsCollecting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [noStepsCollected, setNoStepsCollected] = useState(false);
  const timeoutRef = useRef(null);

  const generateUniqueId = () => {
    stepCounter.current += 1;
    return `step-${Date.now()}-${stepCounter.current}`;
  };

  const handlePartialResponse = (newPartialResponse) => {
    console.log('Nouveau fragment reçu:', newPartialResponse);
    
    setPartialResponse((prev) => {
      let updatedResponse = prev;
      
      if (!isCollecting) {
        // Si on n'a pas encore commencé à collecter, on cherche '['
        const startIndex = newPartialResponse.indexOf('[');
        if (startIndex !== -1) {
          console.log('Début du tableau JSON détecté');
          setIsCollecting(true);
          // On commence la collection à partir du '['
          updatedResponse = newPartialResponse.slice(startIndex);
          console.log('Début de la collection:', updatedResponse);
        } else {
          console.log('En attente du début du tableau JSON...');
          return prev;
        }
      } else {
        // Si on collecte déjà, on ajoute simplement le nouveau fragment
        updatedResponse = prev + newPartialResponse;
        console.log('Ajout au tableau en cours:', updatedResponse);
      }

      // Vérifier si nous avons une réponse complète
      if (updatedResponse.includes(']')) {
        console.log('Fin du tableau détectée, tentative de parsing...');
        try {
          const endIndex = updatedResponse.indexOf(']') + 1;
          const jsonStr = updatedResponse.slice(0, endIndex);
          console.log('JSON string extrait:', jsonStr);
          
          const parsedSteps = JSON.parse(jsonStr);
          console.log('Étapes parsées:', parsedSteps);

          // Valider la structure du tableau
          if (!Array.isArray(parsedSteps)) {
            console.error("La réponse n'est pas un tableau valide");
            setError("Erreur : la réponse n'est pas un tableau valide.");
            return updatedResponse;
          }

          // Valider le contenu du tableau
          if (!parsedSteps.every(step => typeof step === 'string')) {
            console.error("Format des étapes invalide");
            setError("Erreur : certaines étapes ne sont pas au format texte.");
            return updatedResponse;
          }

          if (parsedSteps.length === 0) {
            console.log("Aucune étape collectée");
            setNoStepsCollected(true);
            return updatedResponse;
          }

          // Créer les nouvelles étapes
          const newSteps = parsedSteps.map(stepContent => ({
            id: generateUniqueId(),
            content: stepContent,
            isLocked: false,
            subSteps: []
          }));

          console.log('Nouvelles étapes créées:', newSteps);

          // Mettre à jour l'ensemble des étapes
          const newStepSet = new Set(parsedSteps);
          setStepSet(newStepSet);

          // Réinitialiser le message d'erreur des étapes vides
          setNoStepsCollected(false);

          // Appeler le gestionnaire de complétion
          onGenerateComplete(newSteps);
        } catch (error) {
          console.error('Erreur lors du parsing:', error);
          setError(`Erreur lors du traitement de la réponse: ${error.message}`);
        }
      }

      return updatedResponse;
    });
  };

  const generateSteps = async () => {
    console.log('Démarrage de la génération des étapes...');
    
    // Réinitialiser tous les états
    setSteps([]);
    setPartialResponse('');
    setStepSet(new Set());
    setIsCollecting(false);
    setError(null);
    setIsGenerating(true);
    setNoStepsCollected(false);

    timeoutRef.current = setTimeout(() => {
      if (!stepSet.size) {
        console.log('Timeout: Aucune étape générée après 30 secondes');
        setNoStepsCollected(true);
        setIsGenerating(false);
      }
    }, 30000);

    const promptSupplementaire = `Créer un tableau javascript. imagine et identifie les étapes nécessaires pour atteindre l'objectif "${title}" et place chaque étape dans le tableau ci-dessus.`;

    try {
      await GenerateTextViaIA({
        setIsFetching,
        PrommptSupplementaire: promptSupplementaire,
        handlePartialResponse,
      });
    } catch (error) {
      console.error('Erreur de génération:', error);
      setError(`Erreur lors de la génération des étapes: ${error.message}`);
    } finally {
      clearTimeout(timeoutRef.current);
      setIsGenerating(false);
      console.log('Génération terminée');
    }
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mt-6">
        {!steps.length && (
          <Btn 
            onclick={generateSteps} 
            title={title}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Génération en cours...' : 'Générer les étapes'}
          </Btn>
        )}
      </div>
      
      {isGenerating && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Génération des étapes en cours...</span>
        </div>
      )}

      {noStepsCollected && !isGenerating && !steps.length && (
        <div className="text-amber-600">
          Aucune étape n'a été générée. Veuillez réessayer.
        </div>
      )}
    </div>
  );
};

export default StepGenerator;