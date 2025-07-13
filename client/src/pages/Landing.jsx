import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-16 overflow-hidden relative">
      
      {/* Background Gradient Effect (Optional but enhances visual appeal) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-slate-950 opacity-90"></div>
      
      <motion.div
        className="max-w-4xl text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl sm:text-7xl font-extrabold text-slate-50 mb-8 leading-tight tracking-tight drop-shadow-lg"
          variants={itemVariants}
        >
          🚀 Real-Time Collaboration.
        </motion.h1>
        
        <motion.p
          className="text-lg sm:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Boost productivity and streamline task management with your team in real-time. Secure, fast, and intelligent task assignment.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          variants={containerVariants}
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-12 rounded-full shadow-2xl transition-all duration-300 transform hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            Login
          </motion.button>
          
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="bg-transparent border-2 border-emerald-600 text-emerald-300 hover:bg-emerald-600 hover:text-white font-semibold py-4 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Register
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;