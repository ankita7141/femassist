import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import './EmergencyCard.css';

export default function EmergencyCard() {
  const [data, setData] = useState({});
  const [contact, setContact] = useState({ name: '', phone: '', relation: '' });
  const [editing, setEditing] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    document.title = 'Emergency Card · FemAssist';
    setData(JSON.parse(localStorage.getItem('whc_onboarding') || '{}'));
    const c = JSON.parse(localStorage.getItem('whc_emergency_contact') || 'null');
    if (c) {
      setContact(c);
    } else {
      setEditing(true);
    }
  }, []);

  const handleSaveContact = () => {
    if (!contact.name || !contact.phone) return;
    localStorage.setItem('whc_emergency_contact', JSON.stringify(contact));
    setEditing(false);
    setFlash(true);
    setTimeout(() => setFlash(false), 1800);
  };

  const initials = (data.name || '?').charAt(0).toUpperCase();

  return (
    <div className="ec">
      <div className="ec__head no-print">
        <div>
          <h1 className="ec__title">🚨 Emergency Card</h1>
          <p className="ec__subtitle">
            Critical information, one tap away when it matters.
          </p>
        </div>
        <Button variant="ghost" onClick={() => window.print()}>
          🖨️ Print
        </Button>
      </div>

      {/* The card */}
      <div className="ec__card">
        <div className="ec__card-top">
          <div className="ec__avatar">{initials}</div>
          <div className="ec__identity">
            <h2>{data.name || 'Your name'}</h2>
            <p>{data.age ? `Age ${data.age}` : ''}{data.lifeStage ? ` · ${data.lifeStage}` : ''}</p>
          </div>
          <span className="ec__badge">🌸 FemAssist</span>
        </div>

        <div className="ec__grid">
          <div className="ec__stat">
            <span className="ec__stat-label">Blood Group</span>
            <strong className="ec__stat-value ec__stat-value--blood">{data.bloodGroup || '—'}</strong>
          </div>
          <div className="ec__stat">
            <span className="ec__stat-label">Height</span>
            <strong className="ec__stat-value">{data.height ? `${data.height} cm` : '—'}</strong>
          </div>
          <div className="ec__stat">
            <span className="ec__stat-label">Weight</span>
            <strong className="ec__stat-value">{data.weight ? `${data.weight} kg` : '—'}</strong>
          </div>
        </div>

        {data.allergies && (
          <div className="ec__block ec__block--danger">
            <span className="ec__block-icon">⚠️</span>
            <div>
              <span className="ec__block-label">Allergies</span>
              <strong>{data.allergies}</strong>
            </div>
          </div>
        )}

        {data.conditions && (
          <div className="ec__block">
            <span className="ec__block-icon">🩺</span>
            <div>
              <span className="ec__block-label">Important Conditions</span>
              <strong>{data.conditions}</strong>
            </div>
          </div>
        )}

        {data.medications && (
          <div className="ec__block">
            <span className="ec__block-icon">💊</span>
            <div>
              <span className="ec__block-label">Current Medications</span>
              <strong>{data.medications}</strong>
            </div>
          </div>
        )}

        {/* Emergency contact */}
        <div className="ec__contact">
          <div className="ec__contact-head">
            <span className="ec__block-icon">📞</span>
            <span className="ec__block-label">Emergency Contact</span>
            {!editing && (
              <button className="ec__edit no-print" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="ec__contact-form">
              <input
                type="text"
                placeholder="Name"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Relation (e.g. Sister)"
                value={contact.relation}
                onChange={(e) => setContact({ ...contact, relation: e.target.value })}
              />
              <button
                className="ec__save no-print"
                onClick={handleSaveContact}
                disabled={!contact.name || !contact.phone}
              >
                {flash ? '✓ Saved' : 'Save Contact'}
              </button>
            </div>
          ) : (
            <div className="ec__contact-info">
              <strong>{contact.name}</strong>
              <span className="ec__contact-phone">{contact.phone}</span>
              {contact.relation && <span className="ec__contact-rel">{contact.relation}</span>}
            </div>
          )}
        </div>

        <p className="ec__footer">
          For emergencies, always call local emergency services first.
        </p>
      </div>
    </div>
  );
}