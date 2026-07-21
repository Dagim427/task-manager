import { useState, useEffect } from "react";
import { C, SH_MD } from "../../utils/color.js";
import Label from "../common/Label.jsx";
import Input from "../common/Input.jsx";
import Select from "../common/Select.jsx";
import Btn from "../common/Btn.jsx";

export function TaskForm({
  pageTitle,
  submitLabel,
  initial,
  onCancel,
  onSubmit,
  success,
  error,
  clearError,
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState(initial?.priority ?? "Medium");
  const [status, setStatus] = useState(initial?.status ?? "To Do");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [important, setImportant] = useState(initial?.important ?? false);

  useEffect(() => {
    if (error && clearError) {
      clearError();
    }
  }, [title, description, priority, status, dueDate, important]);

  const priorityColors = {
    Low: C.success,
    Medium: C.warning,
    High: C.danger,
    Critical: C.purple,
  };

  // Deliver the form values back to parent on submit
  const handleSubmit = async () => {
    const isSuccess = await onSubmit({
      title,
      description,
      priority,
      status,
      dueDate,
      important,
    });

    if (isSuccess) {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("To Do");
      setDueDate("");
      setImportant(false);
    }
  };
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.dark,
              marginBottom: 4,
            }}
          >
            {pageTitle}
          </h1>
          <p style={{ fontSize: 14, color: C.mid }}>
            Fill in the details below to {pageTitle.toLowerCase()}.
          </p>
        </div>
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 14,
            padding: 32,
            boxShadow: SH_MD,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <Label>Task Title</Label>
              <Input
                placeholder="e.g. Design the landing page"
                value={title}
                onChange={setTitle}
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                placeholder="Describe what needs to be done…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  color: C.dark,
                  backgroundColor: C.white,
                  outline: "none",
                  fontFamily: "inherit",
                  resize: "vertical",
                  boxSizing: "border-box",
                  lineHeight: 1.5,
                }}
                onFocus={(e) => (e.target.style.borderColor = C.primary)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <Label>Priority</Label>
                <Select
                  value={priority}
                  onChange={setPriority}
                  options={["Low", "Medium", "High", "Critical"]}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: priorityColors[priority],
                    }}
                  />
                  <span style={{ fontSize: 11, color: C.mid }}>
                    {priority} priority
                  </span>
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={status}
                  onChange={setStatus}
                  options={["To Do", "In Progress", "Review", "Done"]}
                />
              </div>
            </div>
            <div>
              <Label>Due Date</Label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  color: C.dark,
                  backgroundColor: C.white,
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.primary)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
              />
            </div>
            <div
              onClick={() => setImportant(!important)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                backgroundColor: important ? C.primaryLight : C.bg,
                borderRadius: 8,
                border: `1.5px solid ${important ? C.primary : C.border}`,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: C.primary,
                  cursor: "pointer",
                }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>
                  Mark as Important
                </div>
                <div style={{ fontSize: 11, color: C.mid }}>
                  This task will be highlighted in your task list
                </div>
              </div>
              {important && (
                <svg
                  style={{ marginLeft: "auto" }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={C.warning}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              )}
            </div>
            {success && (
              <p className=" alert alert-success">Task create successfully!</p>
            )}
            {error && <p className="alert alert-error">{error}</p>}
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                paddingTop: 8,
              }}
            >
              <Btn variant="ghost" onClick={onCancel}>
                Cancel
              </Btn>
              <Btn onClick={handleSubmit}>{submitLabel}</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;
