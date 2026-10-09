import { Outlet, useLocation } from 'react-router-dom';
import './OnboardingLayout.css';

const STEPS = [
  'consent',
  'basic-info',
  'life-stage',
  'menstrual-info',
  'health-profile',
  'health-goals',
  'complete',
];

export default function OnboardingLayout() {
  const { pathname } = useLocation();
  const currentIndex = STEPS.findIndex((s) => pathname.includes(s));
  const currentStep = currentIndex === -1 ? 1 : currentIndex + 1;
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="onb-layout">
      <div className="onb-layout__container">
        <div className="onb-layout__progress-wrap">
          <div className="onb-layout__step-info">
            <span>Step {currentStep} of {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="onb-layout__progress-bar">
            <div className="onb-layout__progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}