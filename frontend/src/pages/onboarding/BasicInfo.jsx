import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import { onboardingApi } from '../../services/api';
import './OnboardingPages.css';

export default function BasicInfo() {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    document.title = 'Basic Info · FemAssist';
    const load = async () => {
      try {
        const data = await onboardingApi.get();
        if (data.age) setAge(String(data.age));
        if (data.dob) setDob(data.dob.split('T')[0]);
      } catch (err) {
        setServerError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleNext = async () => {
    const errs = {};
    if (!age) errs.age = 'Please enter your age';
    else if (Number(age) < 10 || Number(age) > 100) errs.age = 'Enter a valid age (10–100)';

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setServerError('');
    try {
      await onboardingApi.update({
        age: Number(age),
        dob: dob || null,
      });
      navigate('/onboarding/life-stage');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="onb-page">
        <div className="onb-icon">👤</div>
        <p className="onb-subtitle">Loading…</p>
      </div>
    );
  }

  return (
    <div className="onb-page">
      <div className="onb-icon">👤</div>
      <h1 className="onb-title">Let's start with basics</h1>
      <p className="onb-subtitle">Just so we can personalize things for you.</p>

      <div className="onb-form">
        <FormField
          id="ob-age" name="age" label="Age" type="number"
          placeholder="e.g. 27"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
            if (errors.age) setErrors((x) => ({ ...x, age: '' }));
          }}
          error={errors.age}
        />
        <FormField
          id="ob-dob" name="dob" label="Date of birth (optional)" type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          hint="Helps us tailor relevant content for your stage."
        />
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