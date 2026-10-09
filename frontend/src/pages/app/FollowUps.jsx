import { useEffect } from 'react';
import './Placeholder.css';

export default function FollowUps() {
  useEffect(() => { document.title = 'Follow-ups · FemAssist'; }, []);
  return (
    <div className="placeholder">
      <div className="placeholder__icon">🔔</div>
      <h1>Follow-ups</h1>
      <p>Upcoming reminders and tasks.</p>
    </div>
  );
}