import React, { useState, useEffect } from "react";
import { useCrearReservaMutation, useActualizarReservaMutation } from "../../api/reservas";
import { useClientesQuery } from "../../api/clientes";

export default function ReservaForm({ onReservaGuardada, reservaEditar, onEdicionFinalizada, mostrarMensaje }) {
  const { data: clientes = [] } = useClientesQuery();
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [cancha, setCancha] = useState("");
  const [horario, setHorario] = useState("");
  const [fecha, setFecha] = useState("");
  const [editando, setEditando] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const crearReservaMutation = useCrearReservaMutation();
  const actualizarReservaMutation = useActualizarReservaMutation();

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
    // eslint-disable-next-line
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

    const datos = {
      cliente_id: clienteSeleccionado.id,
      nombre: clienteSeleccionado.nombre,
      cancha,
      horario,
      fecha
    };

    if (editando && reservaEditar) {
      actualizarReservaMutation.mutate(
        { id: reservaEditar.id, data: { nombre: clienteSeleccionado.nombre } },
        {
          onSuccess: (res) => {
            if (res.mensaje && mostrarMensaje) mostrarMensaje(res.mensaje, res.mensaje.includes("actualizada") ? "success" : "error");
            if (onEdicionFinalizada) onEdicionFinalizada();
          }
        }
      );
    } else {
      crearReservaMutation.mutate(datos, {
        onSuccess: (res) => {
          if (res.mensaje && mostrarMensaje) mostrarMensaje(res.mensaje, res.mensaje.includes("Reserva guardada") ? "success" : "error");
          if (onReservaGuardada) onReservaGuardada();
          // Limpiar formulario
          setClienteSeleccionado(null);
          setBusqueda("");
          setCancha("");
          setHorario("");
          setFecha("");
          setEditando(false);
        }
      });
    }
  };

  const clientesFiltrados = clientes.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  const horarios = Array.from({length: 13}, (_, i) => `${(6 + i).toString().padStart(2, '0')}:00`);
  const loading = crearReservaMutation.isPending || actualizarReservaMutation.isPending;

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