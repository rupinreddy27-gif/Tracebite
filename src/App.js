export default function App() {
  const kpis = [
    { label: "Open Batches", value: "18" },
    { label: "Pending QA", value: "6" },
    { label: "Deviations", value: "2" },
    { label: "Released Today", value: "11" },
  ];

  const recentBatches = [
    { id: "BT-240317-01", sku: "Choco Biscuit 120g", line: "Line 2", status: "Pending QA" },
    { id: "BT-240317-02", sku: "Salt Crackers 80g", line: "Line 1", status: "Released" },
    { id: "BT-240317-03", sku: "Cream Wafer 60g", line: "Line 3", status: "Deviation" },
  ];

  const checklist = [
    "Packaging seal checked",
    "Weight within tolerance",
    "Barcode readable",
    "Label artwork verified",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px" }}>
        <aside style={{ background: "white", borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>TraceBite</div>
            <div style={{ color: "#64748b", fontSize: "14px" }}>Traceability & QA OS</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "Dashboard",
              "Create Batch",
              "QA Checklist",
              "Approvals",
              "Trace Search",
              "Deviations & CAPA",
              "Reports",
              "Settings",
            ].map((item, index) => (
              <button
                key={item}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "14px",
                  borderRadius: "16px",
                  border: "none",
                  cursor: "pointer",
                  background: index === 0 ? "#0f172a" : "#f8fafc",
                  color: index === 0 ? "white" : "#334155",
                  fontSize: "14px",
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "auto", background: "#f8fafc", borderRadius: "16px", padding: "16px" }}>
            <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b" }}>Logged in as</div>
            <div style={{ fontWeight: "bold", marginTop: "6px" }}>QA Manager</div>
            <div style={{ color: "#64748b", fontSize: "14px" }}>Hyderabad Plant</div>
          </div>
        </aside>

        <main style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <section style={{ background: "white", borderRadius: "24px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <h1 style={{ fontSize: "36px", margin: 0 }}>Factory Dashboard</h1>
                <p style={{ color: "#64748b", marginTop: "8px" }}>
                  Track batch production, QA checks, approvals, and traceability in one place.
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button style={{ padding: "14px 18px", borderRadius: "16px", border: "none", background: "#0f172a", color: "white", cursor: "pointer" }}>
                  + Create Batch
                </button>
                <button style={{ padding: "14px 18px", borderRadius: "16px", border: "none", background: "#e2e8f0", color: "#334155", cursor: "pointer" }}>
                  Scan QR / Barcode
                </button>
              </div>
            </div>
          </section>

          <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {kpis.map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "24px", padding: "20px" }}>
                <div style={{ fontSize: "14px", color: "#64748b" }}>{card.label}</div>
                <div style={{ fontSize: "36px", fontWeight: "bold", marginTop: "8px" }}>{card.value}</div>
              </div>
            ))}
          </section>

          <section style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: "24px" }}>
            <div style={{ background: "white", borderRadius: "24px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ margin: 0 }}>Recent Batches</h2>
                <button style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#e2e8f0", cursor: "pointer" }}>
                  View All
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recentBatches.map((batch) => (
                  <div
                    key={batch.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "18px",
                      padding: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold" }}>{batch.id}</div>
                      <div style={{ color: "#64748b", fontSize: "14px" }}>{batch.sku}</div>
                    </div>
                    <div style={{ color: "#475569", fontSize: "14px" }}>{batch.line}</div>
                    <div style={{ background: "#f1f5f9", borderRadius: "999px", padding: "6px 12px", fontSize: "14px" }}>
                      {batch.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ background: "white", borderRadius: "24px", padding: "24px" }}>
                <h2 style={{ marginTop: 0 }}>Trace Search</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    placeholder="Search by batch ID, lot number, SKU..."
                    style={{ padding: "14px", borderRadius: "16px", border: "1px solid #cbd5e1" }}
                  />
                  <button style={{ padding: "14px", borderRadius: "16px", border: "none", background: "#0f172a", color: "white", cursor: "pointer" }}>
                    Search Record
                  </button>
                </div>
              </div>

              <div style={{ background: "white", borderRadius: "24px", padding: "24px" }}>
                <h2 style={{ marginTop: 0 }}>In-Process QA Checklist</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {checklist.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#f8fafc",
                        padding: "14px",
                        borderRadius: "16px",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <span>{item}</span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>
                          Pass
                        </button>
                        <button style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>
                          Fail
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={{ marginTop: "16px", width: "100%", padding: "14px", borderRadius: "16px", border: "none", background: "#e2e8f0", cursor: "pointer" }}>
                  Upload Photo Evidence
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}