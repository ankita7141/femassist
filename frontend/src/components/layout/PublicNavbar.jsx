import { Link, NavLink } from 'react-router-dom';
import Button from '../Button';
import './PublicNavbar.css';

export default function PublicNavbar() {
  return (
    <header className="public-navbar">
      <div className="container public-navbar__inner">
        <Link to="/home" className="public-navbar__brand" aria-label="FemAssist home">
          <img src="/logo.png" alt="FemAssist" className="public-navbar__logo" />
        </Link>

        <nav className="public-navbar__links">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/how-it-works">How It Works</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="public-navbar__actions">
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}