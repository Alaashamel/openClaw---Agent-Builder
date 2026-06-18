const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

export function IssueList({ issues = [] }) {
  if (!issues.length) return <div className="empty-state">No issues detected. This trace looks clean.</div>;
  return (
    <div className="issue-list">
      {[...issues].sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]).map((issue, index) => (
        <div className={`issue-card ${issue.severity}`} key={`${issue.type}-${index}`}>
          <div>
            <strong>{issue.type.replaceAll('_', ' ')}</strong>
            <p>{issue.message}</p>
          </div>
          <span>{issue.severity}</span>
        </div>
      ))}
    </div>
  );
}
