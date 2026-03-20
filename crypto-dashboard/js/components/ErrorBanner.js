// ─── components/ErrorBanner.js ───────────────────────────────────────────────

function ErrorBanner({ message, onRetry }) {
  // Detect if user is offline
  const isOffline = !navigator.onLine;

  return (
    <div className="error-banner">
      <div className="error-text">
        <span>⚠️</span>
        <span>{isOffline ? '📡 You are offline. Check your internet connection.' : message}</span>
      </div>
      <button className="btn-retry" onClick={onRetry}>
        ↻ Retry
      </button>
    </div>
  );
}
