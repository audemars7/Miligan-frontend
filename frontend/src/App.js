import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "./components/layout/Navigation";
import Dashboard from "./pages/Dashboard";
import ClientesPage from "./pages/ClientesPage";
import ReservasPage from "./pages/ReservasPage";
import LoginForm from "./components/auth/LoginForm";

// Crear instancia de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [autenticado, setAutenticado] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAutenticado(false);
  };

  const handleLogin = () => {
    setAutenticado(true);
  };

  // Estilos globales para la aplicación
  const appStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  if (!autenticado) {
    return (
      <QueryClientProvider client={queryClient}>
        <div style={appStyle}>
          <LoginForm onLogin={handleLogin} />
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={appStyle}>
          <Navigation onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
