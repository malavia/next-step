/*
[-*] : Cela correspond à un tiret (-) ou à un astérisque (*) au début de la chaîne.
Sous-étape : Correspond exactement au mot "Sous-étape".
\d+ : Correspond à un ou plusieurs chiffres, ce qui représente le numéro de la sous-étape.
? : Correspond à zéro ou un espace (facultatif) avant le deux-points.
:\s* : Correspond à un deux-points suivi de zéro ou plusieurs espaces.
*/

// Regex pour identifier les étapes et les sous-étapes
const theRegexForStep = /^[-*]? ?Étape \d+ ?:?\s*/;
const theRegexForSubStep = /^[-*]?\s*(Sous-étape \d+(\.\d+)?(?:\s*:)?)/;

// Regex pour extraire les attributs d'une étape
const priorityRegex = /^Priorité\s*:\s*(Low|Medium|High)/i;
const typeRegex = /^Type\s*:\s*(Sequential|Parallel)/i;
const deadlineRegex = /^Deadline\s*:\s*(.*)/i;


// Fonction pour vérifier si une étape est une sous-étape
export const isSubStep = (step) => {
  return step.match(theRegexForSubStep);
  //return step.startsWith('-') || step.startsWith('*') || step.match(theRegexForSubStep);
};

// Fonction pour nettoyer le contenu d'une étape 
export const clearStepContent = (step) => {
  return step.replace(theRegexForStep, '').trim();
};

// Fonction pour nettoyer le contenu d'une sous-étape 
export const clearSubStepContent = (step) => {
  return step.replace(theRegexForSubStep, '').trim();
};

// Fonction pour extraire les attributs d'une étape
export const extractStepAttributes = (line, currentStep) => {
  const priorityMatch = line.match(priorityRegex);
  const typeMatch = line.match(typeRegex);
  const deadlineMatch = line.match(deadlineRegex);

  if (priorityMatch) currentStep.priority = priorityMatch[1].toLowerCase();
  if (typeMatch) currentStep.type = typeMatch[1].toLowerCase();
  if (deadlineMatch) currentStep.deadline = deadlineMatch[1];
};

/*
const a = "- Sous-étape 1 : Répertorier"; 
const b = "* Sous-étape 2 : Répertorier";
const C = "- Répertorier";
const d = "Sous-étape 1 : Répertorier"; 
Sous-étape 1.1 : Identifier les éléments clés de l'objectif "gfhgf".
Sous-étape 2.2:
renvoit tous "Répertorier"

const theRegexForSubStep = /^[-*]?\s*(?:Sous-étape \d+ :|[-*]\s*.*?):?\s*/;

// Exemple de chaînes
const strings = [
    "- Sous-étape 1 : Déterminer le nombre d'éliminations de poids souhaitées.",
    "* Sous-étape 2 : Vérifier les ressources disponibles.",
    "- Répertorier les matériaux, équipements et logiciels pertinents pour le projet.",
    "Sous-étape 3 : Planifier le processus.",
  ];
  
// Utilisation de .match() pour extraire le contenu
strings.forEach((inputString) => {
const match = inputString.match(theRegexForSubStep);
if (match) {
    // Si une correspondance est trouvée, on affiche le contenu après le préfixe
    const content = inputString.replace(theRegexForSubStep, '').trim();
    console.log(`Original: "${inputString}"\nExtrait: "${content}"\n`);
} else {
    console.log(`Aucune correspondance pour : "${inputString}"\n`);
}
});

  
