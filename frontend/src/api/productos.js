import { API_URL } from "../config";

export async function getProductos() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/productos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function crearProducto(producto) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });
  return response.json();
}

export async function actualizarProducto(id, producto) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });
  return response.json();
}

export async function eliminarProducto(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
} 