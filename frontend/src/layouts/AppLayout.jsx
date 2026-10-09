import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/layout/AppSidebar';
import AppTopbar from '../components/layout/AppTopbar';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-layout__main">
        <AppTopbar />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}