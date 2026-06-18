export function RubricScoreTable({ scores = [] }) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Score</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td><strong>{item.score}/{item.maxScore}</strong></td>
              <td>{item.notes?.[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
