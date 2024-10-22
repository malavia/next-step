export function nettoyerTexte(input) {
    // Garde les sauts de ligne et ne supprime que "Étape X:", "X." et "Sous-étape :"
    return input.replace(/Étape \d+:\s*|\d+\.\s*|Sous-étape :\s*/g, '').trimStart();
}
