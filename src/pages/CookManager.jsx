import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { batches } from "../data/mockData";

export default function CookManager() {
  const navigate = useNavigate();
  const [cookRecords, setCookRecords] = useState({});
  const [expandedBatch, setExpandedBatch] = useState(null);

  const inProgressBatches = batches.filter((b) => b.status === "In Progress" || b.status === "Released");

  const handleSaveCook = (batchId, record) => {
    setCookRecords((prev) => ({ ...prev, [batchId]: { ...record, approved: true } }));
    setExpandedBatch(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>👨‍🍳 Cook Manager</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Record baking and cooking details for each batch</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Batches", value: batches.length, color: "#2563eb" },
            { label: "Cook Records Done", value: Object.keys(cookRecords).length, color: "#16a34a" },
            { label: "Pending Records", value: batches.length - Object.keys(cookRecords).length, color: "#ca8a04" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${s.color}` }}>
              <div style={{ color: "#64748b", fontSize: "14px" }}>{s.label}</div>
              <div style={{ fontSize: "36px", fontWeight: "bold", color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
          <h2 style={{ margin: "0 0 20px 0" }}>🍪 Batch Cook Records</h2>

          {inProgressBatches.map((batch) => {
            const record = cookRecords[batch.id];
            return (
              <div key={batch.id} style={{ marginBottom: "16px" }}>
                <div style={{
                  padding: "16px", borderRadius: "12px", background: "#f8fafc",
                  border: `1px solid ${record ? "#bbf7d0" : "#e2e8f0"}`
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "16px" }}>{batch.product}</div>
                      <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.date} · {batch.line}</div>
                      <div style={{ color: "#94a3b8", fontSize: "13px" }}>{batch.quantity} {batch.unit}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {record ? (
                        <div style={{ padding: "4px 12px", borderRadius: "999px", background: "#dcfce7", color: "#16a34a", fontSize: "13px", fontWeight: "bold" }}>
                          ✅ Cook Record Done
                        </div>
                      ) : (
                        <button
                          onClick={() => setExpandedBatch(expandedBatch === batch.id ? null : batch.id)}
                          style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                          + Add Cook Record
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Show saved record */}
                  {record && (
                    <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                      {[
                        { label: "Oven", value: record.ovenNumber },
                        { label: "Temperature", value: record.bakingTemp },
                        { label: "Baking Time", value: record.bakingTime },
                        { label: "Mixing Time", value: record.mixingTime },
                        { label: "Dough Weight", value: record.doughWeight },
                        { label: "Line Used", value: record.lineUsed },
                      ].map((f) => (
                        <div key={f.label} style={{ background: "white", borderRadius: "8px", padding: "8px 12px" }}>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>{f.label}</div>
                          <div style={{ fontWeight: "500", fontSize: "13px" }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cook record form */}
                {expandedBatch === batch.id && (
                  <CookForm batchId={batch.id} batch={batch} onSave={handleSaveCook} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CookForm({ batchId, batch, onSave }) {
  const [form, setForm] = useState({
    ovenNumber: "",
    bakingTemp: "",
    bakingTime: "",
    mixingTime: "",
    doughWeight: "",
    lineUsed: batch.line,
    notes: "",
  });

  return (
    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginTop: "8px" }}>
      <div style={{ fontWeight: "bold", marginBottom: "16px", color: "#1e40af" }}>👨‍🍳 Cook Record for {batch.product}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        {[
          { key: "ovenNumber", label: "Oven Number", placeholder: "Oven 2" },
          { key: "bakingTemp", label: "Baking Temperature", placeholder: "185°C" },
          { key: "bakingTime", label: "Baking Time", placeholder: "12 minutes" },
          { key: "mixingTime", label: "Mixing Time", placeholder: "8 minutes" },
          { key: "doughWeight", label: "Dough Weight", placeholder: "450 kg" },
          { key: "lineUsed", label: "Line Used", placeholder: "Line A" },
        ].map((field) => (
          <div key={field.key}>
            <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "4px" }}>{field.label}</label>
            <input
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #bfdbfe", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "4px" }}>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Any observations during cooking..."
          rows={2}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #bfdbfe", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }}
        />
      </div>

      <button
        onClick={() => {
          if (!form.ovenNumber || !form.bakingTemp) {
            alert("Please fill Oven Number and Baking Temperature at minimum");
            return;
          }
          onSave(batchId, form);
        }}
        style={{ width: "100%", padding: "12px", background: "#16a34a", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}>
        ✅ Save Cook Record
      </button>
    </div>
  );
}