import React, { useState } from 'react';
import ClienteForm from '../components/clientes/ClienteForm';
import ClientesList from '../components/clientes/ClientesList';

export default function ClientesPage() {
  const [clienteEditar, setClienteEditar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const mostrarMensaje = (msg, tipo = "success") => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 3000);
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const titleStyle = {
    color: '#2c5f2d',
    marginBottom: '2rem',
    textAlign: 'center',
    fontSize: '2.5rem'
  };

  const sectionStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const sectionTitleStyle = {
    color: '#2c5f2d',
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '0.5rem'
  };

  const messageStyle = {
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
    fontWeight: '500',
    color: tipoMensaje === "error" ? "#d32f2f" : "#2e7d32",
    background: tipoMensaje === "error" ? "#ffebee" : "#e8f5e8",
    border: `1px solid ${tipoMensaje === "error" ? "#ffcdd2" : "#c8e6c9"}`
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>👥 Gestión de Clientes</h1>
      
      {mensaje && (
        <div style={messageStyle}>
          {mensaje}
        </div>
      )}

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          {clienteEditar ? "✏️ Editar Cliente" : "➕ Agregar Nuevo Cliente"}
        </h2>
        <ClienteForm
          clienteEditar={clienteEditar}
          onEdicionFinalizada={() => {
            setClienteEditar(null);
            mostrarMensaje("Cliente actualizado correctamente");
          }}
          mostrarMensaje={mostrarMensaje}
        />
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>📋 Lista de Clientes</h2>
        <ClientesList
          onEditar={setClienteEditar}
          mostrarMensaje={mostrarMensaje}
        />
      </div>
    </div>
  );
} 