export class StreamHandler {
  constructor(onChunk, onError, onComplete) {
    this.decoder = new TextDecoder();
    this.buffer = '';
    this.onChunk = onChunk;
    this.onError = onError;
    this.onComplete = onComplete;
  }

  async processStream(response) {
    console.log('Debut de la requête...');
    const reader = response.body.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (this.buffer.trim()) {
            this.processChunk(this.buffer);
          }
          this.onComplete();
          break;
        }

        const chunk = this.decoder.decode(value);
        await this.handleChunk(chunk);
      }
    } catch (error) {
      this.onError(error);
    }
  }

  /**
   * Handles a single chunk of a stream of data.
   * The chunk may contain one or more lines. If the line starts with 'data: ', we attempt to parse the remaining part as JSON.
   * If the parse is successful, and the JSON object has a choices array with a delta object and a content string, we call the onChunk callback with the content.
   * If there is a parse error, or if the line does not start with 'data: ', we ignore the line, unless the line contains the string '[DONE]', in which case we call the onError callback with the error.
   * @param {string} chunk - The current chunk of the stream.
   */
  async handleChunk(chunk) {
    console.log('Chunk:', chunk);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.trim() && line.startsWith('data: ')) {
        try {
          const jsonData = JSON.parse(line.slice(5));
          const content = jsonData.choices?.[0]?.delta?.content || '';
          if (content) {
            this.processChunk(content);
          }
        } catch (error) {
          if (!line.includes('[DONE]')) {
            this.onError(error);
          }
        }
      }
    }
  }

  processChunk(content) {
    this.onChunk(content);
  }
}