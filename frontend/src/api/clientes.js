import { API_URL } from '../config';

export async function getClientes() {
  const token = localStorage.getItem("token");
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/clientes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function crearCliente(data) {
  const token = localStorage.getItem("token");
  if (!token) return { mensaje: "No autenticado" };
  try {
    const res = await fetch(`${API_URL}/clientes`, {
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

export async function actualizarCliente(id, data) {
  const token = localStorage.getItem("token");
  if (!token) return { mensaje: "No autenticado" };
  try {
    const res = await fetch(`${API_URL}/clientes/${id}`, {
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

export async function eliminarCliente(id) {
  const token = localStorage.getItem("token");
  if (!token) return { mensaje: "No autenticado" };
  try {
    const res = await fetch(`${API_URL}/clientes/${id}`, {
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