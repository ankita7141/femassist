import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import { onboardingApi } from '../../services/api';
import './OnboardingPages.css';

const EMPTY_FORM = {
  height: '', weight: '', bloodGroup: '',
  conditions: '', allergies: '', medications: '',
  sleep: '', activity: '',
};

export default function HealthProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    document.title = 'Health Profile · FemAssist';
    const load = async () => {
      try {
        const data = await onboardingApi.get();
        setForm({
          height: data.height ?? '',
          weight: data.weight ?? '',
          bloodGroup: data.bloodGroup ?? '',
          conditions: data.conditions ?? '',
          allergies: data.allergies ?? '',
          medications: data.medications ?? '',
          sleep: data.sleep ?? '',
          activity: data.activity ?? '',
        });
      } catch (err) {
        setServerError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleNext = async () => {
    setSaving(true);
    setServerError('');
    try {
      // Convert numeric fields
      const payload = {
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        bloodGroup: form.bloodGroup || '',
        conditions: form.conditions || '',
        allergies: form.allergies || '',
        medications: form.medications || '',
        sleep: form.sleep ? Number(form.sleep) : null,
        activity: form.activity ? Number(form.activity) : null,
      };
      await onboardingApi.update(payload);
      navigate('/onboarding/health-goals');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="onb-page">
        <div className="onb-icon">🩺</div>
        <p className="onb-subtitle">Loading…</p>
      </div>
    );
  }

  return (
    <div className="onb-page">
      <div className="onb-icon">🩺</div>
      <h1 className="onb-title">Your health profile</h1>
      <p className="onb-subtitle">
        Everything is optional. Fill in what you're comfortable sharing.
      </p>

      <div className="onb-form">
        <div className="onb-grid-2">
          <FormField id="ob-height" name="height" label="Height (cm)" type="number"
            placeholder="e.g. 162" value={form.height} onChange={handleChange} />
          <FormField id="ob-weight" name="weight" label="Weight (kg)" type="number"
            placeholder="e.g. 55" value={form.weight} onChange={handleChange} />
        </div>

        <FormField id="ob-blood" name="bloodGroup" label="Blood group" type="text"
          placeholder="e.g. O+, A-, B+" value={form.bloodGroup} onChange={handleChange} />

        <FormField id="ob-conditions" name="conditions" label="Existing conditions (optional)" type="text"
          placeholder="e.g. PCOS, thyroid" value={form.conditions} onChange={handleChange} />

        <FormField id="ob-allergies" name="allergies" label="Allergies (optional)" type="text"
          placeholder="e.g. penicillin, peanuts" value={form.allergies} onChange={handleChange} />

        <FormField id="ob-meds" name="medications" label="Current medications (optional)" type="text"
          placeholder="e.g. iron supplement" value={form.medications} onChange={handleChange} />

        <div className="onb-grid-2">
          <FormField id="ob-sleep" name="sleep" label="Sleep (hours/night)" type="number"
            placeholder="e.g. 7" value={form.sleep} onChange={handleChange} />
          <FormField id="ob-activity" name="activity" label="Activity (days/week)" type="number"
            placeholder="e.g. 3" value={form.activity} onChange={handleChange} />
        </div>
      </div>

      {serverError && (
        <div className="onb-warning">
          <span>⚠️</span>
          <p>{serverError}</p>
        </div>
      )}

      <div className="onb-actions">
        <Button variant="ghost" size="lg" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="primary" size="lg" onClick={handleNext} disabled={saving}>
          {saving ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}