import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ingredients } from "../data/mockData";

export default function RawMaterialManager() {
  const navigate = useNavigate();
  const [ingList, setIngList] = useState(ingredients);
  const [expandedIng, setExpandedIng] = useState(null);
  const [reviewNote, setReviewNote] = useState({});

  const handleReceived = (id, status) => {
    setIngList((prev) => prev.map((ing) =>
      ing.id === id ? { ...ing, receivedStatus: status } : ing
    ));
  };

  const handleApprove = (id) => {
    setIngList((prev) => prev.map((ing) =>
      ing.id === id ? { ...ing, status: "Approved" } : ing
    ));
    setExpandedIng(null);
  };

  const handleReject = (id) => {
    setIngList((prev) => prev.map((ing) =>
      ing.id === id ? { ...ing, status: "Rejected", reviewReason: reviewNote[id] || "Rejected by Raw Material Manager" } : ing
    ));
    setExpandedIng(null);
  };

  const totalApproved = ingList.filter((i) => i.status === "Approved").length;
  const totalPending = ingList.filter((i) => i.status === "Under Review" || i.status === "Not Received").length;
  const totalRejected = ingList.filter((i) => i.status === "Rejected").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>🌾 Raw Material Manager</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Check incoming raw materials, verify sources and approve quality</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Approved", value: totalApproved, color: "#16a34a", bg: "#dcfce7" },
            { label: "Pending Review", value: totalPending, color: "#ca8a04", bg: "#fef9c3" },
            { label: "Rejected", value: totalRejected, color: "#dc2626", bg: "#fee2e2" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${s.color}` }}>
              <div style={{ color: "#64748b", fontSize: "14px" }}>{s.label}</div>
              <div style={{ fontSize: "36px", fontWeight: "bold", color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Ingredient List */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
          <h2 style={{ margin: "0 0 20px 0" }}>📦 Incoming Raw Materials</h2>

          {ingList.map((ing) => (
            <div key={ing.id} style={{ marginBottom: "16px" }}>
              <div style={{
                padding: "16px", borderRadius: "12px", background: "#f8fafc",
                border: `1px solid ${ing.status === "Approved" ? "#bbf7d0" : ing.status === "Rejected" ? "#fecaca" : ing.receivedStatus === "Not Received" ? "#fecaca" : "#e2e8f0"}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>{ing.name}</div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>Supplier: {ing.supplier}</div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>📍 Source: {ing.location}</div>
                    <div style={{ color: "#94a3b8", fontSize: "13px" }}>Lot: {ing.lotNumber} · {ing.quantity}</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                    {/* Received status */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => handleReceived(ing.id, "Received")}
                        style={{
                          padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold",
                          background: ing.receivedStatus === "Received" ? "#16a34a" : "#e2e8f0",
                          color: ing.receivedStatus === "Received" ? "white" : "#475569"
                        }}>
                        ✓ Received
                      </button>
                      <button
                        onClick={() => handleReceived(ing.id, "Not Received")}
                        style={{
                          padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold",
                          background: ing.receivedStatus === "Not Received" ? "#dc2626" : "#e2e8f0",
                          color: ing.receivedStatus === "Not Received" ? "white" : "#475569"
                        }}>
                        ✗ Not Received
                      </button>
                    </div>

                    {/* QA Status badge */}
                    <div style={{
                      padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "bold",
                      background: ing.status === "Approved" ? "#dcfce7" : ing.status === "Rejected" ? "#fee2e2" : "#fef9c3",
                      color: ing.status === "Approved" ? "#16a34a" : ing.status === "Rejected" ? "#dc2626" : "#ca8a04"
                    }}>
                      {ing.status}
                    </div>

                    {/* Approve/Reject buttons */}
                    {ing.status !== "Approved" && ing.status !== "Rejected" && ing.receivedStatus === "Received" && (
                      <button
                        onClick={() => setExpandedIng(expandedIng === ing.id ? null : ing.id)}
                        style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
                        Quality Check ▼
                      </button>
                    )}
                  </div>
                </div>

                {/* Source location */}
                <div style={{ marginTop: "10px", background: "#eff6ff", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#2563eb" }}>
                  🗺️ Shipped from: <strong>{ing.location}</strong> → Sumo Biscuits, Hyderabad
                </div>

                {ing.reviewReason && (
                  <div style={{ marginTop: "8px", background: "#fef9c3", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#ca8a04" }}>
                    ⚠️ {ing.reviewReason}
                  </div>
                )}
              </div>

              {/* Quality Check Expansion */}
              {expandedIng === ing.id && (
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "16px", marginTop: "8px" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "12px", color: "#1e40af" }}>🔍 Quality Check for {ing.name}</div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "6px" }}>Notes / Issues found:</label>
                    <textarea
                      placeholder="Describe any quality issues found..."
                      value={reviewNote[ing.id] || ""}
                      onChange={(e) => setReviewNote({ ...reviewNote, [ing.id]: e.target.value })}
                      rows={2}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #bfdbfe", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleApprove(ing.id)}
                      style={{ flex: 1, padding: "12px", background: "#16a34a", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>
                      ✓ Approve Quality
                    </button>
                    <button onClick={() => handleReject(ing.id)}
                      style={{ flex: 1, padding: "12px", background: "#dc2626", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>
                      ✗ Reject Quality
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}