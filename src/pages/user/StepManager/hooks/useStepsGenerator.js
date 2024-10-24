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
 *   => streamLLMResponse (index.js)
 */

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

// Traite une ligne individuelle
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

// Traite un ensemble de lignes
const processLines = (lines, bufferRef, updateSteps) => {
  lines.forEach(line => {
    if (line.trim()) {
      updateSteps(line);
    }
  });
};

// Main hook
export const useStepsGenerator = ({ setSteps, title }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const currentStepRef = useRef(null);
  const bufferRef = useRef('');
  const handlerRef = useRef(null);

  // Gestion du buffer
  const processFinalBuffer = useCallback(() => {
    if (bufferRef.current.trim()) {
      processLine(bufferRef.current, currentStepRef, setSteps);
      bufferRef.current = '';
    }
  }, [setSteps]);

  // Update steps handler
  const updateSteps = useCallback((line) => {
    processLine(line, currentStepRef, setSteps);
  }, [setSteps]);

  // Traitement des chunks
  const handleChunk = useCallback((content) => {
    const fullContent = bufferRef.current + content;
    const lines = fullContent.split('\n');
    
    if (!content.endsWith('\n') && lines[lines.length - 1]) {
      bufferRef.current = lines.pop() || '';
    } else {
      bufferRef.current = '';
      if (lines[lines.length - 1]?.trim()) {
        lines.push(lines[lines.length - 1]);
      }
    }

    processLines(lines, bufferRef, updateSteps);
  }, [updateSteps]);

  const stopGeneration = useCallback(async () => {
    console.log('Stopping generation...');
    if (handlerRef.current) {
      try {
        await handlerRef.current.abort();
        processFinalBuffer();
        console.log('Generation successfully stopped');
      } catch (error) {
        console.error('Error while stopping the generation:', error);
        handlerRef.current?.onError?.(error);
      } finally {
        handlerRef.current = null;
        setIsGenerating(false);
      }
    }
  }, [processFinalBuffer]);

  const startGeneration = useCallback(async () => {
    const initializeGeneration = () => {
      setIsGenerating(true);
      setSteps([]);
      currentStepRef.current = null;
      bufferRef.current = '';
    };

    initializeGeneration();

    handlerRef.current = await streamLLMResponse(
      title,
      handleChunk,
      (error) => {
        console.error(error);
        stopGeneration();
      },
      () => {
        processFinalBuffer();
        handlerRef.current = null;
        setIsGenerating(false);
      }
    );
  }, [handleChunk, stopGeneration, processFinalBuffer, title, setSteps]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (handlerRef.current) {
        processFinalBuffer();
        handlerRef.current.abort();
      }
    };
  }, [processFinalBuffer]);

  return {
    isGenerating,
    startGeneration,
    stopGeneration
  };
};