import { useNavigate } from "react-router-dom";
import { batches, stats } from "../data/mockData";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  const pendingQA = batches.filter((b) => b.status === "In Progress");
  const rejected = batches.filter((b) => b.status === "QA Rejected");
  const released = batches.filter((b) => b.status === "Released");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "28px" }}>
          Good afternoon, {user.name} 👋
        </h1>
        <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
          {user.role} · Sumo Biscuits Hyderabad Plant
        </p>
      </div>

      {/* ========== ADMIN DASHBOARD ========== */}
      {user.role === "Admin" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Total Batches", value: stats.totalBatches, color: "#2563eb" },
              { label: "In Progress", value: stats.inProgress, color: "#ca8a04" },
              { label: "Released", value: stats.released, color: "#16a34a" },
              { label: "QA Rejected", value: stats.deviations, color: "#dc2626" },
            ].map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${card.color}` }}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>{card.label}</div>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => navigate("/batches/new")} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>+ New Batch</button>
            <button onClick={() => navigate("/batches")} style={{ padding: "12px 24px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>View All Batches</button>
            <button onClick={() => navigate("/admin")} style={{ padding: "12px 24px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>Manage Users</button>
          </div>

          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 16px 0" }}>All Recent Batches</h2>
            {batches.map((batch) => (
              <div key={batch.id} onClick={() => navigate(`/batches/${batch.id}`)}
                style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{batch.product}</div>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>{batch.id} · {batch.factory}</div>
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: "999px", fontSize: "13px",
                  background: batch.status === "Released" ? "#dcfce7" : batch.status === "QA Rejected" ? "#fee2e2" : "#fef9c3",
                  color: batch.status === "Released" ? "#16a34a" : batch.status === "QA Rejected" ? "#dc2626" : "#ca8a04"
                }}>
                  {batch.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== QA MANAGER DASHBOARD ========== */}
      {user.role === "QA Manager" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Pending QA", value: pendingQA.length, color: "#ca8a04" },
              { label: "QA Rejected", value: rejected.length, color: "#dc2626" },
              { label: "Released Today", value: released.length, color: "#16a34a" },
            ].map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${card.color}` }}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>{card.label}</div>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => navigate("/batches")} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>Review Batches</button>
            <button onClick={() => navigate("/qa-templates")} style={{ padding: "12px 24px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>QA Templates</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
              <h2 style={{ margin: "0 0 16px 0", color: "#ca8a04" }}>⏳ Pending QA Review</h2>
              {pendingQA.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>✅ All caught up!</div>
              ) : pendingQA.map((batch) => (
                <div key={batch.id} onClick={() => navigate(`/batches/${batch.id}`)}
                  style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}>
                  <div style={{ fontWeight: "bold" }}>{batch.product}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.date}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
              <h2 style={{ margin: "0 0 16px 0", color: "#dc2626" }}>❌ Recently Rejected</h2>
              {rejected.map((batch) => (
                <div key={batch.id} onClick={() => navigate(`/batches/${batch.id}`)}
                  style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}>
                  <div style={{ fontWeight: "bold" }}>{batch.product}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.rejectedBy || "QA Team"}</div>
                  {batch.rejectionReason && (
                    <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
                      {batch.rejectionReason.substring(0, 60)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== SUPERVISOR DASHBOARD ========== */}
      {user.role === "Supervisor" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Awaiting Approval", value: pendingQA.length, color: "#ca8a04" },
              { label: "Released", value: released.length, color: "#16a34a" },
              { label: "Total Batches", value: stats.totalBatches, color: "#2563eb" },
            ].map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${card.color}` }}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>{card.label}</div>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => navigate("/batches")} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>View All Batches</button>
            <button onClick={() => navigate("/search")} style={{ padding: "12px 24px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>Search & Trace</button>
          </div>

          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 16px 0" }}>🛡️ Batches Awaiting Final Approval</h2>
            {pendingQA.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
                <div>All caught up! No pending approvals.</div>
              </div>
            ) : pendingQA.map((batch) => (
              <div key={batch.id} onClick={() => navigate(`/batches/${batch.id}`)}
                style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{batch.product}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.factory}</div>
                </div>
                <button style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                  Review →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== OPERATOR DASHBOARD ========== */}
      {user.role === "Operator" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "My Batches Today", value: 2, color: "#2563eb" },
              { label: "QA Checks Pending", value: pendingQA.length, color: "#ca8a04" },
            ].map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${card.color}` }}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>{card.label}</div>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => navigate("/batches/new")}
              style={{ padding: "16px 32px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
              + Create New Batch
            </button>
          </div>

          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 16px 0" }}>📋 My Recent Batches</h2>
            {batches.slice(0, 3).map((batch) => (
              <div key={batch.id} onClick={() => navigate(`/batches/${batch.id}`)}
                style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{batch.product}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.date}</div>
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: "999px", fontSize: "13px",
                  background: batch.status === "Released" ? "#dcfce7" : batch.status === "QA Rejected" ? "#fee2e2" : "#fef9c3",
                  color: batch.status === "Released" ? "#16a34a" : batch.status === "QA Rejected" ? "#dc2626" : "#ca8a04"
                }}>
                  {batch.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
```

---

Save and test all 4 logins:
- `admin@sumo.com` / `admin123` → Admin dashboard with all stats
- `qa@sumo.com` / `qa123` → QA Manager dashboard with pending + rejected
- `supervisor@sumo.com` / `super123` → Supervisor dashboard with approvals
- `operator@sumo.com` / `op123` → Operator dashboard with create batch

Push:
```
git add .
git commit -m "added role based dashboards for all 4 roles"
git push origin main