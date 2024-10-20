import React from 'react';
import { motion } from 'framer-motion';

const Btn = ({ onclick, title, classnames, children }) => {
  return (
    <motion.button
      onClick={onclick}
      disabled={title.length < 2}
      className={`flex items-center py-3 px-6 text-gray-700 rounded-3xl border border-gray-200 text-lg shadow-lg transition-all duration-100 ease-in-out ${classnames} ${
        title.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default Btn;
