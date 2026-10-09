import { useEffect } from 'react';
import './Placeholder.css';

export default function Training() {
  useEffect(() => { document.title = 'My Training · FemAssist'; }, []);
  return (
    <div className="placeholder">
      <div className="placeholder__icon">📚</div>
      <h1>My Training</h1>
      <p>Personalized learning modules — coming soon.</p>
    </div>
  );
}