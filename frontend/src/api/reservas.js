import { API_URL, JWT_TOKEN } from '../config';

export async function getReservas() {
  const res = await fetch(`${API_URL}/reservas`, {
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`
    }
  });
  return res.json();
}

export async function crearReserva(data) {
  const res = await fetch(`${API_URL}/reservar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function actualizarReserva(id, data) {
  const res = await fetch(`${API_URL}/admin/reservas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function eliminarReserva(id) {
  const res = await fetch(`${API_URL}/admin/reservas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`
    }
  });
  return res.json();
} 