import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { getHorariosDisponibles, verificarDisponibilidad } from "../../api/reservas";
import { getCurrentDate, isValidDate } from "../../utils/dateUtils";

export default function ReservaForm({ reload, onReservaGuardada, reservaEditar, onEdicionFinalizada, mostrarMensaje }) {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [cancha, setCancha] = useState("");
  const [horario, setHorario] = useState("");
  const [fecha, setFecha] = useState("");
  const [editando, setEditando] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [loading, setLoading] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horarioDisponible, setHorarioDisponible] = useState(true);
  const [fechaValida, setFechaValida] = useState(true);

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
  }, [reload]);

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

  // Validar fecha en el frontend (sin hacer requests al backend)
  useEffect(() => {
    if (fecha && !editando) {
      // Usar utilidades centralizadas para fechas
      const fechaSeleccionada = fecha; // Ya viene en formato YYYY-MM-DD
      const fechaActual = getCurrentDate();
      
      // Debug: mostrar las fechas para verificar
      console.log('Fecha seleccionada:', fechaSeleccionada);
      console.log('Fecha actual (local):', fechaActual);
      
      // Permitir reservas para el día actual y fechas futuras
      const esFechaPasada = !isValidDate(fechaSeleccionada);
      console.log('¿Es fecha pasada?', esFechaPasada);
      
      setFechaValida(!esFechaPasada);
      
      if (esFechaPasada) {
        setHorariosDisponibles([]);
        setHorarioDisponible(false);
      }
    } else {
      setFechaValida(true);
    }
  }, [fecha, editando]);

  // Cargar horarios disponibles solo si la fecha es válida
  useEffect(() => {
    if (fecha && cancha && !editando && fechaValida) {
      const cargarHorarios = async () => {
        try {
          const data = await getHorariosDisponibles(fecha, cancha);
          setHorariosDisponibles(data.horarios_disponibles || []);
        } catch (error) {
          console.error("Error al cargar horarios:", error);
          setHorariosDisponibles([]);
        }
      };
      cargarHorarios();
    } else if (!fechaValida) {
      setHorariosDisponibles([]);
    }
  }, [fecha, cancha, editando, fechaValida]);

  // Verificar disponibilidad del horario seleccionado solo si la fecha es válida
  useEffect(() => {
    if (fecha && cancha && horario && !editando && fechaValida) {
      const verificar = async () => {
        try {
          const data = await verificarDisponibilidad(fecha, cancha, horario);
          setHorarioDisponible(data.disponible);
          
          if (!data.disponible && mostrarMensaje) {
            mostrarMensaje(data.mensaje, "warning");
          }
        } catch (error) {
          console.error("Error al verificar disponibilidad:", error);
          setHorarioDisponible(true);
        }
      };
      verificar();
    } else if (!fechaValida) {
      setHorarioDisponible(false);
    } else {
      setHorarioDisponible(true);
    }
  }, [fecha, cancha, horario, editando, fechaValida, mostrarMensaje]);

  const handleSelectCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setBusqueda(`${cliente.nombre} ${cliente.apellido || ''}`.trim());
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
    if (!fechaValida) {
      if (mostrarMensaje) mostrarMensaje("La fecha seleccionada no es válida", "error");
      return;
    }
    if (!horarioDisponible && !editando) {
      if (mostrarMensaje) mostrarMensaje("El horario seleccionado no está disponible", "error");
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
        if (data.id) {
          if (mostrarMensaje) mostrarMensaje(data.mensaje || "Reserva guardada", "success");
          if (onReservaGuardada) onReservaGuardada();
          setClienteSeleccionado(null);
          setBusqueda("");
          setCancha("");
          setHorario("");
          setFecha("");
          setEditando(false);
        } else {
          if (mostrarMensaje) mostrarMensaje(data.mensaje || "Error al crear reserva", "error");
        }
      }
    } catch (error) {
      if (mostrarMensaje) mostrarMensaje("Error de red", "error");
    }
    
    setLoading(false);
  };

  const clientesFiltrados = clientes.filter(c => {
    const nombreCompleto = `${c.nombre} ${c.apellido || ''}`.toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase());
  });
  
  // Siempre mostrar todos los horarios (6 AM a 6 PM) en formato de rangos
  const horarios = Array.from({length: 12}, (_, i) => {
    const horaInicio = (6 + i).toString().padStart(2, '0');
    const horaFin = (7 + i).toString().padStart(2, '0');
    return `${horaInicio}:00 - ${horaFin}:00`;
  });

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {/* Primera fila: Buscar cliente + Cancha + Horario */}
      <div style={{ display: 'flex', gap: '25px', marginBottom: '10px' }}>
        <div style={{position: 'relative', flex: '1'}}>
          <input
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setClienteSeleccionado(null); setMostrarOpciones(true); }}
            placeholder="Buscar cliente..."
            required
            onFocus={() => setMostrarOpciones(true)}
            style={{ width: '100%' }}
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
        <select 
          value={cancha} 
          onChange={e => setCancha(e.target.value)} 
          required={!editando} 
          disabled={editando}
          style={{ flex: '0 0 100px' }}
        >
          <option value="">Cancha</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <select 
          value={horario} 
          onChange={e => setHorario(e.target.value)} 
          required={!editando} 
          disabled={editando}
          style={{ 
            flex: '0 0 150px',
            borderColor: !horarioDisponible && horario ? '#ff6b6b' : undefined,
            backgroundColor: !horarioDisponible && horario ? '#fff5f5' : undefined
          }}
        >
          <option value="">Seleccionar horario</option>
          {horarios.map(h => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* Segunda fila: Fecha + Botón */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <input 
          type="date" 
          value={fecha} 
          onChange={e => setFecha(e.target.value)} 
          required={!editando} 
          disabled={editando}
          style={{ flex: '1' }}
        />
        <button 
          type="submit" 
          disabled={loading || (!horarioDisponible && !editando) || !fechaValida}
          style={{ flex: '0 0 auto', padding: '8px 16px' }}
        >
          {editando ? "Actualizar Reserva" : "Agregar Reserva"}
        </button>
        {editando && (
          <button 
            type="button" 
            onClick={() => { setEditando(false); setClienteSeleccionado(null); setBusqueda(""); setCancha(""); setHorario(""); setFecha(""); if (onEdicionFinalizada) onEdicionFinalizada(); }}
            style={{ flex: '0 0 auto', padding: '8px 16px' }}
          >
            Cancelar
          </button>
        )}
      </div>
      
      {/* Indicador de disponibilidad */}
      {horario && fecha && cancha && !editando && (
        <div style={{ 
          margin: '10px 0', 
          padding: '8px', 
          borderRadius: '4px',
          backgroundColor: horarioDisponible && fechaValida ? '#d4edda' : '#f8d7da',
          color: horarioDisponible && fechaValida ? '#155724' : '#721c24',
          border: `1px solid ${horarioDisponible && fechaValida ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {!fechaValida ? 
            `No se pueden hacer reservas para fechas pasadas` :
            horarioDisponible ? 
              `Horario disponible: ${horario} en cancha ${cancha}` : 
              `Horario ocupado: ${horario} en cancha ${cancha}`
          }
        </div>
      )}
    </form>
  );
} 