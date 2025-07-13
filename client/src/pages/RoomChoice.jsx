import React, { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

const RoomChoice = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("create");
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreate = async () => {
    try {
      const res = await API.post(
        "/rooms/create",
        { name: roomName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Room created: ${res.data.code}`);
      navigate(`/dashboard/${res.data.roomId}`);
    } catch (err) {
      toast.error("Failed to create room");
    }
  };

  const handleJoin = async () => {
    try {
      const res = await API.post(
        "/rooms/join",
        { code: roomCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Joined room: ${res.data.name}`);
      navigate(`/dashboard/${res.data.roomId}`);
    } catch (err) {
      toast.error("Invalid room code");
    }
  };

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-6">
      <motion.div 
        className="bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-transform duration-500 hover:shadow-lg hover:shadow-cyan-500/30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          Choose Your Path 🌐
        </h2>

        {/* Mode Selector Buttons */}
        <div className="flex gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 font-semibold py-3 rounded-xl transition duration-200 ${
              mode === "create" 
                ? "bg-orange-500 text-slate-950 shadow-lg" 
                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
            }`}
            onClick={() => setMode("create")}
          >
            Create Room
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 font-semibold py-3 rounded-xl transition duration-200 ${
              mode === "join" 
                ? "bg-cyan-500 text-slate-950 shadow-lg" 
                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
            }`}
            onClick={() => setMode("join")}
          >
            Join Room
          </motion.button>
        </div>

        {/* Conditional Forms based on mode */}
        <AnimatePresence mode="wait">
          {mode === "create" ? (
            <motion.div
              key="create"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <input
                type="text"
                placeholder="Enter Room Name"
                className="w-full px-5 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 shadow-inner"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <motion.button
                onClick={handleCreate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-4 rounded-xl shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
              >
                Create Room
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="join"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <input
                type="text"
                placeholder="Enter Room Code"
                className="w-full px-5 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 shadow-inner"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <motion.button
                onClick={handleJoin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-4 rounded-xl shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
              >
                Join Room
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RoomChoice;