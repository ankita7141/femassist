import { useEffect } from 'react';
import './Placeholder.css';

export default function PeriodTracker() {
  useEffect(() => { document.title = 'Period Tracker · FemAssist'; }, []);
  return (
    <div className="placeholder">
      <div className="placeholder__icon">🌸</div>
      <h1>Period Tracker</h1>
      <p>Cycle logging and insights — coming soon.</p>
    </div>
  );
}