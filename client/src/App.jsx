import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { AppShell } from './components/AppShell.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { TraceLab } from './pages/TraceLab.jsx';
import { RubricGuard } from './pages/RubricGuard.jsx';
import { WorkflowLab } from './pages/WorkflowLab.jsx';
import { Reports } from './pages/Reports.jsx';
import './styles/main.css';

function ProtectedApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) return <div className="loading-screen">Loading OpenClaw Agent Suite...</div>;
  if (!user) return <AuthPage />;

  const pages = {
    dashboard: <Dashboard setActiveTab={setActiveTab} />,
    trace: <TraceLab />,
    rubrics: <RubricGuard />,
    workflow: <WorkflowLab />,
    reports: <Reports />
  };

  return <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>{pages[activeTab]}</AppShell>;
}

export default function App() {
  return <AuthProvider><ProtectedApp /></AuthProvider>;
}
