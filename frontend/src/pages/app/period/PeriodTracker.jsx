import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import SymptomPicker from '../../../components/SymptomPicker';
import { cyclesApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './PeriodTracker.css';

const FLOW_OPTIONS = [
  { id: 'light',  label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'heavy',  label: 'Heavy' },
];

const MOOD_OPTIONS = [
  { id: 'good',   icon: '😊', label: 'Good' },
  { id: 'normal', icon: '😐', label: 'Normal' },
  { id: 'low',    icon: '😔', label: 'Low' },
];

export default function PeriodTracker() {
  const { user } = useAuth();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  // Log form
  const [flow, setFlow] = useState('medium');
  const [mood, setMood] = useState('normal');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    document.title = 'Period Tracker · FemAssist';
    const load = async () => {
      try {
        const data = await cyclesApi.list();
        setCycles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleSymptom = (id) => {
    setSymptoms((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await cyclesApi.create({ flow, mood, symptoms, notes });
      const fresh = await cyclesApi.list();
      setCycles(fresh);
      setFlow('medium');
      setMood('normal');
      setSymptoms([]);
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
      await cyclesApi.remove(id);
      setCycles((list) => list.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const onboarding = user?.onboarding || {};
  const avgCycle = onboarding.avgCycleLength || 28;
  const lastLog = cycles[0];
  const daysSinceLast = lastLog
    ? Math.floor((Date.now() - new Date(lastLog.date).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const nextIn = daysSinceLast !== null
    ? Math.max(0, avgCycle - daysSinceLast)
    : null;

  // Calendar generation
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const dayCells = [];
  for (let i = 0; i < firstDow; i++) dayCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) dayCells.push(d);

  const periodDays = cycles.length
    ? cycles.slice(0, 5).map((c) => new Date(c.date).getDate())
    : [];

  const isToday = (d) => d === today.getDate();

  if (loading) {
    return (
      <div className="pt">
        <h1 className="pt__title">🌸 Period Tracker</h1>
        <p className="pt__subtitle">Loading…</p>
      </div>
    );
  }

  return (
    <div className="pt">
      <h1 className="pt__title">🌸 Period Tracker</h1>
      <p className="pt__subtitle">Track your cycle, mood, and how you feel.</p>

      <div className="pt__overview">
        <div className="pt__ov-card">
          <span className="pt__ov-icon">📅</span>
          <span className="pt__ov-label">Average Cycle</span>
          <strong className="pt__ov-value">{avgCycle} days</strong>
        </div>
        <div className="pt__ov-card">
          <span className="pt__ov-icon">🩸</span>
          <span className="pt__ov-label">Last Log</span>
          <strong className="pt__ov-value">
            {daysSinceLast !== null ? `${daysSinceLast} days ago` : 'None yet'}
          </strong>
        </div>
        <div className="pt__ov-card">
          <span className="pt__ov-icon">⏳</span>
          <span className="pt__ov-label">Next Estimated</span>
          <strong className="pt__ov-value">
            {nextIn !== null ? `In ${nextIn} days` : '—'}
          </strong>
        </div>
      </div>

      <div className="pt__calendar">
        <div className="pt__cal-head">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i} className="pt__cal-dow">{d}</span>
          ))}
        </div>
        <div className="pt__cal-grid">
          {dayCells.map((d, i) => {
            if (d === null) return <span key={i} className="pt__cal-cell pt__cal-cell--empty" />;
            const isPeriod = periodDays.includes(d);
            return (
              <span
                key={i}
                className={`pt__cal-cell ${isPeriod ? 'pt__cal-cell--period' : ''} ${isToday(d) ? 'pt__cal-cell--today' : ''}`}
              >
                {d}
              </span>
            );
          })}
        </div>
        <div className="pt__cal-legend">
          <span><i className="pt__dot pt__dot--period" /> Period</span>
          <span><i className="pt__dot pt__dot--today" /> Today</span>
        </div>
      </div>

      <div className="pt__log">
        <h3 className="pt__section-title">Log Today</h3>

        <div className="pt__field">
          <label className="pt__label">Flow</label>
          <div className="pt__options">
            {FLOW_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`pt__opt ${flow === f.id ? 'pt__opt--active' : ''}`}
                onClick={() => setFlow(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt__field">
          <label className="pt__label">Mood</label>
          <div className="pt__options">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`pt__opt pt__opt--mood ${mood === m.id ? 'pt__opt--active' : ''}`}
                onClick={() => setMood(m.id)}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt__field">
          <label className="pt__label">Symptoms</label>
          <SymptomPicker selected={symptoms} onToggle={toggleSymptom} />
        </div>

        <div className="pt__field">
          <label className="pt__label">Notes (optional)</label>
          <textarea
            className="pt__notes"
            placeholder="Anything to remember?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {error && <div className="pt__error">⚠️ {error}</div>}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : savedFlash ? '✓ Saved!' : "Save Today's Log"}
        </Button>
      </div>

      {cycles.length > 0 ? (
        <div className="pt__recent">
          <h3 className="pt__section-title">Recent Logs</h3>
          <div className="pt__recent-list">
            {cycles.slice(0, 5).map((c) => (
              <div key={c._id} className="pt__log-item">
                <span className="pt__log-date">
                  {new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
                <span className="pt__log-tag">{c.flow} flow</span>
                <span className="pt__log-tag">{c.mood} mood</span>
                {c.symptoms?.length > 0 && (
                  <span className="pt__log-tag">{c.symptoms.length} symptoms</span>
                )}
                <button
                  className="pt__log-del"
                  onClick={() => handleDelete(c._id)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pt__recent">
          <h3 className="pt__section-title">Recent Logs</h3>
          <div className="pt__empty">
            <span>🌸</span>
            <p>No cycle logs yet. Log today above to start.</p>
          </div>
        </div>
      )}
    </div>
  );
}