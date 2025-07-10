import { API_URL } from '../config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch clientes
export async function fetchClientes() {
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

export function useClientesQuery() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes
  });
}

// Crear cliente
export async function crearClienteAPI(data) {
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

export function useCrearClienteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearClienteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
    }
  });
}

// Actualizar cliente
export async function actualizarClienteAPI(id, data) {
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

export function useActualizarClienteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => actualizarClienteAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
    }
  });
}

// Eliminar cliente
export async function eliminarClienteAPI(id) {
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

export function useEliminarClienteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarClienteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
    }
  });
} 