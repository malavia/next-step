export class StreamHandler {
  constructor(onChunk, onError, onComplete) {
    this.buffer = '';
    this.onChunk = onChunk;
    this.onError = onError;
    this.onComplete = onComplete;
    this.abortController = null;
    this.reader = null;
    this.isAborted = false;
  }

  async processStream(response) {
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
        
        // Si aborted, sortir de la boucle
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