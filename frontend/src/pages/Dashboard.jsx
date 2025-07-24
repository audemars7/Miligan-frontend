import React from 'react';
import { Link } from 'react-router-dom';
import { useClientesQuery } from '../api/clientes';

export default function Dashboard() {
  const { data: clientes = [] } = useClientesQuery();

  const cardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  };

  const titleStyle = {
    color: '#2c5f2d',
    marginBottom: '2rem',
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#4a8f4d',
    margin: '1rem 0'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #2c5f2d, #4a8f4d)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'inline-block',
    margin: '1rem 0.5rem',
    transition: 'transform 0.3s ease',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Dashboard - Miligan Tennis Club</h1>
      
      <div style={gridStyle}>
        <div 
          style={cardStyle}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}
        >
          <h3>👥 Total de Clientes</h3>
          <div style={statNumberStyle}>{clientes.length}</div>
          <p>Clientes registrados en el sistema</p>
          <Link 
            to="/clientes" 
            style={buttonStyle}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          >
            Ver Clientes
          </Link>
        </div>

        <div 
          style={cardStyle}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}
        >
          <h3>📅 Gestión de Reservas</h3>
          <div style={statNumberStyle}>🎾</div>
          <p>Administra las reservas de canchas</p>
          <Link 
            to="/reservas" 
            style={buttonStyle}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          >
            Ver Reservas
          </Link>
        </div>

        <div 
          style={cardStyle}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}
        >
          <h3>🏆 Canchas Disponibles</h3>
          <div style={statNumberStyle}>2</div>
          <p>Canchas de tenis disponibles</p>
          <div style={{color: '#666', marginTop: '1rem'}}>
            <div>🎾 Cancha 1</div>
            <div>🎾 Cancha 2</div>
          </div>
        </div>
      </div>

      <div style={{...cardStyle, textAlign: 'left'}}>
        <h3 style={{color: '#2c5f2d', marginBottom: '1rem'}}>🚀 Acceso Rápido</h3>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          <Link to="/clientes" style={buttonStyle}>+ Nuevo Cliente</Link>
          <Link to="/reservas" style={buttonStyle}>+ Nueva Reserva</Link>
        </div>
      </div>
    </div>
  );
} 