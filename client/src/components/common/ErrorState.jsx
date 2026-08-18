function ErrorState({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div
      className="error-state"
      role="alert"
    >
      <div className="error-state-content">
        <h3>Something went wrong</h3>

        <p>{message}</p>

        {onRetry && (
          <button
            type="button"
            className="secondary-button"
            onClick={onRetry}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;