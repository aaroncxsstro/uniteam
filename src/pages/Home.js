import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/LogoB.png';
import './Home.css';
function Home() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <img src={logo} className="landing-logo" alt="logo" />
      </header>
      <main className="landing-content">
        <h1 className="landing-title">Bienvenido a UNITEAM</h1>
        <p className="landing-description">
          Organiza tu tiempo, gestiona tus tareas y alcanza tus objetivos con nuestra aplicación.
        </p>
        <button className="landing-button" onClick={() => navigate('/calendar')}>
          Empezar
        </button>
      </main>
    </div>
  );
}

export default Home;
