import { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  { email: "rawmaterial@sumo.com", password: "raw123", role: "Raw Material Manager", name: "Arjun Sharma" },
  { email: "cook@sumo.com", password: "cook123", role: "Cook Manager", name: "Priya Patel" },
  { email: "qa@sumo.com", password: "qa123", role: "QA Manager", name: "James Wilson" },
  { email: "gm@sumo.com", password: "gm123", role: "General Manager", name: "Vikram Reddy" },
  { email: "dispatch@sumo.com", password: "dispatch123", role: "Dispatch Manager", name: "Sarah Johnson" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Arial, sans-serif", padding: "24px"
    }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>TraceBite</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px" }}>Traceability & QA Operating System</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>Sumo Biscuits — Hyderabad Plant</div>
        </div>

        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <h2 style={{ margin: "0 0 24px 0", fontSize: "22px", color: "#0f172a" }}>Sign in to your account</h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px", fontWeight: "500" }}>Email Address</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@sumo.com" onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "15px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px", fontWeight: "500" }}>Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "15px", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px", marginBottom: "16px", color: "#dc2626", fontSize: "14px" }}>
              ❌ {error}
            </div>
          )}

          <button onClick={handleLogin}
            style={{ width: "100%", padding: "14px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
            Sign In →
          </button>

          <div style={{ marginTop: "24px", background: "#f8fafc", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#475569", marginBottom: "10px" }}>🔑 Test Credentials — Click to auto-fill:</div>
            {users.map((cred) => (
              <div key={cred.role}
                onClick={() => { setEmail(cred.email); setPassword(cred.password); setError(""); }}
                style={{ padding: "8px 10px", borderRadius: "8px", marginBottom: "6px", cursor: "pointer", background: "white", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "13px", color: "#0f172a" }}>{cred.role}</span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{cred.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}