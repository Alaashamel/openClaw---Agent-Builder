import { Activity, ClipboardCheck, FileText, Gauge, GitBranch, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'trace', label: 'AgentTraceLab', icon: Activity },
  { id: 'rubrics', label: 'RubricGuard', icon: ClipboardCheck },
  { id: 'workflow', label: 'TaskFlow Agent', icon: GitBranch },
  { id: 'reports', label: 'Reports', icon: FileText }
];

export function AppShell({ activeTab, setActiveTab, children }) {
  const { user, logout } = useAuth();
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={24} /></div>
          <div>
            <strong>OpenClaw Suite</strong>
            <span>Agent Evaluation Lab</span>
          </div>
        </div>
        <nav className="nav-list">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-card">
          <span className="eyebrow">Reviewer</span>
          <strong>{user?.name}</strong>
          <small>{user?.email}</small>
          <button className="ghost-button" onClick={logout}><LogOut size={16} /> Logout</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
