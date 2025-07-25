import React, { useState } from "react";
import ClientesList from "./components/clientes/ClientesList";
import ClienteForm from "./components/clientes/ClienteForm";
import ReservasList from "./components/reservas/ReservasList";
import ReservaForm from "./components/reservas/ReservaForm";
import LoginForm from "./components/auth/LoginForm";

function App() {
  const [reload, setReload] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [reservaEditar, setReservaEditar] = useState(null);
  const [autenticado, setAutenticado] = useState(!!localStorage.getItem("token"));
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [mostrarClientes, setMostrarClientes] = useState(false);

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
      <button onClick={handleLogout} style={{ float: "right", margin: 10 }}>Cerrar sesión</button>
      <h1>Gestión de Clientes</h1>
      {mensaje && (
        <div style={{ color: tipoMensaje === "error" ? "red" : "green", marginBottom: 10 }}>{mensaje}</div>
      )}
      <ClienteForm
        onClienteCreado={() => { triggerReload(); mostrarMensaje("Cliente agregado correctamente"); }}
        clienteEditar={clienteEditar}
        onEdicionFinalizada={() => { setClienteEditar(null); triggerReload(); mostrarMensaje("Edición finalizada"); }}
        mostrarMensaje={mostrarMensaje}
      />
      <button onClick={() => setMostrarClientes(v => !v)} style={{ marginBottom: 10 }}>
        {mostrarClientes ? "Ocultar Clientes" : "Mostrar Clientes"}
      </button>
      {mostrarClientes && (
        <ClientesList
          reload={reload}
          onEditar={setClienteEditar}
          onReload={triggerReload}
          mostrarMensaje={mostrarMensaje}
        />
      )}

      <h1>Gestión de Reservas</h1>
      <ReservaForm
        onReservaGuardada={() => { triggerReload(); mostrarMensaje("Reserva guardada correctamente"); }}
        reservaEditar={reservaEditar}
        onEdicionFinalizada={() => { setReservaEditar(null); triggerReload(); mostrarMensaje("Edición de reserva finalizada"); }}
        mostrarMensaje={mostrarMensaje}
      />
      <ReservasList
        reload={reload}
        onEditar={setReservaEditar}
        onReload={triggerReload}
        mostrarMensaje={mostrarMensaje}
      />
    </div>
  );
}

export default App; 