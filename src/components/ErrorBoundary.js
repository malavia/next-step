// ErrorBoundary.js
/*pour l'utiliser : 

throw new Error('Erreur de rendu !');

*/

import React, { Component } from 'react';
import errorHandler from '../utils/errorHandler';  // Assurez-vous que votre gestionnaire d'erreurs est importé

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    const errorMessage = process.env.NODE_ENV === 'development'
      ? error.message
      : errorHandler.defaultErrorMessage;

    return { hasError: true, errorMessage };
  }




  componentDidCatch(error, errorInfo) {
    errorHandler.logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-page"><h1>{this.state.errorMessage}</h1></div>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
