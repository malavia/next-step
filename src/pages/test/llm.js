import { useState, useEffect } from 'react';

function StreamProcessor() {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState('');

  const processStreamData = (data) => {
    try {
      // Retire le préfixe "data: " et vérifie si c'est le message de fin
      const jsonString = data.replace(/^data: /, '');
      if (jsonString.trim() === '[DONE]') {
        // Si on a un dernier step en cours, on l'ajoute
        if (currentStep.trim()) {
          setSteps(prev => [...prev, currentStep]);
          setCurrentStep('');
        }
        return;
      }

      // Parse le JSON
      const jsonData = JSON.parse(jsonString);

      // Récupère le contenu du message
      const content = jsonData.choices[0].delta?.content || '';

      // Met à jour le step en cours
      setCurrentStep(prev => {
        const newStep = prev + content;
        
        // Si on détecte un marqueur de fin d'étape (point ou retour à la ligne)
        if (content.includes('.') || content.includes('\n')) {
          // Ajoute l'étape complète à la liste
          setSteps(prevSteps => [...prevSteps, newStep.trim()]);
          return '';
        }
        
        return newStep;
      });

    } catch (error) {
      console.error('Erreur lors du traitement des données:', error);
    }
  };

  useEffect(() => {
    const fetchStream = async () => {
        
        const API_URL = 'http://127.0.0.1:1234/v1/chat/completions';
        const headers = { 'Content-Type': 'application/json' };
        //const contentAssistant = "You are a coach assistant. Always respond in french directly to the user's request without introductory phrases. Ensure that all your sentences are grammatically correct, well-constructed, and natural-sounding. Avoid informal or colloquial expressions unless specifically requested. Provide the anwser directly without any introductory text. Do not reference or restate any instructions, only respond to the content of the user's request. Ensure that questions are properly formatted with correct word order. Always ensure clarity and correctness in all responses. Ne réecrit pas ma question dans ta réponse";
      const contentAssistant = "Respond like a coach assistant. Provide the anwser directly without any introductory text.";
        const data = {
          model: "lmstudio-community/dolphin-2.8-mistral-7b-v02-GGUF/dolphin-2.8-mistral-7b-v02-Q4_0.gguf",
          messages: [
            { role: "system", content: contentAssistant },
            { role: "user", content: "retourne moi une liste d'etapes" }
          ],
          temperature: 0.7,
          max_tokens: -1,
          stream: true
        };
      
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
          });
          const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Décode les données en UTF-8
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Traite chaque ligne du buffer
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
      }
    };

    fetchStream();
  }, []);

  return (
    <div className="steps-container">
      <ol className="steps-list">
        {steps.map((step, index) => (
          <li key={index} className="step-item">
            {step}
          </li>
        ))}
        {currentStep && (
          <li className="step-item current">
            {currentStep}
          </li>
        )}
      </ol>
    </div>
  );
}

export default StreamProcessor;