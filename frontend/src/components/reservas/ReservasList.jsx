import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { formatDate, getDateStatus, getCurrentDate, getMillisecondsUntilMidnight } from "../../utils/dateUtils";

export default function ReservasList({ reload, onEditar, onReload, mostrarMensaje, fechaActual }) {
  const [reservas, setReservas] = useState([]);
  const [reservasAgrupadas, setReservasAgrupadas] = useState({});
  const [fechasOrdenadas, setFechasOrdenadas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  // Timer para actualización automática a medianoche
  useEffect(() => {
    // Auto-seleccionar fecha actual al cargar
    setFechaSeleccionada(getCurrentDate());

    // Configurar timer para medianoche
    const configurarTimerMedianoche = () => {
      const msHastaMedianoche = getMillisecondsUntilMidnight();
      
      const timerId = setTimeout(() => {
        // Actualizar a la nueva fecha actual
        setFechaSeleccionada(getCurrentDate());
        
        // Configurar el siguiente timer (24 horas después)
        configurarTimerMedianoche();
      }, msHastaMedianoche);

      return timerId;
    };

    const timerId = configurarTimerMedianoche();
    
    // Cleanup del timer cuando el componente se desmonte
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    const fetchReservas = async () => {
      console.log("🔄 Fetching reservas... reload:", reload);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/reservas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const reservasArray = Array.isArray(data) ? data : [];
          console.log("📊 Reservas cargadas:", reservasArray);
          setReservas(reservasArray);
          agruparReservasPorFecha(reservasArray);
        }
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        setReservas([]);
        setReservasAgrupadas({});
        setFechasOrdenadas([]);
      }
    };
    fetchReservas();
  }, [reload]);

  const agruparReservasPorFecha = (reservasArray) => {
    console.log("📅 Agrupando reservas por fecha:", reservasArray);
    const agrupadas = {};
    
    reservasArray.forEach(reserva => {
      const fecha = reserva.fecha;
      if (!agrupadas[fecha]) {
        agrupadas[fecha] = [];
      }
      agrupadas[fecha].push(reserva);
    });

    // Ordenar reservas dentro de cada fecha por horario
    Object.keys(agrupadas).forEach(fecha => {
      agrupadas[fecha].sort((a, b) => a.horario.localeCompare(b.horario));
    });

    console.log("📊 Reservas agrupadas:", agrupadas);
    setReservasAgrupadas(agrupadas);
    
    // Ordenar fechas (más recientes primero)
    const fechas = Object.keys(agrupadas).sort((a, b) => new Date(b) - new Date(a));
    setFechasOrdenadas(fechas);
  };

  // Usar utilidades centralizadas para fechas

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta reserva?")) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/admin/reservas/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (mostrarMensaje) mostrarMensaje(data.mensaje || "Reserva eliminada", "success");
        if (onReload) onReload();
      } catch (error) {
        if (mostrarMensaje) mostrarMensaje("Error de red", "error");
      }
    }
  };

    // Filtrar reservas por fecha seleccionada
  const reservasFiltradas = fechaSeleccionada 
    ? reservasAgrupadas[fechaSeleccionada] || []
    : [];
  
  console.log("🎯 Reservas filtradas para fecha", fechaSeleccionada, ":", reservasFiltradas);

  // Estado para el panel modal
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  // Horarios fijos en formato de rangos (1 hora)
  const horarios = [
    '06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'
  ];

  // Función para obtener reserva en un horario y cancha específicos
  const getReservaEnHorario = (horario, cancha) => {
    console.log(`🔍 Buscando reserva para horario: "${horario}", cancha: ${cancha}`);
    console.log(`📋 Reservas disponibles:`, reservasFiltradas);
    
    // Buscar reserva con formato de rangos (nuevo formato)
    let reserva = reservasFiltradas.find(reserva => {
      const coincide = reserva.horario === horario && reserva.cancha == cancha;
      console.log(`🔍 Comparando: "${reserva.horario}" === "${horario}" && ${reserva.cancha} == ${cancha} = ${coincide}`);
      return coincide;
    });
    
    // Si no encuentra, buscar con formato simple (formato antiguo)
    if (!reserva) {
      const horaInicio = horario.split(' - ')[0]; // Extraer "06:00" de "06:00 - 07:00"
      console.log(`🔍 Buscando formato antiguo: "${horaInicio}"`);
      reserva = reservasFiltradas.find(reserva => {
        const coincide = reserva.horario === horaInicio && reserva.cancha == cancha;
        console.log(`🔍 Comparando antiguo: "${reserva.horario}" === "${horaInicio}" && ${reserva.cancha} == ${cancha} = ${coincide}`);
        return coincide;
      });
    }
    
    console.log(`✅ Reserva encontrada:`, reserva);
    return reserva;
  };

  // Función para manejar click en celda
  const handleClickCelda = (reserva) => {
    if (reserva) {
      setReservaSeleccionada(reserva);
    }
  };

  return (
    <div>
      {/* Filtro de fecha y título alineados */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        {/* Título de fecha a la izquierda */}
        <div style={{ 
          border: '2px solid #2c5f2d',
          borderRadius: '8px',
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          display: 'inline-block'
        }}>
          <div style={{ 
            fontSize: '0.9rem', 
            fontWeight: 'bold', 
            color: 'black',
            marginBottom: '2px'
          }}>
            {fechaSeleccionada && formatDate(fechaSeleccionada)}
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#666',
            textAlign: 'center'
          }}>
            {fechaSeleccionada && `${reservasFiltradas.length} reserva${reservasFiltradas.length !== 1 ? 's' : ''}`}
          </div>
        </div>
        {/* Filtro a la derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="fecha-filtro" style={{ margin: 0, fontSize: '0.8rem' }}>
            <strong>Filtrar reservas por fecha:</strong>
          </label>
          <input
            id="fecha-filtro"
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Tabla de horarios */}
      {fechaSeleccionada && (
        <div style={{
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          overflow: 'hidden',
          marginTop: '15px'
        }}>
          {/* Encabezados */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '85px 1fr 1fr',
            backgroundColor: '#2c5f2d',
            color: 'white',
            fontWeight: 'bold'
          }}>
            <div style={{ padding: '6px 2px', textAlign: 'center', fontSize: '0.8rem' }}>HORA</div>
            <div style={{ padding: '6px', textAlign: 'center', fontSize: '0.85rem' }}>CANCHA 1</div>
            <div style={{ padding: '6px', textAlign: 'center', fontSize: '0.85rem' }}>CANCHA 2</div>
          </div>

          {/* Filas de horarios */}
          {horarios.map((horario) => {
            const reservaCancha1 = getReservaEnHorario(horario, 1);
            const reservaCancha2 = getReservaEnHorario(horario, 2);

            return (
              <div key={horario} style={{
                display: 'grid',
                gridTemplateColumns: '85px 1fr 1fr',
                borderBottom: '1px solid #dee2e6'
              }}>
                {/* Columna de hora */}
                <div style={{
                  padding: '4px 2px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  fontWeight: 'bold',
                  borderRight: '1px solid #dee2e6',
                  fontSize: '0.7rem'
                }}>
                  {horario}
                </div>

                {/* Cancha 1 */}
                <div 
                  style={{
                    padding: '4px 6px',
                    textAlign: 'center',
                    backgroundColor: reservaCancha1 ? '#e9ecef' : 'white',
                    cursor: reservaCancha1 ? 'pointer' : 'default',
                    borderRight: '1px solid #dee2e6',
                    minHeight: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => handleClickCelda(reservaCancha1)}
                  onMouseEnter={(e) => {
                    if (reservaCancha1) {
                      e.target.style.backgroundColor = '#d1ecf1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (reservaCancha1) {
                      e.target.style.backgroundColor = '#e9ecef';
                    }
                  }}
                >
                  {reservaCancha1 ? (
                    <div style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                      {reservaCancha1.cliente_nombre && reservaCancha1.cliente_apellido 
                        ? `${reservaCancha1.cliente_nombre} ${reservaCancha1.cliente_apellido}`
                        : reservaCancha1.cliente_nombre || reservaCancha1.nombre}
                    </div>
                  ) : (
                    <span style={{ color: '#6c757d', fontStyle: 'italic', fontSize: '0.75rem' }}>DISPONIBLE</span>
                  )}
                </div>

                {/* Cancha 2 */}
                <div 
                  style={{
                    padding: '4px 6px',
                    textAlign: 'center',
                    backgroundColor: reservaCancha2 ? '#e9ecef' : 'white',
                    cursor: reservaCancha2 ? 'pointer' : 'default',
                    minHeight: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => handleClickCelda(reservaCancha2)}
                  onMouseEnter={(e) => {
                    if (reservaCancha2) {
                      e.target.style.backgroundColor = '#d1ecf1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (reservaCancha2) {
                      e.target.style.backgroundColor = '#e9ecef';
                    }
                  }}
                >
                  {reservaCancha2 ? (
                    <div style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                      {reservaCancha2.cliente_nombre && reservaCancha2.cliente_apellido 
                        ? `${reservaCancha2.cliente_nombre} ${reservaCancha2.cliente_apellido}`
                        : reservaCancha2.cliente_nombre || reservaCancha2.nombre}
                    </div>
                  ) : (
                    <span style={{ color: '#6c757d', fontStyle: 'italic', fontSize: '0.75rem' }}>DISPONIBLE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Panel Modal */}
      {reservaSeleccionada && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setReservaSeleccionada(null)}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            minWidth: '400px',
            maxWidth: '500px'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#2c5f2d',
              textAlign: 'center',
              borderBottom: '2px solid #2c5f2d',
              paddingBottom: '10px'
            }}>
              OPCIONES DE RESERVA
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Cliente:</strong> {reservaSeleccionada.cliente_nombre && reservaSeleccionada.cliente_apellido 
                ? `${reservaSeleccionada.cliente_nombre} ${reservaSeleccionada.cliente_apellido}`
                : reservaSeleccionada.cliente_nombre || reservaSeleccionada.nombre}</p>
              <p><strong>Cancha:</strong> {reservaSeleccionada.cancha}</p>
              <p><strong>Horario:</strong> {reservaSeleccionada.horario}</p>
              <p><strong>Fecha:</strong> {formatDate(reservaSeleccionada.fecha)}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  handleEliminar(reservaSeleccionada.id);
                  setReservaSeleccionada(null);
                }}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ELIMINAR RESERVA
              </button>
              <button
                onClick={() => setReservaSeleccionada(null)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 