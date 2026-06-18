import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { IssueList } from '../components/IssueList.jsx';

export function Reports() {
  const [evaluations, setEvaluations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  function load() {
    api('/evaluations').then((data) => setEvaluations(data.evaluations || [])).catch((err) => setMessage(err.message));
  }
  useEffect(load, []);

  async function remove(id) {
    await api(`/evaluations/${id}`, { method: 'DELETE' });
    setSelected(null);
    load();
  }

  function exportSelected() {
    if (!selected) return;
    const blob = new Blob([JSON.stringify(selected, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <span className="eyebrow">Reports</span>
        <h1>Saved Evaluation Reports</h1>
        <p>Review saved MongoDB reports, inspect issues, export JSON, and delete old evaluations.</p>
      </div>
      {message && <div className="status-box">{message}</div>}
      <div className="studio-grid">
        <div className="content-card">
          <h3>Reports</h3>
          {!evaluations.length ? <p className="muted">No saved reports yet.</p> : evaluations.map((item) => (
            <button className={`report-button ${selected?._id === item._id ? 'active' : ''}`} key={item._id} onClick={() => setSelected(item)}>
              <strong>{item.title}</strong>
              <small>{item.result?.score}% · {item.result?.grade}</small>
            </button>
          ))}
        </div>
        <div className="content-card">
          {!selected ? <p className="muted">Select a report to preview.</p> : (
            <>
              <div className="report-heading"><div><h3>{selected.title}</h3><small>{new Date(selected.createdAt).toLocaleString()}</small></div><span>{selected.result?.score}%</span></div>
              <p>{selected.result?.summary}</p>
              <IssueList issues={selected.result?.issues || []} />
              <div className="button-row">
                <button onClick={exportSelected}>Export report</button>
                <button className="danger-button" onClick={() => remove(selected._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
