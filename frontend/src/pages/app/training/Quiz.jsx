import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { getLessonById, LESSONS } from './lessonsData';
import { trainingApi } from '../../../services/api';
import './Quiz.css';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const l = getLessonById(id);
    setLesson(l);
    if (l) document.title = `${l.title} · Quiz · FemAssist`;
  }, [id]);

  if (!lesson) {
    return (
      <div className="quiz-notfound">
        <span>📝</span>
        <h1>Quiz not found</h1>
        <Button variant="primary" onClick={() => navigate('/app/training')}>
          Back to Training
        </Button>
      </div>
    );
  }

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qIdx]: optIdx }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < lesson.quiz.length) return;

    let correct = 0;
    lesson.quiz.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    const finalScore = Math.round((correct / lesson.quiz.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    // Save progress to backend
    setSaving(true);
    setError('');
    try {
      await trainingApi.complete(lesson.id, finalScore);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const allAnswered = Object.keys(answers).length === lesson.quiz.length;
  const nextLesson = LESSONS.find((l) => l.id !== lesson.id);

  const getFeedback = () => {
    if (score >= 80) {
      return {
        icon: '🌟',
        title: 'Great work!',
        text: 'You nailed it. Ready for the next topic?',
        tone: 'good',
      };
    }
    if (score >= 50) {
      return {
        icon: '👍',
        title: 'Good effort',
        text: 'You got the basics. Consider a quick review before moving on.',
        tone: 'medium',
      };
    }
    return {
      icon: '🌱',
      title: 'Keep going',
      text: 'This topic takes a moment to click. Want to revisit the lesson?',
      tone: 'low',
    };
  };

  const feedback = getFeedback();

  return (
    <div className="quiz">
      <button className="quiz__back" onClick={() => navigate(`/app/training/${lesson.id}`)}>
        ← Back to Lesson
      </button>

      <div className="quiz__head">
        <div className="quiz__icon">📝</div>
        <div>
          <h1 className="quiz__title">Quick Quiz</h1>
          <p className="quiz__meta">{lesson.title}</p>
        </div>
      </div>

      {!submitted ? (
        <>
          <div className="quiz__questions">
            {lesson.quiz.map((q, qIdx) => (
              <div key={qIdx} className="quiz__q" style={{ animationDelay: `${qIdx * 0.08}s` }}>
                <p className="quiz__q-text">
                  <span className="quiz__q-num">{qIdx + 1}.</span> {q.q}
                </p>
                <div className="quiz__options">
                  {q.options.map((opt, optIdx) => {
                    const selected = answers[qIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        className={`quiz__opt ${selected ? 'quiz__opt--on' : ''}`}
                        onClick={() => handleSelect(qIdx, optIdx)}
                      >
                        <span className="quiz__opt-radio">{selected ? '●' : '○'}</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            disabled={!allAnswered || saving}
          >
            {saving ? 'Saving…' : 'Submit Answers'}
          </Button>
        </>
      ) : (
        <div className="quiz__result">
          <div className={`quiz__result-icon quiz__result-icon--${feedback.tone}`}>
            {feedback.icon}
          </div>
          <h2 className="quiz__result-title">{feedback.title}</h2>
          <p className="quiz__result-text">{feedback.text}</p>

          {error && (
            <div className="quiz__error">⚠️ {error}</div>
          )}

          <div className="quiz__score">
            <span className="quiz__score-num">{score}%</span>
            <span className="quiz__score-label">
              {lesson.quiz.filter((q, i) => answers[i] === q.answer).length} of {lesson.quiz.length} correct
            </span>
          </div>

          <div className="quiz__review">
            {lesson.quiz.map((q, qIdx) => {
              const userAnswer = answers[qIdx];
              const isCorrect = userAnswer === q.answer;
              return (
                <div key={qIdx} className="quiz__review-row">
                  <span className={`quiz__review-mark ${isCorrect ? 'quiz__review-mark--good' : 'quiz__review-mark--bad'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="quiz__review-body">
                    <p className="quiz__review-q">{q.q}</p>
                    <p className="quiz__review-a">
                      Correct: <strong>{q.options[q.answer]}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="quiz__result-actions">
            {score < 80 && (
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => navigate(`/app/training/${lesson.id}`)}
              >
                Revisit Lesson
              </Button>
            )}
            {nextLesson && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate(`/app/training/${nextLesson.id}`)}
              >
                Continue Learning →
              </Button>
            )}
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => navigate('/app/training')}
            >
              Back to Training
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}