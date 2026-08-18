function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isConfirming = false,
  error = "",
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget &&
          !isConfirming
        ) {
          onCancel();
        }
      }}
    >
      <div
        className="modal confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="confirm-dialog-content">
          <h3 id="confirm-title">
            {title}
          </h3>

          <p id="confirm-message">
            {message}
          </p>

          {error && (
            <div
              className="form-error"
              role="alert"
            >
              {error}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming
              ? "Deleting..."
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;