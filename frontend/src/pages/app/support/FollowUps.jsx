import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { followupsApi } from '../../../services/api';
import './FollowUps.css';

const ICON_MAP = {
  report: '🧪',
  training: '📚',
  cycle: '🌸',
  symptom: '📝',
};

export default function FollowUps() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dismissing, setDismissing] = useState(null);

  const load = async () => {
    try {
      const data = await followupsApi.list();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Follow-ups · FemAssist';
    load();
  }, []);

  const handleDismiss = async (id) => {
    setDismissing(id);
    try {
      await followupsApi.dismiss(id);
      setItems((list) => list.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDismissing(null);
    }
  };

  const handleOpen = (item) => {
    if (item.type === 'report' && item.reportId) navigate(`/app/health-records/${item.reportId}`);
    else if (item.type === 'training' && item.lessonId) navigate(`/app/training/${item.lessonId}`);
    else if (item.type === 'cycle') navigate('/app/period-tracker');
    else if (item.type === 'symptom') navigate('/app/symptoms');
    else navigate('/app/dashboard');
  };

  const handleReset = async () => {
    try {
      await followupsApi.reset();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="fu">
        <div className="fu__head">
          <h1 className="fu__title">🔔 Follow-ups</h1>
        </div>
        <p className="text-muted" style={{ padding: 16 }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="fu">
      <div className="fu__head">
        <div>
          <h1 className="fu__title">🔔 Follow-ups</h1>
          <p className="fu__subtitle">Small nudges to keep your health on track.</p>
        </div>
        {items.length === 0 && (
          <button className="fu__reset" onClick={handleReset}>
            Reset hidden
          </button>
        )}
      </div>

      {error && <div className="fu__error">⚠️ {error}</div>}

      {items.length === 0 ? (
        <div className="fu-empty">
          <span className="fu-empty__icon">🌿</span>
          <h3>All clear!</h3>
          <p className="text-muted">Nothing needs your attention right now.</p>
        </div>
      ) : (
        <div className="fu__list">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`fu-item fu-item--${item.type}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="fu-item__icon">{ICON_MAP[item.type] || '🔔'}</div>
              <div className="fu-item__body">
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
              <div className="fu-item__actions">
                <button
                  className="fu-item__primary"
                  onClick={() => handleOpen(item)}
                >
                  Open
                </button>
                <button
                  className="fu-item__dismiss"
                  onClick={() => handleDismiss(item.id)}
                  disabled={dismissing === item.id}
                  aria-label="Dismiss"
                >
                  {dismissing === item.id ? '…' : '✕'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}