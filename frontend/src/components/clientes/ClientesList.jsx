import React, { useEffect, useState } from "react";
import { getClientes, eliminarCliente } from "../../api/clientes";

export default function ClientesList({ onEditar }) {
  const [clientes, setClientes] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    getClientes().then(data => setClientes(Array.isArray(data) ? data : []));
  }, [reload]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      await eliminarCliente(id);
      setReload(!reload);
    }
  };

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {(clientes || []).map(cliente => (
          <li key={cliente.id}>
            {cliente.nombre} - {cliente.telefono || "Sin teléfono"}
            <button onClick={() => onEditar(cliente)} style={{marginLeft: 8}}>Editar</button>
            <button onClick={() => handleEliminar(cliente.id)} style={{marginLeft: 8, color: 'red'}}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 