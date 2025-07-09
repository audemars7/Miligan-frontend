import React, { useState } from "react";
import { crearCliente, actualizarCliente } from "../../api/clientes";

export default function ClienteForm({ onClienteCreado, clienteEditar, onEdicionFinalizada }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [editando, setEditando] = useState(false);

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
    if (editando && clienteEditar) {
      await actualizarCliente(clienteEditar.id, { nombre, telefono, email });
      if (onEdicionFinalizada) onEdicionFinalizada();
    } else {
      const nuevo = await crearCliente({ nombre, telefono, email });
      if (nuevo.id) {
        onClienteCreado();
      }
    }
    setNombre("");
    setTelefono("");
    setEmail("");
    setEditando(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
      <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">{editando ? "Actualizar Cliente" : "Agregar Cliente"}</button>
      {editando && <button type="button" onClick={() => { setEditando(false); setNombre(""); setTelefono(""); setEmail(""); if (onEdicionFinalizada) onEdicionFinalizada(); }}>Cancelar</button>}
    </form>
  );
} 