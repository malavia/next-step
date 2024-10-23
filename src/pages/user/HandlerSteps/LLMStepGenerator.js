import { useState, useEffect, useRef } from 'react';

// Fonction externe pour gérer le contenu du rôle utilisateur et traiter les données du flux
function processUserContent(content, currentStep, stepsRef, setLocalSteps) {
  let newStep = currentStep + content;

  if (content.includes('\n')) {
    if (newStep.trim()) {
      console.log('Nouvelle étape avec sous-étapes ajoutée:', newStep.trim());
      const updatedSteps = [...stepsRef.current, newStep.trim()];
      stepsRef.current = updatedSteps;
      setLocalSteps(updatedSteps);
    }
    const parts = newStep.split(/\n+/);
    return parts[parts.length - 1] || '';
  }

  return newStep;
}

// Fonction externe pour gérer les messages envoyés au LLM
function getLLMMessages(title) {
  return [
    { 
      role: "system", 
      content: "Respond like a coach assistant. Provide the answer directly without any introductory text." 
    },
    {
      role: "user", 
      content: `Génère une liste d'étapes pour atteindre l'objectif suivant : "${title}". Chaque étape doit avoir 2 à 3 sous-étapes. Assure-toi que les étapes et les sous-étapes sont rédigées de manière réutilisable pour d'autres objectifs. Chaque étape et sous-étape doit être séparée par un saut de ligne. Les sous étapes doivent commencer par le texte "Sous-étape 1 :"` 
    }
  ];
}

export function LLMStepGenerator({ title, onStepsGenerated, isGenerating, parentStepId = null }) {
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
    console.log('Finalisation des étapes:', finalSteps);
    onStepsGenerated(finalSteps, parentStepId);
  };

  const processStreamData = (data) => {
    try {
      const jsonString = data.replace(/^data: /, '');

      if (jsonString.trim() === '[DONE]') {
        console.log('Données de flux complètes. Finalisation...');
        finalizeSteps();
        return;
      }

      const jsonData = JSON.parse(jsonString);
      const content = jsonData.choices?.[0]?.delta?.content || '';
      console.log('Contenu du message:', content);

      setCurrentStep((prev) => processUserContent(content, prev, stepsRef, setLocalSteps));
    } catch (error) {
      console.error('Erreur lors du traitement des données de flux:', error);
    }
  };

  useEffect(() => {
    console.log('isGenerating:', isGenerating);
    if (!isGenerating) return;

    console.log('Réinitialisation des étapes et démarrage d’une nouvelle génération');
    setCurrentStep('');
    setLocalSteps([]);
    stepsRef.current = [];
    isDoneRef.current = false;
    abortControllerRef.current  = new AbortController();

    const fetchStream = async () => {
      console.log('Début de la requête...');
      try {
        const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "lmstudio-community/dolphin-2.8-mistral-7b-v02-GGUF/dolphin-2.8-mistral-7b-v02-Q4_0.gguf",
            messages: getLLMMessages(title),
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
              console.log('Ligne de flux:', line);
              processStreamData(line);
            }
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Requête annulée');
        } else {
          console.error('Erreur lors de la lecture du flux:', error);
        }
        finalizeSteps();
      }
    };

    fetchStream();

    return () => {
      console.log('Cleanup: annulation de la requête et finalisation des étapes');
      abortControllerRef.current?.abort();
      if (!isDoneRef.current) {
        finalizeSteps();
      }
    };
  }, [title, isGenerating, onStepsGenerated, parentStepId]);

  return null;
}

export default LLMStepGenerator;
