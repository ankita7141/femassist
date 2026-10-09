import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import './Home.css';

const QUICK_FEATURES = [
  { icon: '👤', title: 'Profile',      line: 'Tell us once.' },
  { icon: '📄', title: 'Records',      line: 'We read it for you.' },
  { icon: '🧠', title: 'Intelligence', line: 'We connect the dots.' },
  { icon: '💡', title: 'Action',       line: 'Your next step.' },
  { icon: '📚', title: 'Learning',     line: '2 minutes at a time.' },
  { icon: '🔔', title: 'Follow-up',    line: 'Nothing slips through.' },
  { icon: '🌸', title: 'Cycle',        line: 'Aware, when it matters.' },
];

const FLOW = [
  { icon: '📄', label: 'Upload' },
  { icon: '🔍', label: 'Extract' },
  { icon: '📊', label: 'Analyze' },
  { icon: '🧠', label: 'Detect' },
  { icon: '💡', label: 'Recommend' },
  { icon: '🔔', label: 'Track' },
];

export default function Home() {
  useEffect(() => { document.title = 'Home · FemAssist'; }, []);

  return (
    <div className="home">
      <section className="home-hero container">
        <div className="home-hero__text">
          <Badge variant="accent">🌸 Built for women</Badge>
          <h1 className="home-hero__title">
            Your body.<br />Finally understood.
          </h1>
          <p className="home-hero__subtitle">
            One place for your health records, insights, learning, and follow-ups.
          </p>
          <div className="home-hero__actions">
            <Link to="/register">
              <Button variant="primary" size="lg">Get Started</Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="ghost" size="lg">See how it works</Button>
            </Link>
          </div>
          <p className="home-hero__note">
            Free · Private · Health education, not diagnosis
          </p>
        </div>

        <div className="home-hero__preview">
          <div className="live-demo">
            <div className="live-demo__header">
              <div className="live-demo__dots"><span /><span /><span /></div>
              <span className="live-demo__label">Your Dashboard</span>
            </div>
            <div className="live-demo__body">
              <div className="live-card live-card--profile">
                <div className="live-card__row">
                  <span className="live-card__icon">👤</span>
                  <span className="live-card__label">Health Profile</span>
                  <span className="live-card__value">80%</span>
                </div>
                <div className="live-bar"><div className="live-bar__fill" /></div>
              </div>
              <div className="live-card live-card--report">
                <div className="live-card__row">
                  <span className="live-card__icon">📄</span>
                  <span className="live-card__label">Blood Report</span>
                  <span className="live-card__badge">Analyzing…</span>
                </div>
                <div className="live-values">
                  <div className="live-value"><span>Hb</span><b>10.2</b></div>
                  <div className="live-value"><span>TSH</span><b>4.8</b></div>
                  <div className="live-value"><span>Vit D</span><b>18</b></div>
                </div>
              </div>
              <div className="live-card live-card--insight">
                <span className="live-card__icon">🧠</span>
                <div className="live-card__insight-text">
                  <strong>New insight</strong>
                  <p>Hemoglobin slightly lower than your last record.</p>
                </div>
              </div>
              <div className="live-chip">💡 Review with doctor</div>
            </div>
          </div>
          <div className="float-chip float-chip--1">📚 2-min lesson ready</div>
          <div className="float-chip float-chip--2">🔔 Follow-up in 3 days</div>
        </div>
      </section>

      <section className="home-quick">
        <div className="container">
          <h2 className="home-quick__title">Everything, in one place.</h2>
          <div className="quick-grid">
            {QUICK_FEATURES.map((f, i) => (
              <div key={f.title} className="quick-item" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="quick-item__icon">{f.icon}</div>
                <div className="quick-item__text">
                  <strong>{f.title}</strong>
                  <span>{f.line}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-flow">
        <div className="container">
          <h2 className="home-flow__title">One upload. Six smart steps.</h2>
          <div className="flow-strip">
            <div className="flow-strip__line" />
            {FLOW.map((step, i) => (
              <div key={step.label} className="flow-step" style={{ animationDelay: `${i * 0.4}s` }}>
                <div className="flow-step__icon">{step.icon}</div>
                <span className="flow-step__label">{step.label}</span>
              </div>
            ))}
          </div>
          <div className="home-flow__cta">
            <Link to="/how-it-works">
              <Button variant="secondary">See the full example</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="container home-cta__inner">
          <h2 className="home-cta__title">Start in 2 minutes.</h2>
          <p className="home-cta__subtitle">Your companion is ready when you are.</p>
          <Link to="/register">
            <Button variant="primary" size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}