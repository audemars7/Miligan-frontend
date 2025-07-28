import React, { useState } from "react";
import ClientesList from "./components/clientes/ClientesList";
import ClienteForm from "./components/clientes/ClienteForm";
import ReservasList from "./components/reservas/ReservasList";
import ReservaForm from "./components/reservas/ReservaForm";
import ProductosList from "./components/productos/ProductosList";
import ProductoForm from "./components/productos/ProductoForm";
import CompraForm from "./components/compras/CompraForm";
import ComprasList from "./components/compras/ComprasList";
import LoginForm from "./components/auth/LoginForm";
import { getCurrentDate } from "./utils/dateUtils";

function App() {
  const [reload, setReload] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [reservaEditar, setReservaEditar] = useState(null);
  const [productoEditar, setProductoEditar] = useState(null);
  const [autenticado, setAutenticado] = useState(!!localStorage.getItem("token"));
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [mostrarDeudas, setMostrarDeudas] = useState(false);

  const triggerReload = () => setReload(r => !r);

  const mostrarMensaje = (msg, tipo = "success") => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAutenticado(false);
  };

  if (!autenticado) {
    return <LoginForm onLogin={() => setAutenticado(true)} />;
  }

  return (
    <div>
      {/* Sección superior con fondo de tennis */}
      <div className="tennis-header">
        <div className="tennis-header-content">
          <button 
            onClick={handleLogout} 
            style={{ float: "right", marginBottom: "1rem" }}
          >
            Cerrar sesión
          </button>
          
          <h1 className="academy-title">MILIGAN ACADEMY</h1>
          
          <h2>Gestión de Clientes</h2>
        {mensaje && (
          <div className={`p-4 rounded-lg mb-4 ${tipoMensaje === "error" ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"}`}>
            {mensaje}
          </div>
        )}
        <ClienteForm
          onClienteCreado={() => { triggerReload(); mostrarMensaje("Cliente agregado correctamente"); }}
          clienteEditar={clienteEditar}
          onEdicionFinalizada={() => { setClienteEditar(null); triggerReload(); mostrarMensaje("Edición finalizada"); }}
          mostrarMensaje={mostrarMensaje}
        />
        <button 
          onClick={() => setMostrarClientes(v => !v)} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 mb-4"
        >
          {mostrarClientes ? "Ocultar Clientes" : "Mostrar Clientes"}
        </button>
        </div>
      </div>
      
      {/* Resto del contenido con fondo normal */}
      <div style={{ 
        padding: "2rem",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        margin: "20px 20px 20px 20px",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "4px solid #2c5f2d"
      }}>
        {mostrarClientes && (
          <>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Clientes</h2>
            <ClientesList
              reload={reload}
              onEditar={setClienteEditar}
              onReload={triggerReload}
              mostrarMensaje={mostrarMensaje}
            />
          </>
        )}
        {/* Grid de dos columnas: Gestión de Reservas (65%) + Gestión de Productos (32%) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '65% 32%',
          gap: '30px',
          marginTop: '20px'
        }}>
          {/* Columna 1: Gestión de Reservas (60%) */}
          <div>
            <h2>Gestión de Reservas</h2>
            {/* Crear Nueva Reserva */}
            <div style={{
              border: '1px solid #2c5f2d',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              boxShadow: '0 2px 8px rgba(44, 95, 45, 0.1)',
              marginTop: '20px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#2c5f2d', fontSize: '1rem', fontWeight: 'bold' }}>
                Crear Nueva Reserva
              </h3>
              <div style={{ fontSize: '0.85rem' }} className="compact-form">
                <ReservaForm
                  reload={reload}
                  onReservaGuardada={() => { triggerReload(); mostrarMensaje("Reserva guardada correctamente"); }}
                  reservaEditar={reservaEditar}
                  onEdicionFinalizada={() => { setReservaEditar(null); triggerReload(); mostrarMensaje("Edición de reserva finalizada"); }}
                  mostrarMensaje={mostrarMensaje}
                />
              </div>
            </div>

            {/* Reservas Existentes */}
            <div style={{
              border: '2px solid #2c5f2d',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              boxShadow: '0 4px 12px rgba(44, 95, 45, 0.15)',
              marginTop: '20px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#2c5f2d', fontSize: '1.2rem' }}>
                Reservas Existentes
              </h3>
              <div style={{ fontSize: '0.85rem' }} className="compact-form">
                <ReservasList
                  reload={reload}
                  onEditar={setReservaEditar}
                  onReload={triggerReload}
                  mostrarMensaje={mostrarMensaje}
                  fechaActual={getCurrentDate()}
                />
              </div>
            </div>
          </div>

          {/* Columna 2: Gestión de Productos (40%) */}
          <div>
            <h2>Gestión de Productos</h2>
            {/* Crear Producto */}
            <div style={{
              border: '1px solid #2c5f2d',
              borderRadius: '6px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              boxShadow: '0 1px 4px rgba(44, 95, 45, 0.08)',
              marginTop: '15px'
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#2c5f2d', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Crear Producto
              </h3>
              <div style={{ fontSize: '0.75rem' }} className="compact-form">
                <ProductoForm
                  productoEditar={productoEditar}
                  onProductoGuardado={() => { 
                    setProductoEditar(null); 
                    triggerReload(); 
                    mostrarMensaje(productoEditar ? "Producto actualizado correctamente" : "Producto agregado correctamente"); 
                  }}
                  mostrarMensaje={mostrarMensaje}
                />
              </div>
            </div>

            {/* Lista de Productos */}
            <div style={{
              border: '1px solid #2c5f2d',
              borderRadius: '6px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              boxShadow: '0 1px 4px rgba(44, 95, 45, 0.08)',
              marginTop: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: '0', color: '#2c5f2d', fontSize: '0.85rem' }}>
                  Productos Existentes
                </h3>
                <button 
                  onClick={() => setMostrarProductos(v => !v)}
                  style={{
                    backgroundColor: '#2c5f2d',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  {mostrarProductos ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {mostrarProductos && (
                <div style={{ fontSize: '0.75rem' }} className="compact-form">
                  <ProductosList
                    reload={reload}
                    onEditar={setProductoEditar}
                    onReload={triggerReload}
                    mostrarMensaje={mostrarMensaje}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Grid de dos columnas: Registro de Compras (50%) + Deudas Pendientes (50%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        gap: '10px',
        marginTop: '30px'
      }}>
        {/* Columna 1: Registro de Compras (50%) */}
        <div>
          <div style={{
            border: '2px solid #2c5f2d',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            boxShadow: '0 4px 12px rgba(44, 95, 45, 0.15)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#2c5f2d', fontSize: '1.4rem', fontWeight: 'bold' }}>
              Registro de Compras
            </h2>
            <CompraForm
              onCompraRegistrada={() => {
                triggerReload();
                mostrarMensaje("Compra registrada correctamente");
              }}
              mostrarMensaje={mostrarMensaje}
              reload={reload}
            />
          </div>
        </div>

        {/* Columna 2: Deudas Pendientes (50%) */}
        <div>
          <div style={{
            border: '2px solid #2c5f2d',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            boxShadow: '0 4px 12px rgba(44, 95, 45, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: '0', color: '#2c5f2d', fontSize: '1.4rem', fontWeight: 'bold' }}>
                Deudas Pendientes
              </h2>
              <button 
                onClick={() => setMostrarDeudas(v => !v)}
                style={{
                  backgroundColor: '#2c5f2d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {mostrarDeudas ? "Ocultar Deudas" : "Mostrar Deudas"}
              </button>
            </div>
            {mostrarDeudas && (
              <ComprasList
                reload={reload}
                mostrarMensaje={mostrarMensaje}
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
