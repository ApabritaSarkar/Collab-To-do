import React from "react";
import { motion } from "framer-motion";

const RoomInfo = ({ roomInfo }) => {
  if (!roomInfo) return null;

  return (
    <motion.div
      className="bg-slate-800 p-4 rounded-xl text-sm text-slate-300 flex flex-col md:flex-row md:items-center md:justify-between shadow-xl border border-slate-700"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p>🛠 Room: <strong className="text-white">{roomInfo.name}</strong></p>
      <p>
        🔐 Code:
        <code className="text-indigo-400 bg-slate-900 px-2 py-1 rounded ml-2 font-mono">{roomInfo.code}</code>
      </p>
    </motion.div>
  );
};

export default RoomInfo;
