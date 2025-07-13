import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Users, CheckSquare } from "lucide-react"; // Using lucide-react for icons

const Landing = () => {
  const navigate = useNavigate();

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 30px rgba(99, 102, 241, 0.5)",
    },
    tap: { scale: 0.95 },
  };

  const featureVariants = {
    hover: { scale: 1.1, y: -5 },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-0 left-0 h-96 w-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 h-96 w-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.main
        className="max-w-5xl text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 pb-2"
          variants={itemVariants}
        >
          Collabrix
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-300 font-light tracking-wide"
          variants={itemVariants}
        >
          Collaborate. Organize. Achieve.
        </motion.p>
        {/* Feature Icons */}
        <motion.div
          variants={containerVariants}
          className="flex justify-center items-center space-x-8 md:space-x-12 my-12"
        >
          <motion.div
            variants={featureVariants}
            whileHover="hover"
            className="text-center"
          >
            <Users className="h-10 w-10 mx-auto text-indigo-400" />
            <p className="mt-2 text-sm text-gray-400">Collaborate</p>
          </motion.div>
          <motion.div
            variants={featureVariants}
            whileHover="hover"
            className="text-center"
          >
            <Briefcase className="h-10 w-10 mx-auto text-emerald-400" />
            <p className="mt-2 text-sm text-gray-400">Organize</p>
          </motion.div>
          <motion.div
            variants={featureVariants}
            whileHover="hover"
            className="text-center"
          >
            <CheckSquare className="h-10 w-10 mx-auto text-pink-400" />
            <p className="mt-2 text-sm text-gray-400">Achieve</p>
          </motion.div>
        </motion.div>
        <motion.p
          className="max-w-xl mx-auto text-gray-400 my-10 text-lg"
          variants={itemVariants}
        >
          The ultimate platform to bring your team's ideas to life. From
          seamless project management to real-time collaboration, **Collabrix**
          is where great work happens.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={containerVariants}
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 hover:bg-indigo-700"
          >
            Get Started
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto bg-gray-700 text-gray-200 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 hover:bg-gray-600"
          >
            Login
          </motion.button>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Landing;
