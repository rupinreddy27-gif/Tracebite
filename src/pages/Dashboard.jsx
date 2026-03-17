import { useNavigate } from "react-router-dom";
import { batches, stats } from "../data/mockData";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "28px" }}>Good afternoon 👋</h1>
        <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Here is your production overview</p>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={() => navigate("/batches/new")}
          style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
          + New Batch
        </button>
        <button
          onClick={() => navigate("/search")}
          style={{ padding: "12px 24px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
          Search
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "20px" }}>
          <div style={{ color: "#64748b", fontSize: "14px" }}>Total Batches</div>
          <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.totalBatches}</div>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "20px" }}>
          <div style={{ color: "#64748b", fontSize: "14px" }}>In Progress</div>
          <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.inProgress}</div>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "20px" }}>
          <div style={{ color: "#64748b", fontSize: "14px" }}>Released</div>
          <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.released}</div>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "20px" }}>
          <div style={{ color: "#64748b", fontSize: "14px" }}>Deviations</div>
          <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.deviations}</div>
        </div>
      </div>

      {/* Recent Batches */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
        <h2 style={{ margin: "0 0 16px 0" }}>Recent Batches</h2>
        {batches.map((batch) => (
          <div
            key={batch.id}
            onClick={() => navigate(`/batches/${batch.id}`)}
            style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "bold" }}>{batch.product}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>{batch.id}</div>
            </div>
            <div style={{
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              background: batch.status === "Released" ? "#dcfce7" : "#fee2e2",
              color: batch.status === "Released" ? "#16a34a" : "#dc2626"
            }}>
              {batch.status}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}