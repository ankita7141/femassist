import { Outlet, Link } from 'react-router-dom';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <Link to="/home" className="auth-layout__brand" aria-label="FemAssist home">
        <img src="/logo.png" alt="FemAssist" className="auth-layout__logo" />
      </Link>
      <div className="auth-layout__card">
        <Outlet />
      </div>
    </div>
  );
}