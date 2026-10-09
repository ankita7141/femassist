import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LESSONS, ZONES } from './lessonsData';
import BodyMap from './BodyMap';
import { trainingApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './MyTraining.css';

export default function MyTraining() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  const [activeZone, setActiveZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'My Training · FemAssist';
    const load = async () => {
      try {
        const data = await trainingApi.getProgress();
        setProgress(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getRecommended = () => {
    const onboarding = user?.onboarding || {};
    const goalMap = {
      anemia: 'hemoglobin',
      pcos: 'pcos-basics',
      menstrual: 'cycle-basics',
      nutrition: 'iron-rich-foods',
      mental: 'sleep-hormones',
      menopause: 'menopause-intro',
    };
    const goal = (onboarding.goals || []).find((g) => goalMap[g]);
    if (goal) return LESSONS.find((l) => l.id === goalMap[goal]);
    return LESSONS[0];
  };

  const recommended = getRecommended();

  const filteredLessons = activeZone
    ? LESSONS.filter((l) => l.zone === activeZone)
    : LESSONS;

  const completedCount = LESSONS.filter((l) => progress[l.id]?.completed).length;
  const totalLessons = LESSONS.length;
  const percent = Math.round((completedCount / totalLessons) * 100);

  const isCompleted = (id) => progress[id]?.completed;

  const lessonCounts = {};
  ZONES.forEach((z) => {
    lessonCounts[z.id] = LESSONS.filter((l) => l.zone === z.id).length;
  });

  const completedZones = ZONES
    .filter((z) => {
      const zoneLessons = LESSONS.filter((l) => l.zone === z.id);
      return zoneLessons.length > 0 && zoneLessons.every((l) => progress[l.id]?.completed);
    })
    .map((z) => z.id);

  const activeZoneMeta = ZONES.find((z) => z.id === activeZone);

  if (loading) {
    return (
      <div className="tr">
        <h1 className="tr__title">📚 My Training</h1>
        <p className="tr__subtitle">Loading…</p>
      </div>
    );
  }

  return (
    <div className="tr">
      <h1 className="tr__title">📚 My Training</h1>
      <p className="tr__subtitle">Tap a part of the body to explore lessons.</p>

      {error && <div className="tr__error">⚠️ {error}</div>}

      <div className="tr-progress">
        <div className="tr-progress__head">
          <div>
            <h3 className="tr-progress__title">Your Progress</h3>
            <p className="tr-progress__sub">
              {completedCount} of {totalLessons} lessons completed
            </p>
          </div>
          <div className="tr-progress__ring">
            <svg viewBox="0 0 36 36" className="tr-progress__svg">
              <path
                className="tr-progress__track"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="tr-progress__fill"
                strokeDasharray={`${percent}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="tr-progress__percent">{percent}%</span>
          </div>
        </div>
      </div>

      <div className="tr-section">
        <h2 className="tr-section__title">🌸 Know Your Body</h2>
        <p className="tr-section__hint">Tap a body area to see related lessons</p>
        <BodyMap
          activeZone={activeZone}
          onSelect={setActiveZone}
          lessonCounts={lessonCounts}
          completedZones={completedZones}
        />
      </div>

      {activeZoneMeta && (
        <div className="tr-filter-banner">
          <span className="tr-filter-banner__label">
            Showing: <strong>{activeZoneMeta.icon} {activeZoneMeta.label}</strong>
          </span>
          <button
            className="tr-filter-banner__clear"
            onClick={() => setActiveZone(null)}
          >
            Clear ×
          </button>
        </div>
      )}

      {!activeZone && (
        <div className="tr-section">
          <h2 className="tr-section__title">🎯 Recommended for You</h2>
          <div
            className="tr-hero-card"
            onClick={() => navigate(`/app/training/${recommended.id}`)}
          >
            <div className="tr-hero-card__icon">{recommended.icon}</div>
            <div className="tr-hero-card__body">
              <span className="tr-hero-card__tag">Because of your health context</span>
              <h3 className="tr-hero-card__title">{recommended.title}</h3>
              <p className="tr-hero-card__sub">{recommended.summary}</p>
              <div className="tr-hero-card__meta">
                <span>⏱ {recommended.duration}</span>
                {isCompleted(recommended.id) && <span className="tr-done-badge">✓ Completed</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tr-section">
        <h2 className="tr-section__title">
          {activeZone ? '📖 Lessons in this area' : '📚 All Lessons'}
        </h2>
        <div className="tr-lessons">
          {filteredLessons.map((lesson, i) => (
            <button
              key={lesson.id}
              className="tr-lesson"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => navigate(`/app/training/${lesson.id}`)}
            >
              <div className="tr-lesson__icon">{lesson.icon}</div>
              <div className="tr-lesson__body">
                <strong className="tr-lesson__title">{lesson.title}</strong>
                <span className="tr-lesson__meta">
                  ⏱ {lesson.duration}
                  {isCompleted(lesson.id) && (
                    <> · <span className="tr-lesson__done">✓ {progress[lesson.id]?.score ?? ''}% quiz</span></>
                  )}
                </span>
              </div>
              <span className="tr-lesson__arrow">→</span>
            </button>
          ))}
          {filteredLessons.length === 0 && (
            <div className="tr-empty">
              <p className="text-muted">No lessons in this area yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}