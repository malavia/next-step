import { useState, useRef, useCallback, useEffect } from 'react';
import { streamLLMResponse } from '../../../../services/llm';
import { isSubStep, clearStepContent, clearSubStepContent } from '../../../../utils/clearData';


const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

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

const ERRORS = {
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  STREAM_ERROR: 'STREAM_ERROR',
  ABORT_ERROR: 'ABORT_ERROR'
};

const createNewStep = (content) => ({
  id: generateUniqueId(),
  content: clearStepContent(content),
  isLocked: false,
  subSteps: []
});

const createNewSubStep = (content) => ({
  id: generateUniqueId(),
  content: clearSubStepContent(content)
});

const addSubStepToLastStep = (steps, subStep) => {
  const newSteps = [...steps];
  const lastStep = newSteps[newSteps.length - 1];
  lastStep.subSteps.push(subStep);
  return newSteps;
};

const addNewStep = (steps, newStep) => [...steps, newStep];

const processLine = (line, currentStepRef, setSteps) => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return;

  if (isSubStep(trimmedLine) && currentStepRef.current) {
    const subStep = createNewSubStep(trimmedLine);
    setSteps(prev => addSubStepToLastStep(prev, subStep));
  } else {
    const newStep = createNewStep(trimmedLine);
    currentStepRef.current = newStep;
    setSteps(prev => addNewStep(prev, newStep));
  }
};

const processLines = (lines, bufferRef, updateSteps) => {
  lines.forEach(line => {
    if (line.trim()) {
      updateSteps(line);
    }
  });
};

export const useStepsGenerator = ({ setSteps, title, onError }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const currentStepRef = useRef(null);
  const bufferRef = useRef('');
  const handlerRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 1; // nb de tententatives de connection
  const RETRY_DELAY = 2000; // 2 seconds

  const handleError = useCallback((error, type = ERRORS.STREAM_ERROR) => {
    console.error('Error in steps generator:', error);
    setError({ type, message: error.message });
    setIsGenerating(false);
    onError?.(error);
  }, [onError]);

  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (handlerRef.current) {
      handlerRef.current.abort();
    }
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
    console.log('Chunk received:', content);
    const fullContent = bufferRef.current + content;
    const lines = fullContent.split('\n');
    console.log('Buffer:', lines);
    
    //if (!content.endsWith('\n') && lines[lines.length - 1]) {
    if (!content.endsWith('\n')) {
      bufferRef.current = lines.pop() || ''; // Stocker la dernière ligne incomplète
      console.log('Buffering1:', lines);
    } else {
      bufferRef.current = ''; // Réinitialiser le buffer
      if (lines[lines.length - 1]?.trim()) {
        // Assurez-vous de ne pas ajouter une ligne vide à la fin
        lines.push(lines[lines.length - 1]);
      }
    }
  
    console.log('end Buffer:', lines);
    processLines(lines, bufferRef, updateSteps); // Appelez processLines avec le contenu restant
  }, [updateSteps]);

  

  

  const stopGeneration = useCallback(async () => {
    console.log('Stopping generation...');
    try {
      await cleanup();
      processFinalBuffer();
      console.log('Generation successfully stopped');
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
          title,
          handleChunk,
          (error) => {
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
              // Connection failed - attempt retry if under max retries
              if (retryCountRef.current < MAX_RETRIES) {
                retryCountRef.current++;
                console.log(`Retrying connection (${retryCountRef.current}/${MAX_RETRIES})...`);
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
  }, [handleChunk, stopGeneration, processFinalBuffer, title, setSteps, cleanup, handleError]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isGenerating,
    startGeneration,
    stopGeneration,
    error
  };
};