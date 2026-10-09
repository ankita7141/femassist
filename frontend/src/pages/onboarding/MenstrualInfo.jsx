import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import OptionCard from '../../components/OptionCard';
import { onboardingApi } from '../../services/api';
import './OnboardingPages.css';

export default function MenstrualInfo() {
  const navigate = useNavigate();
  const [hasPeriods, setHasPeriods] = useState(null);
  const [lastDate, setLastDate] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [periodDuration, setPeriodDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    document.title = 'Cycle Info · FemAssist';
    const load = async () => {
      try {
        const data = await onboardingApi.get();
        if (data.hasPeriods !== null && data.hasPeriods !== undefined) {
          setHasPeriods(data.hasPeriods);
        }
        if (data.lastPeriodDate) setLastDate(data.lastPeriodDate.split('T')[0]);
        if (data.avgCycleLength) setCycleLength(String(data.avgCycleLength));
        if (data.avgPeriodDuration) setPeriodDuration(String(data.avgPeriodDuration));
      } catch (err) {
        setServerError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleNext = async () => {
    setSaving(true);
    setServerError('');
    try {
      await onboardingApi.update({
        hasPeriods,
        lastPeriodDate: lastDate || null,
        avgCycleLength: cycleLength ? Number(cycleLength) : null,
        avgPeriodDuration: periodDuration ? Number(periodDuration) : null,
      });
      navigate('/onboarding/health-profile');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="onb-page">
        <div className="onb-icon">🌸</div>
        <p className="onb-subtitle">Loading…</p>
      </div>
    );
  }

  return (
    <div className="onb-page">
      <div className="onb-icon">🌸</div>
      <h1 className="onb-title">A quick cycle check</h1>
      <p className="onb-subtitle">This activates your Period Tracker. Skip if not relevant.</p>

      <div className="onb-options">
        <OptionCard
          icon="✓"
          title="Yes, I currently have periods"
          selected={hasPeriods === true}
          onClick={() => setHasPeriods(true)}
        />
        <OptionCard
          icon="✗"
          title="No, I don't have periods"
          selected={hasPeriods === false}
          onClick={() => setHasPeriods(false)}
        />
        <OptionCard
          icon="?"
          title="Not sure"
          selected={hasPeriods === 'unsure'}
          onClick={() => setHasPeriods('unsure')}
        />
      </div>

      {hasPeriods === true && (
        <div className="onb-form">
          <FormField
            id="ob-last-date" name="lastDate" label="Last period date" type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
          />
          <div className="onb-grid-2">
            <FormField
              id="ob-cycle" name="cycleLength" label="Average cycle length (days)" type="number"
              placeholder="e.g. 28"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
            />
            <FormField
              id="ob-duration" name="periodDuration" label="Average period duration (days)" type="number"
              placeholder="e.g. 5"
              value={periodDuration}
              onChange={(e) => setPeriodDuration(e.target.value)}
            />
          </div>
        </div>
      )}

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
          disabled={hasPeriods === null || saving}
        >
          {saving ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}