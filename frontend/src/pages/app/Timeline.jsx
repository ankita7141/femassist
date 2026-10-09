import { useEffect } from 'react';
import './Placeholder.css';

export default function Timeline() {
  useEffect(() => { document.title = 'Timeline · FemAssist'; }, []);
  return (
    <div className="placeholder">
      <div className="placeholder__icon">📅</div>
      <h1>Health Timeline</h1>
      <p>Every health activity, in one scrollable view.</p>
    </div>
  );
}