import './OptionCard.css';

export default function OptionCard({ icon, title, subtitle, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`opt-card ${selected ? 'opt-card--selected' : ''}`}
    >
      {icon && <div className="opt-card__icon">{icon}</div>}
      <div className="opt-card__text">
        <strong>{title}</strong>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </button>
  );
}