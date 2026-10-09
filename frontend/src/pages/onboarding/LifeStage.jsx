import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import OptionCard from '../../components/OptionCard';
import { onboardingApi } from '../../services/api';
import './OnboardingPages.css';

const STAGES = [
  { id: 'teenage',      icon: '🌱', title: 'Teenage',              subtitle: 'Building healthy foundations' },
  { id: 'young-adult',  icon: '🌸', title: 'Young Adult',          subtitle: 'Reproductive age' },
  { id: 'pregnancy',    icon: '🤰', title: 'Pregnancy',            subtitle: 'Expecting' },
  { id: 'postpartum',   icon: '👶', title: 'Postpartum',           subtitle: 'After birth' },
  { id: 'perimenopause',icon: '🌺', title: '40+ / Perimenopause',  subtitle: 'Hormonal transition' },
  { id: 'menopause',    icon: '🌼', title: 'Menopause',            subtitle: 'Post-menopause' },
];

export default function LifeStage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    document.title = 'Life Stage · FemAssist';
    const load = async () => {
      try {
        const data = await onboardingApi.get();
        if (data.lifeStage) setSelected(data.lifeStage);
      } catch (err) {
        setServerError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleNext = async () => {
    if (!selected) return;

    setSaving(true);
    setServerError('');
    try {
      await onboardingApi.update({ lifeStage: selected });

      // Conditional routing: skip menstrual info for non-applicable stages
      if (selected === 'menopause' || selected === 'pregnancy') {
        navigate('/onboarding/health-profile');
      } else {
        navigate('/onboarding/menstrual-info');
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="onb-page">
        <div className="onb-icon">🌷</div>
        <p className="onb-subtitle">Loading…</p>
      </div>
    );
  }

  return (
    <div className="onb-page">
      <div className="onb-icon">🌷</div>
      <h1 className="onb-title">Which stage best describes you?</h1>
      <p className="onb-subtitle">This helps us show only what's relevant.</p>

      <div className="onb-options">
        {STAGES.map((stage) => (
          <OptionCard
            key={stage.id}
            icon={stage.icon}
            title={stage.title}
            subtitle={stage.subtitle}
            selected={selected === stage.id}
            onClick={() => setSelected(stage.id)}
          />
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
          disabled={!selected || saving}
        >
          {saving ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}