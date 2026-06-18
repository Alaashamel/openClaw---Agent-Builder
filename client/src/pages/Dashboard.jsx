import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { MetricCard } from '../components/MetricCard.jsx';

export function Dashboard({ setActiveTab }) {
  const [evaluations, setEvaluations] = useState([]);
  const [rubrics, setRubrics] = useState([]);

  useEffect(() => {
    Promise.all([api('/evaluations'), api('/rubrics')]).then(([evals, rubs]) => {
      setEvaluations(evals.evaluations || []);
      setRubrics(rubs.rubrics || []);
    }).catch(() => {});
  }, []);

  const avgScore = evaluations.length
    ? Math.round(evaluations.reduce((sum, item) => sum + (item.result?.score || 0), 0) / evaluations.length)
    : 0;
  const criticalIssues = evaluations.reduce((sum, item) => sum + (item.result?.issues || []).filter((issue) => issue.severity === 'critical').length, 0);

  return (
    <section className="page-section">
      <div className="page-header">
        <span className="eyebrow">AI Agent Evaluation</span>
        <h1>Dashboard</h1>
        <p>Track agent trace quality, rubric coverage, workflow safety, and stored evaluation reports.</p>
      </div>
      <div className="metrics-grid">
        <MetricCard label="Stored Evaluations" value={evaluations.length} hint="MongoDB-backed reports" />
        <MetricCard label="Average Score" value={`${avgScore}%`} hint="Trace reliability" />
        <MetricCard label="Rubrics" value={rubrics.length} hint="Reusable scoring standards" />
        <MetricCard label="Critical Issues" value={criticalIssues} hint="Needs immediate review" />
      </div>
      <div className="quick-actions">
        <button onClick={() => setActiveTab('trace')}>Analyze new trace</button>
        <button onClick={() => setActiveTab('rubrics')}>Create rubric</button>
        <button onClick={() => setActiveTab('workflow')}>Run workflow simulation</button>
      </div>
      <div className="content-card">
        <h3>Latest Evaluations</h3>
        {!evaluations.length ? <p className="muted">No evaluations yet. Start with AgentTraceLab.</p> : evaluations.slice(0, 5).map((item) => (
          <div className="report-row" key={item._id}>
            <div><strong>{item.title}</strong><small>{new Date(item.createdAt).toLocaleString()}</small></div>
            <span>{item.result?.score}% · {item.result?.grade}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
