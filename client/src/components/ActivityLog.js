import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import AuthContext from '../context/AuthContext';

const ActivityLog = () => {
  const { token } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/tasks/logs/recent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs');
    }
  };

  useEffect(() => {
    fetchLogs();

    // Optional: Poll every 10 seconds
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div style={{
      width: '300px',
      background: '#f9f9f9',
      padding: '1rem',
      borderLeft: '1px solid #ddd',
      overflowY: 'auto',
      maxHeight: '100vh'
    }}>
      <h3>Activity Log</h3>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {logs.map(log => (
          <li key={log._id} style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.9rem' }}>{log.message}</div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>
              By <strong>{log.user.name}</strong> | {new Date(log.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
