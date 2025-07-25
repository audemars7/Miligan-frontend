import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

export default function ReservaForm({ onReservaGuardada, reservaEditar, onEdicionFinalizada, mostrarMensaje }) {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [cancha, setCancha] = useState("");
  const [horario, setHorario] = useState("");
  const [fecha, setFecha] = useState("");
  const [editando, setEditando] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
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
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    if (reservaEditar) {
      setClienteSeleccionado(reservaEditar.cliente_id ? clientes.find(c => c.id === reservaEditar.cliente_id) : null);
      setBusqueda(reservaEditar.nombre || "");
      setCancha(reservaEditar.cancha || "");
      setHorario(reservaEditar.horario || "");
      setFecha(reservaEditar.fecha || "");
      setEditando(true);
    } else {
      setClienteSeleccionado(null);
      setBusqueda("");
      setCancha("");
      setHorario("");
      setFecha("");
      setEditando(false);
    }
  }, [reservaEditar, clientes]);

  const handleSelectCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setBusqueda(cliente.nombre);
    setMostrarOpciones(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteSeleccionado) {
      if (mostrarMensaje) mostrarMensaje("Selecciona un cliente válido", "error");
      return;
    }
    if (!cancha || !horario || !fecha) {
      if (mostrarMensaje) mostrarMensaje("Todos los campos son obligatorios", "error");
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem("token");
    
    const datos = {
      cliente_id: clienteSeleccionado.id,
      nombre: clienteSeleccionado.nombre,
      cancha,
      horario,
      fecha
    };

    try {
      if (editando && reservaEditar) {
        const res = await fetch(`${API_URL}/admin/reservas/${reservaEditar.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ nombre: clienteSeleccionado.nombre })
        });
        const data = await res.json();
        if (mostrarMensaje) mostrarMensaje(data.mensaje || "Reserva actualizada", "success");
        if (onEdicionFinalizada) onEdicionFinalizada();
      } else {
        const res = await fetch(`${API_URL}/reservar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(datos)
        });
        const data = await res.json();
        if (mostrarMensaje) mostrarMensaje(data.mensaje || "Reserva guardada", "success");
        if (onReservaGuardada) onReservaGuardada();
        setClienteSeleccionado(null);
        setBusqueda("");
        setCancha("");
        setHorario("");
        setFecha("");
        setEditando(false);
      }
    } catch (error) {
      if (mostrarMensaje) mostrarMensaje("Error de red", "error");
    }
    
    setLoading(false);
  };

  const clientesFiltrados = clientes.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  const horarios = Array.from({length: 13}, (_, i) => `${(6 + i).toString().padStart(2, '0')}:00`);

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div style={{position: 'relative', display: 'inline-block'}}>
        <input
          value={busqueda}
          onChange={e => { setBusqueda(e.target.value); setClienteSeleccionado(null); setMostrarOpciones(true); }}
          placeholder="Buscar cliente..."
          required
          onFocus={() => setMostrarOpciones(true)}
        />
        {mostrarOpciones && busqueda && clientesFiltrados.length > 0 && (
          <ul style={{position: 'absolute', zIndex: 10, background: 'white', border: '1px solid #ccc', width: '100%', maxHeight: 120, overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0}}>
            {clientesFiltrados.map(cliente => (
              <li key={cliente.id} style={{padding: 4, cursor: 'pointer'}} onClick={() => handleSelectCliente(cliente)}>
                {cliente.nombre} {cliente.apellido}
              </li>
            ))}
          </ul>
        )}
      </div>
      <select value={cancha} onChange={e => setCancha(e.target.value)} required={!editando} disabled={editando}>
        <option value="">Cancha</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      <select value={horario} onChange={e => setHorario(e.target.value)} required={!editando} disabled={editando}>
        <option value="">Horario</option>
        {horarios.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required={!editando} disabled={editando} />
      <button type="submit" disabled={loading}>{editando ? "Actualizar Reserva" : "Agregar Reserva"}</button>
      {editando && <button type="button" onClick={() => { setEditando(false); setClienteSeleccionado(null); setBusqueda(""); setCancha(""); setHorario(""); setFecha(""); if (onEdicionFinalizada) onEdicionFinalizada(); }}>Cancelar</button>}
    </form>
  );
} 