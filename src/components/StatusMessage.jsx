function StatusMessage({ variant, children }) {
  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <p className={`status-message status-${variant}`} role={role}>
      {children}
    </p>
  );
}

export default StatusMessage;
