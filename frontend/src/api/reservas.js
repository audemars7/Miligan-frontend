import { API_URL } from '../config';

export async function getReservas() {
  const token = localStorage.getItem("token");
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/reservas`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function crearReserva(data) {
  const token = localStorage.getItem("token");
  if (!token) return { mensaje: "No autenticado" };
  try {
    const res = await fetch(`${API_URL}/reservar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return { mensaje: "Error de red" };
  }
}

export async function actualizarReserva(id, data) {
  const token = localStorage.getItem("token");
  if (!token) return { mensaje: "No autenticado" };
  try {
    const res = await fetch(`${API_URL}/admin/reservas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return { mensaje: "Error de red" };
  }
}

export async function eliminarReserva(id) {
  const token = localStorage.getItem("token");
  if (!token) return { mensaje: "No autenticado" };
  try {
    const res = await fetch(`${API_URL}/admin/reservas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return await res.json();
  } catch {
    return { mensaje: "Error de red" };
  }
} 