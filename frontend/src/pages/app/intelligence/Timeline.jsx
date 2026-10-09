import { useEffect, useState } from 'react';
import './Timeline.css';

// Icon + label for each event type
const EVENT_META = {
  report:     { icon: '📄', label: 'Report uploaded' },
  symptom:    { icon: '📝', label: 'Symptom logged' },
  cycle:      { icon: '🌸', label: 'Cycle logged' },
  onboarding: { icon: '🎉', label: 'Onboarding completed' },
};

export default function Timeline() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    document.title = 'Health Timeline · FemAssist';

    const reports = JSON.parse(localStorage.getItem('whc_reports') || '[]');
    const symptoms = JSON.parse(localStorage.getItem('whc_symptoms') || '[]');
    const cycles = JSON.parse(localStorage.getItem('whc_cycles') || '[]');
    const onboarding = JSON.parse(localStorage.getItem('whc_onboarding') || '{}');

    const all = [
      ...reports.map((r) => ({
        id: r.id,
        type: 'report',
        date: r.date,
        title: r.type,
        detail: `${r.values?.length || 0} values extracted`,
      })),
      ...symptoms.map((s) => ({
        id: s.id,
        type: 'symptom',
        date: s.date,
        title: `${s.symptoms.length} symptom${s.symptoms.length > 1 ? 's' : ''}`,
        detail: `Severity: ${s.severity}`,
      })),
      ...cycles.map((c) => ({
        id: c.id,
        type: 'cycle',
        date: c.date,
        title: `Flow: ${c.flow}`,
        detail: `Mood: ${c.mood}${c.symptoms?.length ? ` · ${c.symptoms.length} symptoms` : ''}`,
      })),
    ];

    if (onboarding.completedAt) {
      all.push({
        id: 'onb',
        type: 'onboarding',
        date: onboarding.completedAt,
        title: 'Welcome to FemAssist',
        detail: `${onboarding.name || 'You'} completed onboarding`,
      });
    }

    // Sort newest first
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    setEvents(all);
  }, []);

  const groupByDay = () => {
    const groups = {};
    events.forEach((e) => {
      const d = new Date(e.date);
      const key = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return groups;
  };

  const grouped = groupByDay();

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="tl">
      <h1 className="tl__title">📅 Health Timeline</h1>
      <p className="tl__subtitle">Every action, in one scrollable view.</p>

      {events.length === 0 ? (
        <div className="tl-empty">
          <span className="tl-empty__icon">🌱</span>
          <h3>Your journey starts here</h3>
          <p className="text-muted">
            Once you upload a report or log a symptom, it will appear here.
          </p>
        </div>
      ) : (
        <div className="tl__list">
          {Object.entries(grouped).map(([day, items]) => (
            <div key={day} className="tl-day">
              <div className="tl-day__label">{day}</div>
              <div className="tl-day__events">
                {items.map((e, i) => {
                  const meta = EVENT_META[e.type];
                  return (
                    <div
                      key={e.id}
                      className={`tl-event tl-event--${e.type}`}
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="tl-event__marker">
                        <span>{meta.icon}</span>
                      </div>
                      <div className="tl-event__body">
                        <div className="tl-event__head">
                          <strong>{meta.label}</strong>
                          <span className="tl-event__time">{formatTime(e.date)}</span>
                        </div>
                        <p className="tl-event__title">{e.title}</p>
                        <p className="tl-event__detail">{e.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}