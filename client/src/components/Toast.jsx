export function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  return (
    <div className={`toast ${type}`}>
      {message}
      <button onClick={onClose}>×</button>
    </div>
  );
}
