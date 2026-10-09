import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import './AuthPages.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => { document.title = 'Forgot Password · FemAssist'; }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-page__success">
          <div className="auth-page__success-icon">📬</div>
          <h1 className="auth-page__title">Check your email</h1>
          <p className="auth-page__subtitle">
            We've sent a reset link to <strong>{email}</strong>. Follow the
            link to set a new password.
          </p>
          <Link to="/login" style={{ width: '100%' }}>
            <Button variant="primary" size="lg" fullWidth>Back to Login</Button>
          </Link>
          <p className="auth-page__footer">
            Didn't get the email?{' '}
            <button
              type="button"
              className="auth-page__link auth-page__link--button"
              onClick={() => setSent(false)}
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1 className="auth-page__title">Forgot password? 🔒</h1>
        <p className="auth-page__subtitle">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="forgot-email" name="email" label="Email" type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
          error={error} autoComplete="email" disabled={loading}
        />
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </Button>
      </form>

      <p className="auth-page__footer">
        Remembered it?{' '}
        <Link to="/login" className="auth-page__link">Back to Login</Link>
      </p>
    </div>
  );
}