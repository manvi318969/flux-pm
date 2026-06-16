import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(11,12,16,0.8)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="container"
        style={{
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo />
          <span className="display" style={{ fontSize: 20, fontWeight: 700 }}>
            FLUX
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: "var(--text-dim)",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontWeight: 500, color: "var(--text)" }}>
              {user?.name?.split(" ")[0]}
            </span>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{ fontSize: 13, color: "var(--text-faint)", fontWeight: 500 }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

export function Logo({ size = 26 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 7,
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 14px -4px var(--accent-glow)",
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
          fill="#fff"
        />
      </svg>
    </div>
  );
}
