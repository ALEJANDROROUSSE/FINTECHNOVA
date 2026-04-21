import React, { useState } from 'react';
import { LogIn, Lock } from 'lucide-react';

function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === 'admin' && pass === '1234') {
      onLogin();
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">FintechNova</div>
          <p>Panel de Administración Especializado</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••" required />
          </div>
          <button type="submit" className="btn-login">
            <LogIn size={18} /> Acceder al Panel
          </button>
        </form>
        <div className="login-footer">
          <Lock size={14} /> Conexión Segura SSL
        </div>
      </div>
    </div>
  );
}

export default Login;