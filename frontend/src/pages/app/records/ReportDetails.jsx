import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { reportsApi } from '../../../services/api';
import './ReportDetails.css';

const LAYERS = [
  { id: 'extracted', label: '📊 Extracted Values' },
  { id: 'explanation', label: '💡 Simple Explanation' },
  { id: 'original', label: '📄 Original Report' },
];

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [layer, setLayer] = useState('extracted');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = 'Report Details · FemAssist';
    const load = async () => {
      try {
        const data = await reportsApi.get(id);
        setReport(data);
        // Auto-mark as reviewed (fire and forget — don't block rendering)
        if (!data.reviewed) {
          reportsApi.markReviewed(id).catch(() => {});
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this report? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await reportsApi.remove(id);
      navigate('/app/health-records', { replace: true });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const statusClass = (status) => {
    if (status === 'low') return 'rpt-value--low';
    if (status === 'high') return 'rpt-value--high';
    if (status === 'normal') return 'rpt-value--normal';
    return '';
  };

  if (loading) {
    return (
      <div className="rpt">
        <button className="rpt__back" onClick={() => navigate('/app/health-records')}>
          ← Back to Records
        </button>
        <div className="rpt-notfound">
          <span>⏳</span>
          <h1>Loading…</h1>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="rpt">
        <button className="rpt__back" onClick={() => navigate('/app/health-records')}>
          ← Back to Records
        </button>
        <div className="rpt-notfound">
          <span>📄</span>
          <h1>{error || 'Report not found'}</h1>
          <p className="text-muted">It may have been deleted.</p>
          <Link to="/app/health-records">
            <Button variant="primary">Back to Records</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rpt">
      <button className="rpt__back" onClick={() => navigate('/app/health-records')}>
        ← Back to Records
      </button>

      <div className="rpt__head">
        <div className="rpt__head-icon">📄</div>
        <div style={{ flex: 1 }}>
          <h1 className="rpt__title">{report.type}</h1>
          <p className="rpt__meta">
            {formatDate(report.date)}
            {report.fileName ? ` · ${report.fileName}` : ''}
          </p>
        </div>
        <button
          className="rpt__delete"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete report"
        >
          {deleting ? '…' : '🗑'}
        </button>
      </div>

      <div className="rpt__tabs">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            className={`rpt__tab ${layer === l.id ? 'rpt__tab--active' : ''}`}
            onClick={() => setLayer(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="rpt__content" key={layer}>
        {layer === 'extracted' && (
          <div className="rpt-values">
            <p className="rpt-values__hint">
              Values read from your document with confidence score
            </p>
            {report.values && report.values.length > 0 ? (
              report.values.map((v, i) => (
                <div
                  key={i}
                  className={`rpt-value ${statusClass(v.status)}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="rpt-value__name">{v.name}</div>
                  <div className="rpt-value__num">
                    <strong>{v.value}</strong>
                    <span>{v.unit}</span>
                  </div>
                  <div className="rpt-value__confidence">
                    <div className="rpt-value__confidence-bar">
                      <div
                        className="rpt-value__confidence-fill"
                        style={{ width: `${v.confidence}%` }}
                      />
                    </div>
                    <span>{v.confidence}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No values extracted.</p>
            )}
          </div>
        )}

        {layer === 'explanation' && (
          <div className="rpt-explanation">
            <div className="rpt-explanation__icon">💡</div>
            <p className="rpt-explanation__text">
              {report.explanation || 'No explanation available.'}
            </p>
            <div className="rpt-explanation__note">
              <span>🩺</span>
              <p>
                This is health education only — not a diagnosis. Always
                consult a healthcare professional for medical decisions.
              </p>
            </div>
          </div>
        )}

        {layer === 'original' && (
          <div className="rpt-original">
            <div className="rpt-original__preview">
              <span className="rpt-original__icon">📄</span>
              <strong>{report.fileName || 'report.pdf'}</strong>
              <p className="text-muted">Preview not available in prototype</p>
            </div>
            <Button variant="ghost" size="sm">⬇ Download Original</Button>
          </div>
        )}
      </div>
    </div>
  );
}