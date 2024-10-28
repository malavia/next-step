import React from 'react';
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
  objectiveData, 
  setObjectiveData
}) => {


  // Gestion des modifications des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjectiveData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestion de la sauvegarde
  const handleSave = () => {
    onSave();
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
              value={objectiveData.title}
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
              value={objectiveData.description}
              onChange={handleChange}
              placeholder="Deécrivez votre objectif en détail..."
              className="mt-1"
              rows={4}
            />
          </div>
          <Step2Metrics
            objectiveData={objectiveData}
            setObjectiveData={setObjectiveData}>
          </Step2Metrics>


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
