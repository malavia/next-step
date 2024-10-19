import React from 'react';
import { motion } from 'framer-motion';

// Particles Component with more dynamic animation
const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="w-4 h-4 rounded-full bg-white opacity-20 animate-bounce slow absolute left-10 top-10"></div>
      <div className="w-6 h-6 rounded-full bg-white opacity-30 animate-ping absolute right-10 top-20"></div>
      <div className="w-3 h-3 rounded-full bg-white opacity-25 animate-bounce absolute left-1/2 top-1/3"></div>
      <div className="w-5 h-5 rounded-full bg-white opacity-20 animate-ping slow absolute right-1/3 top-1/4"></div>
      {/* Additional particles for more dynamic effect */}
      <div className="w-2 h-2 rounded-full bg-white opacity-20 animate-bounce absolute left-1/4 bottom-10"></div>
      <div className="w-7 h-7 rounded-full bg-white opacity-40 animate-ping slow absolute right-1/4 bottom-20"></div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="h-screen relative bg-gradient-to-r from-blue-500 via-pink-300 to-blue-700 flex flex-col justify-center items-center">
      {/* Particles Component */}
      <Particles />
      
      <motion.div 
        className="container mx-auto px-6 lg:px-8 text-center relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Parallax Effect on Text */}
        <motion.h1
          className="text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          whileHover={{ scale: 1.05, textShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)" }} // Zoom and shadow on hover
        >
          Un changement progressif, <br/>
          des résultats durables
        </motion.h1>
        
        <motion.p
          className="text-2xl lg:text-3xl text-white mb-8 drop-shadow-md leading-relaxed"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Prenez soin de votre bien-être, jour après jour
        </motion.p>
        
        <motion.div 
          className="max-w-3xl mx-auto text-white text-lg lg:text-xl mb-10 drop-shadow-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <p>
            Trouver un équilibre entre vos objectifs personnels et votre bien-être peut être un défi. Ici, vous êtes guidé 
            étape par étape à travers des petites actions quotidiennes, qui vous permettent de cultiver un état d’esprit serein et une meilleure qualité de vie.
          </p>
        </motion.div>
        
        {/* Animated Button with wave effect */}
        <motion.button
          className="bg-white text-blue-600 py-3 px-8 rounded-3xl text-lg shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden"
          whileHover={{ scale: 1.05, backgroundColor: "#60a5fa", color: "#fff" }}
          whileTap={{ scale: 0.95 }}
        >
          Commencez votre transformation
          {/* Button wave effect */}
          <span className="absolute inset-0 bg-blue-400 opacity-30 rounded-3xl transform scale-x-0 transition-all duration-700 ease-in-out origin-center hover:scale-x-100"></span>
        </motion.button>
      </motion.div>
      
      {/* Gradient Animation */}
      <style jsx>{`
        section {
          background-size: 200% 200%;
          animation: gradientShift 30s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-bounce {
          animation: bounce 4s infinite;
        }

        .animate-ping {
          animation: ping 2s infinite;
        }

        .slow {
          animation-duration: 6s;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        /* Wave animation for the button */
        .hover\:scale-x-100:hover {
          transform: scaleX(1);
        }

        .transform {
          transform-origin: center;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
