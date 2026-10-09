import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import './About.css';

const VALUES = [
  { icon: '🤝', title: 'Understand', line: 'We help you make sense of your own health data.' },
  { icon: '💗', title: 'Care',       line: 'Every recommendation is personal to your context.' },
  { icon: '🌟', title: 'Empower',    line: 'You stay in control, with clarity at every step.' },
];

export default function About() {
  useEffect(() => { document.title = 'About · FemAssist'; }, []);

  return (
    <div className="about">
      <section className="about-hero container">
        <Badge variant="accent">🌸 Our story</Badge>
        <h1 className="about-hero__title">Built for women,<br />by design.</h1>
        <p className="about-hero__subtitle">A health companion that connects the dots — so you don't have to.</p>
      </section>

      <section className="about-mission container">
        <div className="about-mission__card">
          <p className="about-mission__text">
            Most health apps are either cold databases or generic trackers.
            <strong> We wanted something warmer.</strong> A companion that
            listens to your context, learns from your own reports, and gives
            you clarity — not noise.
          </p>
        </div>
      </section>

      <section className="about-values container">
        <h2 className="about-values__title">What we stand for</h2>
        <div className="about-values__grid">
          {VALUES.map((v, i) => (
            <div key={v.title} className="about-value" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="about-value__icon">{v.icon}</div>
              <h3 className="about-value__title">{v.title}</h3>
              <p className="about-value__line">{v.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-disclaimer container">
        <div className="about-disclaimer__card">
          <div className="about-disclaimer__icon">🩺</div>
          <div>
            <h3 className="about-disclaimer__title">A clear boundary</h3>
            <p className="about-disclaimer__text">
              This platform is for <strong>health education and awareness</strong>.
              It does not diagnose diseases and does not replace a healthcare
              professional. Always consult a qualified doctor for medical decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container about-cta__inner">
          <h2 className="about-cta__title">Ready to begin?</h2>
          <Link to="/register"><Button variant="primary" size="lg">Create Free Account</Button></Link>
        </div>
      </section>
    </div>
  );
}