import React, { useState } from "react";
import { API_URL } from "../../config";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log("Intentando conectar a:", `${API_URL}/login`);
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        if (onLogin) onLogin();
      } else {
        setError(data.mensaje || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error detallado:", err);
      setError("Error de conexión con el servidor");
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(74, 124, 89, 0.3) 0%, rgba(62, 107, 71, 0.3) 100%), url('https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit} style={{ 
        maxWidth: 250, 
        padding: 20, 
        border: "1px solid rgba(255, 255, 255, 0.3)", 
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)"
      }}>
      <h2 style={{ textAlign: "center", margin: "0 10px 20px 10px", fontSize: "1.2rem" }}>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={{ width: "95%", padding: "10px", marginBottom: 10, fontSize: "0.9rem", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: "95%", padding: "10px", marginBottom: 15, fontSize: "0.9rem", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
      />
      <button type="submit" disabled={loading} style={{ 
        width: "95%", 
        padding: "10px", 
        fontSize: "0.9rem", 
        backgroundColor: "#2c5f2d", 
        color: "white", 
        border: "none", 
        borderRadius: "4px", 
        cursor: loading ? "not-allowed" : "pointer",
        boxSizing: "border-box",
        marginTop: "5px"
      }}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
    </form>
    </div>
  );
} 