import React, { useState } from "react";
import ClientesList from "./components/clientes/ClientesList";
import ClienteForm from "./components/clientes/ClienteForm";
import ReservasList from "./components/reservas/ReservasList";
import ReservaForm from "./components/reservas/ReservaForm";
import LoginForm from "./components/auth/LoginForm";

function App() {
  const [reload, setReload] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [reloadReservas, setReloadReservas] = useState(false);
  const [reservaEditar, setReservaEditar] = useState(null);
  const [autenticado, setAutenticado] = useState(!!localStorage.getItem("token"));

  const handleClienteCreado = () => {
    setReload(!reload);
  };

  const handleEdicionFinalizada = () => {
    setClienteEditar(null);
    setReload(!reload);
  };

  const handleReservaGuardada = () => {
    setReloadReservas(!reloadReservas);
  };

  const handleEdicionReservaFinalizada = () => {
    setReservaEditar(null);
    setReloadReservas(!reloadReservas);
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
      <ClienteForm
        onClienteCreado={handleClienteCreado}
        clienteEditar={clienteEditar}
        onEdicionFinalizada={handleEdicionFinalizada}
      />
      <ClientesList
        key={reload}
        onEditar={setClienteEditar}
      />

      <h1>Gestión de Reservas</h1>
      <ReservaForm
        onReservaGuardada={handleReservaGuardada}
        reservaEditar={reservaEditar}
        onEdicionFinalizada={handleEdicionReservaFinalizada}
      />
      <ReservasList
        key={reloadReservas}
        onEditar={setReservaEditar}
      />
    </div>
  );
}

export default App;
