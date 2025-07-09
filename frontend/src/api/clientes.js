import { API_URL, JWT_TOKEN } from '../config';

export async function getClientes() {
  const res = await fetch(`${API_URL}/clientes`, {
    headers: { Authorization: `Bearer ${JWT_TOKEN}` }
  });
  return res.json();
}

export async function crearCliente(data) {
  const res = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function actualizarCliente(id, data) {
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function eliminarCliente(id) {
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`
    }
  });
  return res.json();
} 