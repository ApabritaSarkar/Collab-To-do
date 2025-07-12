import React, { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="bg-slate-900 p-8 rounded-xl shadow-xl w-full max-w-md text-white space-y-6">
        <h2 className="text-3xl font-bold text-center">Choose Room</h2>

        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              mode === "create" ? "bg-indigo-600" : "bg-slate-700"
            }`}
            onClick={() => setMode("create")}
          >
            Create
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              mode === "join" ? "bg-indigo-600" : "bg-slate-700"
            }`}
            onClick={() => setMode("join")}
          >
            Join
          </button>
        </div>

        {mode === "create" ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Room Name"
              className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <button
              onClick={handleCreate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg transition"
            >
              Create Room
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Room Code"
              className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button
              onClick={handleJoin}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg transition"
            >
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomChoice;
