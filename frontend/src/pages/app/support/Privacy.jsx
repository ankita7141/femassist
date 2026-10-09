import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import './Privacy.css';

const BLOCKS = [
  {
    icon: '📥',
    title: 'What we store',
    items: [
      'Basic profile you entered (name, age, life stage)',
      'Health records you upload',
      'Symptoms and cycle logs you create',
      'Learning progress and quiz scores',
      'Emergency contact you add',
    ],
  },
  {
    icon: '🎯',
    title: 'Why we use it',
    items: [
      'To personalize lessons, insights, and follow-ups',
      'To show trends across your own reports',
      'To help you prepare a doctor summary',
      'Never to sell or share with advertisers',
    ],
  },
  {
    icon: '🔒',
    title: 'Where it lives',
    items: [
      'All data is stored on your own device',
      'Nothing is sent to a server in this prototype',
      'You can download or delete everything anytime',
    ],
  },
  {
    icon: '🩺',
    title: 'What we never do',
    items: [
      'Diagnose diseases',
      'Replace a healthcare professional',
      'Send your data to third parties',
      'Require you to share anything you don\'t want to',
    ],
  },
];

export default function Privacy() {
  useEffect(() => { document.title = 'Privacy · FemAssist'; }, []);

  return (
    <div className="priv">
      <div className="priv__head">
        <h1 className="priv__title">🔒 Your Privacy</h1>
        <p className="priv__subtitle">
          Health data is personal. Here's exactly how we handle yours.
        </p>
      </div>

      <div className="priv__grid">
        {BLOCKS.map((block, i) => (
          <div
            key={block.title}
            className="priv-block"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="priv-block__icon">{block.icon}</div>
            <h3 className="priv-block__title">{block.title}</h3>
            <ul className="priv-block__list">
              {block.items.map((item) => (
                <li key={item}>
                  <span className="priv-block__check">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="priv__warning">
        <span>⚠️</span>
        <div>
          <strong>Medical disclaimer</strong>
          <p>
            FemAssist is a health education and awareness tool. It does not
            diagnose diseases and does not replace a healthcare professional.
            Always consult a qualified doctor for medical decisions.
          </p>
        </div>
      </div>

      <div className="priv__actions">
        <Link to="/app/settings">
          <Button variant="ghost">← Back to Settings</Button>
        </Link>
      </div>
    </div>
  );
}