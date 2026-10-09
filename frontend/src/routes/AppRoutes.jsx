import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import OnboardingLayout from '../layouts/OnboardingLayout';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Public
import Splash from '../pages/public/Splash';
import Home from '../pages/public/Home';
import Features from '../pages/public/Features';
import HowItWorks from '../pages/public/HowItWorks';
import About from '../pages/public/About';

// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Onboarding
import Consent from '../pages/onboarding/Consent';
import BasicInfo from '../pages/onboarding/BasicInfo';
import LifeStage from '../pages/onboarding/LifeStage';
import MenstrualInfo from '../pages/onboarding/MenstrualInfo';
import HealthProfile from '../pages/onboarding/HealthProfile';
import HealthGoals from '../pages/onboarding/HealthGoals';
import OnboardingComplete from '../pages/onboarding/OnboardingComplete';

// App
import Dashboard from '../pages/app/Dashboard';
import HealthRecords from '../pages/app/HealthRecords';
import Symptoms from '../pages/app/Symptoms';
import PeriodTracker from '../pages/app/period/PeriodTracker';

// Records
import UploadReport from '../pages/app/records/UploadReport';
import ReportDetails from '../pages/app/records/ReportDetails';

// Intelligence
import Intelligence from '../pages/app/intelligence/Intelligence';
import Timeline from '../pages/app/intelligence/Timeline';

// Training
import MyTraining from '../pages/app/training/MyTraining';
import Lesson from '../pages/app/training/Lesson';
import Quiz from '../pages/app/training/Quiz';

// Support
import FollowUps from '../pages/app/support/FollowUps';
import DoctorSummary from '../pages/app/support/DoctorSummary';
import EmergencyCard from '../pages/app/support/EmergencyCard';
import Profile from '../pages/app/support/Profile';
import Settings from '../pages/app/support/Settings';
import Privacy from '../pages/app/support/Privacy';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/splash" replace />} />

      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/splash" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Onboarding — requires login, but not completed onboarding */}
      <Route
        element={
          <ProtectedRoute requireOnboarding={false}>
            <OnboardingLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/onboarding/consent" element={<Consent />} />
        <Route path="/onboarding/basic-info" element={<BasicInfo />} />
        <Route path="/onboarding/life-stage" element={<LifeStage />} />
        <Route path="/onboarding/menstrual-info" element={<MenstrualInfo />} />
        <Route path="/onboarding/health-profile" element={<HealthProfile />} />
        <Route path="/onboarding/health-goals" element={<HealthGoals />} />
        <Route path="/onboarding/complete" element={<OnboardingComplete />} />
      </Route>

      {/* Main app — requires login + completed onboarding */}
      <Route
        element={
          <ProtectedRoute requireOnboarding={true}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app/health-records" element={<HealthRecords />} />
        <Route path="/app/health-records/upload" element={<UploadReport />} />
        <Route path="/app/health-records/:id" element={<ReportDetails />} />
        <Route path="/app/symptoms" element={<Symptoms />} />
        <Route path="/app/intelligence" element={<Intelligence />} />
        <Route path="/app/timeline" element={<Timeline />} />
        <Route path="/app/period-tracker" element={<PeriodTracker />} />
        <Route path="/app/training" element={<MyTraining />} />
        <Route path="/app/training/:id" element={<Lesson />} />
        <Route path="/app/training/:id/quiz" element={<Quiz />} />
        <Route path="/app/follow-ups" element={<FollowUps />} />
        <Route path="/app/doctor-summary" element={<DoctorSummary />} />
        <Route path="/app/emergency-card" element={<EmergencyCard />} />
        <Route path="/app/profile" element={<Profile />} />
        <Route path="/app/settings" element={<Settings />} />
        <Route path="/app/privacy" element={<Privacy />} />
      </Route>
    </Routes>
  );
}