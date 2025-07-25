import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

export default function ClienteForm({ clienteEditar, onClienteCreado, onEdicionFinalizada, mostrarMensaje }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clienteEditar) {
      setNombre(clienteEditar.nombre || "");
      setApellido(clienteEditar.apellido || "");
      setTelefono(clienteEditar.telefono || "");
      setEmail(clienteEditar.email || "");
      setEditando(true);
    } else {
      setNombre("");
      setApellido("");
      setTelefono("");
      setEmail("");
      setEditando(false);
    }
  }, [clienteEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      if (mostrarMensaje) mostrarMensaje("El nombre es obligatorio", "error");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (editando && clienteEditar) {
        const res = await fetch(`${API_URL}/clientes/${clienteEditar.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ nombre, apellido, telefono, email })
        });
        const data = await res.json();
        if (mostrarMensaje) mostrarMensaje(data.mensaje || "Cliente actualizado", "success");
        if (onEdicionFinalizada) onEdicionFinalizada();
      } else {
        const res = await fetch(`${API_URL}/clientes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ nombre, apellido, telefono, email })
        });
        const data = await res.json();
        if (data.id) {
          if (mostrarMensaje) mostrarMensaje("Cliente creado correctamente", "success");
          setNombre("");
          setApellido("");
          setTelefono("");
          setEmail("");
          if (onClienteCreado) onClienteCreado();
        } else {
          if (mostrarMensaje) mostrarMensaje(data.mensaje || "Error al crear cliente", "error");
        }
      }
    } catch (error) {
      if (mostrarMensaje) mostrarMensaje("Error de red", "error");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
      <input value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Apellido" />
      <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit" disabled={loading}>
        {editando ? "Actualizar Cliente" : "Agregar Cliente"}
      </button>
      {editando && (
        <button type="button" onClick={() => {
          setEditando(false);
          setNombre("");
          setApellido("");
          setTelefono("");
          setEmail("");
          if (onEdicionFinalizada) onEdicionFinalizada();
        }}>
          Cancelar
        </button>
      )}
    </form>
  );
} 