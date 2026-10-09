import { Outlet, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';
import './PublicLayout.css';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isSplash = pathname === '/splash';

  if (isSplash) {
    return (
      <div className="public-layout">
        <main className="public-layout__main">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="public-layout">
      <PublicNavbar />
      <main className="public-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}