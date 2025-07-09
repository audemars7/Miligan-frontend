import React, { useState } from "react";
import ClientesList from "./components/clientes/ClientesList";
import ClienteForm from "./components/clientes/ClienteForm";
import ReservasList from "./components/reservas/ReservasList";
import ReservaForm from "./components/reservas/ReservaForm";

function App() {
  const [reload, setReload] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [reloadReservas, setReloadReservas] = useState(false);
  const [reservaEditar, setReservaEditar] = useState(null);

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

  return (
    <div>
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
