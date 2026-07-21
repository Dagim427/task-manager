import { useMemo, useState } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { C, SH } from "../utils/color.js";
import Select from "../components/common/Select.jsx";
import Btn from "../components/common/Btn.jsx";
import TaskCard from "../components/task/TaskCard.jsx";

function Dashboard(props) {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Pull tasks & handlers from Layout Outlet context (with fallback to props & safe defaults)
  const context = useOutletContext() || {};
  const tasks = context.tasks || props.tasks || [];
  const onDelete = context.onDelete || props.onDelete || (() => {});
  const onToggleDone = context.onToggleDone || props.onToggleDone || (() => {});
  const onToggleImportant = context.onToggleImportant || props.onToggleImportant || (() => {});

  // 2. Automatically determine view filter based on the active URL route
  const getFilterFromPath = (pathname) => {
    if (pathname === "/my-tasks") return "active";
    if (pathname === "/completed") return "done";
    if (pathname === "/important") return "important";
    return "all"; // Default for /dashboard
  };

  const filter = props.filter || getFilterFromPath(location.pathname);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [sort, setSort] = useState("Due Date");

  // 3. Stats calculation (safe against undefined arrays)
  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "Done").length,
    pending: tasks.filter((t) => t.status !== "Done").length,
    important: tasks.filter((t) => t.important).length,
  };

  const STAT_CARDS = [
    {
      label: "Total Tasks",
      value: stats.total,
      color: C.primary,
      bg: C.primaryLight,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: stats.done,
      color: C.success,
      bg: "#ECFDF5",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: "Pending",
      value: stats.pending,
      color: C.warning,
      bg: "#FFFBEB",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Important",
      value: stats.important,
      color: C.warning,
      bg: "#FFFBEB",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    if (filter === "active") list = list.filter((t) => t.status !== "Done");
    else if (filter === "done") list = list.filter((t) => t.status === "Done");
    else if (filter === "important") list = list.filter((t) => t.important);

    if (search)
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
      );
    if (statusFilter !== "All Status")
      list = list.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "All Priority")
      list = list.filter((t) => t.priority === priorityFilter);

    if (sort === "Due Date")
      list.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
    else if (sort === "Priority") {
      const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      list.sort((a, b) => (order[a.priority] ?? 99) - (order[b.priority] ?? 99));
    } else if (sort === "Title")
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    return list;
  }, [tasks, filter, search, statusFilter, priorityFilter, sort]);

  const titles = {
    all: "Dashboard",
    active: "My Tasks",
    done: "Completed",
    important: "Important",
  };
  const subtitles = {
    all: "Overview of all your tasks and activity.",
    active: "Tasks that are still in progress.",
    done: "Tasks you have completed.",
    important: "Your starred high-priority tasks.",
  };

  const activeTitle = titles[filter] || titles.all;
  const activeSubtitle = subtitles[filter] || subtitles.all;

  const handleCreateTask = () => {
    if (props.onNavigate) {
      props.onNavigate("create-task");
    } else {
      navigate("/create-task");
    }
  };

  const handleEditTask = (taskId) => {
    if (props.onNavigate) {
      props.onNavigate("edit-task");
    } else {
      navigate(`/edit-task/${taskId}`);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.dark,
              marginBottom: 4,
            }}
          >
            {activeTitle}
          </h1>
          <p style={{ fontSize: 14, color: C.mid }}>{activeSubtitle}</p>
        </div>

        {/* Stats — only on dashboard */}
        {filter === "all" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 28,
            }}
          >
            {STAT_CARDS.map((card) => (
              <div
                key={card.label}
                style={{
                  backgroundColor: C.white,
                  borderRadius: 12,
                  padding: "20px 20px",
                  boxShadow: SH,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: card.bg,
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.dark,
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </div>
                  <div style={{ fontSize: 12, color: C.mid, marginTop: 4 }}>
                    {card.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 12,
            padding: "14px 16px",
            boxShadow: SH,
            border: `1px solid ${C.border}`,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <svg
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.light}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              style={{
                width: "100%",
                padding: "8px 12px 8px 32px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 13,
                color: C.dark,
                backgroundColor: C.bg,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.primary)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={["All Status", "To Do", "In Progress", "Review", "Done"]}
          />
          <Select
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={["All Priority", "Low", "Medium", "High", "Critical"]}
          />
          <Select
            value={sort}
            onChange={setSort}
            options={["Due Date", "Priority", "Title"]}
          />
          <Btn onClick={handleCreateTask}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </Btn>
        </div>

        {/* Task grid / empty state */}
        {filteredTasks.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 24px",
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              style={{ marginBottom: 20, opacity: 0.35 }}
            >
              <rect
                x="10"
                y="20"
                width="60"
                height="48"
                rx="8"
                fill={C.primary}
              />
              <rect
                x="22"
                y="32"
                width="36"
                height="6"
                rx="3"
                fill="#fff"
                opacity="0.7"
              />
              <rect
                x="22"
                y="44"
                width="24"
                height="5"
                rx="2.5"
                fill="#fff"
                opacity="0.5"
              />
              <rect
                x="22"
                y="55"
                width="16"
                height="4"
                rx="2"
                fill="#fff"
                opacity="0.3"
              />
              <circle cx="56" cy="20" r="12" fill={C.warning} />
              <line
                x1="56"
                y1="14"
                x2="56"
                y2="20"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="56" cy="24" r="1.5" fill="#fff" />
            </svg>
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
            <div
              style={{
                fontSize: 13,
                color: C.mid,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {search ||
              statusFilter !== "All Status" ||
              priorityFilter !== "All Priority"
                ? "Try adjusting your filters or search query."
                : "Create your first task to get started."}
            </div>
            <Btn onClick={handleCreateTask}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Task
            </Btn>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => handleEditTask(task.id)}
                onDelete={() => onDelete(task.id)}
                onToggleDone={() => onToggleDone(task.id)}
                onToggleImportant={() => onToggleImportant(task.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;