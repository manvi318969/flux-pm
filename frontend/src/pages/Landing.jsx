import { Link } from "react-router-dom";
import { Logo } from "../components/TopBar";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* glow background */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 600,
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* nav */}
      <nav style={{ position: "relative", zIndex: 2 }}>
        <div
          className="container"
          style={{
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo />
            <span className="display" style={{ fontSize: 21, fontWeight: 700 }}>
              FLUX
            </span>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Link to="/login" style={{ fontSize: 14, color: "var(--text-dim)", fontWeight: 500 }}>
              Sign in
            </Link>
            <Link to="/register" className="btn">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* hero */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "100px 0 80px",
        }}
      >
        <div className="container" style={{ maxWidth: 820 }}>
          <div
            className="rise"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--bg-card)",
              border: "1px solid var(--line)",
              borderRadius: 100,
              padding: "7px 16px",
              fontSize: 13,
              color: "var(--text-dim)",
              marginBottom: 34,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} />
            Project management, reimagined
          </div>

          <h1
            className="display rise"
            style={{
              fontSize: "clamp(44px, 7vw, 78px)",
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: 26,
              animationDelay: "0.05s",
            }}
          >
            Where your work
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              finds its flow.
            </span>
          </h1>

          <p
            className="rise"
            style={{
              fontSize: 18,
              color: "var(--text-dim)",
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.7,
              animationDelay: "0.1s",
            }}
          >
            Plan projects, assign tasks, track deadlines and watch progress move
            across a board built for momentum. Simple, fast, and made to keep teams
            in sync.
          </p>

          <div
            className="rise"
            style={{ display: "flex", gap: 14, justifyContent: "center", animationDelay: "0.15s" }}
          >
            <Link to="/register" className="btn" style={{ padding: "14px 28px", fontSize: 15 }}>
              Start for free →
            </Link>
            <Link to="/login" className="btn-ghost" style={{ padding: "13px 26px", fontSize: 15 }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* board preview mockup */}
      <section style={{ position: "relative", zIndex: 2, paddingBottom: 100 }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div
            className="rise card"
            style={{
              padding: 20,
              animationDelay: "0.2s",
              boxShadow: "0 40px 120px -40px rgba(99,102,241,0.3)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {[
                { title: "To Do", color: "#9b9da7", tasks: ["Design landing page", "Set up database"] },
                { title: "In Progress", color: "#fbbf24", tasks: ["Build auth flow", "API endpoints"] },
                { title: "Done", color: "#34d399", tasks: ["Project setup", "Wireframes"] },
              ].map((col) => (
                <div key={col.title}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 12,
                      color: "var(--text-dim)",
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                    {col.title}
                  </div>
                  {col.tasks.map((t) => (
                    <div
                      key={t}
                      style={{
                        background: "var(--bg-elev)",
                        border: "1px solid var(--line)",
                        borderRadius: 9,
                        padding: "12px 13px",
                        fontSize: 13,
                        marginBottom: 10,
                        color: "var(--text)",
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section style={{ position: "relative", zIndex: 2, paddingBottom: 120 }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              ["Kanban boards", "Drag tasks across To Do, In Progress and Done. See momentum at a glance."],
              ["Deadlines & priority", "Set due dates and priority levels so nothing slips through."],
              ["Live progress", "Every project shows a real-time completion bar as tasks get done."],
            ].map(([title, desc]) => (
              <div key={title} className="card" style={{ padding: 26 }}>
                <h3 className="display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--line)", padding: "30px 0", position: "relative", zIndex: 2 }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13, color: "var(--text-faint)" }}>
          <span>© {new Date().getFullYear()} FLUX. Built for momentum.</span>
          <span>React · Node.js · MongoDB</span>
        </div>
      </footer>
    </div>
  );
}
