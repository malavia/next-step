
/*
    utilisation : 
            {objectiveData.term === 'custom' ? formatDate(objectiveData.deadline) : formatDate(getTermDate(objectiveData.term))}
*/


/*calculates a future date based on a given term. The term can be 'court' (1 month), 'moyen' (6 months), or 'long' (1 year). If the term is not recognized, it returns null.*/
export const getTermDate = (term) => {
    const today = new Date();
    switch (term) {
      case 'court':
        return new Date(today.setMonth(today.getMonth() + 1));
      case 'moyen':
        return new Date(today.setMonth(today.getMonth() + 6));
      case 'long':
        return new Date(today.setFullYear(today.getFullYear() + 1));
      default:
        return null;
    }
};

/*converts a date to a string in French. If the date is null, it returns an empty string.*/
export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
};


export function daysBetween(date) {
    const today = new Date();
    const givenDate = new Date(date);

    // Calculer la différence en millisecondes
    const differenceInTime = today - givenDate;

    // Convertir la différence en jours
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

    return differenceInDays;
}

// Utilisation
//const date = "2023-10-01"; // Exemple de date
//console.log(`Nombre de jours : ${daysBetween(date)}`);
