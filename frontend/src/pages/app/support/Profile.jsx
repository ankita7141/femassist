import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import './Profile.css';

export default function Profile() {
  const [form, setForm] = useState({});
  const [original, setOriginal] = useState({});
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    document.title = 'Profile · FemAssist';
    const saved = JSON.parse(localStorage.getItem('whc_onboarding') || '{}');
    setForm(saved);
    setOriginal(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    const merged = { ...original, ...form };
    localStorage.setItem('whc_onboarding', JSON.stringify(merged));
    setOriginal(merged);
    setFlash(true);
    setTimeout(() => setFlash(false), 1800);
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(original);
  const initials = (form.name || '?').charAt(0).toUpperCase();

  return (
    <div className="prof">
      <div className="prof__head">
        <h1 className="prof__title">👤 Profile &amp; Settings</h1>
      </div>

      {/* Profile hero */}
      <div className="prof-hero">
        <div className="prof-hero__avatar">{initials}</div>
        <div className="prof-hero__info">
          <h2>{form.name || 'Your name'}</h2>
          <p>{form.age ? `Age ${form.age}` : ''}{form.lifeStage ? ` · ${form.lifeStage}` : ''}</p>
        </div>
      </div>

      {/* Personal Info */}
      <div className="prof-card">
        <h3 className="prof-card__title">Personal Information</h3>
        <div className="prof-grid">
          <label className="prof-field">
            <span>Name</span>
            <input name="name" value={form.name || ''} onChange={handleChange} />
          </label>
          <label className="prof-field">
            <span>Age</span>
            <input name="age" type="number" value={form.age || ''} onChange={handleChange} />
          </label>
          <label className="prof-field">
            <span>Date of Birth</span>
            <input name="dob" type="date" value={form.dob || ''} onChange={handleChange} />
          </label>
          <label className="prof-field">
            <span>Life Stage</span>
            <input name="lifeStage" value={form.lifeStage || ''} onChange={handleChange} />
          </label>
        </div>
      </div>

      {/* Health Info */}
      <div className="prof-card">
        <h3 className="prof-card__title">Health Information</h3>
        <div className="prof-grid">
          <label className="prof-field">
            <span>Height (cm)</span>
            <input name="height" type="number" value={form.height || ''} onChange={handleChange} />
          </label>
          <label className="prof-field">
            <span>Weight (kg)</span>
            <input name="weight" type="number" value={form.weight || ''} onChange={handleChange} />
          </label>
          <label className="prof-field">
            <span>Blood Group</span>
            <input name="bloodGroup" value={form.bloodGroup || ''} onChange={handleChange} />
          </label>
        </div>
      </div>

      {/* Medical */}
      <div className="prof-card">
        <h3 className="prof-card__title">Medical Details</h3>
        <div className="prof-grid">
          <label className="prof-field prof-field--wide">
            <span>Existing Conditions</span>
            <input name="conditions" value={form.conditions || ''} onChange={handleChange} />
          </label>
          <label className="prof-field prof-field--wide">
            <span>Allergies</span>
            <input name="allergies" value={form.allergies || ''} onChange={handleChange} />
          </label>
          <label className="prof-field prof-field--wide">
            <span>Current Medications</span>
            <input name="medications" value={form.medications || ''} onChange={handleChange} />
          </label>
        </div>
      </div>

      {/* Lifestyle */}
      <div className="prof-card">
        <h3 className="prof-card__title">Lifestyle</h3>
        <div className="prof-grid">
          <label className="prof-field">
            <span>Sleep (hours/night)</span>
            <input name="sleep" type="number" value={form.sleep || ''} onChange={handleChange} />
          </label>
          <label className="prof-field">
            <span>Activity (days/week)</span>
            <input name="activity" type="number" value={form.activity || ''} onChange={handleChange} />
          </label>
        </div>
      </div>

      {/* Save */}
      <div className="prof__actions">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          disabled={!isDirty}
        >
          {flash ? '✓ Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}