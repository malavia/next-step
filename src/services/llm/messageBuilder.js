export const buildSystemMessage = () => ({
    role: "system",
    content: "Respond like a coach assistant. Provide the answer directly without any introductory text."
  });
  
  export const buildUserMessage = (title) => ({
    role: "user",
    content: `Génère une liste d'étapes pour atteindre l'objectif suivant : "${title}". 
      Chaque étape doit avoir 2 à 3 sous-étapes. 
      Assure-toi que les étapes et les sous-étapes sont rédigées de manière réutilisable pour d'autres objectifs. ne pas répeter l'objectif principal.
      Chaque étape et sous-étape doit être séparée par un saut de ligne. 
      Les sous étapes doivent commencer par le texte "Sous-étape 1 :"`
  });
  
  export const buildMessages = (title) => [
    buildSystemMessage(),
    buildUserMessage(title)
  ];