import React, { useEffect, useState } from "react";
import { getReservas, eliminarReserva } from "../../api/reservas";

export default function ReservasList({ onEditar }) {
  const [reservas, setReservas] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    getReservas().then(setReservas);
  }, [reload]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta reserva?")) {
      await eliminarReserva(id);
      setReload(!reload);
    }
  };

  return (
    <div>
      <h2>Reservas</h2>
      <ul>
        {reservas.map(reserva => (
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