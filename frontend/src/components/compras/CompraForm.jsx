import React, { useState, useEffect } from "react";
import { registrarCompra } from "../../api/compras";
import { fetchClientes } from "../../api/clientes";
import { getProductos } from "../../api/productos";
import { getCurrentDate } from "../../utils/dateUtils";

export default function CompraForm({ onCompraRegistrada, mostrarMensaje, reload }) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");

  useEffect(() => {
    cargarDatos();
  }, [reload]);

  const cargarDatos = async () => {
    try {
      const [clientesData, productosData] = await Promise.all([
        fetchClientes(),
        getProductos()
      ]);
      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const clientesFiltrados = clientes.filter(cliente => 
    `${cliente.nombre} ${cliente.apellido || ''}`.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  const agregarProducto = (producto) => {
    const productoExistente = productosSeleccionados.find(p => p.id === producto.id);
    
    if (productoExistente) {
      setProductosSeleccionados(prev => 
        prev.map(p => 
          p.id === producto.id 
            ? { ...p, cantidad: p.cantidad + 1, subtotal: (p.cantidad + 1) * p.precio }
            : p
        )
      );
    } else {
      setProductosSeleccionados(prev => [...prev, {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        subtotal: producto.precio
      }]);
    }
  };

  const cambiarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(productoId);
      return;
    }

    setProductosSeleccionados(prev => 
      prev.map(p => 
        p.id === productoId 
          ? { ...p, cantidad: nuevaCantidad, subtotal: nuevaCantidad * p.precio }
          : p
      )
    );
  };

  const eliminarProducto = (productoId) => {
    setProductosSeleccionados(prev => prev.filter(p => p.id !== productoId));
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, producto) => total + producto.subtotal, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!clienteSeleccionado) {
      if (mostrarMensaje) mostrarMensaje("Debe seleccionar un cliente", "error");
      return;
    }

    if (productosSeleccionados.length === 0) {
      if (mostrarMensaje) mostrarMensaje("Debe agregar al menos un producto", "error");
      return;
    }

    const cliente = clientes.find(c => c.id === parseInt(clienteSeleccionado));
    const fecha = getCurrentDate();

    try {
      // Registrar cada producto como una compra separada (según estructura actual del backend)
      for (const producto of productosSeleccionados) {
        const compra = {
          cliente_id: cliente.id,
          nombre_cliente: `${cliente.nombre} ${cliente.apellido || ''}`.trim(),
          producto: producto.nombre,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio,
          total: producto.subtotal,
          fecha: fecha
        };

        await registrarCompra(compra);
      }

      if (mostrarMensaje) {
        mostrarMensaje(`Compra registrada correctamente para ${cliente.nombre}`, "success");
      }
      
      if (onCompraRegistrada) onCompraRegistrada();
      
      // Limpiar formulario
      setClienteSeleccionado("");
      setProductosSeleccionados([]);
      setBusquedaCliente("");
      
    } catch (error) {
      if (mostrarMensaje) mostrarMensaje("Error al registrar compra", "error");
    }
  };

  return (
    <div style={{ fontSize: '0.8rem' }}>
      <h2 style={{ fontSize: '1rem', margin: '0 0 15px 0', fontWeight: 'bold' }}>Registrar Compra</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Búsqueda y selección de cliente */}
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.85rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>1. Seleccionar Cliente</h3>
          <input
            type="text"
            placeholder="Escribir nombre del cliente..."
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
            style={{
              width: '70%',
              maxWidth: '250px',
              padding: '6px 8px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          
          {/* Lista de clientes filtrados */}
          {busquedaCliente.length > 0 && clientesFiltrados.length > 0 && (
            <div style={{ 
              marginTop: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '6px 8px', background: '#f5f5f5' }}>
                Clientes encontrados:
              </div>
              {clientesFiltrados.map(cliente => (
                <button
                  key={cliente.id}
                  type="button"
                  onClick={() => {
                    setClienteSeleccionado(cliente.id.toString());
                    setBusquedaCliente(`${cliente.nombre} ${cliente.apellido || ''}`);
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: '0.7rem',
                    border: 'none',
                    background: 'white',
                    color: 'black',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f0f0f0';
                    e.target.style.color = 'black';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = 'black';
                  }}
                >
                  {cliente.nombre} {cliente.apellido || ''} - {cliente.telefono}
                </button>
              ))}
            </div>
          )}
          
          {/* Cliente seleccionado */}
          {clienteSeleccionado && (
            <div style={{
              marginTop: '8px',
              padding: '6px 8px',
              background: '#e8f5e8',
              borderRadius: '4px',
              fontSize: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span><strong>Cliente:</strong> {busquedaCliente}</span>
              <button
                type="button"
                onClick={() => {
                  setClienteSeleccionado("");
                  setBusquedaCliente("");
                }}
                style={{
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Cambiar
              </button>
            </div>
          )}
        </div>

        {/* Selección de productos */}
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.85rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>2. Agregar Productos</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '6px'
          }}>
            {productos.map(producto => (
              <button
                key={producto.id}
                type="button"
                onClick={() => agregarProducto(producto)}
                style={{
                  padding: '8px 6px',
                  fontSize: '0.65rem',
                  border: '1px solid #2c5f2d',
                  borderRadius: '6px',
                  background: '#2c5f2d',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#3d7540';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#2c5f2d';
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{producto.nombre}</div>
                <div style={{ marginBottom: '1px' }}>S/ {producto.precio.toFixed(2)}</div>
                <div style={{ opacity: '0.9' }}>Stock: {producto.stock}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Productos seleccionados */}
        {productosSeleccionados.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.85rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>3. Productos Seleccionados</h3>
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '6px 4px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Producto</th>
                    <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Precio</th>
                    <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Cant.</th>
                    <th style={{ padding: '6px 4px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Subtotal</th>
                    <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>-</th>
                  </tr>
                </thead>
                <tbody>
                  {productosSeleccionados.map(producto => (
                    <tr key={producto.id}>
                      <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{producto.nombre}</td>
                      <td style={{ padding: '4px', textAlign: 'center', borderBottom: '1px solid #eee' }}>S/ {producto.precio.toFixed(2)}</td>
                      <td style={{ padding: '4px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                        <input
                          type="number"
                          min="1"
                          value={producto.cantidad}
                          onChange={(e) => cambiarCantidad(producto.id, parseInt(e.target.value))}
                          style={{
                            width: '40px',
                            padding: '2px 4px',
                            fontSize: '0.7rem',
                            textAlign: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '3px'
                          }}
                        />
                      </td>
                      <td style={{ padding: '4px', textAlign: 'right', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                        S/ {producto.subtotal.toFixed(2)}
                      </td>
                      <td style={{ padding: '4px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                        <button
                          type="button"
                          onClick={() => eliminarProducto(producto.id)}
                          style={{
                            padding: '2px 6px',
                            fontSize: '0.6rem',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{
              marginTop: '8px',
              padding: '6px 8px',
              background: '#e8f5e8',
              borderRadius: '4px',
              textAlign: 'right',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              Total: S/ {calcularTotal().toFixed(2)}
            </div>
          </div>
        )}

        {/* Botón de envío */}
        <button 
          type="submit" 
          disabled={!clienteSeleccionado || productosSeleccionados.length === 0}
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            background: (!clienteSeleccionado || productosSeleccionados.length === 0) ? '#ccc' : '#2c5f2d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: (!clienteSeleccionado || productosSeleccionados.length === 0) ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
          onMouseEnter={(e) => {
            if (!e.target.disabled) {
              e.target.style.background = '#3d7540';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.target.disabled) {
              e.target.style.background = '#2c5f2d';
            }
          }}
        >
          Registrar Compra (Total: S/ {calcularTotal().toFixed(2)})
        </button>
      </form>
    </div>
  );
} 