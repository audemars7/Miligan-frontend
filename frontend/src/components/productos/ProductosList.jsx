import React, { useEffect, useState } from "react";
import { getProductos, eliminarProducto } from "../../api/productos";

export default function ProductosList({ reload, onEditar, onReload, mostrarMensaje }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        const productosArray = Array.isArray(data) ? data : [];
        setProductos(productosArray);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProductos([]);
      }
    };
    fetchProductos();
  }, [reload]);

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar el producto "${nombre}"?`)) {
      try {
        const resultado = await eliminarProducto(id);
        if (mostrarMensaje) mostrarMensaje(resultado.mensaje || "Producto eliminado", "success");
        if (onReload) onReload();
      } catch (error) {
        if (mostrarMensaje) mostrarMensaje("Error de red", "error");
      }
    }
  };

  return (
    <div>
      <h2>Lista de Productos</h2>
      
      {productos.length === 0 ? (
        <p>No hay productos registrados</p>
      ) : (
        <div>
          <p><strong>Total de productos:</strong> {productos.length}</p>
          
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Producto</th>
                <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>Precio</th>
                <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>Stock</th>
                <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id}>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    {producto.nombre}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>
                    S/ {parseFloat(producto.precio).toFixed(2)}
                  </td>
                  <td style={{ 
                    border: "1px solid #ddd", 
                    padding: 8, 
                    textAlign: "right",
                    color: producto.stock <= 5 ? "red" : "black",
                    fontWeight: producto.stock <= 5 ? "bold" : "normal"
                  }}>
                    {producto.stock}
                    {producto.stock <= 5 && " ⚠️"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
                    <button 
                      onClick={() => onEditar(producto)} 
                      style={{ marginRight: 8, padding: "4px 8px" }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleEliminar(producto.id, producto.nombre)}
                      style={{ padding: "4px 8px", color: "red" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: 15, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5 }}>
            <p><strong>Resumen:</strong></p>
            <p>• Productos con stock bajo (≤5): {productos.filter(p => p.stock <= 5).length}</p>
            <p>• Valor total del inventario: S/ {productos.reduce((total, p) => total + (p.precio * p.stock), 0).toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
} 