import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

export default function ClientesList({ reload, onEditar, onReload, mostrarMensaje }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div>
      <h2>Clientes</h2>
      <ul>
        {(clientes || []).map(cliente => (
          <li key={cliente.id}>
            {cliente.nombre} {cliente.apellido} - {cliente.telefono || "Sin teléfono"}
            <button onClick={() => onEditar(cliente)} style={{marginLeft: 8}}>Editar</button>
            <button onClick={() => handleEliminar(cliente.id)} style={{marginLeft: 8, color: 'red'}}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 