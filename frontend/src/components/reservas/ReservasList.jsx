import React from "react";
import { useReservasQuery, useEliminarReservaMutation } from "../../api/reservas";

export default function ReservasList({ onEditar, mostrarMensaje }) {
  const { data: reservas = [], isLoading, isError } = useReservasQuery();
  const eliminarReservaMutation = useEliminarReservaMutation();

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta reserva?")) {
      eliminarReservaMutation.mutate(id, {
        onSuccess: (res) => {
          if (res.mensaje && mostrarMensaje) mostrarMensaje(res.mensaje, res.mensaje.includes("eliminada") ? "success" : "error");
        }
      });
    }
  };

  if (isLoading) return <div>Cargando reservas...</div>;
  if (isError) return <div style={{ color: "red" }}>Error al cargar reservas</div>;

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