import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { onboardingApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './OnboardingPages.css';

export default function OnboardingComplete() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'All Set · FemAssist';
    const finish = async () => {
      try {
        await onboardingApi.complete();
        // Refresh user so AuthContext knows onboarding is done
        await refreshUser();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    finish();
  }, [refreshUser]);

  const handleGoToDashboard = async () => {
    setSaving(true);
    try {
      await refreshUser(); // ensure latest state
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="onb-page">
        <div className="onb-icon">🎉</div>
        <p className="onb-subtitle">Finishing up…</p>
      </div>
    );
  }

  return (
    <div className="onb-page">
      <div className="onb-celebration">
        <div className="onb-celebration__icon">🎉</div>
        <h1 className="onb-title">You're all set! 🌸</h1>
        <p className="onb-subtitle">
          Your personalized health companion is ready.
        </p>

        {error && (
          <div className="onb-warning">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={handleGoToDashboard}
          disabled={saving}
        >
          {saving ? 'Opening…' : 'Go to Dashboard'}
        </Button>
      </div>
    </div>
  );
}