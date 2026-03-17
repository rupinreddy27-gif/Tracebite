import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { batches } from "../data/mockData";

export default function SearchTrace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!search.trim()) return;
    const found = batches.filter((batch) =>
      batch.id.toLowerCase().includes(search.toLowerCase()) ||
      batch.product.toLowerCase().includes(search.toLowerCase()) ||
      batch.sku.toLowerCase().includes(search.toLowerCase()) ||
      batch.factory.toLowerCase().includes(search.toLowerCase())
    );
    setResults(found);
    setSearched(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      
      <h1 style={{ margin: "0 0 8px 0" }}>Search & Trace</h1>
      <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>Find batches by ID, lot number, product, or supplier for investigations and audits</p>

      {/* Search Bar */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            placeholder="Enter batch ID, lot number, product name, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ flex: 1, padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "15px" }}
          />
          <button
            onClick={handleSearch}
            style={{ padding: "14px 28px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}>
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
        {!searched && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Search for batches</div>
            <div style={{ fontSize: "14px" }}>Enter a batch ID, product name, or supplier to find related records</div>
          </div>
        )}

        {searched && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>No results found</div>
          </div>
        )}

        {results.map((batch) => (
          <div
            key={batch.id}
            onClick={() => navigate(`/batches/${batch.id}`)}
            style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>{batch.product}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>{batch.id} · {batch.factory}</div>
              <div style={{ color: "#94a3b8", fontSize: "13px" }}>{batch.date} · {batch.quantity} {batch.unit}</div>
            </div>
            <div style={{
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              background: batch.status === "Released" ? "#dcfce7" : "#fee2e2",
              color: batch.status === "Released" ? "#16a34a" : "#dc2626"
            }}>
              {batch.status}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}