import { useEffect } from 'react';
import './Placeholder.css';

export default function Profile() {
  useEffect(() => { document.title = 'Profile · FemAssist'; }, []);
  return (
    <div className="placeholder">
      <div className="placeholder__icon">👤</div>
      <h1>Profile &amp; Settings</h1>
      <p>Manage your account and preferences.</p>
    </div>
  );
}