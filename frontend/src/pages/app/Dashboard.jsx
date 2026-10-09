import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Dashboard · FemAssist';
  }, []);

  const o = user?.onboarding || {};

  const profileCompletion = () => {
    let score = 0;
    const total = 6;
    if (user?.name) score++;
    if (o.age) score++;
    if (o.lifeStage) score++;
    if (o.height || o.weight) score++;
    if (o.bloodGroup) score++;
    if (Array.isArray(o.goals) && o.goals.length) score++;
    return Math.round((score / total) * 100);
  };

  const completion = profileCompletion();

  return (
    <div className="dashboard">
      <div className="dash-card">
        <div className="dash-card__head">
          <div className="dash-card__icon">🩺</div>
          <div>
            <h3>Health Profile</h3>
            <p className="text-muted">{completion}% complete</p>
          </div>
        </div>
        <div className="dash-progress">
          <div className="dash-progress__fill" style={{ width: `${completion}%` }} />
        </div>
        {completion < 100 && (
          <Link to="/app/profile">
            <Button variant="ghost" size="sm">Complete Profile</Button>
          </Link>
        )}
      </div>

      <div className="dash-section">
        <h2 className="dash-section__title">Quick Actions</h2>
        <div className="dash-actions">
          <button className="dash-action" onClick={() => navigate('/app/health-records')}>
            <span className="dash-action__icon">📄</span>
            <span>Upload Report</span>
          </button>
          <button className="dash-action" onClick={() => navigate('/app/symptoms')}>
            <span className="dash-action__icon">📝</span>
            <span>Log Symptoms</span>
          </button>
          <button className="dash-action" onClick={() => navigate('/app/training')}>
            <span className="dash-action__icon">📚</span>
            <span>Start Learning</span>
          </button>
          <button className="dash-action" onClick={() => navigate('/app/period-tracker')}>
            <span className="dash-action__icon">🌸</span>
            <span>Track Period</span>
          </button>
        </div>
      </div>

      <div className="dash-section">
        <h2 className="dash-section__title">Today's Insight</h2>
        <div className="dash-insight">
          <div className="dash-insight__icon">🧠</div>
          <div className="dash-insight__body">
            <strong>Nothing new yet</strong>
            <p>
              Upload a report or log a symptom to see personalized insights
              here.
            </p>
          </div>
        </div>
      </div>

      <div className="dash-section">
        <h2 className="dash-section__title">Recent Activity</h2>
        <div className="dash-activity">
          <div className="dash-activity__empty">
            <span className="dash-activity__empty-icon">🌱</span>
            <p>Your journey starts here.</p>
            <p className="text-muted">
              Once you upload a report or log a symptom, your timeline will
              appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}