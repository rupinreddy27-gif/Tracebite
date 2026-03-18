import { useNavigate } from "react-router-dom";
import { batches, ingredients } from "../data/mockData";

export default function GeneralManager() {
  const navigate = useNavigate();

  const approvedIngredients = ingredients.filter((i) => i.status === "Approved").length;
  const totalIngredients = ingredients.length;
  const ingredientIssues = ingredients.filter((i) => i.status !== "Approved");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>👔 General Manager Dashboard</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Full overview of all operations — Raw Materials, Cooking, QA, and Dispatch</p>
        </div>

        {/* Overall status */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Batches", value: batches.length, color: "#2563eb" },
            { label: "Released", value: batches.filter((b) => b.status === "Released").length, color: "#16a34a" },
            { label: "QA Rejected", value: batches.filter((b) => b.status === "QA Rejected").length, color: "#dc2626" },
            { label: "Ingredient Issues", value: ingredientIssues.length, color: "#ca8a04" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${s.color}` }}>
              <div style={{ color: "#64748b", fontSize: "14px" }}>{s.label}</div>
              <div style={{ fontSize: "36px", fontWeight: "bold", color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Ingredient Status */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px 0" }}>🌾 Raw Material Status</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, background: "#f1f5f9", borderRadius: "999px", height: "12px" }}>
              <div style={{ width: `${(approvedIngredients / totalIngredients) * 100}%`, background: "#16a34a", borderRadius: "999px", height: "12px" }} />
            </div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#16a34a" }}>
              {approvedIngredients}/{totalIngredients} Approved
            </div>
          </div>

          {ingredientIssues.length > 0 && (
            <div>
              <div style={{ fontWeight: "bold", color: "#dc2626", fontSize: "14px", marginBottom: "8px" }}>⚠️ Issues requiring attention:</div>
              {ingredientIssues.map((ing) => (
                <div key={ing.id} style={{ padding: "10px 14px", background: "#fef2f2", borderRadius: "8px", marginBottom: "6px", border: "1px solid #fecaca" }}>
                  <div style={{ fontWeight: "500" }}>{ing.name} — {ing.supplier}</div>
                  <div style={{ fontSize: "13px", color: "#dc2626" }}>{ing.status}: {ing.reviewReason || "No details provided"}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Batches Overview */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px 0" }}>📦 All Batches — Full Status</h2>
          {batches.map((batch) => (
            <div
              key={batch.id}
              onClick={() => navigate(`/batches/${batch.id}`)}
              style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "15px" }}>{batch.product}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.factory} · {batch.date}</div>
                  <div style={{ color: "#94a3b8", fontSize: "13px" }}>{batch.quantity} {batch.unit} · {batch.line} · {batch.shift} shift</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                  <div style={{
                    padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "bold",
                    background: batch.status === "Released" ? "#dcfce7" : batch.status === "QA Rejected" ? "#fee2e2" : "#fef9c3",
                    color: batch.status === "Released" ? "#16a34a" : batch.status === "QA Rejected" ? "#dc2626" : "#ca8a04"
                  }}>
                    {batch.status}
                  </div>

                  {/* Approval checklist */}
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[
                      { label: "RM", done: true },
                      { label: "Cook", done: batch.status !== "In Progress" },
                      { label: "QA", done: batch.status === "Released" },
                      { label: "GM", done: batch.status === "Released" },
                    ].map((check) => (
                      <div key={check.label} style={{
                        padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold",
                        background: check.done ? "#dcfce7" : "#f1f5f9",
                        color: check.done ? "#16a34a" : "#94a3b8"
                      }}>
                        {check.done ? "✓" : "○"} {check.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {batch.rejectionReason && (
                <div style={{ marginTop: "8px", background: "#fef2f2", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#dc2626" }}>
                  ❌ Rejection reason: {batch.rejectionReason}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}