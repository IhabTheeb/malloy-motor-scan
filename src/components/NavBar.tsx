export function NavBar() {
  return (
    <nav style={{
      padding: "14px 24px",
      background: "var(--bg-1)",
      borderBottom: "1px solid var(--border-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div style={{ fontSize: "20px", fontWeight: 600 }}>
        Malloy Motor Scan
      </div>

      <button
        onClick={() => window.location.href = "/"}
        style={{
          background: "var(--accent-red)",
          border: "none",
          padding: "8px 16px",
          borderRadius: "var(--radius)",
          color: "white",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Home
      </button>
    </nav>
  );
}
