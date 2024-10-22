import { useState, useEffect, useRef } from 'react';
import { nettoyerTexte } from '../../../utils/clearData';

export function LLMStepGenerator({ title, onStepsGenerated, isGenerating, isSubStep = false, parentStepId = null, parentStepContent = null }) {
  const [currentStep, setCurrentStep] = useState('');
  const [localSteps, setLocalSteps] = useState([]);
  const stepsRef = useRef([]);
  const isDoneRef = useRef(false);
  const abortControllerRef = useRef(null);

  const finalizeSteps = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;

    const finalSteps = [...stepsRef.current];
    if (currentStep.trim()) {
      finalSteps.push(currentStep.trim());
    }
    console.log('Finalisation des étapes:', finalSteps); // Debug: Afficher les étapes finales
    onStepsGenerated(finalSteps, parentStepId);  // Passer parentStepId pour les sous-étapes
  };

  const processStreamData = (data) => {
    try {
      const jsonString = data.replace(/^data: /, '');
      //console.log('Données de flux reçues:', jsonString); // Debug: Afficher les données reçues

      if (jsonString.trim() === '[DONE]') {
        console.log('Données de flux complètes. Finalisation...'); // Debug: Indiquer la fin du flux
        finalizeSteps();
        return;
      }

      const jsonData = JSON.parse(jsonString);
      const content = jsonData.choices?.[0]?.delta?.content || '';
      console.log('Contenu du message:', content); // Debug: Afficher le contenu du message
      setCurrentStep((prev) => {
        let newStep = prev + content;

        if (content.includes('\n')) {
          if (newStep.trim()) {
            console.log(isSubStep ? 'Nouvelle sous-étape ajoutée:' : 'Nouvelle étape ajoutée:', newStep.trim());
            newStep = nettoyerTexte(newStep);
            const updatedSteps = [...stepsRef.current, newStep.trim()];
            stepsRef.current = updatedSteps;
            setLocalSteps(updatedSteps);
          }
          const parts = newStep.split(/\n+/);
          return parts[parts.length - 1] || '';
        }

        return newStep;
      });
    } catch (error) {
      console.error('Erreur lors du traitement des données de flux:', error); // Debug: Afficher les erreurs
    }
  };

  useEffect(() => {
    console.log('isGenerating:', isGenerating); // Debug: Surveiller quand la génération commence
    if (!isGenerating) return;

    console.log('Réinitialisation des étapes et démarrage d’une nouvelle génération'); // Debug: Indiquer une nouvelle génération
    setCurrentStep('');
    setLocalSteps([]);
    stepsRef.current = [];
    isDoneRef.current = false;
    abortControllerRef.current = new AbortController();

    const fetchStream = async () => {
      console.log('Début de la requête...'); // Debug: Indiquer le début de la requête
      try {
        const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "lmstudio-community/dolphin-2.8-mistral-7b-v02-GGUF/dolphin-2.8-mistral-7b-v02-Q4_0.gguf",
            messages: [
              { 
                role: "system", 
                content: "Respond like a coach assistant. Provide the answer directly without any introductory text." 
              },
              {
                role: "user", 
                content: isSubStep 
                  ? `Génère une liste de sous-étapes pour l'étape suivante : "${parentStepContent}" pour l'objectif "${title}". Chaque étape que tu as imaginé finit par un saut de ligne, c'est important car après je vais splitter ces étapes. ne réécrit pas le contenu de l'étape parente dans la nouvelle liste de sous-étapes.`
                  : `Retourne-moi une liste d'étapes pour ${title}. Chaque étape que tu as imaginé finit par un saut de ligne, c'est important car après je vais splitter ces étapes.`
              }
            ],
            temperature: 0.7,
            max_tokens: -1,
            stream: true
          }),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            if (buffer.trim()) {
              processStreamData(buffer);
            }
            processStreamData('data: [DONE]');
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() && line.startsWith('data: ')) {
              console.log('Ligne de flux:', line); // Debug: Afficher chaque ligne du flux
              processStreamData(line);
            }
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Requête annulée'); // Debug: Indiquer que la requête a été annulée
        } else {
          console.error('Erreur lors de la lecture du flux:', error); // Debug: Afficher toute autre erreur
        }
        finalizeSteps();
      }
    };

    fetchStream();

    return () => {
      console.log('Cleanup: annulation de la requête et finalisation des étapes'); // Debug: Surveiller le nettoyage
      abortControllerRef.current?.abort();
      if (!isDoneRef.current) {
        finalizeSteps();
      }
    };
  }, [title, isGenerating, onStepsGenerated, parentStepId]);

  return null;
}

export default LLMStepGenerator;
