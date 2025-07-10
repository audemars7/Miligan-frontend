import React, { useState, useEffect } from "react";
import { useCrearClienteMutation, useActualizarClienteMutation } from "../../api/clientes";

export default function ClienteForm({ clienteEditar, onEdicionFinalizada, mostrarMensaje }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [editando, setEditando] = useState(false);

  const crearClienteMutation = useCrearClienteMutation();
  const actualizarClienteMutation = useActualizarClienteMutation();

  useEffect(() => {
    if (clienteEditar) {
      setNombre(clienteEditar.nombre || "");
      setTelefono(clienteEditar.telefono || "");
      setEmail(clienteEditar.email || "");
      setEditando(true);
    } else {
      setNombre("");
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
    if (editando && clienteEditar) {
      actualizarClienteMutation.mutate(
        { id: clienteEditar.id, data: { nombre, telefono, email } },
        {
          onSuccess: (res) => {
            if (res.mensaje && mostrarMensaje) mostrarMensaje(res.mensaje, res.mensaje.includes("actualizado") ? "success" : "error");
            if (onEdicionFinalizada) onEdicionFinalizada();
          }
        }
      );
    } else {
      crearClienteMutation.mutate(
        { nombre, telefono, email },
        {
          onSuccess: (nuevo) => {
            if (nuevo.id) {
              if (mostrarMensaje) mostrarMensaje("Cliente creado correctamente", "success");
            } else if (mostrarMensaje) {
              mostrarMensaje(nuevo.mensaje || "Error al crear cliente", "error");
            }
            setNombre("");
            setTelefono("");
            setEmail("");
            setEditando(false);
          }
        }
      );
    }
  };

  const loading = crearClienteMutation.isLoading || actualizarClienteMutation.isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
      <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit" disabled={loading}>{editando ? "Actualizar Cliente" : "Agregar Cliente"}</button>
      {editando && <button type="button" onClick={() => { setEditando(false); setNombre(""); setTelefono(""); setEmail(""); if (onEdicionFinalizada) onEdicionFinalizada(); }}>Cancelar</button>}
    </form>
  );
} 