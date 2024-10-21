import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export function Button({ variant = 'primary', className = '', children, ...props }) {
  const baseStyles = 'flex items-center px-6 py-3 rounded-3xl font-medium transition-colors duration-200 border border-gray-200 shadow-lg';
  const variants = {
    primary: 'bg-white text-gray-700 hover:bg-gray-100',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    finished: 'bg-blue-500 text-white hover:bg-blue-600'
  };

  const disabledStyles = props.disabled ? 'opacity-50 cursor-not-allowed' : '';
  return (
    <motion.button
    className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}
    whileHover={!props.disabled && { scale: 1.02 }}  // Empêche l'effet hover si désactivé
    whileTap={!props.disabled && { scale: 0.98 }}    // Empêche l'effet tap si désactivé
    
      {...props}
    >
      {children}
    </motion.button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'finished']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool, // Ajout de la validation du type disabled
};
