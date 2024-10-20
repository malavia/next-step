import { useState, useEffect, useRef } from 'react';

function StreamProcessor({ title, onStepsGenerated, isGenerating }) {
  const [currentStep, setCurrentStep] = useState('');
  const [localSteps, setLocalSteps] = useState([]);
  const stepsRef = useRef([]);
  const isDoneRef = useRef(false);

  const finalizeSteps = () => {
    // Éviter les appels multiples
    if (isDoneRef.current) return;
    isDoneRef.current = true;

    const finalSteps = [...stepsRef.current];
    if (currentStep.trim()) {
      finalSteps.push(currentStep.trim());
    }
    console.log('Étapes finales:', finalSteps);
    onStepsGenerated(finalSteps);
  };

  const processStreamData = (data) => {
    try {
      const jsonString = data.replace(/^data: /, '');
      
      if (jsonString.trim() === '[DONE]') {
        finalizeSteps();
        return;
      }

      const jsonData = JSON.parse(jsonString);
      const content = jsonData.choices[0].delta?.content || '';

      setCurrentStep(prev => {
        const newStep = prev + content;

        if (content.includes('°') ) {
         // if (content.includes('.') || content.includes('\n')) {
          if (newStep.trim()) {
            const updatedSteps = [...stepsRef.current, newStep.trim()];
            stepsRef.current = updatedSteps;
            setLocalSteps(updatedSteps);
            console.log('Nouvelle étape ajoutée:', newStep.trim());
            console.log('Étapes actuelles:', updatedSteps);
          }
          console.log('Nouvelle étape:', newStep.trim());
          const parts = newStep.split(/[\°]/);
          //const parts = newStep.split(/[.\n]/);
          //const parts = newStep.split(/[\[]/);
          return parts[parts.length - 1] || '';
        }

        return newStep;
      });
    } catch (error) {
      console.error('Erreur lors du traitement des données:', error);
    }
  };

  useEffect(() => {
    if (!isGenerating) return;

    // Réinitialiser les états au début
    setCurrentStep('');
    setLocalSteps([]);
    stepsRef.current = [];
    isDoneRef.current = false;

    const fetchStream = async () => {
      const API_URL = 'http://127.0.0.1:1234/v1/chat/completions';
      
      const requestData = {
        model: "lmstudio-community/dolphin-2.8-mistral-7b-v02-GGUF/dolphin-2.8-mistral-7b-v02-Q4_0.gguf",
        messages: [
          { 
            role: "system", 
            content: "Respond like a coach assistant. Provide the answer directly without any introductory text." 
          },
          { 
            role: "user", 
            content: `retourne moi une liste d'etapes  pour ${title}. Chaque étape que tu as imaginé commence par le caractère °` 
          }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: true
      };

      try {
        console.log('Démarrage de la requête streaming...');
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
              processStreamData(line);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la lecture du stream:', error);
        // Finaliser même en cas d'erreur pour éviter de bloquer l'UI
        finalizeSteps();
      }
    };

    fetchStream();

    // Cleanup function
    return () => {
      if (!isDoneRef.current) {
        finalizeSteps();
      }
    };
  }, [title, isGenerating]);

  // Effet pour le débogage
  useEffect(() => {
    //console.log('State localSteps mis à jour:', localSteps);
    //console.log('Ref stepsRef actuelle:', stepsRef.current);
  }, [localSteps]);

  return null;
}

export default StreamProcessor;