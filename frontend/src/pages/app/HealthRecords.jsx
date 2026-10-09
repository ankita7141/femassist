import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { reportsApi } from '../../services/api';
import './HealthRecords.css';

export default function HealthRecords() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Health Records · FemAssist';
    const load = async () => {
      try {
        const data = await reportsApi.list();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const iconForType = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('blood')) return '🧪';
    if (t.includes('thyroid')) return '🩺';
    if (t.includes('prescription')) return '💊';
    return '📄';
  };

  if (loading) {
    return (
      <div className="records">
        <div className="records__head">
          <h1 className="records__title">Health Records</h1>
        </div>
        <div className="records__empty">
          <span className="records__empty-icon">⏳</span>
          <p>Loading your reports…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="records">
      <div className="records__head">
        <h1 className="records__title">Health Records</h1>
        <Link to="/app/health-records/upload">
          <Button variant="primary">+ Upload Report</Button>
        </Link>
      </div>

      {error && (
        <div className="records__empty">
          <span className="records__empty-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!error && reports.length === 0 ? (
        <div className="records__empty">
          <span className="records__empty-icon">📄</span>
          <p>No reports yet.</p>
          <p className="text-muted">Upload your first report to get started.</p>
          <Link to="/app/health-records/upload" style={{ marginTop: 12 }}>
            <Button variant="primary">Upload Report</Button>
          </Link>
        </div>
      ) : reports.length > 0 ? (
        <>
          <h2 className="records__subtitle">Recent Reports</h2>
          <div className="records__grid">
            {reports.map((r, i) => (
              <button
                key={r._id}
                className="record-card"
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => navigate(`/app/health-records/${r._id}`)}
              >
                <div className="record-card__icon">{iconForType(r.type)}</div>
                <div className="record-card__body">
                  <strong className="record-card__type">{r.type}</strong>
                  <span className="record-card__date">{formatDate(r.date)}</span>
                </div>
                <span className="record-card__arrow">→</span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}