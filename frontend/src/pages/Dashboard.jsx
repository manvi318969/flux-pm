import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    api.get("/projects").then(({ data }) => setProjects(data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const deleteProject = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this project and all its tasks?")) return;
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <TopBar />
      <main className="container" style={{ paddingTop: 44, paddingBottom: 80 }}>
        {/* header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 className="display" style={{ fontSize: 34, fontWeight: 700, marginBottom: 6 }}>
              Good to see you, {user?.name?.split(" ")[0]}
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-dim)" }}>
              {projects.length === 0
                ? "Create your first project to get started."
                : `You have ${projects.length} project${projects.length > 1 ? "s" : ""} in motion.`}
            </p>
          </div>
          <button className="btn" onClick={() => setShowModal(true)} style={{ padding: "12px 22px" }}>
            + New project
          </button>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : projects.length === 0 ? (
          <EmptyState onCreate={() => setShowModal(true)} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {projects.map((p) => (
              <Link key={p._id} to={`/project/${p._id}`} className="card rise"
                style={{ padding: 24, transition: "all 0.2s", display: "block", position: "relative" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--line-strong)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 9, background: p.color || "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                    {p.name[0].toUpperCase()}
                  </span>
                  <button
                    onClick={(e) => deleteProject(e, p._id)}
                    style={{ fontSize: 12, color: "var(--text-faint)", padding: 4 }}
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="display" style={{ fontSize: 19, fontWeight: 600, marginBottom: 6 }}>{p.name}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text-dim)", marginBottom: 22, minHeight: 38, lineHeight: 1.6 }}>
                  {p.description || "No description"}
                </p>

                {/* progress */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-faint)", marginBottom: 8 }}>
                  <span>{p.doneTasks}/{p.totalTasks} tasks done</span>
                  <span style={{ color: "var(--text-dim)", fontWeight: 600 }}>{p.progress}%</span>
                </div>
                <div style={{ height: 6, background: "var(--bg)", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p.progress}%`, background: p.progress === 100 ? "var(--green)" : "var(--accent)", borderRadius: 100, transition: "width 0.5s ease" }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <CreateModal
          onClose={() => setShowModal(false)}
          onCreated={(proj) => { setProjects((prev) => [{ ...proj, totalTasks: 0, doneTasks: 0, progress: 0 }, ...prev]); setShowModal(false); }}
        />
      )}
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="card" style={{ padding: "80px 40px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
      <h2 className="display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>No projects yet</h2>
      <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 26 }}>
        Spin up your first project and start tracking work.
      </p>
      <button className="btn" onClick={onCreate} style={{ padding: "12px 24px" }}>+ Create a project</button>
    </div>
  );
}

function CreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", description: "", color: COLORS[0] });
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post("/projects", form);
      onCreated(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <h2 className="display" style={{ fontSize: 21, fontWeight: 600, marginBottom: 22 }}>New project</h2>
      <label style={labelStyle}>Project name</label>
      <input className="input" placeholder="e.g. Website Redesign" autoFocus
        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ marginBottom: 18 }} />
      <label style={labelStyle}>Description</label>
      <textarea className="input" placeholder="What's this project about?" rows={3}
        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
        style={{ marginBottom: 18, resize: "vertical" }} />
      <label style={labelStyle}>Colour</label>
      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        {COLORS.map((c) => (
          <button key={c} onClick={() => setForm({ ...form, color: c })}
            style={{ width: 30, height: 30, borderRadius: 8, background: c, border: form.color === c ? "2px solid #fff" : "2px solid transparent", transition: "all 0.15s" }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={create} disabled={saving || !form.name.trim()} style={{ opacity: saving || !form.name.trim() ? 0.6 : 1 }}>
          {saving ? "Creating..." : "Create project"}
        </button>
      </div>
    </Overlay>
  );
}

export function Overlay({ children, onClose }) {
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 }}>
      <div onClick={(e) => e.stopPropagation()} className="card rise"
        style={{ width: "100%", maxWidth: 460, padding: 30, background: "var(--bg-elev)" }}>
        {children}
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-dim)", marginBottom: 8 };
