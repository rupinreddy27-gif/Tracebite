import { useNavigate, useParams } from "react-router-dom";
import { batches, ingredients, qaTemplates } from "../data/mockData";
import { useState } from "react";

export default function BatchDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Details");
  const [qaChecks, setQaChecks] = useState({
    "Raw flour quality check": { status: null, photo: null, reason: "" },
    "Sugar and salt measurement": { status: null, photo: null, reason: "" },
    "Biscuit color and texture": { status: null, photo: null, reason: "" },
    "Weight per packet check": { status: null, photo: null, reason: "" },
    "Packaging seal integrity": { status: null, photo: null, reason: "" },
    "Allergen labeling verified": { status: null, photo: null, reason: "" },
    "Expiry date printed correctly": { status: null, photo: null, reason: "" },
  });

  const [expandedIngredient, setExpandedIngredient] = useState(null);

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

  const ingredientReviewReasons = {
    "ING-005": {
      reason: "Milk powder batch failed moisture content test",
      detectedBy: "QA Lab",
      date: "Jan 20, 2024",
      action: "Awaiting re-test from supplier Amul Dairy",
    },
  };

  const handleStatus = (item, status) => {
    setQaChecks((prev) => ({
      ...prev,
      [item]: { ...prev[item], status },
    }));
  };

  const handlePhoto = (item, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setQaChecks((prev) => ({
      ...prev,
      [item]: { ...prev[item], photo: url },
    }));
  };

  const handleReason = (item, value) => {
    setQaChecks((prev) => ({
      ...prev,
      [item]: { ...prev[item], reason: value },
    }));
  };

  const allDone = Object.values(qaChecks).every((c) => c.status !== null);
  const allPassed = Object.values(qaChecks).every((c) => c.status === "pass");
  const anyFailed = Object.values(qaChecks).some((c) => c.status === "fail");
  const hasIngredientOnHold = ingredients.some((ing) => ing.status === "Under Review") && batch.status === "Released";

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
  background: hasIngredientOnHold ? "#fef9c3" : batch.status === "Released" ? "#dcfce7" : batch.status === "In Progress" ? "#fef9c3" : "#fee2e2",
  color: hasIngredientOnHold ? "#ca8a04" : batch.status === "Released" ? "#16a34a" : batch.status === "In Progress" ? "#ca8a04" : "#dc2626",
  fontWeight: "bold"
}}></div>
        
                    
  {hasIngredientOnHold ? "🔒 On Hold" : batch.status}
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

        {/* ============ DETAILS TAB ============ */}
        {activeTab === "Details" && (
          <div>
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

            {/* Ingredient Hold Warning - inside Details tab */}
            {hasIngredientOnHold && (
              <div style={{
                marginTop: "16px",
                background: "#fffbeb",
                border: "1px solid #fbbf24",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start"
              }}>
                <div style={{ fontSize: "24px" }}>⚠️</div>
                <div>
                  <div style={{ fontWeight: "bold", color: "#ca8a04", marginBottom: "4px" }}>
                    Batch on Hold — Ingredient Under Review
                  </div>
                  <div style={{ fontSize: "14px", color: "#475569" }}>
                    One or more raw ingredients are currently under review.
                    This batch cannot be released until all ingredients are approved.
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    {ingredients
                      .filter((ing) => ing.status === "Under Review")
                      .map((ing) => (
                        <div key={ing.id} style={{ fontSize: "13px", color: "#dc2626", marginTop: "4px" }}>
                          ❌ {ing.name} — {ing.supplier} (Lot: {ing.lotNumber})
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Rejection reason - only shows for QA Rejected batches */}
{batch.status === "QA Rejected" && batch.rejectionReason && (
  <div style={{
    marginTop: "16px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start"
  }}>
    <div style={{ fontSize: "24px" }}>❌</div>
    <div>
      <div style={{ fontWeight: "bold", color: "#dc2626", marginBottom: "8px", fontSize: "16px" }}>
        Why was this batch QA Rejected?
      </div>
      <div style={{ fontSize: "14px", color: "#475569", marginBottom: "10px" }}>
        {batch.rejectionReason}
      </div>
      <div style={{ fontSize: "13px", color: "#94a3b8" }}>
        Rejected by: <strong style={{ color: "#475569" }}>{batch.rejectedBy}</strong> · {batch.rejectedDate}
      </div>
    </div>
  </div>
)}


        {/* ============ MATERIALS TAB ============ */}
        {activeTab === "Materials" && (
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px 0" }}>🌾 Raw Ingredients Used</h2>
            {ingredients.map((ing) => (
              <div key={ing.id}>
                <div style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  border: expandedIngredient === ing.id ? "1px solid #fbbf24" : "1px solid transparent"
                }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "15px" }}>{ing.name}</div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>Supplier: {ing.supplier}</div>
                    <div style={{ color: "#94a3b8", fontSize: "13px" }}>Lot: {ing.lotNumber} · {ing.quantity}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      background: ing.status === "Approved" ? "#dcfce7" : "#fef9c3",
                      color: ing.status === "Approved" ? "#16a34a" : "#ca8a04",
                      fontWeight: "bold"
                    }}>
                      {ing.status}
                    </div>
                    {ing.status === "Under Review" && (
                      <button
                        onClick={() => setExpandedIngredient(expandedIngredient === ing.id ? null : ing.id)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#fef9c3",
                          color: "#ca8a04",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "bold"
                        }}>
                        {expandedIngredient === ing.id ? "Hide ▲" : "Why? ▼"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded reason */}
                {expandedIngredient === ing.id && ingredientReviewReasons[ing.id] && (
                  <div style={{
                    background: "#fffbeb",
                    border: "1px solid #fbbf24",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "8px",
                    marginLeft: "8px"
                  }}>
                    <div style={{ fontWeight: "bold", color: "#ca8a04", marginBottom: "10px" }}>
                      ⚠️ Why is this Under Review?
                    </div>
                    <div style={{ fontSize: "14px", color: "#475569", marginBottom: "6px" }}>
                      <strong>Issue:</strong> {ingredientReviewReasons[ing.id].reason}
                    </div>
                    <div style={{ fontSize: "14px", color: "#475569", marginBottom: "6px" }}>
                      <strong>Detected by:</strong> {ingredientReviewReasons[ing.id].detectedBy}
                    </div>
                    <div style={{ fontSize: "14px", color: "#475569", marginBottom: "6px" }}>
                      <strong>Date:</strong> {ingredientReviewReasons[ing.id].date}
                    </div>
                    <div style={{ fontSize: "14px", color: "#475569" }}>
                      <strong>Action:</strong> {ingredientReviewReasons[ing.id].action}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============ QA CHECKS TAB ============ */}
        {activeTab === "QA Checks" && (
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px 0" }}>✅ QA Checklist</h2>

            {Object.entries(qaChecks).map(([item, data]) => (
              <div key={item} style={{
                background: data.status === "pass" ? "#f0fdf4" : data.status === "fail" ? "#fef2f2" : "#f8fafc",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                border: `1px solid ${data.status === "pass" ? "#bbf7d0" : data.status === "fail" ? "#fecaca" : "#e2e8f0"}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontWeight: "500", fontSize: "15px" }}>{item}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleStatus(item, "pass")}
                      style={{
                        padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold",
                        background: data.status === "pass" ? "#16a34a" : "#e2e8f0",
                        color: data.status === "pass" ? "white" : "#475569",
                      }}>
                      ✓ Pass
                    </button>
                    <button
                      onClick={() => handleStatus(item, "fail")}
                      style={{
                        padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold",
                        background: data.status === "fail" ? "#dc2626" : "#e2e8f0",
                        color: data.status === "fail" ? "white" : "#475569",
                      }}>
                      ✗ Fail
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <label style={{
                    padding: "8px 16px", background: "white", border: "1px dashed #cbd5e1",
                    borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#64748b",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}>
                    📷 Upload Photo Evidence
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhoto(item, e)} />
                  </label>
                  {data.photo && (
                    <img src={data.photo} alt="evidence" style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover", border: "2px solid #e2e8f0" }} />
                  )}
                  {data.status && (
                    <span style={{ fontSize: "13px", fontWeight: "bold", color: data.status === "pass" ? "#16a34a" : "#dc2626" }}>
                      {data.status === "pass" ? "✓ Passed" : "✗ Failed"}
                    </span>
                  )}
                </div>

                {data.status === "fail" && (
                  <div style={{ marginTop: "12px" }}>
                    <textarea
                      placeholder="Why did this check fail? Describe the issue clearly..."
                      value={data.reason}
                      onChange={(e) => handleReason(item, e.target.value)}
                      rows={2}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: "8px",
                        border: "1px solid #fecaca", fontSize: "14px",
                        background: "#fff5f5", color: "#dc2626",
                        boxSizing: "border-box", resize: "vertical"
                      }}
                    />
                    {data.reason && (
                      <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>⚠️ Reason recorded</div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {allDone && (
              <div style={{
                marginTop: "24px", padding: "20px", borderRadius: "12px",
                background: allPassed ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${allPassed ? "#bbf7d0" : "#fecaca"}`
              }}>
                <div style={{ textAlign: "center", marginBottom: anyFailed ? "16px" : "0" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{allPassed ? "🎉" : "⚠️"}</div>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: allPassed ? "#16a34a" : "#dc2626" }}>
                    {allPassed ? "All checks passed! Ready for approval." : "Some checks failed. Review required."}
                  </div>
                </div>

                {anyFailed && (
                  <div style={{ marginTop: "16px", borderTop: "1px solid #fecaca", paddingTop: "16px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "14px", color: "#dc2626", marginBottom: "10px" }}>❌ Failed Checks:</div>
                    {Object.entries(qaChecks)
                      .filter(([, d]) => d.status === "fail")
                      .map(([item, d]) => (
                        <div key={item} style={{ background: "white", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px", border: "1px solid #fecaca" }}>
                          <div style={{ fontWeight: "500", color: "#dc2626" }}>✗ {item}</div>
                          {d.photo && (
                            <img src={d.photo} alt="evidence" style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", marginTop: "8px", border: "2px solid #fecaca" }} />
                          )}
                          {d.reason ? (
                            <div style={{ fontSize: "13px", color: "#475569", marginTop: "6px" }}>📝 Reason: {d.reason}</div>
                          ) : (
                            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>No reason provided</div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============ APPROVALS TAB ============ */}
        {activeTab === "Approvals" && (
          <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px 0" }}>🛡️ Approvals & Status</h2>
            {approvals.map((approval) => (
              <div key={approval.stage} style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", flexShrink: 0,
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

            {/* Hold or Released status */}
            {hasIngredientOnHold ? (
              <div style={{ marginTop: "24px", background: "#fffbeb", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔒</div>
                <div style={{ fontWeight: "bold", color: "#ca8a04", fontSize: "16px" }}>Batch on Hold</div>
                <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
                  Cannot release — Milk Powder is still Under Review
                </div>
              </div>
            ) : batch.status === "Released" ? (
              <div style={{ marginTop: "24px", background: "#f0fdf4", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🚚</div>
                <div style={{ fontWeight: "bold", color: "#16a34a", fontSize: "16px" }}>Batch Released</div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>This batch has been approved and released</div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
