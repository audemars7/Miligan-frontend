import React, { useEffect, useState } from "react";
import { getReservas, eliminarReserva } from "../../api/reservas";

export default function ReservasList(
  
  { reload, onEditar, onReload, mostrarMensaje }) {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    getReservas().then(data => setReservas(Array.isArray(data) ? data : []));
  }, [reload]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta reserva?")) {
      const res = await eliminarReserva(id);
      if (res.mensaje && mostrarMensaje) mostrarMensaje(res.mensaje, res.mensaje.includes("eliminada") ? "success" : "error");
      if (onReload) onReload();
    }
  };

  return (
    <div>
      <h2>Reservas</h2>
      <ul>
        {(reservas || []).map(reserva => (
          <li key={reserva.id}>
            {reserva.nombre} - {reserva.cancha} - {reserva.horario} - {reserva.fecha}
            <button onClick={() => onEditar(reserva)} style={{marginLeft: 8}}>Editar</button>
            <button onClick={() => handleEliminar(reserva.id)} style={{marginLeft: 8, color: 'red'}}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 