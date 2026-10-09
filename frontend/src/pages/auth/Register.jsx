import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function Register() {
  const navigate = useNavigate();
  const { register, user } = useAuth();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', agree: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => { document.title = 'Create Account · FemAssist'; }, []);

  useEffect(() => {
    if (user) {
      navigate(user.onboarding?.completed ? '/app/dashboard' : '/onboarding/consent', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((x) => ({ ...x, [name]: '' }));
    if (serverError) setServerError('');
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 2) return { label: 'Weak', cls: 'weak' };
    if (score <= 4) return { label: 'Medium', cls: 'medium' };
    return { label: 'Strong', cls: 'strong' };
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (!form.confirm) errs.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    if (!form.agree) errs.agree = 'Please accept the terms to continue';
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
      await register(form.name, form.email, form.password);
      navigate('/onboarding/consent', { replace: true });
    } catch (error) {
      setServerError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength();

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1 className="auth-page__title">Create your account 🌸</h1>
        <p className="auth-page__subtitle">Two minutes now. Personalization for life.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="reg-name" name="name" label="Name" type="text"
          placeholder="Your full name"
          value={form.name} onChange={handleChange}
          error={errors.name} autoComplete="name" disabled={loading}
        />
        <FormField
          id="reg-email" name="email" label="Email" type="email"
          placeholder="you@example.com"
          value={form.email} onChange={handleChange}
          error={errors.email} autoComplete="email" disabled={loading}
        />
        <FormField
          id="reg-password" name="password" label="Password" type="password"
          placeholder="Minimum 6 characters"
          value={form.password} onChange={handleChange}
          error={errors.password}
          hint={strength ? (
            <span className={`pw-strength pw-strength--${strength.cls}`}>
              Password strength: <strong>{strength.label}</strong>
            </span>
          ) : null}
          autoComplete="new-password" disabled={loading}
        />
        <FormField
          id="reg-confirm" name="confirm" label="Confirm password" type="password"
          placeholder="Re-enter your password"
          value={form.confirm} onChange={handleChange}
          error={errors.confirm} autoComplete="new-password" disabled={loading}
        />

        <label className="auth-page__checkbox auth-page__checkbox--terms">
          <input
            type="checkbox" name="agree"
            checked={form.agree} onChange={handleChange}
            disabled={loading}
          />
          <span>
            I agree to the{' '}
            <Link to="/app/privacy" className="auth-page__link">Terms &amp; Privacy</Link>
          </span>
        </label>
        {errors.agree && (
          <span className="form-field__error" style={{ marginTop: -6 }}>{errors.agree}</span>
        )}

        {serverError && (
          <div className="auth-page__server-error">
            ⚠️ {serverError}
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="auth-page__footer">
        Already have an account?{' '}
        <Link to="/login" className="auth-page__link">Login</Link>
      </p>
    </div>
  );
}