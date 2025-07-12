import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-100 mb-6 leading-tight tracking-tight">
          🚀 Real-Time To-Do Collaboration
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
          Boost your productivity by managing tasks with your team in real-time.  
          Secure. Fast. Smart.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl shadow transition-all duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-xl shadow transition-all duration-300"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
