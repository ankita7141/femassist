import { useAuth } from '../../context/AuthContext';
import './AppTopbar.css';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function AppTopbar() {
  const { user } = useAuth();
  const name = user?.name || '';
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <header className="app-topbar">
      <div className="app-topbar__left">
        <h2 className="app-topbar__greeting">
          {getGreeting()}{name ? `, ${name}` : ''} 🌸
        </h2>
        <p className="app-topbar__sub">Here's your health overview.</p>
      </div>

      <div className="app-topbar__right">
        <button className="app-topbar__icon-btn" aria-label="Notifications">
          🔔
          <span className="app-topbar__dot" />
        </button>
        <div className="app-topbar__avatar">{initial}</div>
      </div>
    </header>
  );
}