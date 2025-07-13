import React from "react";
import { motion } from "framer-motion";

const RoomMembers = ({ roomInfo }) => {
  if (!roomInfo) return null;
console.log("🔍 roomInfo in RoomMembers:", roomInfo);

  const members = roomInfo?.members || [];

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800">
      <h3 className="text-2xl font-semibold mb-4 text-white">Room Members 👥</h3>

      {members.length > 0 ? (
        <ul className="space-y-4">
          {members.map((member) => (
            <motion.li
              key={member._id}
              className="bg-slate-800 p-4 rounded-lg shadow border border-slate-700"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="font-bold text-white text-lg">{member.name}</div>
              <div className="text-sm text-indigo-400">{member.email}</div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 text-center py-6">
          No members found or not yet joined.
        </p>
      )}
    </div>
  );
};

export default RoomMembers;
