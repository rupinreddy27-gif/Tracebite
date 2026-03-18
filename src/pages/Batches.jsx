import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { batches, ingredients } from "../data/mockData";

export default function Batches() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Status");

  const filtered = batches.filter((batch) => {
    const matchSearch =
      batch.product.toLowerCase().includes(search.toLowerCase()) ||
      batch.id.toLowerCase().includes(search.toLowerCase()) ||
      batch.factory.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All Status" || batch.status === filter;
    return matchSearch && matchFilter;
  });

  const isOnHold = (batch) =>
    ingredients.some((i) => i.status === "Under Review") && batch.status === "Released";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0 }}>Batches</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>{batches.length} total batch records</p>
        </div>
        <button
          onClick={() => navigate("/batches/new")}
          style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
          + New Batch
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input
          placeholder="Search by batch ID, product, or factory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px" }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", background: "white" }}>
          <option>All Status</option>
          <option>Released</option>
          <option>QA Rejected</option>
          <option>In Progress</option>
        </select>
      </div>

      {/* Batch Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {filtered.map((batch) => (
          <div
            key={batch.id}
            onClick={() => navigate(`/batches/${batch.id}`)}
            style={{ background: "white", borderRadius: "16px", padding: "20px", cursor: "pointer", border: "1px solid #f1f5f9" }}>

            <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>{batch.id}</div>
            <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "4px" }}>{batch.product}</div>
            <div style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>SKU: {batch.sku}</div>

            <div style={{ color: "#475569", fontSize: "14px", marginBottom: "4px" }}>🏭 {batch.factory}</div>
            <div style={{ color: "#475569", fontSize: "14px", marginBottom: "4px" }}>📅 {batch.date}</div>
            <div style={{ color: "#475569", fontSize: "14px", marginBottom: "16px" }}>📦 {batch.quantity} {batch.unit}</div>

            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              background: isOnHold(batch) ? "#fef9c3" : batch.status === "Released" ? "#dcfce7" : batch.status === "QA Rejected" ? "#fee2e2" : "#fef9c3",
              color: isOnHold(batch) ? "#ca8a04" : batch.status === "Released" ? "#16a34a" : batch.status === "QA Rejected" ? "#dc2626" : "#ca8a04"
            }}>
              {isOnHold(batch) ? "🔒 On Hold" : batch.status}
            </div>

          </div>
        ))}
      </div>

      {/* Back to Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{ marginTop: "24px", padding: "12px 24px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: "12px", cursor: "pointer" }}>
        ← Back to Dashboard
      </button>

    </div>
  );
}
