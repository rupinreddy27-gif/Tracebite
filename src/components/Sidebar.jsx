import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Batches", path: "/batches" },
    { label: "Search", path: "/search" },
    { label: "QA Templates", path: "/qa-templates" },
    { label: "Admin", path: "/admin" },
  ];

  return (
    <div style={{ background: "white", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", fontFamily: "Arial, sans-serif" }}>

      {/* Logo */}
      <div style={{ fontWeight: "bold", fontSize: "20px", color: "#2563eb", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        TraceBite
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "8px" }}>
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
              background: location.pathname === link.path ? "#2563eb" : "#f1f5f9",
              color: location.pathname === link.path ? "white" : "#334155",
            }}>
            {link.label}
          </button>
        ))}
      </div>

      {/* User Info + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ background: "#f1f5f9", padding: "8px 16px", borderRadius: "10px", fontSize: "14px", color: "#334155", fontWeight: "500" }}>
          👤 {JSON.parse(localStorage.getItem("loggedInUser") || '{}').name || "User"}
        </div>
        <button
          onClick={() => { localStorage.removeItem("loggedInUser"); window.location.href = "/login"; }}
          style={{ padding: "8px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
          Logout
        </button>
      </div>

    </div>
  );
}