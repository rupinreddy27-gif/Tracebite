import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { batches, storeLocations } from "../data/mockData";

export default function DispatchManager() {
  const navigate = useNavigate();
  const [dispatches, setDispatches] = useState({});
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [form, setForm] = useState({});

  const readyBatches = batches.filter((b) => b.status === "Released");

  const handleDispatch = (batchId) => {
    const f = form[batchId] || {};
    if (!f.vehicle || !f.driver || !f.selectedStores?.length) {
      alert("Please fill vehicle, driver and select at least one store");
      return;
    }
    setDispatches((prev) => ({
      ...prev,
      [batchId]: {
        ...f,
        date: new Date().toLocaleDateString(),
        status: "Dispatched",
      }
    }));
    setExpandedBatch(null);
  };

  const updateForm = (batchId, key, value) => {
    setForm((prev) => ({
      ...prev,
      [batchId]: { ...prev[batchId], [key]: value }
    }));
  };

  const toggleStore = (batchId, store) => {
    const current = form[batchId]?.selectedStores || [];
    const updated = current.includes(store)
      ? current.filter((s) => s !== store)
      : [...current, store];
    updateForm(batchId, "selectedStores", updated);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>🚚 Dispatch Manager</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Manage truck dispatches and delivery locations across Hyderabad</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Ready to Dispatch", value: readyBatches.length, color: "#16a34a" },
            { label: "Dispatched Today", value: Object.keys(dispatches).length, color: "#2563eb" },
            { label: "Delivery Locations", value: storeLocations.length, color: "#ca8a04" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: "16px", padding: "20px", borderLeft: `4px solid ${s.color}` }}>
              <div style={{ color: "#64748b", fontSize: "14px" }}>{s.label}</div>
              <div style={{ fontSize: "36px", fontWeight: "bold", color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Store Locations Map */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px 0" }}>📍 Delivery Locations — Hyderabad</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {storeLocations.map((store, i) => (
              <div key={i} style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "500", fontSize: "14px" }}>🏪 {store.name}</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  📍 {store.lat.toFixed(4)}, {store.lng.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ready Batches */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
          <h2 style={{ margin: "0 0 16px 0" }}>📦 Batches Ready for Dispatch</h2>

          {readyBatches.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
              No batches ready for dispatch yet
            </div>
          )}

          {readyBatches.map((batch) => {
            const dispatched = dispatches[batch.id];
            const batchForm = form[batch.id] || {};

            return (
              <div key={batch.id} style={{ marginBottom: "16px" }}>
                <div style={{
                  padding: "16px", borderRadius: "12px", background: "#f8fafc",
                  border: `1px solid ${dispatched ? "#bbf7d0" : "#e2e8f0"}`
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "16px" }}>{batch.product}</div>
                      <div style={{ color: "#64748b", fontSize: "13px" }}>{batch.id} · {batch.quantity} {batch.unit}</div>
                      <div style={{ color: "#94a3b8", fontSize: "13px" }}>{batch.date} · {batch.line}</div>
                    </div>
                    {dispatched ? (
                      <div style={{ padding: "6px 14px", borderRadius: "999px", background: "#dcfce7", color: "#16a34a", fontWeight: "bold", fontSize: "13px" }}>
                        🚚 Dispatched
                      </div>
                    ) : (
                      <button
                        onClick={() => setExpandedBatch(expandedBatch === batch.id ? null : batch.id)}
                        style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>
                        Dispatch This Batch
                      </button>
                    )}
                  </div>

                  {/* Show dispatch details */}
                  {dispatched && (
                    <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {[
                        { label: "Vehicle", value: dispatched.vehicle },
                        { label: "Driver", value: dispatched.driver },
                        { label: "Dispatch Date", value: dispatched.date },
                        { label: "Stores", value: dispatched.selectedStores?.join(", ") },
                      ].map((f) => (
                        <div key={f.label} style={{ background: "white", borderRadius: "8px", padding: "8px 12px" }}>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>{f.label}</div>
                          <div style={{ fontWeight: "500", fontSize: "13px" }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dispatch Form */}
                {expandedBatch === batch.id && !dispatched && (
                  <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginTop: "8px" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "16px", color: "#1e40af" }}>🚚 Dispatch Details for {batch.product}</div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "4px" }}>Vehicle Number *</label>
                        <input
                          value={batchForm.vehicle || ""}
                          onChange={(e) => updateForm(batch.id, "vehicle", e.target.value)}
                          placeholder="TS 09 AB 1234"
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #bfdbfe", fontSize: "14px", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "4px" }}>Driver Name *</label>
                        <input
                          value={batchForm.driver || ""}
                          onChange={(e) => updateForm(batch.id, "driver", e.target.value)}
                          placeholder="Ravi Kumar"
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #bfdbfe", fontSize: "14px", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "8px", fontWeight: "500" }}>
                        Select Delivery Stores * (click to select)
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {storeLocations.map((store, i) => {
                          const selected = batchForm.selectedStores?.includes(store.name);
                          return (
                            <div
                              key={i}
                              onClick={() => toggleStore(batch.id, store.name)}
                              style={{
                                padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                border: `2px solid ${selected ? "#2563eb" : "#e2e8f0"}`,
                                background: selected ? "#eff6ff" : "white",
                                fontSize: "13px", fontWeight: selected ? "bold" : "normal",
                                color: selected ? "#2563eb" : "#475569"
                              }}>
                              {selected ? "✓ " : "○ "}{store.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {batchForm.selectedStores?.length > 0 && (
                      <div style={{ background: "white", borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "bold", color: "#2563eb", marginBottom: "8px" }}>
                          🗺️ Route: Sumo Biscuits → {batchForm.selectedStores.join(" → ")}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          {batchForm.selectedStores.length} delivery stops
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleDispatch(batch.id)}
                      style={{ width: "100%", padding: "14px", background: "#16a34a", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}>
                      ✅ Confirm Dispatch
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}