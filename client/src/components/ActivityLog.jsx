import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import AuthContext from "../context/AuthContext";

const ActivityLog = () => {
  const { token } = useContext(AuthContext);
  const { roomId } = useParams();
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await API.get(`/tasks/logs?roomId=${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [token, roomId]);

  return (
    <div className="w-full md:w-80 bg-slate-900 text-white p-4 rounded-xl shadow-lg h-full max-h-screen overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 text-white">Activity Log 📜</h3>
      <ul className="space-y-4">
        {logs.map((log) => (
          <li
            key={log._id}
            className="border-l-4 border-indigo-500 pl-3 bg-slate-800 rounded-md p-3"
          >
            <div className="text-sm text-white">{log.message}</div>
            <div className="text-xs text-slate-400 mt-1">
              By{" "}
              <span className="font-medium text-emerald-400">
                {log.user.name}
              </span>{" "}
              | {new Date(log.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
