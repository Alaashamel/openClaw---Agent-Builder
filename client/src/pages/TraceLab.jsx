import { useEffect, useMemo, useState } from 'react';
import { api, riskyTrace, sampleTrace } from '../lib/api.js';
import { IssueList } from '../components/IssueList.jsx';
import { RubricScoreTable } from '../components/RubricScoreTable.jsx';

export function TraceLab() {
  const [title, setTitle] = useState('Order status trace evaluation');
  const [traceText, setTraceText] = useState(JSON.stringify(sampleTrace, null, 2));
  const [rubrics, setRubrics] = useState([]);
  const [rubricId, setRubricId] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('');
  const selectedRubric = useMemo(() => rubrics.find((item) => item._id === rubricId), [rubrics, rubricId]);

  useEffect(() => {
    api('/rubrics').then((data) => {
      setRubrics(data.rubrics || []);
      if (data.rubrics?.[0]) setRubricId(data.rubrics[0]._id);
    }).catch(() => {});
  }, []);

  async function analyze(save = false) {
    setStatus('');
    try {
      const trace = JSON.parse(traceText);
      const endpoint = save ? '/evaluations' : '/evaluations/analyze';
      const data = await api(endpoint, {
        method: 'POST',
        body: JSON.stringify({ title, trace, rubric: selectedRubric || null })
      });
      setResult(save ? data.evaluation.result : data.result);
      setStatus(save ? 'Evaluation saved to MongoDB.' : 'Trace analyzed successfully.');
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  function downloadReport() {
    if (!result) return;
    const report = { title, trace: JSON.parse(traceText), result, generatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agent-trace-evaluation-report.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <span className="eyebrow">AgentTraceLab</span>
        <h1>Trace Evaluation & Debugging</h1>
        <p>Paste multi-step agent JSON traces, detect unsafe behavior, score rubrics, and store reports in MongoDB.</p>
      </div>
      <div className="studio-grid">
        <div className="content-card editor-card">
          <label>Evaluation title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label>Rubric<select value={rubricId} onChange={(e) => setRubricId(e.target.value)}>{rubrics.map((rubric) => <option key={rubric._id} value={rubric._id}>{rubric.title}</option>)}</select></label>
          <div className="button-row">
            <button onClick={() => setTraceText(JSON.stringify(sampleTrace, null, 2))}>Load safe sample</button>
            <button onClick={() => setTraceText(JSON.stringify(riskyTrace, null, 2))}>Load risky sample</button>
          </div>
          <textarea value={traceText} onChange={(e) => setTraceText(e.target.value)} spellCheck="false" />
          <div className="button-row">
            <button className="primary-button" onClick={() => analyze(false)}>Analyze only</button>
            <button onClick={() => analyze(true)}>Analyze & save</button>
            <button onClick={downloadReport} disabled={!result}>Export JSON</button>
          </div>
          {status && <div className="status-box">{status}</div>}
        </div>
        <div className="content-card">
          <h3>Result</h3>
          {!result ? <p className="muted">Run an analysis to see score, issues, rubric scoring, and recommendations.</p> : (
            <>
              <div className="score-ring"><strong>{result.score}%</strong><span>{result.grade}</span></div>
              <p>{result.summary}</p>
              <h4>Issues</h4>
              <IssueList issues={result.issues} />
              <h4>Rubric Scores</h4>
              <RubricScoreTable scores={result.rubricScores} />
              <h4>Recommendations</h4>
              <ul className="recommendations">{result.recommendations.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
