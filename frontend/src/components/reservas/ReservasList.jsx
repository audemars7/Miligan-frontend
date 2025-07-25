import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

export default function ReservasList({ reload, onEditar, onReload, mostrarMensaje }) {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/reservas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setReservas(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        setReservas([]);
      }
    };
    fetchReservas();
  }, [reload]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta reserva?")) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/admin/reservas/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (mostrarMensaje) mostrarMensaje(data.mensaje || "Reserva eliminada", "success");
        if (onReload) onReload();
      } catch (error) {
        if (mostrarMensaje) mostrarMensaje("Error de red", "error");
      }
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