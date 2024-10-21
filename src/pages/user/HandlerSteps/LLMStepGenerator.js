// StreamProcessor.jsx
import { useState, useEffect, useRef } from 'react';
import { nettoyerTexte } from '../../../utils/clearData';

export function StreamProcessor({ title, onStepsGenerated, isGenerating }) {
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
      const content = jsonData.choices?.[0]?.delta?.content || '';

      setCurrentStep((prev) => {
        let newStep = prev + content;

        if (content.includes('\n')) {
          if (newStep.trim()) {
            console.log('Nouvelle étape ajoutée:', newStep.trim());
            newStep = nettoyerTexte(newStep); // Appliquer nettoyage sans casser le format
            const updatedSteps = [...stepsRef.current, newStep.trim()];
            stepsRef.current = updatedSteps;
            setLocalSteps(updatedSteps);
            console.log('Nouvelle étape ajoutée:', newStep.trim());
          }
          const parts = newStep.split(/\n+/); // Assure une bonne gestion des sauts de ligne
          return parts[parts.length - 1] || ''; // Garde la partie après le dernier saut de ligne
        }

        return newStep;
      });
    } catch (error) {
      console.error('Error processing stream data:', error);
    }
  };

  useEffect(() => {
    if (!isGenerating) return;

    setCurrentStep('');
    setLocalSteps([]);
    stepsRef.current = [];
    isDoneRef.current = false;
    abortControllerRef.current = new AbortController();

    const fetchStream = async () => {
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
                content: `retourne moi une liste d'etapes  pour ${title}. Chaque étape que tu as imaginé fini par un saut de ligne, c'est important car après je vais spliter ces étapes` 
              }
            ],
            temperature: 0.7,
            max_tokens: -1,
            stream: true
          }),
          signal: abortControllerRef.current.signal
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
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error reading stream:', error);
        }
        finalizeSteps();
      }
    };

    fetchStream();

    return () => {
      abortControllerRef.current?.abort();
      if (!isDoneRef.current) {
        finalizeSteps();
      }
    };
  }, [title, isGenerating, onStepsGenerated]);

  return null;
}

export default StreamProcessor;