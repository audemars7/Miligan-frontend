import { API_URL } from "../config";

export async function getCompras() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/compras`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function getComprasDeuda() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/compras/deuda`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function registrarCompra(compra) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/compras`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(compra),
  });
  return response.json();
}

export async function marcarCompraPagada(compraId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/compras/${compraId}/pagar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
} 