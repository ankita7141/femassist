import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import './Intelligence.css';

const SEVERITY_RANK = { mild: 1, moderate: 2, severe: 3 };

export default function Intelligence() {
  const [reports, setReports] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    document.title = 'Health Intelligence · FemAssist';
    setReports(JSON.parse(localStorage.getItem('whc_reports') || '[]'));
    setSymptoms(JSON.parse(localStorage.getItem('whc_symptoms') || '[]'));
    setCycles(JSON.parse(localStorage.getItem('whc_cycles') || '[]'));
  }, []);

  /* ---------- Insight generators ---------- */

  const generateInsights = () => {
    const list = [];

    // 1. Hemoglobin trend (if 2+ reports have Hemoglobin)
    const hbReports = reports
      .filter((r) => r.values?.some((v) => v.name.toLowerCase() === 'hemoglobin'))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (hbReports.length >= 2) {
      const first = hbReports[0].values.find((v) => v.name.toLowerCase() === 'hemoglobin');
      const last = hbReports[hbReports.length - 1].values.find((v) => v.name.toLowerCase() === 'hemoglobin');
      const firstVal = parseFloat(first.value);
      const lastVal = parseFloat(last.value);
      if (!isNaN(firstVal) && !isNaN(lastVal) && Math.abs(firstVal - lastVal) >= 0.5) {
        const direction = lastVal < firstVal ? 'downward' : 'upward';
        list.push({
          icon: '📉',
          type: direction === 'downward' ? 'warning' : 'info',
          title: `Hemoglobin trending ${direction}`,
          text: `Your hemoglobin went from ${first.value} to ${last.value} ${last.unit}. Consider discussing persistent changes with a healthcare professional.`,
        });
      }
    }

    // 2. Symptoms frequency (last 7 days)
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentSymptoms = symptoms.filter((s) => new Date(s.date).getTime() >= oneWeekAgo);
    if (recentSymptoms.length >= 3) {
      const allSymptoms = recentSymptoms.flatMap((s) => s.symptoms);
      const counts = {};
      allSymptoms.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      list.push({
        icon: '📝',
        type: 'info',
        title: `Frequent symptom: ${top[0]}`,
        text: `You logged "${top[0]}" ${top[1]} times in the last 7 days. Keep tracking to spot patterns.`,
      });
    }

    // 3. Severe symptoms check
    const severeLogs = symptoms.filter((s) => s.severity === 'severe');
    if (severeLogs.length > 0) {
      list.push({
        icon: '⚠️',
        type: 'warning',
        title: 'Severe symptoms logged',
        text: `You've logged severe symptoms ${severeLogs.length} time(s). Consider consulting a healthcare professional.`,
      });
    }

    // 4. Cycle length consistency
    if (cycles.length >= 2) {
      const gaps = [];
      for (let i = 0; i < cycles.length - 1; i++) {
        const gap = Math.abs(
          new Date(cycles[i].date).getTime() - new Date(cycles[i + 1].date).getTime()
        ) / (1000 * 60 * 60 * 24);
        gaps.push(Math.round(gap));
      }
      const avg = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
      list.push({
        icon: '🌸',
        type: 'info',
        title: `Average gap: ${avg} days`,
        text: `Based on your last ${cycles.length} cycle logs.`,
      });
    }

    // 5. Mood pattern
    if (cycles.length >= 3) {
      const lowMoods = cycles.filter((c) => c.mood === 'low').length;
      if (lowMoods >= 2) {
        list.push({
          icon: '🌧️',
          type: 'info',
          title: 'Low mood days noticed',
          text: `You've logged "low" mood ${lowMoods} times recently. Tracking mood alongside cycle can reveal patterns.`,
        });
      }
    }

    // 6. Empty state
    if (list.length === 0) {
      list.push({
        icon: '🌱',
        type: 'info',
        title: 'Not enough data yet',
        text: 'Upload a report or log a few symptoms and check back here.',
      });
    }

    return list;
  };

  const insights = generateInsights();

  /* ---------- Trends (simple bar chart of report values) ---------- */
  const generateTrends = () => {
    const hbReports = reports
      .filter((r) => r.values?.some((v) => v.name.toLowerCase() === 'hemoglobin'))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return hbReports.map((r) => {
      const hb = r.values.find((v) => v.name.toLowerCase() === 'hemoglobin');
      return {
        date: new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        value: parseFloat(hb.value),
        unit: hb.unit,
      };
    });
  };

  const trends = generateTrends();
  const maxTrend = trends.length ? Math.max(...trends.map((t) => t.value)) : 0;

  /* ---------- Patterns (cramps vs flow) ---------- */
  const generatePatterns = () => {
    const patterns = [];
    if (cycles.length >= 3) {
      const heavyDays = cycles.filter((c) => c.flow === 'heavy');
      const heavyWithCramps = heavyDays.filter((c) => c.symptoms?.includes('cramps'));
      if (heavyDays.length >= 2 && heavyWithCramps.length >= 2) {
        patterns.push({
          icon: '💢',
          title: 'Cramps on heavy-flow days',
          text: `Cramps logged on ${heavyWithCramps.length} of your last ${heavyDays.length} heavy-flow days.`,
        });
      }
      const lowMoodDays = cycles.filter((c) => c.mood === 'low');
      const lowMoodWithFatigue = lowMoodDays.filter((c) => c.symptoms?.includes('fatigue'));
      if (lowMoodDays.length >= 2 && lowMoodWithFatigue.length >= 2) {
        patterns.push({
          icon: '😴',
          title: 'Fatigue with low mood',
          text: `Fatigue appeared on ${lowMoodWithFatigue.length} of ${lowMoodDays.length} low-mood days.`,
        });
      }
    }
    if (patterns.length === 0) {
      patterns.push({
        icon: '🔍',
        title: 'No patterns yet',
        text: 'Keep logging to let patterns emerge over time.',
      });
    }
    return patterns;
  };

  const patterns = generatePatterns();

  /* ---------- Things to monitor ---------- */
  const generateMonitor = () => {
    const items = [];
    // Any value flagged "low" or "high" in the latest report
    const latest = reports[0];
    if (latest?.values) {
      latest.values.forEach((v) => {
        if (v.status === 'low' || v.status === 'high') {
          items.push({
            name: v.name,
            value: `${v.value} ${v.unit}`,
            status: v.status,
          });
        }
      });
    }
    return items;
  };

  const monitor = generateMonitor();

  return (
    <div className="int">
      <h1 className="int__title">🧠 Health Intelligence</h1>
      <p className="int__subtitle">
        Insights from your reports, symptoms, and cycles — all in one place.
      </p>

      {/* Tabs */}
      <div className="int__tabs">
        {[
          { id: 'insights', label: '💡 Insights' },
          { id: 'trends', label: '📈 Trends' },
          { id: 'patterns', label: '🔍 Patterns' },
          { id: 'monitor', label: '👁️ Monitor' },
        ].map((t) => (
          <button
            key={t.id}
            className={`int__tab ${activeTab === t.id ? 'int__tab--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---------- Insights ---------- */}
      {activeTab === 'insights' && (
        <div className="int__list">
          {insights.map((ins, i) => (
            <div
              key={i}
              className={`int-card int-card--${ins.type}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="int-card__icon">{ins.icon}</div>
              <div className="int-card__body">
                <strong>{ins.title}</strong>
                <p>{ins.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Trends ---------- */}
      {activeTab === 'trends' && (
        <div className="int__trends">
          {trends.length === 0 ? (
            <div className="int-empty">
              <span className="int-empty__icon">📈</span>
              <p>Upload 2+ reports to see trends over time.</p>
            </div>
          ) : (
            <>
              <p className="int__trends-label">
                Hemoglobin over time ({trends[0].unit})
              </p>
              <div className="int-chart">
                {trends.map((t, i) => {
                  const height = maxTrend ? (t.value / maxTrend) * 100 : 0;
                  return (
                    <div key={i} className="int-chart__col">
                      <div className="int-chart__bar-wrap">
                        <div
                          className="int-chart__bar"
                          style={{
                            height: `${height}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        >
                          <span className="int-chart__value">{t.value}</span>
                        </div>
                      </div>
                      <span className="int-chart__date">{t.date}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------- Patterns ---------- */}
      {activeTab === 'patterns' && (
        <div className="int__list">
          {patterns.map((p, i) => (
            <div
              key={i}
              className="int-card int-card--pattern"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="int-card__icon">{p.icon}</div>
              <div className="int-card__body">
                <strong>{p.title}</strong>
                <p>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Monitor ---------- */}
      {activeTab === 'monitor' && (
        <div className="int__monitor">
          {monitor.length === 0 ? (
            <div className="int-empty">
              <span className="int-empty__icon">👁️</span>
              <p>Nothing flagged. Keep uploading reports.</p>
            </div>
          ) : (
            monitor.map((m, i) => (
              <div
                key={i}
                className={`int-monitor int-monitor--${m.status}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="int-monitor__badge">{m.status}</span>
                <div>
                  <strong>{m.name}</strong>
                  <p>{m.value}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CTA */}
      <div className="int__cta">
        <Link to="/app/health-records/upload">
          <Button variant="secondary">Upload a new report</Button>
        </Link>
      </div>
    </div>
  );
}