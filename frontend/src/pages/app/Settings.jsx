import { useEffect } from 'react';
import './Placeholder.css';

export default function Settings() {
  useEffect(() => { document.title = 'Settings · FemAssist'; }, []);
  return (
    <div className="placeholder">
      <div className="placeholder__icon">⚙️</div>
      <h1>Settings</h1>
      <p>Notifications, privacy, data management.</p>
    </div>
  );
}