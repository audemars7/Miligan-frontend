import React, { useEffect, useState } from "react";
import { getComprasDeuda, marcarCompraPagada } from "../../api/compras";

export default function ComprasList({ reload, mostrarMensaje }) {
  const [compras, setCompras] = useState([]);
  const [comprasAgrupadas, setComprasAgrupadas] = useState({});

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const data = await getComprasDeuda();
        const comprasArray = Array.isArray(data) ? data : [];
        setCompras(comprasArray);
        agruparComprasPorCliente(comprasArray);
      } catch (error) {
        console.error("Error al cargar compras:", error);
        setCompras([]);
        setComprasAgrupadas({});
      }
    };
    fetchCompras();
  }, [reload]);

  const agruparComprasPorCliente = (comprasArray) => {
    const agrupadas = {};
    
    comprasArray.forEach(compra => {
      const clienteKey = compra.cliente_id || 'sin_cliente';
      const nombreCliente = compra.nombre_cliente || 'Cliente desconocido';
      
      if (!agrupadas[clienteKey]) {
        agrupadas[clienteKey] = {
          nombre: nombreCliente,
          compras: [],
          total: 0
        };
      }
      
      agrupadas[clienteKey].compras.push(compra);
      agrupadas[clienteKey].total += compra.total;
    });

    setComprasAgrupadas(agrupadas);
  };

  const marcarComoPagado = async (compraId, nombreCliente, producto, total) => {
    if (window.confirm(`¿Marcar como pagada la compra de ${producto} por S/ ${total.toFixed(2)} de ${nombreCliente}?`)) {
      try {
        const resultado = await marcarCompraPagada(compraId);
        if (mostrarMensaje) {
          mostrarMensaje(resultado.mensaje || "Compra marcada como pagada", "success");
        }
        // Recargar las compras
        const data = await getComprasDeuda();
        const comprasArray = Array.isArray(data) ? data : [];
        setCompras(comprasArray);
        agruparComprasPorCliente(comprasArray);
      } catch (error) {
        if (mostrarMensaje) {
          mostrarMensaje("Error al marcar como pagada", "error");
        }
      }
    }
  };

  const calcularTotalGeneral = () => {
    return Object.values(comprasAgrupadas).reduce((total, grupo) => total + grupo.total, 0);
  };

  return (
    <div style={{ fontSize: '0.8rem' }}>
      <h2 style={{ fontSize: '1rem', margin: '0 0 15px 0', fontWeight: 'bold' }}>Deudas Pendientes</h2>
      
      {Object.keys(comprasAgrupadas).length === 0 ? (
        <p style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', padding: '20px' }}>No hay deudas pendientes</p>
      ) : (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '15px',
            padding: '8px 12px',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
              <span style={{ color: '#dc3545' }}>Total adeudado:</span> S/ {calcularTotalGeneral().toFixed(2)}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
              <span style={{ color: '#2c5f2d' }}>Clientes:</span> {Object.keys(comprasAgrupadas).length}
            </div>
          </div>
          
          {Object.entries(comprasAgrupadas).map(([clienteId, grupo]) => (
            <div key={clienteId} style={{
              marginBottom: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#2c5f2d',
                color: 'white',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{grupo.nombre}</span>
                <span>Debe: S/ {grupo.total.toFixed(2)}</span>
              </div>
              
              <div style={{ padding: '12px' }}>
                <div style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ padding: '6px 4px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Fecha</th>
                        <th style={{ padding: '6px 4px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Producto</th>
                        <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Cant.</th>
                        <th style={{ padding: '6px 4px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>P. Unit.</th>
                        <th style={{ padding: '6px 4px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Total</th>
                        <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grupo.compras.map(compra => (
                        <tr key={compra.id}>
                          <td style={{ padding: '4px', borderBottom: '1px solid #eee', fontSize: '0.65rem' }}>
                            {compra.fecha}
                          </td>
                          <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>
                            {compra.producto}
                          </td>
                          <td style={{ padding: '4px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                            {compra.cantidad}
                          </td>
                          <td style={{ padding: '4px', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                            S/ {compra.precio_unitario.toFixed(2)}
                          </td>
                          <td style={{ padding: '4px', textAlign: 'right', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                            S/ {compra.total.toFixed(2)}
                          </td>
                          <td style={{ padding: '4px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                            <button
                              onClick={() => marcarComoPagado(compra.id, grupo.nombre, compra.producto, compra.total)}
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.6rem',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#218838'}
                              onMouseLeave={(e) => e.target.style.background = '#28a745'}
                            >
                              Pagado
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
                  background: '#fff3cd',
                  borderRadius: '4px',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  border: '1px solid #ffeaa7'
                }}>
                  Subtotal cliente: S/ {grupo.total.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 