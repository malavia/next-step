// errorHandler.js
class ErrorHandler {
  constructor() {
    this.defaultErrorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
  }

  logError(error, context = '') {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[Error]: ${context}`, error);
    }
  }

  displayFriendlyError(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Utilisateur introuvable. Veuillez vérifier vos identifiants.';
      case 'auth/wrong-password':
        return 'Mot de passe incorrect. Veuillez réessayer.';
      case 'auth/email-already-in-use':
        return 'Cet e-mail est déjà utilisé. Utilisez un autre e-mail.';
      // Ajoutez plus de cas spécifiques à votre application
      default:
        return this.defaultErrorMessage;
    }
  }

  handleFirebaseError(error, context = '') {
    this.logError(error, context);
    const errorCode = error.code;
    return this.displayFriendlyError(errorCode);
  }

  handleGenericError(error, context = '') {
    this.logError(error, context);
    return this.defaultErrorMessage;
  }
}

const errorHandler = new ErrorHandler();
export default errorHandler;

/*
utilisation :
    try {
      // Code qui peut échouer
    } catch (error) {
      const friendlyMessage = errorHandler.handleGenericError(error, 'Erreur dans SomeComponent');

*/