import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => { document.title = 'Login · FemAssist'; }, []);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate(user.onboarding?.completed ? '/app/dashboard' : '/onboarding/consent', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((x) => ({ ...x, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const data = await login(form.email, form.password);
      const completed = data.onboarding?.completed;
      navigate(completed ? '/app/dashboard' : '/onboarding/consent', { replace: true });
    } catch (error) {
      setServerError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1 className="auth-page__title">Welcome back 🌸</h1>
        <p className="auth-page__subtitle">Sign in to continue to your companion.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="login-email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          disabled={loading}
        />
        <FormField
          id="login-password"
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          disabled={loading}
        />

        <div className="auth-page__row">
          <label className="auth-page__checkbox">
            <input type="checkbox" /> <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="auth-page__link">
            Forgot password?
          </Link>
        </div>

        {serverError && (
          <div className="auth-page__server-error">
            ⚠️ {serverError}
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </Button>
      </form>

      <p className="auth-page__footer">
        Don't have an account?{' '}
        <Link to="/register" className="auth-page__link">Create account</Link>
      </p>
    </div>
  );
}