import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { followupsApi } from '../../services/api';
import './AppSidebar.css';

const NAV_ITEMS_TOP = [
  { to: '/app/dashboard',      icon: '🏠', label: 'Dashboard' },
  { to: '/app/health-records', icon: '📄', label: 'Health Records' },
];

const NAV_ITEMS_MID = [
  { to: '/app/symptoms',       icon: '📝', label: 'Symptoms' },
  { to: '/app/intelligence',   icon: '🧠', label: 'Intelligence' },
  { to: '/app/timeline',       icon: '📅', label: 'Timeline' },
  { to: '/app/training',       icon: '📚', label: 'My Training' },
  { to: '/app/follow-ups',     icon: '🔔', label: 'Follow-ups' },
];

const NAV_ITEMS_BOTTOM = [
  { to: '/app/doctor-summary', icon: '📋', label: 'Doctor Summary' },
  { to: '/app/emergency-card', icon: '🚨', label: 'Emergency Card' },
  { to: '/app/profile',        icon: '👤', label: 'Profile' },
  { to: '/app/settings',       icon: '⚙️', label: 'Settings' },
];

function shouldShowPeriodTracker(onboarding) {
  if (!onboarding) return false;
  const { lifeStage, hasPeriods } = onboarding;
  if (lifeStage === 'menopause' || lifeStage === 'pregnancy') return false;
  if (hasPeriods === false) return false;
  return true;
}

export default function AppSidebar() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const showTracker = shouldShowPeriodTracker(user?.onboarding);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const list = await followupsApi.list();
        setPendingCount(list.length);
      } catch {
        setPendingCount(0);
      }
    };
    load();
  }, [user]);

  const renderLink = (item, extra = null) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) =>
        `app-sidebar__link ${isActive ? 'app-sidebar__link--active' : ''}`
      }
    >
      <span className="app-sidebar__icon">{item.icon}</span>
      <span className="app-sidebar__label">{item.label}</span>
      {extra}
    </NavLink>
  );

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__brand">
        <NavLink to="/app/dashboard" className="app-sidebar__brand-link">
          <img src="/logo.png" alt="FemAssist" className="app-sidebar__logo" />
        </NavLink>
      </div>

      <nav className="app-sidebar__nav">
        {NAV_ITEMS_TOP.map((item) => renderLink(item))}

        {showTracker &&
          renderLink({ to: '/app/period-tracker', icon: '🌸', label: 'Period Tracker' })}

        {NAV_ITEMS_MID.map((item) =>
          renderLink(
            item,
            item.to === '/app/follow-ups' && pendingCount > 0 ? (
              <span className="app-sidebar__badge">{pendingCount}</span>
            ) : null
          )
        )}

        <div className="app-sidebar__divider" />

        {NAV_ITEMS_BOTTOM.map((item) => renderLink(item))}
      </nav>

      <NavLink to="/home" className="app-sidebar__back">
        ← Back to site
      </NavLink>
    </aside>
  );
}