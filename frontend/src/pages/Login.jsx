import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/TopBar";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to keep things moving">
      <form onSubmit={submit}>
        <input className="input" type="email" placeholder="Email" style={{ marginBottom: 14 }}
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" style={{ marginBottom: 14 }}
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p style={{ color: "var(--red)", fontSize: 13, marginBottom: 14 }}>{error}</p>}
        <button type="submit" className="btn" disabled={loading} style={{ width: "100%", padding: 13, opacity: loading ? 0.6 : 1 }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p style={{ marginTop: 22, fontSize: 14, color: "var(--text-dim)", textAlign: "center" }}>
        New to FLUX?{" "}
        <Link to="/register" style={{ color: "var(--accent-soft)", fontWeight: 500 }}>Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -150, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 2 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 30 }}>
          <Logo size={32} />
          <span className="display" style={{ fontSize: 24, fontWeight: 700 }}>FLUX</span>
        </Link>
        <div className="card" style={{ padding: 34 }}>
          <h1 className="display" style={{ fontSize: 24, fontWeight: 600, marginBottom: 6, textAlign: "center" }}>{title}</h1>
          <p style={{ fontSize: 14, color: "var(--text-dim)", textAlign: "center", marginBottom: 28 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
