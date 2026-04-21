import React, { useState, useRef, useMemo } from 'react';
import { 
  PieChart, Pie, Tooltip, ResponsiveContainer, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  Users, LayoutDashboard, Search, Bell, Trash2, 
  UserPlus, X, DollarSign, History, CheckCircle, AlertCircle
} from 'lucide-react';

function App() {
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const idCounterRef = useRef(3);
  
  // ESTADO DE USUARIOS (Añadimos la propiedad 'monto')
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Alejandro R.", email: "ale@fintech.com", kyc: "Verificado", registro: "2026-03-10", monto: 5000 },
    { id: 2, nombre: "Admin Nova", email: "admin@nova.com", kyc: "Pendiente", registro: "2026-03-15", monto: 3500 }
  ]);

  const [auditoria, setAuditoria] = useState([
    { id: 101, fecha: "2026-04-13 10:00:22", user: "Admin", accion: "LOGIN", tabla: "SISTEMA" }
  ]);

  // Estados para el formulario
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState(''); // Nuevo estado para el monto

  // Cálculo de Cartera Total Dinámica
  const carteraTotal = useMemo(() => {
    return usuarios.reduce((acc, user) => acc + Number(user.monto || 0), 0);
  }, [usuarios]);

  const datosSalud = useMemo(() => {
    const v = usuarios.filter(u => u.kyc === 'Verificado').length;
    const p = usuarios.filter(u => u.kyc === 'Pendiente').length;
    return [
      { name: 'Activos', value: v, color: '#3182ce' },
      { name: 'Prevención', value: p, color: '#f59e0b' },
      { name: 'Mora', value: 0, color: '#ef4444' }
    ];
  }, [usuarios]);

  const dataCrecimiento = [
    { mes: 'Ene', monto: 1200 }, { mes: 'Feb', monto: 3500 },
    { mes: 'Mar', monto: 4200 }, { mes: 'Abr', monto: 5800 }
  ];

  const agregarUsuario = (e) => {
    e.preventDefault();
    idCounterRef.current += 1;
    const nuevo = { 
      id: idCounterRef.current, 
      nombre: nuevoNombre, 
      email: nuevoEmail, 
      monto: nuevoMonto, // Guardamos el monto ingresado
      kyc: "Pendiente",
      registro: new Date().toISOString().split('T')[0]
    };
    
    setUsuarios([...usuarios, nuevo]);
    setAuditoria([{ 
      id: Date.now(), 
      fecha: new Date().toLocaleString(), 
      user: "Admin", 
      accion: "CREATE_LOAN", 
      tabla: "USUARIO" 
    }, ...auditoria]);
    
    setNuevoNombre(''); setNuevoEmail(''); setNuevoMonto(''); setIsModalOpen(false);
  };

  const eliminarUsuario = (id) => {
    if (window.confirm("¿Eliminar registro?")) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const alternarEstado = (id) => {
    setUsuarios(usuarios.map(u => 
      u.id === id ? { ...u, kyc: u.kyc === 'Pendiente' ? 'Verificado' : 'Pendiente' } : u
    ));
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">FintechNova</div>
        <nav className="nav-menu">
          <button className={`nav-link ${vistaActual === 'dashboard' ? 'active' : ''}`} onClick={() => setVistaActual('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={`nav-link ${vistaActual === 'usuarios' ? 'active' : ''}`} onClick={() => setVistaActual('usuarios')}>
            <Users size={20} /> Gestión Usuarios
          </button>
          <button className={`nav-link ${vistaActual === 'auditoria' ? 'active' : ''}`} onClick={() => setVistaActual('auditoria')}>
            <History size={20} /> Auditoría
          </button>
        </nav>
      </aside>

      <div className="main-layout">
        <header className="top-header">
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Buscar..." />
          </div>
          <div className="user-info">
            <Bell size={20} />
            <div className="user-avatar">AD</div>
          </div>
        </header>

        <main className="page-content">
          {vistaActual === 'dashboard' && (
            <div className="fade-in">
              <h1 className="section-title">Resumen General</h1>
              <div className="dashboard-grid">
                <div className="stat-card">
                  <div>
                    <p className="stat-label">Usuarios Totales</p>
                    <h2 className="stat-value">{usuarios.length}</h2>
                    <p className="stat-label" style={{marginTop: '10px'}}>Cartera Global:</p>
                    <h2 className="stat-value" style={{fontSize: '22px'}}>
                      ${carteraTotal.toLocaleString()}
                    </h2>
                  </div>
                  <div style={{marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', opacity: 0.2}}>
                    <Users size={32} />
                    <DollarSign size={32} />
                  </div>
                </div>

                <div className="stat-card">
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={dataCrecimiento}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="mes" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="monto" fill="#818cf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="stat-card">
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={datosSalud} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                        {datosSalud.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="content-card" style={{marginTop: '30px'}}>
                <h3>Historial de Transacciones</h3>
                <table className="premium-table">
                  <thead>
                    <tr><th>Fecha</th><th>Descripción</th><th>Monto</th><th>Estado</th></tr>
                  </thead>
                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map(u => (
                        <tr key={u.id}>
                          <td className="txt-time">2026-04-13</td>
                          <td>Préstamo a {u.nombre}</td>
                          <td className="txt-amount positive">
                            + ${Number(u.monto).toLocaleString()}
                          </td>
                          <td><span className="badge-pill badge-verified">Complete</span></td>
                        </tr>
                      )).reverse().slice(0, 5) // reverse para ver los últimos primero
                    ) : (
                      <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No hay transacciones</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {vistaActual === 'usuarios' && (
            <div className="fade-in">
              <div className="page-header">
                <h1 className="section-title">Gestión de Usuarios</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                  <UserPlus size={18} /> Nuevo Registro
                </button>
              </div>
              <div className="content-card">
                <table className="premium-table">
                  <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Monto Prestado</th><th>Estado</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u.id}>
                        <td className="txt-time">#{u.id}</td>
                        <td style={{fontWeight: '700'}}>{u.nombre}</td>
                        <td style={{color: '#1e293b'}}>${Number(u.monto).toLocaleString()}</td>
                        <td>
                          <button onClick={() => alternarEstado(u.id)} className={`badge-pill ${u.kyc === 'Verificado' ? 'badge-verified' : 'badge-pending'}`}>
                            {u.kyc}
                          </button>
                        </td>
                        <td>
                          <button className="btn-delete" onClick={() => eliminarUsuario(u.id)}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {vistaActual === 'auditoria' && (
            <div className="fade-in">
              <h1 className="section-title">Auditoría</h1>
              <div className="content-card">
                <table className="premium-table">
                  <thead>
                    <tr><th>Fecha/Hora</th><th>Operador</th><th>Acción</th><th>Módulo</th></tr>
                  </thead>
                  <tbody>
                    {auditoria.map(log => (
                      <tr key={log.id}>
                        <td className="txt-time">{log.fecha}</td>
                        <td><strong>{log.user}</strong></td>
                        <td><span className="badge-pill" style={{background: '#e2e8f0'}}>{log.accion}</span></td>
                        <td><code>{log.tabla}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL CON CAMPO DE MONTO */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Alta de Préstamo</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={agregarUsuario}>
              <div className="form-group">
                <label>Nombre del Cliente</label>
                <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={nuevoEmail} onChange={(e) => setNuevoEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Monto del Préstamo ($)</label>
                <input type="number" value={nuevoMonto} onChange={(e) => setNuevoMonto(e.target.value)} required placeholder="Ej: 5000" />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>Generar Préstamo</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;