import { LLM_CONFIG } from './config';
import { buildMessages } from './messageBuilder';
import { StreamHandler } from './streamHandler';

export const streamLLMResponse = async (title, onChunk, onError, onComplete) => {
  
  const abortController = new AbortController();
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

    const handler = new StreamHandler(onChunk, onError, onComplete);
    handler.abortController = abortController;
    
    // Démarrer le traitement du stream dans une promesse séparée
    const processPromise = handler.processStream(response);
    
    // Retourner le handler immédiatement
    return handler;
  } catch (error) {
    onError?.(error);
    return null;
  }
};