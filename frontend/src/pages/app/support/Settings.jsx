import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';
import './Settings.css';

const NOTIF_OPTIONS = [
  { id: 'reportReview',  label: 'Report review reminders',  desc: 'Nudge you after uploading a report.' },
  { id: 'lessonNudge',   label: 'Lesson recommendations',   desc: 'Suggest lessons based on your data.' },
  { id: 'cycleLog',      label: 'Cycle log reminders',      desc: 'Remind you to log your cycle.' },
  { id: 'weeklyDigest',  label: 'Weekly summary',           desc: 'A short weekly health recap.' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notifs, setNotifs] = useState({
    reportReview: true, lessonNudge: true, cycleLog: true, weeklyDigest: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    document.title = 'Settings · FemAssist';
    const saved = JSON.parse(localStorage.getItem('whc_notif_settings') || 'null');
    if (saved) setNotifs(saved);
  }, []);

  const toggleNotif = (id) => {
    const updated = { ...notifs, [id]: !notifs[id] };
    setNotifs(updated);
    localStorage.setItem('whc_notif_settings', JSON.stringify(updated));
  };

  const handleDownload = () => {
    const keys = ['whc_onboarding', 'whc_reports', 'whc_symptoms', 'whc_cycles', 'whc_training_progress', 'whc_emergency_contact'];
    const dump = {};
    keys.forEach((k) => {
      const v = localStorage.getItem(k);
      if (v) {
        try { dump[k] = JSON.parse(v); } catch { dump[k] = v; }
      }
    });
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `femassist-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    ['whc_onboarding', 'whc_reports', 'whc_symptoms', 'whc_cycles', 'whc_training_progress', 'whc_emergency_contact', 'whc_notif_settings', 'whc_followups_dismissed', 'whc_token'].forEach((k) => localStorage.removeItem(k));
    navigate('/home');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="st">
      <h1 className="st__title">⚙️ Settings</h1>

      {/* Notifications */}
      <div className="st-card">
        <h3 className="st-card__title">Notifications</h3>
        <p className="st-card__sub">Choose what you want to be reminded about.</p>
        <div className="st-toggles">
          {NOTIF_OPTIONS.map((opt) => (
            <div key={opt.id} className="st-toggle-row">
              <div className="st-toggle-info">
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </div>
              <button
                className={`st-switch ${notifs[opt.id] ? 'st-switch--on' : ''}`}
                onClick={() => toggleNotif(opt.id)}
                aria-pressed={notifs[opt.id]}
              >
                <span className="st-switch__thumb" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="st-card">
        <h3 className="st-card__title">Privacy &amp; Consent</h3>
        <Link to="/app/privacy" className="st-link">
          <span>📖 Read our privacy policy</span>
          <span>→</span>
        </Link>
      </div>

      {/* Data Management */}
      <div className="st-card">
        <h3 className="st-card__title">Data Management</h3>
        <p className="st-card__sub">Your data stays on this device.</p>
        <div className="st-actions">
          <Button variant="ghost" fullWidth onClick={handleDownload}>
            ⬇ Download My Data
          </Button>
          {!showDeleteConfirm ? (
            <Button variant="ghost" fullWidth onClick={() => setShowDeleteConfirm(true)}>
              🗑 Delete My Data
            </Button>
          ) : (
            <div className="st-confirm">
              <p>Are you sure? This clears everything on this device.</p>
              <div className="st-confirm__buttons">
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <button className="st-danger-btn" onClick={handleDelete}>Delete Everything</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account */}
      <div className="st-card">
        <h3 className="st-card__title">Account</h3>
        <Button variant="ghost" fullWidth onClick={handleLogout}>
          🚪 Logout
        </Button>
      </div>
    </div>
  );
}