import { useNavigate, useParams } from "react-router-dom";
import { batches } from "../data/mockData";
import { useState } from "react";

export default function BatchDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Details");

  const batch = batches.find((b) => b.id === id);

  if (!batch) {
    return (
      <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
        <h2>Batch not found</h2>
        <button onClick={() => navigate("/batches")}>← Back to Batches</button>
      </div>
    );
  }

  const tabs = ["Details", "Materials", "QA Checks", "Approvals"];

  const approvals = [
    { stage: "Submitted for QA", person: "Maria Chen", date: "Jan 15, 2024 9:30 AM", done: true },
    { stage: "QA Review", person: "James Wilson", date: "Jan 16, 2024 4:15 AM", done: true },
    { stage: "Final Approval", person: "Sarah Johnson", date: "Jan 16, 2024 11:00 AM", done: true },
    { stage: "Released", person: "System", date: "Jan 16, 2024 11:01 AM", done: batch.status === "Released" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <button
            onClick={() => navigate("/batches")}
            style={{ padding: "10px 16px", background: "#f1f5f9", border: "none", borderRadius: "10px", cursor: "pointer" }}>
            ← Back
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#64748b", fontSize: "14px" }}>{batch.id}</div>
            <h1 style={{ margin: "4px 0 0 0", fontSize: "24px" }}>{batch.product}</h1>
          </div>
          <div style={{
            padding: "6px 16px",
            borderRadius: "999px",
            fontSize: "14px",
            background: batch.status === "Released" ? "#dcfce7" : "#fee2e2",
            color: batch.status === "Released" ? "#16a34a" : "#dc2626",
            fontWeight: "bold"
          }}>
            {batch.status}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "white", padding: "6px", borderRadius: "12px", width: "fit-content" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "500",
                background: activeTab === tab ? "#2563eb" : "transparent",
                color: activeTab === tab ? "white" : "#64748b",
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Details Tab */}
        {activeTab === "Details" && (
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px 0" }}>📦 Batch Information</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {[
                { label: "Batch ID", value: batch.id },
                { label: "Product Name", value: batch.product },
                { label: "Product SKU", value: batch.sku },
                { label: "Factory Name", value: batch.factory },
                { label: "Production Date", value: batch.date },
                { label: "Production Line", value: batch.line },
                { label: "Shift", value: batch.shift },
                { label: "Quantity Produced", value: `${batch.quantity} ${batch.unit}` },
              ].map((field) => (
                <div key={field.label}>
                  <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>{field.label}</div>
                  <div style={{ fontSize: "15px", fontWeight: "500" }}>{field.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === "Materials" && (
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px 0" }}>🧪 Raw Materials</h2>
            <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>No materials recorded yet</div>
              <div style={{ fontSize: "14px", marginTop: "8px" }}>Materials will be added when backend is connected</div>
            </div>
          </div>
        )}

        {/* QA Checks Tab */}
        {activeTab === "QA Checks" && (
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px 0" }}>✅ QA Checklist</h2>
            {["Visual appearance", "Weight check", "Seal integrity", "Label verification", "Barcode scan"].map((item) => (
              <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f8fafc", borderRadius: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px" }}>{item}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ padding: "6px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#16a34a", fontWeight: "500" }}>Pass</button>
                  <button style={{ padding: "6px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#dc2626", fontWeight: "500" }}>Fail</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === "Approvals" && (
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px 0" }}>🛡️ Approvals & Status</h2>
            {approvals.map((approval) => (
              <div key={approval.stage} style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0,
                  background: approval.done ? "#dcfce7" : "#f1f5f9",
                }}>
                  {approval.done ? "✅" : "⏳"}
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "15px" }}>{approval.stage}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{approval.person} · {approval.date}</div>
                </div>
              </div>
            ))}

            {batch.status === "Released" && (
              <div style={{ marginTop: "24px", background: "#f0fdf4", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🚚</div>
                <div style={{ fontWeight: "bold", color: "#16a34a", fontSize: "16px" }}>Batch Released</div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>This batch has been approved and released</div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}