// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e2a3a 0%, #2d3f55 50%, #1a2332 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "rgba(79,124,172,0.3)",
          border: "1px solid rgba(79,124,172,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: "clamp(26px, 5vw, 38px)",
          fontWeight: 700,
          color: "#f1f5f9",
          marginBottom: 12,
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}
      >
        Sales Analytics Dashboard
      </h1>

      <p
        style={{
          color: "#94a3b8",
          fontSize: 15,
          marginBottom: 36,
          textAlign: "center",
          maxWidth: 400,
          lineHeight: 1.6,
        }}
      >
        Track your monthly sales performance with interactive charts and filters.
      </p>

      <Link
        href="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#4f7cac",
          color: "#fff",
          padding: "12px 28px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          transition: "background 0.2s",
          boxShadow: "0 4px 14px rgba(79,124,172,0.35)",
          letterSpacing: "0.01em",
        }}
      >
        Open Dashboard
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>

      <p style={{ color: "#475569", fontSize: 12, marginTop: 48 }}>
        Built with Next.js · Recharts · Tailwind CSS
      </p>
    </main>
  );
}
