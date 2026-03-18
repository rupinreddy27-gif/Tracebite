import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ingredients } from "../data/mockData";

export default function RawMaterialManager() {
  const navigate = useNavigate();
  const [ingList, setIngList] = useState(ingredients);
  const [expandedIng, setExpandedIng] = useState(null);
  const [reviewNote, setReviewNote] = useState({});
  const [activeSection, setActiveSection] = useState("All");

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
  const totalUnderReview = ingList.filter((i) => i.status === "Under Review").length;
  const totalNotReceived = ingList.filter((i) => i.receivedStatus === "Not Received").length;
  const totalRejected = ingList.filter((i) => i.status === "Rejected").length;

  const filteredList = activeSection === "All" ? ingList
    : activeSection === "Approved" ? ingList.filter((i) => i.status === "Approved")
    : activeSection === "Under Review" ? ingList.filter((i) => i.status === "Under Review")
    : activeSection === "Not Received" ? ingList.filter((i) => i.receivedStatus === "Not Received")
    : ingList.filter((i) => i.status === "Rejected");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>🌾 Raw Material Manager</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
            Check incoming raw materials, verify sources and approve quality
          </p>
        </div>

        {/* Clickable Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Approved", value: totalApproved, color: "#16a34a", bg: "#dcfce7", key: "Approved" },
            { label: "Under Review", value: totalUnderReview, color: "#ca8a04", bg: "#fef9c3", key: "Under Review" },
            { label: "Not Received", value: totalNotReceived, color: "#dc2626", bg: "#fee2e2", key: "Not Received" },
            { label: "Rejected", value: totalRejected, color: "#7c3aed", bg: "#ede9fe", key: "Rejected" },
          ].map((s) => (
            <div
              key={s.key}
              onClick={() => setActiveSection(activeSection === s.key ? "All" : s.key)}
              style={{
                background: activeSection === s.key ? s.bg : "white",
                borderRadius: "16px", padding: "20px",
                borderLeft: `4px solid ${s.color}`,
                cursor: "pointer",
                border: activeSection === s.key ? `2px solid ${s.color}` : `1px solid transparent`,
                borderLeftWidth: "4px"
              }}>
              <div style={{ color: "#64748b", fontSize: "14px" }}>{s.label}</div>
              <div style={{ fontSize: "36px", fontWeight: "bold", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: s.color, marginTop: "4px" }}>
                {activeSection === s.key ? "← showing these" : "click to filter"}
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["All", "Approved", "Under Review", "Not Received", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              style={{
                padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer",
                fontWeight: "500", fontSize: "13px",
                background: activeSection === tab ? "#2563eb" : "#f1f5f9",
                color: activeSection === tab ? "white" : "#475569"
              }}>
              {tab} ({tab === "All" ? ingList.length
                : tab === "Approved" ? totalApproved
                : tab === "Under Review" ? totalUnderReview
                : tab === "Not Received" ? totalNotReceived
                : totalRejected})
            </button>
          ))}
        </div>

        {/* Ingredient List */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
          <h2 style={{ margin: "0 0 20px 0" }}>
            📦 {activeSection === "All" ? "All" : activeSection} Ingredients
            <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "normal", marginLeft: "8px" }}>
              ({filteredList.length} items)
            </span>
          </h2>

          {filteredList.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
              No ingredients in this category
            </div>
          )}

          {filteredList.map((ing) => (
            <div key={ing.id} style={{ marginBottom: "16px" }}>
              <div style={{
                padding: "16px", borderRadius: "12px", background: "#f8fafc",
                border: `2px solid ${
                  ing.status === "Approved" ? "#bbf7d0"
                  : ing.status === "Rejected" ? "#fecaca"
                  : ing.receivedStatus === "Not Received" ? "#fecaca"
                  : "#fef08a"
                }`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  
                  {/* Left - ingredient info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
                      {ing.name}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>
                      🏭 Supplier: {ing.supplier}
                    </div>
                    <div style={{ color: "#2563eb", fontSize: "13px", marginTop: "2px" }}>
                      📍 Source Location: <strong>{ing.location}</strong>
                    </div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>
                      🔢 Lot: {ing.lotNumber} · 📦 {ing.quantity}
                    </div>

                    {/* Route */}
                    <div style={{ marginTop: "8px", background: "#eff6ff", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", color: "#2563eb", display: "inline-block" }}>
                      🗺️ {ing.location} → Sumo Biscuits, Hyderabad
                    </div>

                    {/* Review reason */}
                    {ing.reviewReason && (
                      <div style={{ marginTop: "8px", background: ing.status === "Rejected" ? "#fef2f2" : "#fffbeb", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", color: ing.status === "Rejected" ? "#dc2626" : "#ca8a04" }}>
                        ⚠️ {ing.reviewReason}
                      </div>
                    )}
                  </div>

                  {/* Right - actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", minWidth: "160px" }}>
                    
                    {/* Status badge */}
                    <div style={{
                      padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "bold",
                      background: ing.status === "Approved" ? "#dcfce7" : ing.status === "Rejected" ? "#fee2e2" : "#fef9c3",
                      color: ing.status === "Approved" ? "#16a34a" : ing.status === "Rejected" ? "#dc2626" : "#ca8a04"
                    }}>
                      {ing.status}
                    </div>

                    {/* Received / Not Received buttons */}
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

                    {/* Quality check button */}
                    {ing.status !== "Approved" && ing.status !== "Rejected" && ing.receivedStatus === "Received" && (
                      <button
                        onClick={() => setExpandedIng(expandedIng === ing.id ? null : ing.id)}
                        style={{
                          padding: "8px 16px", borderRadius: "8px", border: "none",
                          background: "#2563eb", color: "white",
                          cursor: "pointer", fontSize: "13px", fontWeight: "bold", width: "100%"
                        }}>
                        🔍 Quality Check ▼
                      </button>
                    )}

                    {/* Already approved/rejected message */}
                    {ing.status === "Approved" && (
                      <div style={{ fontSize: "13px", color: "#16a34a", fontWeight: "bold" }}>
                        ✅ Quality Approved
                      </div>
                    )}
                    {ing.status === "Rejected" && (
                      <div style={{ fontSize: "13px", color: "#dc2626", fontWeight: "bold" }}>
                        ❌ Quality Rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quality Check Form - expands when clicked */}
              {expandedIng === ing.id && (
                <div style={{
                  background: "#eff6ff", border: "1px solid #bfdbfe",
                  borderRadius: "12px", padding: "20px", marginTop: "8px"
                }}>
                  <div style={{ fontWeight: "bold", marginBottom: "12px", color: "#1e40af", fontSize: "15px" }}>
                    🔍 Quality Check for {ing.name}
                  </div>
                  <div style={{ color: "#475569", fontSize: "13px", marginBottom: "12px" }}>
                    Source: {ing.location} · Supplier: {ing.supplier} · Lot: {ing.lotNumber}
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "6px", fontWeight: "500" }}>
                      Quality Notes / Issues Found:
                    </label>
                    <textarea
                      placeholder="Describe any quality issues found, or leave blank if all good..."
                      value={reviewNote[ing.id] || ""}
                      onChange={(e) => setReviewNote({ ...reviewNote, [ing.id]: e.target.value })}
                      rows={3}
                      style={{
                        width: "100%", padding: "10px", borderRadius: "8px",
                        border: "1px solid #bfdbfe", fontSize: "14px",
                        boxSizing: "border-box", resize: "vertical"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => handleApprove(ing.id)}
                      style={{
                        flex: 1, padding: "14px", background: "#16a34a", color: "white",
                        border: "none", borderRadius: "10px", cursor: "pointer",
                        fontWeight: "bold", fontSize: "15px"
                      }}>
                      ✅ Approve Quality
                    </button>
                    <button
                      onClick={() => handleReject(ing.id)}
                      style={{
                        flex: 1, padding: "14px", background: "#dc2626", color: "white",
                        border: "none", borderRadius: "10px", cursor: "pointer",
                        fontWeight: "bold", fontSize: "15px"
                      }}>
                      ❌ Reject Quality
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
