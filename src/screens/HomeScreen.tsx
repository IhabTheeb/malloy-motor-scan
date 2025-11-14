import { NavBar } from "../components/NavBar";

export function HomeScreen() {
  return (
    <div>
      <NavBar />

      <header style={{
        padding: "60px 20px",
        textAlign: "center",
        background: "linear-gradient(135deg, #2c2c31, #1f1f24)",
        borderBottom: "1px solid var(--border-soft)"
      }}>
        <h1 style={{
          fontSize: "42px",
          marginBottom: "12px",
          color: "white"
        }}>
          Motor Nameplate Scanner
        </h1>

        <p style={{
          fontSize: "18px",
          color: "var(--text-1)"
        }}>
          Capture a motor nameplate → Extract specs → Find the correct SKU in seconds.
        </p>

        <button
          onClick={() => window.location.href = "/scan"}
          style={{
            marginTop: "32px",
            background: "var(--accent-red)",
            padding: "16px 32px",
            border: "none",
            borderRadius: "var(--radius)",
            fontSize: "20px",
            fontWeight: 600,
            color: "white",
            cursor: "pointer",
            boxShadow: "var(--shadow)",
          }}
        >
          Start Scanning
        </button>
      </header>
    </div>
  );
}
