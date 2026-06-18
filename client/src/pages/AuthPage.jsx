import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: 'Alaa Shamel', email: 'demo@agentlab.dev', password: 'DemoPass123!' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="brand huge"><ShieldCheck size={32} /><strong>OpenClaw Agent Suite</strong></div>
        <h1>Production-ready AI agent evaluation lab.</h1>
        <p>Review traces, write rubrics, detect unsafe workflows, run mock agent tasks, and export clear evaluation reports.</p>
        <div className="hero-grid">
          <span>JWT Auth</span><span>MongoDB</span><span>Trace Debugging</span><span>Rubric Scoring</span><span>Workflow Safety</span><span>Tests</span>
        </div>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">Reviewer Portal</span>
        <h2>{mode === 'login' ? 'Login' : 'Create account'}</h2>
        {mode === 'register' && <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error && <div className="error-box">{error}</div>}
        <button className="primary-button" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}</button>
        <button type="button" className="link-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        </button>
        <small>Demo after seeding: demo@agentlab.dev / DemoPass123!</small>
      </form>
    </div>
  );
}
