import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)',
      color: '#fff',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀 Real-Time To-Do Board</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Collaborate on tasks with your team in real time. Smart, fast, secure.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => navigate('/login')}
          style={btnStyle}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{ ...btnStyle, backgroundColor: '#4CAF50' }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

const btnStyle = {
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#1976d2',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out'
};

export default Landing;
