import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import './HowItWorks.css';

const STEPS = [
  { num: '01', icon: '📄', title: 'Collect',   line: 'You upload a report or log a symptom.' },
  { num: '02', icon: '🔍', title: 'Extract',   line: 'Values are read from your document.' },
  { num: '03', icon: '📊', title: 'Analyze',   line: 'Compared with your own health history.' },
  { num: '04', icon: '🧠', title: 'Detect',    line: 'Meaningful changes are noticed.' },
  { num: '05', icon: '💡', title: 'Recommend', line: 'A simple explanation and next step.' },
  { num: '06', icon: '🔔', title: 'Track',     line: 'A follow-up is added to your timeline.' },
];

const EXAMPLE = [
  { time: 'Step 1', icon: '📄', label: 'Blood report uploaded',    detail: 'You uploaded a lab report' },
  { time: 'Step 2', icon: '🔍', label: '3 values extracted',        detail: 'Hb 10.2 · TSH 4.8 · Vit D 18' },
  { time: 'Step 3', icon: '📊', label: 'Compared with last record', detail: 'Hb was 11.4 last time' },
  { time: 'Step 4', icon: '🧠', label: 'A change was detected',     detail: 'Hemoglobin trending down' },
  { time: 'Step 5', icon: '💡', label: 'Next step suggested',       detail: 'Discuss with your doctor' },
  { time: 'Step 6', icon: '🔔', label: 'Follow-up created',         detail: 'Reminder set for next visit' },
];

export default function HowItWorks() {
  useEffect(() => { document.title = 'How It Works · FemAssist'; }, []);

  return (
    <div className="hiw">
      <section className="hiw-hero container">
        <Badge variant="accent">How it works</Badge>
        <h1 className="hiw-hero__title">One upload.<br />Six smart steps.</h1>
        <p className="hiw-hero__subtitle">From raw data to a clear next step — in seconds.</p>
      </section>

      <section className="hiw-flow container">
        <div className="hiw-flow__rail" aria-hidden="true" />
        {STEPS.map((step, i) => (
          <div key={step.num} className="hiw-step" style={{ animationDelay: `${i * 0.12}s` }}>
            <div className="hiw-step__dot"><span>{step.icon}</span></div>
            <div className="hiw-step__card">
              <div className="hiw-step__num">Step {step.num}</div>
              <h3 className="hiw-step__title">{step.title}</h3>
              <p className="hiw-step__line">{step.line}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="hiw-example">
        <div className="container">
          <div className="hiw-example__head">
            <h2 className="hiw-example__title">A real example</h2>
            <p className="hiw-example__subtitle">Meet Ankita. She just uploaded a blood report.</p>
          </div>

          <div className="hiw-timeline">
            {EXAMPLE.map((item, i) => (
              <div key={item.label} className="hiw-tl-item" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                <div className="hiw-tl-item__marker"><span>{item.icon}</span></div>
                <div className="hiw-tl-item__body">
                  <span className="hiw-tl-item__time">{item.time}</span>
                  <strong className="hiw-tl-item__label">{item.label}</strong>
                  <p className="hiw-tl-item__detail">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hiw-example__result">
            <span className="hiw-example__result-icon">🧠</span>
            <div>
              <strong>A change was observed.</strong>
              <p>Please discuss it with your doctor.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-principle container">
        <div className="hiw-principle__card">
          <div className="hiw-principle__left"><span className="hiw-principle__icon">🌸</span></div>
          <div className="hiw-principle__right">
            <h3>Enter once. Use everywhere.</h3>
            <p>Your profile, reports, symptoms, and cycle data flow through every module — automatically.</p>
          </div>
        </div>
      </section>

      <section className="hiw-cta">
        <div className="container hiw-cta__inner">
          <h2 className="hiw-cta__title">Ready to see it in action?</h2>
          <div className="hiw-cta__actions">
            <Link to="/register"><Button variant="primary" size="lg">Get Started</Button></Link>
            <Link to="/features"><Button variant="ghost" size="lg">Explore Features</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}