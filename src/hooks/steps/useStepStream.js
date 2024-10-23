import { useState, useRef, useCallback, useEffect } from 'react';
import { streamLLMResponse } from '../../services/llm';
import { isSubStep, clearStepContent, clearSubStepContent } from '../../utils/clearData';

const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

/**
 * Custom hook that manages the generation of steps using a stream response. (real-time)
 * It handles updating steps, chunking data, and starting the generation process.
 * 
 * * hook qui personnalisé qui gère la génération d'étapes à l'aide d'une réponse de flux. (temps réel) 
 * * Il gère la mise à jour des étapes, le chunking des données et le démarrage du processus de génération.
 */

export const useStepStream = ({ setSteps, title}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const currentStepRef = useRef(null);
  const bufferRef = useRef('');
  const handlerRef = useRef(null);

  const updateSteps = useCallback((line) => {
    const trimmedLine = line.trim();

    if (isSubStep(trimmedLine)) {
      if (currentStepRef.current) {
        const subStep = {
          id: generateUniqueId(),
          content: clearSubStepContent(trimmedLine)
        };
        setSteps(prev => {
          const newSteps = [...prev];
          const lastStep = newSteps[newSteps.length - 1];
          lastStep.subSteps.push(subStep);
          return newSteps;
        });
      }
    } else if (trimmedLine) {
      const newStep = {
        id: generateUniqueId(),
        content: clearStepContent(trimmedLine),
        isLocked: false,
        subSteps: []
      };
      currentStepRef.current = newStep;
      setSteps(prev => [...prev, newStep]);
    }
  }, []);

  const handleChunk = useCallback((content) => {
    console.log('handleChunk', content);
    const fullContent = bufferRef.current + content;
    const lines = fullContent.split('\n');
    
    bufferRef.current = lines.pop() || '';

    lines.forEach(line => {
      if (line.trim()) {
        updateSteps(line);
      }
    });
  }, [updateSteps]);

  const stopGeneration = useCallback(async () => {
    console.log('Stopping generation...');
    if (handlerRef.current) {
      try {
        await handlerRef.current.abort();
        console.log('Generation successfully stopped');
      } catch (error) {
        console.error('Error while stopping the generation:', error);
        handlerRef.current?.onError?.(error);
      } finally {
        handlerRef.current = null;
        setIsGenerating(false);
      }
    }
  }, []);


  const startGeneration = useCallback(async () => {
    setIsGenerating(true);
    setSteps([]);
    currentStepRef.current = null;
    bufferRef.current = '';

    handlerRef.current = await streamLLMResponse(
      title,
      handleChunk,
      (error) => {
        console.error(error);
        stopGeneration();
      },
      () => {
        handlerRef.current = null;
        setIsGenerating(false);
      }
    );
  }, [handleChunk, stopGeneration]);


  useEffect(() => {
    return () => {
      if (handlerRef.current) {
        handlerRef.current.abort();
      }
    };
  }, []);

  return {
    isGenerating,
    startGeneration,
    stopGeneration
  };
};