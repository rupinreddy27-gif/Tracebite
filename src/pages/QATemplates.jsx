import { useState } from "react";
import { qaTemplates } from "../data/mockData";

export default function QATemplates() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0 }}>QA Templates</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Reusable quality assurance checklists</p>
        </div>
        <button style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
          + New Template
        </button>
      </div>

      {/* Template Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {qaTemplates.map((template) => (
          <div
            key={template.id}
            style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{ background: "#eff6ff", borderRadius: "10px", padding: "10px", fontSize: "20px" }}>📋</div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>{template.name}</div>
                <div style={{ color: "#64748b", fontSize: "13px" }}>{template.category}</div>
              </div>
            </div>

            <div style={{ color: "#475569", fontSize: "14px", marginBottom: "16px" }}>
              {template.items.length} check items
            </div>

            {/* Tag Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {template.items.slice(0, 3).map((item) => (
                <span
                  key={item}
                  style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", color: "#475569" }}>
                  {item}
                </span>
              ))}
              {template.items.length > 3 && (
                <span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", color: "#475569" }}>
                  +{template.items.length - 3} more
                </span>
              )}
            </div>

            <button
              onClick={() => setSelected(selected === template.id ? null : template.id)}
              style={{ padding: "10px 20px", background: "#f1f5f9", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "500" }}>
              {selected === template.id ? "Hide Items" : "View Items"}
            </button>

            {/* Expanded Items */}
            {selected === template.id && (
              <div style={{ marginTop: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                {template.items.map((item, index) => (
                  <div key={item} style={{ padding: "10px 0", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>{index + 1}.</span>
                    <span style={{ fontSize: "14px" }}>{item}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}