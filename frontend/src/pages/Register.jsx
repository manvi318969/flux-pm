import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthShell } from "./Login";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start organising your work in minutes">
      <form onSubmit={submit}>
        <input className="input" placeholder="Full name" style={{ marginBottom: 14 }}
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="email" placeholder="Email" style={{ marginBottom: 14 }}
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" style={{ marginBottom: 14 }}
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p style={{ color: "var(--red)", fontSize: 13, marginBottom: 14 }}>{error}</p>}
        <button type="submit" className="btn" disabled={loading} style={{ width: "100%", padding: 13, opacity: loading ? 0.6 : 1 }}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p style={{ marginTop: 22, fontSize: 14, color: "var(--text-dim)", textAlign: "center" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--accent-soft)", fontWeight: 500 }}>Sign in</Link>
      </p>
    </AuthShell>
  );
}
