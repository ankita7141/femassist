import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import './Features.css';

const TABS = [
  { id: 'profile',  icon: '👤', title: 'Smart Health Profile',  line: 'Tell us once. We remember.' },
  { id: 'records',  icon: '📄', title: 'Smart Health Records',  line: 'Upload. We read it for you.' },
  { id: 'brain',    icon: '🧠', title: 'Health Intelligence',   line: 'We connect the dots.' },
  { id: 'action',   icon: '💡', title: 'Personalized Action',   line: 'Your next step, clearly.' },
  { id: 'learning', icon: '📚', title: 'Personalized Learning', line: '2-minute lessons that fit you.' },
  { id: 'followup', icon: '🔔', title: 'Smart Follow-up',       line: 'Nothing slips through.' },
  { id: 'cycle',    icon: '🌸', title: 'Period Tracker',        line: 'Cycle-aware, when it matters.', badge: 'Applicable users' },
];

export default function Features() {
  useEffect(() => { document.title = 'Features · FemAssist'; }, []);
  const [active, setActive] = useState('profile');
  const [autoPlay, setAutoPlay] = useState(true);

 useEffect(() => {
  if (!autoPlay) return;
  const t = setInterval(() => {
    setActive((c) => {
      const i = TABS.findIndex((x) => x.id === c);
      return TABS[(i + 1) % TABS.length].id;
    });
  }, 3500);
  return () => clearInterval(t);
}, [autoPlay]);

  const handleTabClick = (id) => { setActive(id); setAutoPlay(false); };
  const activeTab = TABS.find((t) => t.id === active);

  return (
    <div className="features">
      <section className="feat-showcase container">
        <div className="feat-showcase__header">
          <h1 className="feat-showcase__title">Seven modules. One platform.</h1>
          <p className="feat-showcase__subtitle">Click any icon to explore.</p>
        </div>

        <div className="feat-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`feat-tab ${active === tab.id ? 'feat-tab--active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              aria-label={tab.title}
            >
              <span className="feat-tab__icon">{tab.icon}</span>
            </button>
          ))}
        </div>

        <div className="feat-stage">
          <div className="feat-stage__frame">
            <div className="feat-stage__header">
              <span className="feat-stage__icon">{activeTab.icon}</span>
              <div>
                <h3 className="feat-stage__title">{activeTab.title}</h3>
                <p className="feat-stage__line">{activeTab.line}</p>
              </div>
              {activeTab.badge && <Badge variant="accent">{activeTab.badge}</Badge>}
            </div>
            <div className="feat-stage__demo" key={active}>
              <FeatureDemo id={active} />
            </div>
          </div>
        </div>
      </section>

      <section className="feat-scroll">
        <div className="container">
          <h2 className="feat-scroll__title">Everything, connected.</h2>
          <div className="feat-scroll__grid">
            {TABS.map((tab, i) => (
              <div key={tab.id} className="feat-mini" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="feat-mini__icon">{tab.icon}</div>
                <strong className="feat-mini__title">{tab.title}</strong>
                <span className="feat-mini__line">{tab.line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-cta">
        <div className="container features-cta__inner">
          <h2 className="features-cta__title">All of it. Free to start.</h2>
          <div className="features-cta__actions">
            <Link to="/register"><Button variant="primary" size="lg">Get Started</Button></Link>
            <Link to="/how-it-works"><Button variant="ghost" size="lg">See How It Works</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureDemo({ id }) {
  if (id === 'profile') {
    return (
      <div className="demo demo-profile">
        <div className="demo-field"><span>Name</span><b>Ankita</b></div>
        <div className="demo-field"><span>Age</span><b>27</b></div>
        <div className="demo-field"><span>Blood group</span><b>O+</b></div>
        <div className="demo-field"><span>Conditions</span><b>None</b></div>
        <div className="demo-complete">✓ Profile complete</div>
      </div>
    );
  }
  if (id === 'records') {
    return (
      <div className="demo demo-records">
        <div className="demo-doc">
          <span className="demo-doc__icon">📄</span>
          <div className="demo-doc__scan" />
          <div className="demo-doc__rows">
            <div className="demo-doc__row"><span>Hemoglobin</span><b>10.2 g/dL</b><i>96%</i></div>
            <div className="demo-doc__row"><span>TSH</span><b>4.8 mIU/L</b><i>94%</i></div>
            <div className="demo-doc__row"><span>Vitamin D</span><b>18 ng/mL</b><i>98%</i></div>
          </div>
        </div>
      </div>
    );
  }
  if (id === 'brain') {
    return (
      <div className="demo demo-brain">
        <div className="brain-node brain-node--a">👤</div>
        <div className="brain-node brain-node--b">📄</div>
        <div className="brain-node brain-node--c">📝</div>
        <div className="brain-node brain-node--d">🌸</div>
        <div className="brain-core">🧠</div>
        <div className="brain-result">Pattern detected</div>
      </div>
    );
  }
  if (id === 'action') {
    return (
      <div className="demo demo-action">
        <div className="action-card action-card--insight">
          <span>🧠</span>
          <div>
            <strong>Hemoglobin trending down</strong>
            <p>Compared to your last record.</p>
          </div>
        </div>
        <div className="action-arrow">↓</div>
        <div className="action-card action-card--next">
          <span>💡</span>
          <div>
            <strong>Discuss with your doctor</strong>
            <p>Suggested in your next visit.</p>
          </div>
        </div>
      </div>
    );
  }
  if (id === 'learning') {
    return (
      <div className="demo demo-learning">
        <div className="lesson-card">
          <div className="lesson-card__top">
            <span>📚</span>
            <div>
              <strong>Understanding Hemoglobin</strong>
              <p>2 min lesson</p>
            </div>
          </div>
          <div className="lesson-bar"><div className="lesson-bar__fill" /></div>
          <div className="lesson-done">✓ Completed</div>
        </div>
      </div>
    );
  }
  if (id === 'followup') {
    return (
      <div className="demo demo-followup">
        <div className="followup-item"><span>🧪</span><div><strong>Review report</strong><p>Due in 3 days</p></div></div>
        <div className="followup-item"><span>📚</span><div><strong>Finish lesson</strong><p>Due tomorrow</p></div></div>
        <div className="followup-item"><span>🌸</span><div><strong>Log cycle</strong><p>Estimated in 5 days</p></div></div>
      </div>
    );
  }
  if (id === 'cycle') {
    return (
      <div className="demo demo-cycle">
        <div className="cycle-grid">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className={`cycle-day ${
                [4, 5, 6, 7, 8].includes(i) ? 'cycle-day--period' : ''
              } ${i === 14 ? 'cycle-day--ovulation' : ''} ${
                i === 20 ? 'cycle-day--today' : ''
              }`}
            />
          ))}
        </div>
        <div className="cycle-legend">
          <span><i className="dot dot--period" /> Period</span>
          <span><i className="dot dot--ovulation" /> Ovulation</span>
          <span><i className="dot dot--today" /> Today</span>
        </div>
        <div className="cycle-stat">Avg cycle: <b>29 days</b></div>
      </div>
    );
  }
  return null;
}