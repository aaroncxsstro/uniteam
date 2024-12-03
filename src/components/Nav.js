import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Nav.css';
import Logo from '../assets/LogoT.png';
import calendario from '../assets/calendario.png';
import tareas from '../assets/comprobacion-de-lista.png';
import sobre from '../assets/sobre.png';
import foro from '../assets/usuarios.png';

function Nav() {
  const location = useLocation();

  return (
    <nav className="Nav">
      {/* Logo a la izquierda */}
      <div className="Nav-logo">
      <Link to="/">
        <img src={Logo} alt="logo" />
        </Link>
      </div>

      {/* Links de navegación */}
      <ul className="Nav-links">
        <li className={location.pathname === '/calendar' ? 'active' : ''}>
          <Link to="/calendar">
            <img src={calendario} alt="Calendario" className="icon" />
            <span className="label">Calendario</span>
          </Link>
        </li>
        <li className={location.pathname === '/chat' ? 'active' : ''}>
          <Link to="/chat">
            <img src={sobre} alt="Chat" className="icon" />
            <span className="label">Chat</span>
          </Link>
        </li>
        <li className={location.pathname === '/tasks' ? 'active' : ''}>
          <Link to="/tasks">
            <img src={tareas} alt="Tareas" className="icon" />
            <span className="label">Tareas</span>
          </Link>
        </li>
        <li className={location.pathname === '/forum' ? 'active' : ''}>
          <Link to="/forum">
            <img src={foro} alt="Foro" className="icon" />
            <span className="label">Foro</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
