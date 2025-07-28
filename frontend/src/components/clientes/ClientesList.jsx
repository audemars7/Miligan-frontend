import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

export default function ClientesList({ reload, onEditar, onReload, mostrarMensaje }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/clientes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setClientes(data);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
      setLoading(false);
    };

    fetchClientes();
  }, [reload]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/clientes/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (mostrarMensaje) mostrarMensaje(data.mensaje || "Cliente eliminado", "success");
        if (onReload) onReload();
      } catch (error) {
        if (mostrarMensaje) mostrarMensaje("Error de red", "error");
      }
    }
  };

  if (loading) return <div>Cargando clientes...</div>;

  return (
    <div style={{
      border: '2px solid #2c5f2d',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 4px 12px rgba(44, 95, 45, 0.15)'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(8, 1fr)', 
        gap: '6px', 
        padding: '10px 0' 
      }}>
        {(clientes || []).map(cliente => (
          <button
            key={cliente.id}
            style={{
              background: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '8px 4px',
              cursor: 'pointer',
              fontSize: '0.65rem',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              wordWrap: 'break-word',
              lineHeight: '1.2'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
            onClick={() => setClienteSeleccionado(cliente)}
          >
            <span style={{ color: '#2c5f2d', fontWeight: '500', fontSize: '0.6rem' }}>
              {cliente.nombre} {cliente.apellido ? cliente.apellido : ""}
            </span>
          </button>
        ))}
      </div>
      {clienteSeleccionado && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}
          onClick={() => setClienteSeleccionado(null)}
        >
          <div style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 300, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <h3>Información del Cliente</h3>
            <p><b>Nombre:</b> {clienteSeleccionado.nombre}</p>
            <p><b>Apellido:</b> {clienteSeleccionado.apellido || '-'}</p>
            <p><b>Teléfono:</b> {clienteSeleccionado.telefono || '-'}</p>
            <p><b>Email:</b> {clienteSeleccionado.email || '-'}</p>
            <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => { onEditar(clienteSeleccionado); setClienteSeleccionado(null); }}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                Editar
              </button>
              <button 
                onClick={() => { handleEliminar(clienteSeleccionado.id); setClienteSeleccionado(null); }}
                className="btn-eliminar"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                Eliminar
              </button>
              <button 
                onClick={() => setClienteSeleccionado(null)} 
                style={{ padding: '8px 16px', fontSize: '0.9rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 