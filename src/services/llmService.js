/*osef*/
export async function callLLM(message, temperature, onUpdate) {
  const API_URL = 'http://127.0.0.1:1234/v1/chat/completions';
  const headers = { 'Content-Type': 'application/json' };
  //const contentAssistant = "You are a coach assistant. Always respond in french directly to the user's request without introductory phrases. Ensure that all your sentences are grammatically correct, well-constructed, and natural-sounding. Avoid informal or colloquial expressions unless specifically requested. Provide the anwser directly without any introductory text. Do not reference or restate any instructions, only respond to the content of the user's request. Ensure that questions are properly formatted with correct word order. Always ensure clarity and correctness in all responses. Ne réecrit pas ma question dans ta réponse";
const contentAssistant = "Respond like a coach assistant. Provide the anwser directly without any introductory text.";
  const data = {
    model: "lmstudio-community/dolphin-2.8-mistral-7b-v02-GGUF/dolphin-2.8-mistral-7b-v02-Q4_0.gguf",
    messages: [
      { role: "system", content: contentAssistant },
      { role: "user", content: message }
    ],
    temperature: temperature,
    max_tokens: -1,
    stream: true
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });
      buffer += decodedChunk;

      const lines = buffer.split('\n');
      buffer = lines.pop(); // Conserve les morceaux non traités

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonData = line.slice(6).trim(); // Enlever les espaces

          // Vérification de l'intégrité des données
          if (jsonData === '[DONE]') break;

          // Vérification si jsonData commence par '{' ou '[' pour déterminer si c'est un JSON valide
          if (jsonData.startsWith('{') || jsonData.startsWith('[')) {
            try {
              const parsedData = JSON.parse(jsonData);
              if (parsedData.choices && parsedData.choices[0].delta) {
                const content = parsedData.choices[0].delta.content || '';
                onUpdate(content); // Callback pour mettre à jour la réponse
              }
            } catch (e) {
              console.error('Erreur lors de la réception de la réponse JSON :', e);
              console.log('Données non valides reçues :', jsonData); // Journaliser les données non valides
            }
          } else {
            console.log('Données non JSON reçues :', jsonData); // Log des données non JSON
          }
        }
      }
    }
  } catch (e) {
    console.error('Erreur lors de la récupération des données :', e);
  }
}


export const GenerateTextViaIA = ({
  setIsFetching, 
  PrommptSupplementaire, 
  maxCharacters = 100, 
  temperature = 0.7, 
  handlePartialResponse
}) => {
  console.log("Appel à l'IA avec le prompt :", PrommptSupplementaire);

  // Activer l'état "isFetching" pour indiquer qu'une requête est en cours
  setIsFetching(true);

   const message = `: ${PrommptSupplementaire}.   
JE VEUX QUE TU ME RENVOIES CE UNIQUE TABLEAU JAVASCRIPT 
NE FOURNIS PAS D'AUTRE TEXTE, PAS DE PRESENTATIONPAS DE NUMÉROTATION, PAS DE COMMENTAIRES, PAS D'INTRODUCTION. 
ENVOIE LE TABLEAU DIRECTEMENT, SANS PRÉAMBULE NI EXPLICATION.`;



   console.log("Message envoyé à l'IA :", message);
  callLLM(message, temperature, (partialResponse) => {

    // Transmettre la réponse partielle à la fonction de traitement
    handlePartialResponse(partialResponse);

  })
  .catch((error) => {
    console.error('Erreur lors de l\'appel à l\'IA :', error);
    //setError('Erreur lors de l\'appel à l\'IA.');
  })
  .finally(() => {
    setIsFetching(false);
    console.log("La requête est terminée.");
  });
};