import './SymptomPicker.css';

export const SYMPTOM_OPTIONS = [
  { id: 'headache', icon: '🤕', label: 'Headache' },
  { id: 'cramps',   icon: '💢', label: 'Cramps' },
  { id: 'fatigue',  icon: '😴', label: 'Fatigue' },
  { id: 'bloating', icon: '🎈', label: 'Bloating' },
  { id: 'backpain', icon: '🦴', label: 'Back Pain' },
  { id: 'nausea',   icon: '🤢', label: 'Nausea' },
  { id: 'mood',     icon: '🌧️', label: 'Mood Changes' },
  { id: 'other',    icon: '➕', label: 'Other' },
];

export default function SymptomPicker({ selected = [], onToggle }) {
  return (
    <div className="sym-picker">
      {SYMPTOM_OPTIONS.map((s) => {
        const isOn = selected.includes(s.id);
        return (
          <button
            key={s.id}
            type="button"
            className={`sym-chip ${isOn ? 'sym-chip--on' : ''}`}
            onClick={() => onToggle(s.id)}
          >
            <span className="sym-chip__icon">{s.icon}</span>
            <span>{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}