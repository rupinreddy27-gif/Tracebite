import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { qaTemplates } from "../data/mockData";

export default function NewBatch() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product: "",
    sku: "",
    factory: "",
    line: "",
    shift: "",
    date: "",
    targetQty: "",
    actualQty: "",
    notes: "",
    templateId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.product || !form.sku || !form.factory) {
      alert("Please fill in Product, SKU and Factory at minimum");
      return;
    }
    if (!form.templateId) {
      alert("Please select a QA Template for this batch");
      return;
    }
    alert(`Batch created for ${form.product} with QA template selected! (Saves to database when backend is connected)`);
    navigate("/batches");
  };

  const selectedTemplate = qaTemplates.find((t) => t.id === form.templateId);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <button
            onClick={() => navigate("/batches")}
            style={{ padding: "10px 16px", background: "#f1f5f9", border: "none", borderRadius: "10px", cursor: "pointer" }}>
            ← Back
          </button>
          <div>
            <h1 style={{ margin: 0 }}>New Batch Record</h1>
            <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Create in under 30 seconds</p>
          </div>
        </div>

        {/* Batch Info Form */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ margin: "0 0 20px 0" }}>📦 Batch Information</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px" }}>Product Name *</label>
              <input
                name="product"
                value={form.product}
                onChange={handleChange}
                placeholder="Hydrating Face Serum"
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px" }}>Product SKU *</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="HFS-30ML"
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px" }}>Factory Name *</label>
              <input
                name="factory"
                value={form.factory}
                onChange={handleChange}
                placeholder="GreenLeaf Manufacturing Co."
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px" }}>Production Line</label>
              <select
                name="line"
                value={form.line}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box", background: "white" }}>
                <option value="">Select Line</option>
                <option>Line A</option>
                <option>Line B</option>
                <option>Line C</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px" }}>Production Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px" }}>Shift</label>
              <select
                name="shift"
                value={form.shift}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box", background: "white" }}>
                <option value="">Select Shift</option>
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px" }}>Target Quantity</label>
              <input
                type="number"
                name="targetQty"
                value={form.targetQty}
                onChange={handleChange}
                placeholder="5000"
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px" }}>Actual Quantity</label>
              <input
                type="number"
                name="actualQty"
                value={form.actualQty}
                onChange={handleChange}
                placeholder="4800"
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "6px" }}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes about this batch..."
              rows={3}
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }}
            />
          </div>
        </div>

        {/* QA Template Selector */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ margin: "0 0 8px 0" }}>📋 Select QA Template *</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 16px 0" }}>
            Choose a QA checklist template for this batch. These checks will be loaded automatically.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {qaTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => setForm({ ...form, templateId: template.id })}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: `2px solid ${form.templateId === template.id ? "#2563eb" : "#e2e8f0"}`,
                  cursor: "pointer",
                  background: form.templateId === template.id ? "#eff6ff" : "white",
                }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{template.name}</div>
                <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>{template.category}</div>
                <div style={{ color: "#94a3b8", fontSize: "13px" }}>{template.items.length} check items</div>
              </div>
            ))}
          </div>

          {/* Preview selected template */}
          {selectedTemplate && (
            <div style={{ marginTop: "16px", background: "#f8fafc", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "10px", color: "#2563eb" }}>
                ✅ {selectedTemplate.name} — checks that will be loaded:
              </div>
              {selectedTemplate.items.map((item, index) => (
                <div key={item} style={{ fontSize: "14px", padding: "6px 0", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                  {index + 1}. {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{ width: "100%", padding: "16px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
          Create Batch Record
        </button>

      </div>
    </div>
  );
}