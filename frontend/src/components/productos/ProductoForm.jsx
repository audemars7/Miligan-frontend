import React, { useState, useEffect } from "react";
import { crearProducto, actualizarProducto } from "../../api/productos";

export default function ProductoForm({ productoEditar, onProductoGuardado, mostrarMensaje }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre);
      setPrecio(productoEditar.precio.toString());
      setStock(productoEditar.stock.toString());
      setEditando(true);
    } else {
      setNombre("");
      setPrecio("");
      setStock("");
      setEditando(false);
    }
  }, [productoEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !precio || !stock) {
      if (mostrarMensaje) mostrarMensaje("Todos los campos son obligatorios", "error");
      return;
    }

    const precioNumerico = parseFloat(precio);
    const stockNumerico = parseInt(stock);

    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      if (mostrarMensaje) mostrarMensaje("El precio debe ser un número mayor a 0", "error");
      return;
    }

    if (isNaN(stockNumerico) || stockNumerico < 0) {
      if (mostrarMensaje) mostrarMensaje("El stock debe ser un número mayor o igual a 0", "error");
      return;
    }

    const producto = {
      nombre: nombre.trim(),
      precio: precioNumerico,
      stock: stockNumerico
    };

    try {
      let resultado;
      if (editando) {
        resultado = await actualizarProducto(productoEditar.id, producto);
      } else {
        resultado = await crearProducto(producto);
      }

      if (resultado.mensaje) {
        if (mostrarMensaje) mostrarMensaje(resultado.mensaje, "success");
        if (onProductoGuardado) onProductoGuardado();
        
        // Limpiar formulario solo si no estamos editando
        if (!editando) {
          setNombre("");
          setPrecio("");
          setStock("");
        }
      }
    } catch (error) {
      if (mostrarMensaje) mostrarMensaje("Error de red", "error");
    }
  };

  const handleCancelar = () => {
    setNombre("");
    setPrecio("");
    setStock("");
    setEditando(false);
    if (onProductoGuardado) onProductoGuardado();
  };

  return (
    <div>
      <h2>{editando ? "Editar Producto" : "Agregar Producto"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="nombre" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Nombre del producto:</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: GRIPS WILSON"
            style={{ width: "85%", padding: '4px 6px', fontSize: '0.8rem', marginBottom: '6px' }}
          />
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="precio" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Precio (S/):</label>
          <input
            id="precio"
            type="number"
            step="0.01"
            min="0"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="12.00"
            style={{ width: "60%", padding: '4px 6px', fontSize: '0.8rem', marginBottom: '6px' }}
          />
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="stock" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Stock inicial:</label>
          <input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="50"
            style={{ width: "50%", padding: '4px 6px', fontSize: '0.8rem', marginBottom: '6px' }}
          />
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <button type="submit" style={{ marginRight: '8px', padding: "6px 12px", fontSize: '0.8rem' }}>
            {editando ? "Actualizar" : "Agregar"} Producto
          </button>
          
          {editando && (
            <button type="button" onClick={handleCancelar} style={{ padding: "6px 12px", fontSize: '0.8rem' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 