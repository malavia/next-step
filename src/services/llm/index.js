import { LLM_CONFIG } from './config';
import { buildMessages } from './messageBuilder';
import { StreamHandler } from './streamHandler';

export const streamLLMResponse = async (title, onChunk, onError, onComplete) => {
  
  try {
    const response = await fetch(LLM_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...LLM_CONFIG,
        messages: buildMessages(title),
        stream: true
      })
    });

    const handler = new StreamHandler(onChunk, onError, onComplete);
    await handler.processStream(response);
  } catch (error) {
    onError(error);
  }
};