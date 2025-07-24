import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation({ onLogout }) {
  const location = useLocation();

  const navStyle = {
    background: 'linear-gradient(135deg, #2c5f2d, #4a8f4d)',
    padding: '1rem 2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const logoStyle = {
    color: 'white',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  };

  const activeLinkStyle = {
    ...linkStyle,
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)'
  };

  const logoutButtonStyle = {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          🎾 Miligan Tennis
        </Link>
        
        <ul style={navLinksStyle}>
          <li>
            <Link 
              to="/" 
              style={location.pathname === '/' ? activeLinkStyle : linkStyle}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/clientes" 
              style={location.pathname === '/clientes' ? activeLinkStyle : linkStyle}
            >
              Clientes
            </Link>
          </li>
          <li>
            <Link 
              to="/reservas" 
              style={location.pathname === '/reservas' ? activeLinkStyle : linkStyle}
            >
              Reservas
            </Link>
          </li>
        </ul>

        <button 
          onClick={onLogout} 
          style={logoutButtonStyle}
          onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
} 