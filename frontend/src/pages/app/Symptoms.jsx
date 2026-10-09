import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import SymptomPicker from '../../components/SymptomPicker';
import { symptomsApi } from '../../services/api';
import './Symptoms.css';

const SEVERITY = [
  { id: 'mild',     label: 'Mild',     color: 'success' },
  { id: 'moderate', label: 'Moderate', color: 'warning' },
  { id: 'severe',   label: 'Severe',   color: 'danger' },
];

export default function Symptoms() {
  const [selected, setSelected] = useState([]);
  const [severity, setSeverity] = useState('mild');
  const [notes, setNotes] = useState('');
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Symptoms · FemAssist';
    const load = async () => {
      try {
        const data = await symptomsApi.list();
        setRecent(data.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleSave = async () => {
    if (selected.length === 0) return;
    setSaving(true);
    setError('');
    try {
      await symptomsApi.create({ symptoms: selected, severity, notes });
      const fresh = await symptomsApi.list();
      setRecent(fresh.slice(0, 5));
      setSelected([]);
      setSeverity('mild');
      setNotes('');
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this log?')) return;
    try {
      await symptomsApi.remove(id);
      setRecent((list) => list.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
      ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="sym">
      <h1 className="sym__title">How are you feeling today?</h1>
      <p className="sym__subtitle">Tap what applies. Save in one click.</p>

      <div className="sym__card">
        <h3 className="sym__section-title">Symptoms</h3>
        <SymptomPicker selected={selected} onToggle={toggle} />
      </div>

      <div className="sym__card">
        <h3 className="sym__section-title">Severity</h3>
        <div className="sym__severity">
          {SEVERITY.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`sym__sev-btn sym__sev-btn--${s.color} ${severity === s.id ? 'sym__sev-btn--active' : ''}`}
              onClick={() => setSeverity(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sym__card">
        <h3 className="sym__section-title">Notes (optional)</h3>
        <textarea
          className="sym__notes"
          placeholder="Anything else you want to note?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {error && (
        <div className="sym__error">⚠️ {error}</div>
      )}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleSave}
        disabled={selected.length === 0 || saving}
      >
        {saving ? 'Saving…' : savedFlash ? '✓ Saved!' : 'Save Log'}
      </Button>

      {loading ? (
        <div className="sym__recent">
          <h3 className="sym__section-title">Recent Logs</h3>
          <p className="text-muted" style={{ padding: 16 }}>Loading…</p>
        </div>
      ) : recent.length > 0 ? (
        <div className="sym__recent">
          <h3 className="sym__section-title">Recent Logs</h3>
          <div className="sym__recent-list">
            {recent.map((r) => (
              <div key={r._id} className="sym__log">
                <div className="sym__log-head">
                  <span className="sym__log-date">{formatDate(r.date)}</span>
                  <span className={`sym__log-sev sym__log-sev--${r.severity}`}>{r.severity}</span>
                  <button
                    className="sym__log-del"
                    onClick={() => handleDelete(r._id)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
                <p className="sym__log-symptoms">
                  {r.symptoms.length} symptom{r.symptoms.length > 1 ? 's' : ''} logged
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="sym__recent">
          <h3 className="sym__section-title">Recent Logs</h3>
          <div className="sym__empty">
            <span>🌱</span>
            <p>No logs yet. Log how you feel above.</p>
          </div>
        </div>
      )}
    </div>
  );
}