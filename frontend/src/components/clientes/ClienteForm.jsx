import React, { useState } from "react";
import { crearCliente, actualizarCliente } from "../../api/clientes";

export default function ClienteForm({ onClienteCreado, clienteEditar, onEdicionFinalizada, mostrarMensaje }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar datos al editar
  React.useEffect(() => {
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
    setLoading(true);
    if (editando && clienteEditar) {
      const res = await actualizarCliente(clienteEditar.id, { nombre, telefono, email });
      if (res.mensaje && mostrarMensaje) mostrarMensaje(res.mensaje, res.mensaje.includes("actualizado") ? "success" : "error");
      if (onEdicionFinalizada) onEdicionFinalizada();
    } else {
      const nuevo = await crearCliente({ nombre, telefono, email });
      if (nuevo.id) {
        if (onClienteCreado) onClienteCreado();
      }
      if (nuevo.mensaje && mostrarMensaje) mostrarMensaje(nuevo.mensaje, nuevo.id ? "success" : "error");
    }
    setNombre("");
    setTelefono("");
    setEmail("");
    setEditando(false);
    setLoading(false);
  };

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