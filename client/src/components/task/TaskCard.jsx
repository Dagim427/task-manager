import { useState } from "react";
import { C, SH, SH_MD, PRIORITY_COLOR, STATUS_COLOR } from "../../utils/color";
import Badge from "../common/Badge";

function TaskCard({ task, onEdit, onDelete, onToggleDone, onToggleImportant }) {
  const [hover, setHover] = useState(false);
  const done = task.status === "Done";
  const overdue = !done && task.dueDate < "2026-07-21";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: C.white,
        borderRadius: 12,
        border: `1.5px solid ${hover ? C.primary + "40" : C.border}`,
        boxShadow: hover ? SH_MD : SH,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "all 0.2s",
        opacity: done ? 0.75 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <button
          onClick={onToggleDone}
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            border: `2px solid ${done ? C.success : C.border}`,
            backgroundColor: done ? C.success : "transparent",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 1,
            transition: "all 0.15s",
          }}
        >
          {done && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: done ? C.light : C.dark,
              textDecoration: done ? "line-through" : "none",
              marginBottom: 4,
            }}
          >
            {task.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.mid,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {task.description}
          </div>
        </div>
        <button
          onClick={onToggleImportant}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            flexShrink: 0,
            color: task.important ? C.warning : C.border,
            transition: "color 0.15s",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={task.important ? C.warning : "none"}
            stroke={task.important ? C.warning : C.border}
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <Badge label={task.priority} color={PRIORITY_COLOR[task.priority]} />
        <Badge label={task.status} color={STATUS_COLOR[task.status]} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke={overdue ? C.danger : C.light}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span
            style={{
              fontSize: 11,
              color: overdue ? C.danger : C.light,
              fontWeight: overdue ? 600 : 400,
            }}
          >
            {overdue ? "Overdue · " : ""}
            {new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={onEdit}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: `1px solid ${C.border}`,
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.mid}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: `1px solid #FECACA`,
              backgroundColor: "#FEF2F2",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.danger}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
