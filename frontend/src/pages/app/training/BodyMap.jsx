import './BodyMap.css';

const ZONE_LABELS = {
  head:  { label: 'Mental Well-being',    icon: '🧠' },
  chest: { label: 'Heart & Energy',       icon: '💗' },
  belly: { label: 'Menstrual & Hormonal', icon: '🌸' },
  bones: { label: 'Bone Health',          icon: '🦴' },
  legs:  { label: 'Movement & Fitness',   icon: '🏃' },
};

export default function BodyMap({ activeZone, onSelect, lessonCounts = {}, completedZones = [] }) {
  const handleClick = (zone) => {
    onSelect(activeZone === zone ? null : zone);
  };

  const zoneProps = (zone) => ({
    className: `bm-zone bm-zone--${zone} ${activeZone === zone ? 'bm-zone--active' : ''}`,
    onClick: () => handleClick(zone),
    role: 'button',
    tabIndex: 0,
    'aria-label': ZONE_LABELS[zone].label,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(zone);
      }
    },
  });

  return (
    <div className="bm">
      <svg
        viewBox="0 0 220 460"
        className="bm__svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Interactive body map"
      >
        <defs>
          <linearGradient id="bmBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF0F6" />
            <stop offset="100%" stopColor="#F3F0FF" />
          </linearGradient>
          <linearGradient id="bmActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8B4C8" />
            <stop offset="100%" stopColor="#C4A8F5" />
          </linearGradient>
        </defs>

        {/* Body silhouette (non-clickable, backdrop) */}
        <g className="bm__silhouette">
          {/* Head outline */}
          <ellipse cx="110" cy="55" rx="42" ry="46" fill="url(#bmBody)" stroke="#F0D5E4" strokeWidth="2" />
          {/* Neck */}
          <rect x="100" y="98" width="20" height="14" fill="url(#bmBody)" stroke="#F0D5E4" strokeWidth="2" />
          {/* Shoulders + torso */}
          <path
            d="M70 130 Q60 130 55 155 L50 300 Q50 330 65 335 L155 335 Q170 330 170 300 L165 155 Q160 130 150 130 Q135 118 110 118 Q85 118 70 130 Z"
            fill="url(#bmBody)"
            stroke="#F0D5E4"
            strokeWidth="2"
          />
          {/* Left arm */}
          <path d="M55 155 Q35 200 38 280 Q40 320 55 335 L65 330 Q55 300 58 260 Q62 200 75 160 Z" fill="url(#bmBody)" stroke="#F0D5E4" strokeWidth="2" />
          {/* Right arm */}
          <path d="M165 155 Q185 200 182 280 Q180 320 165 335 L155 330 Q165 300 162 260 Q158 200 145 160 Z" fill="url(#bmBody)" stroke="#F0D5E4" strokeWidth="2" />
          {/* Left leg */}
          <path d="M65 335 L60 400 Q58 440 75 445 L100 445 Q108 445 108 435 L108 335 Z" fill="url(#bmBody)" stroke="#F0D5E4" strokeWidth="2" />
          {/* Right leg */}
          <path d="M155 335 L160 400 Q162 440 145 445 L120 445 Q112 445 112 435 L112 335 Z" fill="url(#bmBody)" stroke="#F0D5E4" strokeWidth="2" />
        </g>

        {/* Clickable zones (transparent overlays) */}

        {/* HEAD */}
        <ellipse
          cx="110" cy="55" rx="42" ry="46"
          {...zoneProps('head')}
        />

        {/* CHEST (upper torso) */}
        <path
          d="M75 135 Q65 135 62 160 L60 220 L160 220 L158 160 Q155 135 145 135 Q130 125 110 125 Q90 125 75 135 Z"
          {...zoneProps('chest')}
        />

        {/* BELLY (lower torso) */}
        <path
          d="M60 225 L160 225 L158 300 Q158 328 145 333 L75 333 Q62 328 62 300 Z"
          {...zoneProps('belly')}
        />

        {/* BONES (spine line down the middle) */}
        <rect
          x="104" y="140" width="12" height="170" rx="6"
          {...zoneProps('bones')}
        />

        {/* LEGS */}
        <path
          d="M65 340 L62 400 Q60 435 75 440 L100 440 Q108 440 108 430 L108 340 Z"
          {...zoneProps('legs')}
        />
        <path
          d="M155 340 L158 400 Q160 435 145 440 L120 440 Q112 440 112 430 L112 340 Z"
          {...zoneProps('legs')}
        />

        {/* Completion dots */}
        {completedZones.map((zone) => {
          const dotPos = {
            head:  { x: 158, y: 55 },
            chest: { x: 175, y: 175 },
            belly: { x: 175, y: 280 },
            bones: { x: 130, y: 155 },
            legs:  { x: 175, y: 400 },
          }[zone];
          if (!dotPos) return null;
          return (
            <g key={zone} className="bm__done-dot">
              <circle cx={dotPos.x} cy={dotPos.y} r="9" fill="#10B981" />
              <text
                x={dotPos.x}
                y={dotPos.y + 4}
                textAnchor="middle"
                fontSize="11"
                fill="#fff"
                fontWeight="700"
              >✓</text>
            </g>
          );
        })}

        {/* Lesson count badges — shown on hover via CSS */}
        {Object.entries(lessonCounts).map(([zone, count]) => {
          if (count === 0) return null;
          const pos = {
            head:  { x: 110, y: 55 },
            chest: { x: 110, y: 175 },
            belly: { x: 110, y: 280 },
            bones: { x: 110, y: 155 },
            legs:  { x: 110, y: 400 },
          }[zone];
          if (!pos) return null;
          return (
            <text
              key={zone}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              className={`bm__count bm__count--${zone}`}
              fontSize="14"
              fontWeight="700"
              fill="#7C3AED"
            >
              {ZONE_LABELS[zone].icon}
            </text>
          );
        })}
      </svg>

      <div className="bm__legend">
        {Object.entries(ZONE_LABELS).map(([zone, meta]) => (
          <button
            key={zone}
            type="button"
            className={`bm__legend-item ${activeZone === zone ? 'bm__legend-item--active' : ''}`}
            onClick={() => handleClick(zone)}
          >
            <span>{meta.icon}</span>
            <span>{meta.label}</span>
            {lessonCounts[zone] ? <span className="bm__legend-count">{lessonCounts[zone]}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}