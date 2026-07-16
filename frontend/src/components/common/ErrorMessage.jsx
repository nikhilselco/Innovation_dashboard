function ErrorMessage({ message, onRetry }) {
  return (
    <div className="dashboard-content">
      <div className="error-state">
        <i className="ti ti-alert-triangle" aria-hidden="true"></i>
        <h3>Couldn&apos;t load dashboard data</h3>
        <p>{message || "Something went wrong while reaching the backend."}</p>
        {onRetry && (
          <button type="button" className="retry-btn" onClick={onRetry}>
            <i className="ti ti-refresh" aria-hidden="true"></i> Try again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
