import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import TopBar from "../components/TopBar";
import { Overlay } from "./Dashboard";

const COLUMNS = [
  { key: "todo", label: "To Do", color: "#9b9da7" },
  { key: "in_progress", label: "In Progress", color: "#fbbf24" },
  { key: "done", label: "Done", color: "#34d399" },
];

const PRIORITY = {
  Low: { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  High: { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export default function ProjectBoard() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // {status} for new, or task object for edit
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const load = async () => {
    const [pRes, tRes] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/tasks/project/${id}`),
    ]);
    setProject(pRes.data);
    setTasks(tRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  // ----- drag handlers -----
  const onDrop = async (status) => {
    setDragOver(null);
    if (!dragId) return;
    const task = tasks.find((t) => t._id === dragId);
    if (!task || task.status === status) { setDragId(null); return; }
    // optimistic update
    setTasks((prev) => prev.map((t) => (t._id === dragId ? { ...t, status } : t)));
    setDragId(null);
    try {
      await api.put(`/tasks/${task._id}`, { status });
    } catch {
      load(); // revert on fail
    }
  };

  const saveTask = async (data) => {
    if (data._id) {
      const { data: updated } = await api.put(`/tasks/${data._id}`, data);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } else {
      const { data: created } = await api.post("/tasks", { ...data, project: id });
      setTasks((prev) => [...prev, created]);
    }
    setModal(null);
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    setModal(null);
  };

  if (loading) return (<div><TopBar /><div className="spinner" /></div>);

  return (
    <div style={{ minHeight: "100vh" }}>
      <TopBar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* breadcrumb + header */}
        <Link to="/dashboard" style={{ fontSize: 13, color: "var(--text-faint)" }}>← All projects</Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", margin: "16px 0 28px", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 44, height: 44, borderRadius: 11, background: project.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>
              {project.name[0].toUpperCase()}
            </span>
            <div>
              <h1 className="display" style={{ fontSize: 26, fontWeight: 700 }}>{project.name}</h1>
              {project.description && <p style={{ fontSize: 14, color: "var(--text-dim)" }}>{project.description}</p>}
            </div>
          </div>
          <button className="btn" onClick={() => setModal({ status: "todo" })} style={{ padding: "11px 20px" }}>+ Add task</button>
        </div>

        {/* progress bar */}
        <div className="card" style={{ padding: "18px 22px", marginBottom: 28, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: "var(--text-dim)" }}>Overall progress</span>
              <span style={{ fontWeight: 600 }}>{progress}% · {done}/{total} done</span>
            </div>
            <div style={{ height: 8, background: "var(--bg)", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "var(--green)" : "var(--accent)", borderRadius: 100, transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>

        {/* kanban board */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} className="board">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col.key); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => onDrop(col.key)}
                style={{
                  background: dragOver === col.key ? "var(--bg-hover)" : "var(--bg-elev)",
                  border: `1px solid ${dragOver === col.key ? "var(--accent)" : "var(--line)"}`,
                  borderRadius: 14,
                  padding: 14,
                  minHeight: 400,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "0 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: col.color }} />
                    {col.label}
                    <span style={{ color: "var(--text-faint)", fontWeight: 500 }}>{colTasks.length}</span>
                  </div>
                  <button onClick={() => setModal({ status: col.key })} style={{ color: "var(--text-faint)", fontSize: 18, lineHeight: 1 }} title="Add task">+</button>
                </div>

                {colTasks.length === 0 && (
                  <div style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", padding: "30px 0" }}>
                    Drop tasks here
                  </div>
                )}

                {colTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={() => setDragId(task._id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => setModal(task)}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--line)",
                      borderRadius: 10,
                      padding: 14,
                      marginBottom: 10,
                      cursor: "grab",
                      opacity: dragId === task._id ? 0.4 : 1,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--line-strong)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                  >
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: task.description ? 6 : 10, lineHeight: 1.5 }}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 10, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {task.description}
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6, color: PRIORITY[task.priority].color, background: PRIORITY[task.priority].bg }}>
                        {task.priority}
                      </span>
                      {task.deadline && (
                        <span style={{ fontSize: 11.5, color: isOverdue(task) ? "var(--red)" : "var(--text-faint)" }}>
                          📅 {fmtDate(task.deadline)}
                        </span>
                      )}
                      {task.assignee && (
                        <span style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }} title={task.assignee}>
                          {task.assignee[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>

      {modal && (
        <TaskModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={saveTask}
          onDelete={deleteTask}
        />
      )}

      <style>{`
        @media (max-width: 820px) {
          .board { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function TaskModal({ initial, onClose, onSave, onDelete }) {
  const isEdit = !!initial._id;
  const [form, setForm] = useState({
    _id: initial._id,
    title: initial.title || "",
    description: initial.description || "",
    assignee: initial.assignee || "",
    priority: initial.priority || "Medium",
    status: initial.status || "todo",
    deadline: initial.deadline ? initial.deadline.slice(0, 10) : "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 className="display" style={{ fontSize: 21, fontWeight: 600 }}>{isEdit ? "Edit task" : "New task"}</h2>
        {isEdit && (
          <button onClick={() => { if (confirm("Delete this task?")) onDelete(form._id); }}
            style={{ fontSize: 13, color: "var(--red)", fontWeight: 500 }}>Delete</button>
        )}
      </div>

      <label style={lbl}>Title</label>
      <input className="input" placeholder="Task title" autoFocus style={{ marginBottom: 16 }}
        value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

      <label style={lbl}>Description</label>
      <textarea className="input" placeholder="Add details..." rows={3} style={{ marginBottom: 16, resize: "vertical" }}
        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <div>
          <label style={lbl}>Assignee</label>
          <input className="input" placeholder="Name"
            value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} />
        </div>
        <div>
          <label style={lbl}>Deadline</label>
          <input className="input" type="date"
            value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 26 }}>
        <div>
          <label style={lbl}>Priority</label>
          <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={{ cursor: "pointer" }}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Status</label>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ cursor: "pointer" }}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={save} disabled={saving || !form.title.trim()} style={{ opacity: saving || !form.title.trim() ? 0.6 : 1 }}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create task"}
        </button>
      </div>
    </Overlay>
  );
}

const lbl = { display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-dim)", marginBottom: 8 };

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
function isOverdue(task) {
  return task.status !== "done" && new Date(task.deadline) < new Date(new Date().toDateString());
}
