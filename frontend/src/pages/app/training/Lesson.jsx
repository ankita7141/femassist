import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { getLessonById, LESSONS } from './lessonsData';
import { trainingApi } from '../../../services/api';
import './Lesson.css';

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const l = getLessonById(id);
    setLesson(l);
    if (l) document.title = `${l.title} · FemAssist`;
    const load = async () => {
      try {
        const data = await trainingApi.getProgress();
        setProgress(data);
      } catch {
        // ignore — progress optional
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (!lesson) {
    return (
      <div className="lesson-notfound">
        <span>📚</span>
        <h1>Lesson not found</h1>
        <Link to="/app/training">
          <Button variant="primary">Back to Training</Button>
        </Link>
      </div>
    );
  }

  const isCompleted = progress[lesson.id]?.completed;

  const goToQuiz = () => {
    navigate(`/app/training/${lesson.id}/quiz`);
  };

  const nextLesson = LESSONS.find(
    (l) => l.id !== lesson.id && !progress[l.id]?.completed
  );

  return (
    <div className="lesson">
      <button className="lesson__back" onClick={() => navigate('/app/training')}>
        ← Back to Training
      </button>

      <div className="lesson__head">
        <div className="lesson__icon">{lesson.icon}</div>
        <div>
          <h1 className="lesson__title">{lesson.title}</h1>
          <p className="lesson__meta">
            ⏱ {lesson.duration}
            {isCompleted && <> · <span className="lesson__done">✓ Completed</span></>}
          </p>
        </div>
      </div>

      <div className="lesson__content">
        {lesson.content.map((block, i) => {
          if (block.type === 'text') {
            return (
              <p
                key={i}
                className="lesson__para"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {block.value}
              </p>
            );
          }
          if (block.type === 'callout') {
            return (
              <div
                key={i}
                className="lesson__callout"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span>🩺</span>
                <p>{block.value}</p>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="lesson__actions">
        <Button variant="primary" size="lg" fullWidth onClick={goToQuiz}>
          Continue to Quiz →
        </Button>
      </div>

      {nextLesson && (
        <div className="lesson__next">
          <h3 className="lesson__next-title">Up next</h3>
          <button
            className="lesson__next-card"
            onClick={() => navigate(`/app/training/${nextLesson.id}`)}
          >
            <div className="lesson__next-icon">{nextLesson.icon}</div>
            <div>
              <strong>{nextLesson.title}</strong>
              <p>⏱ {nextLesson.duration}</p>
            </div>
            <span className="lesson__next-arrow">→</span>
          </button>
        </div>
      )}
    </div>
  );
}