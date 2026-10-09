import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireOnboarding = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still loading initial auth state — show nothing (or a loader)
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          fontSize: '32px',
        }}
      >
        🌸
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Onboarding required but not done → go to consent
  if (requireOnboarding && !user.onboarding?.completed) {
    return <Navigate to="/onboarding/consent" replace />;
  }

  return children;
}