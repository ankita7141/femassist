import { useEffect } from 'react';
import './Placeholder.css';

export default function Intelligence() {
  useEffect(() => { document.title = 'Intelligence · FemAssist'; }, []);
  return (
    <div className="placeholder">
      <div className="placeholder__icon">🧠</div>
      <h1>Health Intelligence</h1>
      <p>Trends, patterns, insights — coming soon.</p>
    </div>
  );
}