import { LLM_CONFIG } from './config';
import { buildMessages } from './messageBuilder';
import { ParserLLMResponse } from './ParserLLMResponse';

/**
 * appelé par le hook useStepsGenerator
 * Demande une réponse LLM via un flux et appelle les fonctions de rappel en conséquence.
 * Le dossier ne fait rien d'autres que retourner les chunks à la fonction de rappel.
 * appel ParserLLMResponse qui va traiter les chunks
 *
 * @param {string} title - Le titre de la requête
 * @param {function(string)} onChunk - Fonction de rappel pour chaque chunk de la réponse. Le chunk est un string qui contient la réponse partielle.
 * @param {function(Error)} onError - Fonction de rappel si une erreur survient. L'erreur est un objet Error.
 * @param {function()} onComplete - Fonction de rappel lorsque la répons  est terminée.
 *
 * @returns {Promise<StreamHandler>} - Une promesse qui résout en un StreamHandler qui permet d'annuler la requête.
 */
export const streamLLMResponse = async (title, onChunk, onError, onComplete) => {
  const abortController = new AbortController();
  console.log("Début du streaming...");

  try {
    const response = await fetch(LLM_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...LLM_CONFIG,
        messages: buildMessages(title),
        stream: true
      }),
      signal: abortController.signal
    });
    console.log("Réponse reçue du serveur");

    const handler = new ParserLLMResponse(onChunk, onError, onComplete);
    handler.abortController = abortController;

    // Débogage dans `parseLLM`
    handler.parseLLM(response);

    return handler;
  } catch (error) {
    console.error("Erreur dans streamLLMResponse :", error);
    onError?.(error);
    return null;
  }
};
