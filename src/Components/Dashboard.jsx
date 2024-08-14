import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes limpiar el almacenamiento local y redirigir al usuario
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard</h1>
      <button
        onClick={handleLogout}
        className="logout-button"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
