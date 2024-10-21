export function nettoyerTexte(input) {
    // Garde les sauts de ligne et ne supprime que "Étape X:" ou "X."
    return input.replace(/Étape \d+:\s*|\d+\.\s*/g, '').trimStart();
}
  