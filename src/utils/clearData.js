export function nettoyerTexte(input) {
    // Garde les sauts de ligne et ne supprime que "Étape X:", "X." et "Sous-étape :"
    return input.replace(/Étape \d+:\s*|\d+\.\s*|Sous-étape :\s*/g, '').trimStart();
}
const theRegexForStep = /^[-*]? ?Étape \d+ ?:?\s*/;

//const theRegexForSubStep = /^[-*] Sous-étape \d+ ?:?\s*/ ; //// Enlève le "- Sous-étape X :" ou "* Sous-étape X :" au début
//const theRegexForSubStep = /^[-*] Sous-étape \d* ?:?\s*|^[-*] ?/;
const theRegexForSubStep = /^[-*]?\s*(?:Sous-étape \d+ :|[-*]\s*.*?):?\s*/;

/*
[-*] : Cela correspond à un tiret (-) ou à un astérisque (*) au début de la chaîne.
Sous-étape : Correspond exactement au mot "Sous-étape".
\d+ : Correspond à un ou plusieurs chiffres, ce qui représente le numéro de la sous-étape.
? : Correspond à zéro ou un espace (facultatif) avant le deux-points.
:\s* : Correspond à un deux-points suivi de zéro ou plusieurs espaces.
*/

// Fonction pour vérifier si une étape est une sous-étape
export const isSubStep = (step) => {
  return step.startsWith('-') || step.startsWith('*') || step.match(theRegexForSubStep);
};

// Fonction pour nettoyer le contenu d'une étape 
export const clearStepContent = (step) => {
  return step.replace(theRegexForStep, '').trim();
};

// Fonction pour nettoyer le contenu d'une sous-étape 
export const clearSubStepContent = (step) => {
  return step.replace(theRegexForSubStep, '').trim();
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

  
