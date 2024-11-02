/**
 * C'est THE fichier qui traite les données d'une requête LLM.
 * 
 * * hook  qui gère la génération d'étapes à l'aide d'une réponse de flux. (temps réel) 
 * * Il demande l'appel a LLM via streamLLMResponse (index.js) et récupére les chunks.
 * * Il gère :
 *  - la mise à jour des étapes, (updateSteps)
 *  - le chunking des données, (handleChunk)
 *  - le démarrage et l'arrêt du processus de génération. (stopGeneration, startGeneration) 
 * 
 * useStepsGenerator génère des étapes et Il les communique via un callback à useStepsManagement
 * 
 *   => streamLLMResponse (index.js)
 */


// useStepsGenerator.js
import { useState, useRef, useCallback, useEffect } from 'react';
import { streamLLMResponse } from '../../../../services/llm';
import { processLine, processLines } from './lineProcessing';
import { ERRORS } from './errorConstants';

export const useStepsGenerator = ({ setSteps, objectiveData, onError }) => {
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const currentStepRef = useRef(null);
  const bufferRef = useRef('');
  const handlerRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 1; 
  const RETRY_DELAY = 2000; 

  const handleError = useCallback((error, type = ERRORS.STREAM_ERROR) => {
    console.error('Error in steps generator:', error);
    setError({ type, message: error.message });
    setIsGenerating(false);
    onError?.(error);
  }, [onError]);

  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    if (handlerRef.current) handlerRef.current.abort();
    handlerRef.current = null;
    retryCountRef.current = 0;
    bufferRef.current = '';
    currentStepRef.current = null;
  }, []);

  const processFinalBuffer = useCallback(() => {
    if (bufferRef.current.trim()) {
      processLine(bufferRef.current, currentStepRef, setSteps);
      bufferRef.current = '';
    }
  }, [setSteps]);

  const updateSteps = useCallback((line) => {
    processLine(line, currentStepRef, setSteps);
  }, [setSteps]);

  const handleChunk = useCallback((content) => {
    const fullContent = bufferRef.current + content;
    const lines = fullContent.split('\n');
    //console.log('handleChunk - lines:', lines);
    if (!content.endsWith('\n')) {
      bufferRef.current = lines.pop() || '';
    } else {
      bufferRef.current = '';
    }
  
    processLines(lines, updateSteps);
  }, [updateSteps]);

  const stopGeneration = useCallback(async () => {
    try {
      await cleanup();
      processFinalBuffer();
    } catch (error) {
      handleError(error, ERRORS.ABORT_ERROR);
    } finally {
      setIsGenerating(false);
    }
  }, [cleanup, processFinalBuffer, handleError]);

  const startGeneration = useCallback(async () => {
    const initializeGeneration = () => {
      setIsGenerating(true);
      setError(null);
      setSteps([]);
      currentStepRef.current = null;
      bufferRef.current = '';
      retryCountRef.current = 0;
    };

    const attemptConnection = async () => {
      try {
        handlerRef.current = await streamLLMResponse(
          objectiveData,
          handleChunk,
          (error) => {
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
              if (retryCountRef.current < MAX_RETRIES) {
                retryCountRef.current++;
                retryTimeoutRef.current = setTimeout(attemptConnection, RETRY_DELAY);
                return;
              }
              handleError(error, ERRORS.CONNECTION_FAILED);
            } else {
              handleError(error);
            }
            stopGeneration();
          },
          () => {
            processFinalBuffer();
            cleanup();
            setIsGenerating(false);
          }
        );
      } catch (error) {
        handleError(error);
        cleanup();
      }
    };

    initializeGeneration();
    await attemptConnection();
  }, [handleChunk, stopGeneration, processFinalBuffer, objectiveData, setSteps, cleanup, handleError]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    isGenerating,
    startGeneration,
    stopGeneration,
    error
  };
};
