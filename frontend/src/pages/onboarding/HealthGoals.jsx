import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { onboardingApi } from '../../services/api';
import './OnboardingPages.css';

const GOALS = [
  { id: 'menstrual',  icon: '🌸', label: 'Menstrual Health' },
  { id: 'nutrition',  icon: '🥗', label: 'Nutrition' },
  { id: 'mental',     icon: '🧘', label: 'Mental Well-being' },
  { id: 'fitness',    icon: '🏃', label: 'Fitness' },
  { id: 'pregnancy',  icon: '🤰', label: 'Pregnancy' },
  { id: 'pcos',       icon: '💜', label: 'PCOS Awareness' },
  { id: 'anemia',     icon: '🩸', label: 'Anemia Awareness' },
  { id: 'menopause',  icon: '🌺', label: 'Menopause' },
  { id: 'general',    icon: '💗', label: "General Women's Health" },
];

export default function HealthGoals() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    document.title = 'Health Goals · FemAssist';
    const load = async () => {
      try {
        const data = await onboardingApi.get();
        if (Array.isArray(data.goals)) setSelected(data.goals);
      } catch (err) {
        setServerError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleNext = async () => {
    setSaving(true);
    setServerError('');
    try {
      await onboardingApi.update({ goals: selected });
      navigate('/onboarding/complete');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="onb-page">
        <div className="onb-icon">🎯</div>
        <p className="onb-subtitle">Loading…</p>
      </div>
    );
  }

  return (
    <div className="onb-page">
      <div className="onb-icon">🎯</div>
      <h1 className="onb-title">What would you like to focus on?</h1>
      <p className="onb-subtitle">Pick as many as you like. We'll personalize your learning.</p>

      <div className="onb-chips">
        {GOALS.map((goal) => (
          <button
            key={goal.id}
            type="button"
            className={`onb-chip ${selected.includes(goal.id) ? 'onb-chip--on' : ''}`}
            onClick={() => toggle(goal.id)}
          >
            <span>{goal.icon}</span>
            <span>{goal.label}</span>
          </button>
        ))}
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
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={selected.length === 0 || saving}
        >
          {saving ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}