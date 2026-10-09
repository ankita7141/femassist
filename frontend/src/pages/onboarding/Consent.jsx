import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { onboardingApi } from '../../services/api';
import './OnboardingPages.css';

export default function Consent() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Consent · FemAssist';
    const load = async () => {
      try {
        const data = await onboardingApi.get();
        if (data.consentAccepted) setAgreed(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    load();
  }, []);

  const handleContinue = async () => {
    setSaving(true);
    setError('');
    try {
      await onboardingApi.update({ consentAccepted: true });
      navigate('/onboarding/basic-info');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="onb-page">
        <div className="onb-icon">🔒</div>
        <p className="onb-subtitle">Loading…</p>
      </div>
    );
  }

  return (
    <div className="onb-page">
      <div className="onb-icon">🔒</div>
      <h1 className="onb-title">Your privacy matters</h1>
      <p className="onb-subtitle">
        Before we begin, here's how we handle your information.
      </p>

      <div className="onb-block">
        <h4>What we collect</h4>
        <ul>
          <li>Basic health information (age, life stage)</li>
          <li>Health records you upload</li>
          <li>Symptoms and cycle information — only if you choose</li>
          <li>Learning activity</li>
        </ul>
      </div>

      <div className="onb-block">
        <h4>Why we collect it</h4>
        <ul>
          <li>To provide personalized health awareness</li>
          <li>To recommend relevant lessons and follow-ups</li>
          <li>To help you track your own health over time</li>
        </ul>
      </div>

      <div className="onb-warning">
        <span>⚠️</span>
        <p>
          This platform is for health <strong>education and awareness only</strong>.
          It does not diagnose diseases or replace a healthcare professional.
        </p>
      </div>

      <label className="onb-check">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          I understand and agree to the Terms & Privacy. I understand this
          platform does not provide medical diagnosis.
        </span>
      </label>

      {error && (
        <div className="onb-warning">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <div className="onb-actions">
        <span />
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!agreed || saving}
        >
          {saving ? 'Saving…' : 'I Understand & Continue'}
        </Button>
      </div>
    </div>
  );
}