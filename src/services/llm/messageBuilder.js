export const buildSystemMessage = () => ({
    role: "system",
    content: "Respond like a coach assistant. Provide the answer directly without any introductory text."
  });
  
  export const buildUserMessage = (title, description, terme) => ({
    role: "user",
    content: `
        Objectif : ${title}
        Description : ${description}
        Terme : ${terme}

        Peux-tu me fournir des étapes et sous-étapes concrètes pour atteindre cet objectif dans le format suivant : 
          Étape 1 : <Nom de l'étape>
          Sous-étape 1 : <Description de la sous-étape>
          Sous-étape 2 : <Description de la sous-étape>
          Étape 2 : <Nom de l'étape>
          Sous-étape 1 : <Description de la sous-étape>
          ...
      `
  
  });
  
  export const buildMessages = (title, description = "", terme = "") => [
    buildSystemMessage(),
    buildUserMessage(title, description, terme)
  ];

  

      /* l'ancien prompt  - le nouveau semble plus efficace
    `Génère une liste d'étapes pour atteindre l'objectif suivant : "${title}". 

      Chaque étape doit avoir 2 à 3 sous-étapes. 
      Assure-toi que les étapes et les sous-étapes sont rédigées de manière réutilisable pour d'autres objectifs. ne pas répeter l'objectif principal.
      Chaque étape et sous-étape doit être séparée par un saut de ligne. 
      Les sous étapes doivent commencer par le texte "Sous-étape 1 :"

      
      Valeurs métriques : 3 séances de 30 minutes par semaine

*/