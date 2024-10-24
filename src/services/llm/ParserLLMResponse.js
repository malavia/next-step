/*
* est appelé par streamLLMResponse (index.js)
* les chunks retournés sont envoyé à useStepsGenerator (handleChunk)
*/
export class ParserLLMResponse {

   /*
   * @param {function(string)} onChunk - Fonction de rappel pour chaque chunk de la réponse.
   * @param {function(Error)} onError - Fonction de rappel si une erreur survient.
   * @param {function()} onComplete - Fonction de rappel lorsque la réponse est terminée.
   */
  constructor(onChunk, onError, onComplete) {
    this.buffer = '';
    this.onChunk = onChunk;
    this.onError = onError;
    this.onComplete = onComplete;
    this.abortController = null;
    this.reader = null;
    this.isAborted = false;
  }

  /**
   * lit un flux de reponse LLM, le traite et retourne les chunks (0 à 5 caractères max) à la fonction de rappel (onChunk).
   * 
   * @param {Response} response - La réponse LLM
   *
   * @returns {Promise<void>} - Une promesse qui est résolue lorsque le flux est terminé.
   */
  async parseLLM(response) {
    try {
      this.reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (!this.isAborted) {
        const { done, value } = await this.reader.read();

        if (done) {
          if (this.onComplete) {
            this.onComplete();
          }
          break;
        }        
        
        if (this.isAborted) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (this.isAborted) break; 
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(5));
              const content = jsonData.choices?.[0]?.delta?.content || '';
              if (content) {
                this.onChunk(content);
              }
            } catch (error) {
              if (!line.includes('[DONE]')) {
                this.onError(error);
              }
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        this.onError?.(error);
      }
    } finally {
      // Nettoyage
      if (this.reader) {
        try {
          await this.reader.cancel();
        } catch (error) {
          console.error('Error cancelling reader:', error);
        }
      }
    }
  }

  
  /**
   * Abort the stream and cancel any ongoing read operation.
   * If the stream has not started yet, this will prevent it from starting.
   * If the stream has started, this will attempt to cancel the ongoing read operation
   * and prevent any further chunks from being processed.
   * The `abort` method returns a promise that resolves when the stream has been aborted.
   * @returns {Promise<void>}
   */
  async abort() {
    console.log('Aborting stream...');
    this.isAborted = true;
    
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (error) {
        console.error('Error cancelling reader:', error);
      }
    }

    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch (error) {
        console.error('Error aborting controller:', error);
      }
    }
  }
}