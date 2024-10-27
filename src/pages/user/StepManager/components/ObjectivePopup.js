import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import Step2Metrics from './Metrics';

const ObjectivePopup = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTitle = '', 
  initialDescription = '' 
}) => {

  // État local pour les champs du formulaire
  const [formData, setFormData] = useState({
    title: initialTitle,
    //category: '',
    description: initialDescription,
    metrics: {
      initialValue: 0,
      targetValue: 0,
      unit: ''
    },
    term: '',
    deadline: ''
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      title: initialTitle,
      description: initialDescription,
      metrics: {
        initialValue: prev.metrics?.initialValue || 0,
        targetValue: prev.metrics?.targetValue || 0,
        unit: prev.metrics?.unit || ''
      }
    }));
  }, [initialTitle, initialDescription]);
  

  // Gestion des modifications des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestion de la sauvegarde
  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-slate-800 dark:text-white">
        <DialogHeader>
          <DialogTitle>
            Mon Objectif
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titre </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titre de l'objectif"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deécrivez votre objectif en détail..."
              className="mt-1"
              rows={4}
            />
          </div>

          <Step2Metrics
            formData={formData}
            setFormData={setFormData}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Sauvegarder
            </Button>
          </div>


        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectivePopup;