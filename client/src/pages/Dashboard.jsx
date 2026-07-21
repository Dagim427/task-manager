// src/pages/Dashboard.jsx
import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { C } from "../utils/color.js";
import {
  cardStyle,
  statTitleStyle,
  statValueStyle,
} from "../utils/CardStyle.js";
import TaskCard from "../components/task/TaskCard.jsx";
import Btn from "../components/common/Btn.jsx";
import Select from "../components/common/Select.jsx";

export default function Dashboard({
  tasks = [],
  onDelete,
  onToggleDone,
  onToggleImportant,
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Local state for dropdown filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Synchronized search query from top Header input
  const searchQuery = searchParams.get("q") || "";

  // Dynamic status metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const important = tasks.filter((t) => t.important).length;
    return { total, completed, inProgress, important };
  }, [tasks]);

  // Combined search and dropdown filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleResetFilters = () => {
    setStatusFilter("All");
    setPriorityFilter("All");
    if (searchQuery) {
      searchParams.delete("q");
      setSearchParams(searchParams);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: C.dark,
              marginBottom: 4,
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: C.mid }}>
            Manage, organize, and track your daily productivity.
          </p>
        </div>
        <Btn onClick={() => navigate("/create-task")}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create New Task
        </Btn>
      </div>

      {/* Metrics Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div style={cardStyle}>
          <div style={statTitleStyle}>Total Tasks</div>
          <div style={{ ...statValueStyle, color: C.dark }}>{stats.total}</div>
        </div>
        <div style={cardStyle}>
          <div style={statTitleStyle}>In Progress</div>
          <div style={{ ...statValueStyle, color: C.warning }}>
            {stats.inProgress}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={statTitleStyle}>Completed</div>
          <div style={{ ...statValueStyle, color: C.success }}>
            {stats.completed}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={statTitleStyle}>Important</div>
          <div style={{ ...statValueStyle, color: C.purple || "#8B5CF6" }}>
            {stats.important}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
          backgroundColor: C.white,
          padding: "14px 20px",
          borderRadius: 12,
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>
            Filter By:
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.mid }}>Status:</span>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={["All", "To Do", "In Progress", "Review", "Done"]}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.mid }}>Priority:</span>
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={["All", "Low", "Medium", "High", "Critical"]}
            />
          </div>
        </div>

        {(statusFilter !== "All" ||
          priorityFilter !== "All" ||
          searchQuery) && (
          <button
            onClick={handleResetFilters}
            style={{
              background: "none",
              border: "none",
              color: C.primary,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Task Grid & Empty State */}
      {filteredTasks.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 20px",
            backgroundColor: C.white,
            borderRadius: 12,
            border: `1.5px dashed ${C.border}`,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 6,
            }}
          >
            No tasks found
          </div>
          <p
            style={{
              fontSize: 13,
              color: C.mid,
              maxWidth: 360,
              margin: "0 auto 20px",
            }}
          >
            {searchQuery || statusFilter !== "All" || priorityFilter !== "All"
              ? "Try adjusting or resetting your search filters to find what you're looking for."
              : "You don't have any tasks right now. Get started by creating your first task!"}
          </p>
          {!searchQuery &&
            statusFilter === "All" &&
            priorityFilter === "All" && (
              <Btn onClick={() => navigate("/create-task")} size="sm">
                Create Task
              </Btn>
            )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => navigate(`/edit/${task.id}`)}
              onDelete={() => onDelete?.(task.id)}
              onToggleDone={() => onToggleDone?.(task.id)}
              onToggleImportant={() => onToggleImportant?.(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
