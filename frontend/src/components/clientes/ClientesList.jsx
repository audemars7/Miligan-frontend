import React from "react";
import { useClientesQuery, useEliminarClienteMutation } from "../../api/clientes";

export default function ClientesList({ onEditar, mostrarMensaje }) {
  const { data: clientes = [], isLoading, isError } = useClientesQuery();
  const eliminarClienteMutation = useEliminarClienteMutation();

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      eliminarClienteMutation.mutate(id, {
        onSuccess: (res) => {
          if (res.mensaje && mostrarMensaje) mostrarMensaje(res.mensaje, res.mensaje.includes("eliminado") ? "success" : "error");
        }
      });
    }
  };

  if (isLoading) return <div>Cargando clientes...</div>;
  if (isError) return <div style={{ color: "red" }}>Error al cargar clientes</div>;

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