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
          Étape 1 :: <Nom de l'étape>
          Priorité : <Priorité de l'étape entre Low, Medium et High>
          Type : <Type de l'étape entre Sequential et Parallel>
          Deadline : <Deadline de l'étape en fonction du terme si le terme est indiqué>
          Sous-étape 1 : <Description de la sous-étape>
          Sous-étape 2 : <Description de la sous-étape>
          Étape 2 : <Nom de l'étape>
          Priorité : <Priorité de l'étape entre basse, moyenne et haute>
          Type : <Type de l'étape entre sequenttial et parallel>
          Deadline : <Deadline de l'étape en fonction du terme si le terme est indifié>
          Sous-étape 1 : <Description de la sous-étape>
          ...
      `
  });
  
  export const buildMessages = (title, description = "", terme = "") => [
    buildSystemMessage(),
    buildUserMessage(title, description, terme)
  ];