import { useNavigate } from "react-router-dom";
import { batches, stats, ingredients } from "../data/mockData";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  const pendingQA = batches.filter((b) => b.status === "In Progress");
  const rejected = batches.filter((b) => b.status === "QA Rejected");
  const released = batches.filter((b) => b.status === "Released");
  const ingredientIssues = ingredients.filter((i) => i.status !== "Approved");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>

      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "28px" }}>Good afternoon, {user.name} 👋</h1>
        <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>{user.role} · Sumo Biscuits Hyderabad Plant</p>
      </div>

   
      {/* ========== RAW MATERIAL MANAGER ========== */}
      {user.role === "Raw Material Manager" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Approved Ingredients", value: ingredients.filter((i) => i.status === "Approved").length, color: "#16a34a" },
              { label: "Under Review", value: ingredients.filter((i) => i.status === "Under Review").length, color: "#ca8a04" },
              { label: "Not Received", value: ingredients.filter((i) => i.receivedStatus === "Not Received").length, color: "#dc2626" },
            ].map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${card.color}` }}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>{card.label}</div>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => navigate("/raw-material")} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
              🌾 Check Raw Materials
            </button>
          </div>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 16px 0" }}>⚠️ Ingredients Needing Attention</h2>
            {ingredientIssues.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>✅ All ingredients approved!</div>
            ) : ingredientIssues.map((ing) => (
              <div key={ing.id} style={{ padding: "14px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ fontWeight: "bold" }}>{ing.name}</div>
                <div style={{ color: "#64748b", fontSize: "13px" }}>📍 {ing.location} · {ing.supplier}</div>
                <div style={{ color: "#dc2626", fontSize: "13px", marginTop: "4px" }}>{ing.status}: {ing.reviewReason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== COOK MANAGER ========== */}
      {user.role === "Cook Manager" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Total Batches", value: batches.length, color: "#2563eb" },
              { label: "In Progress", value: pendingQA.length, color: "#ca8a04" },
              { label: "Completed", value: released.length, color: "#16a34a" },
            ].map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${card.color}` }}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>{card.label}</div>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => navigate("/cook-manager")} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
              👨‍🍳 Manage Cook Records
            </button>
          </div>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 16px 0" }}>🍪 Active Batches</h2>
            {batches.map((batch) => (
              <div key={batch.id} onClick={() => navigate(`/batches/${batch.id}`)}
                style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{batch.product}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.line} · {batch.shift} shift</div>
                </div>
                <div style={{ padding: "4px 12px", borderRadius: "999px", fontSize: "13px", background: batch.status === "Released" ? "#dcfce7" : batch.status === "QA Rejected" ? "#fee2e2" : "#fef9c3", color: batch.status === "Released" ? "#16a34a" : batch.status === "QA Rejected" ? "#dc2626" : "#ca8a04" }}>
                  {batch.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== QA MANAGER ========== */}
      {user.role === "QA Manager" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Pending QA", value: pendingQA.length, color: "#ca8a04" },
              { label: "QA Rejected", value: rejected.length, color: "#dc2626" },
              { label: "Released", value: released.length, color: "#16a34a" },
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
              <h2 style={{ margin: "0 0 16px 0", color: "#ca8a04" }}>⏳ Pending QA</h2>
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
                  <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
                    {batch.rejectionReason?.substring(0, 60)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== GENERAL MANAGER ========== */}
      {user.role === "General Manager" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Total Batches", value: batches.length, color: "#2563eb" },
              { label: "Released", value: released.length, color: "#16a34a" },
              { label: "QA Rejected", value: rejected.length, color: "#dc2626" },
              { label: "Ingredient Issues", value: ingredientIssues.length, color: "#ca8a04" },
            ].map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${card.color}` }}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>{card.label}</div>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => navigate("/general-manager")} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
              👔 Full Operations View
            </button>
            <button onClick={() => navigate("/batches")} style={{ padding: "12px 24px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>All Batches</button>
          </div>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 16px 0" }}>📋 Operations Summary</h2>
            {batches.map((batch) => (
              <div key={batch.id} onClick={() => navigate(`/batches/${batch.id}`)}
                style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{batch.product}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.factory}</div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["RM", "Cook", "QA", "GM"].map((stage) => (
                    <div key={stage} style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", background: batch.status === "Released" ? "#dcfce7" : "#f1f5f9", color: batch.status === "Released" ? "#16a34a" : "#94a3b8" }}>
                      ✓ {stage}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== DISPATCH MANAGER ========== */}
      {user.role === "Dispatch Manager" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Ready to Dispatch", value: released.length, color: "#16a34a" },
              { label: "Total Batches", value: batches.length, color: "#2563eb" },
              { label: "Delivery Locations", value: 6, color: "#ca8a04" },
            ].map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${card.color}` }}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>{card.label}</div>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => navigate("/dispatch")} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
              🚚 Manage Dispatches
            </button>
          </div>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 16px 0" }}>📦 Batches Ready for Dispatch</h2>
            {released.map((batch) => (
              <div key={batch.id}
                style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{batch.product}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.quantity} {batch.unit}</div>
                </div>
                <button onClick={() => navigate("/dispatch")}
                  style={{ padding: "8px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                  Dispatch →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}