import { useState, useEffect } from "react";

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://pkqegxbvivxphfyeroqr.supabase.co";
const SUPABASE_KEY = "sb_publishable_8RTOeyQeBkHvmNzGbyNT7Q_cq5zk_kV";

async function dbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...(options.headers || {}),
    },
    ...options,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text ? JSON.parse(text) : [];
}

const db = {
  select: (table, opts = {}) => {
    let path = `${table}?select=${opts.cols || "*"}`;
    if (opts.eq) Object.entries(opts.eq).forEach(([k, v]) => { path += `&${k}=eq.${encodeURIComponent(v)}`; });
    if (opts.order) path += `&order=${opts.order}`;
    return dbFetch(path, { method: "GET" });
  },
  insert: (table, data) => dbFetch(table, { method: "POST", body: JSON.stringify(data) }),
  update: (table, data, match) => {
    let path = `${table}?`;
    Object.entries(match).forEach(([k, v]) => { path += `${k}=eq.${encodeURIComponent(v)}&`; });
    return dbFetch(path, { method: "PATCH", body: JSON.stringify(data), prefer: "return=representation" });
  },
  delete: (table, match) => {
    let path = `${table}?`;
    Object.entries(match).forEach(([k, v]) => { path += `${k}=eq.${encodeURIComponent(v)}&`; });
    return dbFetch(path, { method: "DELETE" });
  },
};

const storeLocations = [
  { name: "DMart - Kukatpally" }, { name: "Big Bazaar - Ameerpet" },
  { name: "Reliance Fresh - Madhapur" }, { name: "More Supermarket - Begumpet" },
  { name: "Spencer's - Banjara Hills" }, { name: "Star Bazaar - Kondapur" },
];

const ALL_ROLES = ["Raw Material Manager", "Cook Manager", "QA Manager", "General Manager", "Dispatch Manager"];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  page: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "'DM Sans','Segoe UI',sans-serif" },
  nav: { background: "#0f172a", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "58px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.25)" },
  logo: { fontWeight: "800", fontSize: "20px", color: "#38bdf8", letterSpacing: "-0.5px", cursor: "pointer" },
  navBtn: a => ({ padding: "7px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px", background: a ? "#38bdf8" : "transparent", color: a ? "#0f172a" : "#94a3b8" }),
  card: { background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
  stat: c => ({ background: "white", borderRadius: "14px", padding: "20px 24px", borderLeft: `4px solid ${c}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }),
  btn: v => {
    const m = { primary: { background: "#2563eb", color: "white" }, success: { background: "#16a34a", color: "white" }, danger: { background: "#dc2626", color: "white" }, ghost: { background: "#f1f5f9", color: "#334155" }, warning: { background: "#f59e0b", color: "white" } };
    return { ...(m[v] || m.primary), padding: "10px 20px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" };
  },
  badge: s => {
    const m = { Released: { bg: "#dcfce7", c: "#15803d" }, "QA Rejected": { bg: "#fee2e2", c: "#dc2626" }, "In Progress": { bg: "#fef9c3", c: "#b45309" }, Approved: { bg: "#dcfce7", c: "#15803d" }, "Under Review": { bg: "#fef9c3", c: "#b45309" }, "Not Received": { bg: "#fee2e2", c: "#dc2626" }, Rejected: { bg: "#ede9fe", c: "#7c3aed" }, "On Hold": { bg: "#fef9c3", c: "#b45309" }, Active: { bg: "#dcfce7", c: "#15803d" }, Inactive: { bg: "#fee2e2", c: "#dc2626" }, "Super Admin": { bg: "#fef3c7", c: "#92400e" } };
    const t = m[s] || { bg: "#f1f5f9", c: "#64748b" };
    return { display: "inline-block", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", background: t.bg, color: t.c };
  },
  input: { width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box", outline: "none", background: "white" },
  lbl: { fontSize: "13px", color: "#475569", display: "block", marginBottom: "5px", fontWeight: "600" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "24px" },
};

const Badge = ({ s }) => <span style={S.badge(s)}>{s}</span>;
const Stat = ({ label, value, color }) => (
  <div style={S.stat(color)}>
    <div style={{ color: "#64748b", fontSize: "13px", fontWeight: "500" }}>{label}</div>
    <div style={{ fontSize: "34px", fontWeight: "800", color, marginTop: "4px" }}>{value}</div>
  </div>
);
function Spinner({ label = "Loading from database..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px", gap: "16px" }}>
      <div style={{ width: "36px", height: "36px", border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ color: "#64748b", fontWeight: "600", fontSize: "14px" }}>{label}</div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const go = async () => {
    if (!email || !pw) { setErr("Please enter email and password."); return; }
    setLoading(true); setErr("");
    try {
      const users = await db.select("app_users", { eq: { email } });
      if (!users.length || users[0].password !== pw) { setErr("Invalid email or password."); setLoading(false); return; }
      const user = users[0];
      if (!user.is_active) { setErr("Your account has been deactivated. Contact your Super Admin."); setLoading(false); return; }
      await db.insert("user_activity_log", { user_id: user.id, user_name: user.name, action: "LOGIN", details: `Logged in as ${user.role}` });
      await db.update("app_users", { last_login: new Date().toISOString() }, { id: user.id });
      onLogin(user);
    } catch (e) { setErr("Connection error: " + e.message); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e40af 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "38px", fontWeight: "900", color: "#38bdf8", letterSpacing: "-1px" }}>TraceBite</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginTop: "6px" }}>Traceability & QA Operating System</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginTop: "4px" }}>Sumo Biscuits — Hyderabad Plant</div>
        </div>
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "20px", fontWeight: "700" }}>Sign in</h2>
          <div style={{ marginBottom: "14px" }}><label style={S.lbl}>Email</label><input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@sumo.com" onKeyDown={e => e.key === "Enter" && go()} /></div>
          <div style={{ marginBottom: "20px" }}><label style={S.lbl}>Password</label><input style={S.input} type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && go()} /></div>
          {err && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", marginBottom: "14px", color: "#dc2626", fontSize: "13px" }}>❌ {err}</div>}
          <button onClick={go} disabled={loading} style={{ ...S.btn("primary"), width: "100%", padding: "14px", fontSize: "15px", opacity: loading ? 0.7 : 1 }}>{loading ? "Signing in..." : "Sign In →"}</button>
          <div style={{ marginTop: "16px", background: "#f8fafc", borderRadius: "10px", padding: "12px", fontSize: "12px", color: "#64748b" }}>
            <strong>Default accounts:</strong><br />admin@sumo.com / admin123 (Super Admin)<br />qa@sumo.com / qa123 · cook@sumo.com / cook123
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ user, page, setPage, onLogout }) {
  const links = {
    "Super Admin": [["Dashboard", "dashboard"], ["Users", "admin-users"], ["Activity", "admin-activity"], ["Batches", "batches"], ["QA Templates", "qa-templates"], ["Search", "search"]],
    "Raw Material Manager": [["Dashboard", "dashboard"], ["Raw Materials", "raw-material"]],
    "Cook Manager": [["Dashboard", "dashboard"], ["Cook Records", "cook-manager"], ["Batches", "batches"]],
    "QA Manager": [["Dashboard", "dashboard"], ["Batches", "batches"], ["QA Templates", "qa-templates"], ["Search", "search"]],
    "General Manager": [["Dashboard", "dashboard"], ["Operations", "general-manager"], ["Batches", "batches"], ["Search", "search"]],
    "Dispatch Manager": [["Dashboard", "dashboard"], ["Dispatch", "dispatch"], ["Batches", "batches"]],
  }[user.role] || [["Dashboard", "dashboard"]];
  return (
    <div style={S.nav}>
      <div style={S.logo} onClick={() => setPage("dashboard")}>TraceBite</div>
      <div style={{ display: "flex", gap: "4px" }}>{links.map(([l, p]) => <button key={p} onClick={() => setPage(p)} style={S.navBtn(page === p)}>{l}</button>)}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {user.role === "Super Admin" && <span style={S.badge("Super Admin")}>👑 Super Admin</span>}
        <div style={{ background: "rgba(255,255,255,0.08)", padding: "7px 14px", borderRadius: "10px", fontSize: "13px", color: "#cbd5e1" }}>👤 {user.name}</div>
        <button onClick={onLogout} style={{ padding: "7px 14px", background: "#dc2626", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Logout</button>
      </div>
    </div>
  );
}

// ─── QA TEMPLATES (fully Supabase connected) ──────────────────────────────────
function QATemplates({ user }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null); // null = new, object = editing
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [msg, setMsg] = useState("");

  // Form state
  const blankForm = { name: "", category: "", items: [""] };
  const [form, setForm] = useState(blankForm);

  const load = async () => {
    setLoading(true);
    try {
      const data = await db.select("qa_templates", { order: "created_at.asc" });
      setTemplates(data);
    } catch (e) { console.error("Load templates error:", e.message); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(blankForm); setEditTemplate(null); setShowModal(true); };
  const openEdit = (t) => {
    setForm({ name: t.name, category: t.category, items: [...t.items] });
    setEditTemplate(t);
    setShowModal(true);
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, ""] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, val) => setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? val : it) }));

  const save = async () => {
    if (!form.name.trim()) { alert("Please enter a template name"); return; }
    if (!form.category.trim()) { alert("Please enter a category"); return; }
    const cleanItems = form.items.map(i => i.trim()).filter(i => i.length > 0);
    if (cleanItems.length === 0) { alert("Add at least one check item"); return; }
    setSaving(true);
    try {
      if (editTemplate) {
        // Update existing
        await db.update("qa_templates", { name: form.name.trim(), category: form.category.trim(), items: cleanItems }, { id: editTemplate.id });
        await db.insert("user_activity_log", { user_id: user.id, user_name: user.name, action: "UPDATE_TEMPLATE", details: `Updated QA template: ${form.name}` });
        setMsg(`✅ Template "${form.name}" updated!`);
      } else {
        // Create new — generate ID
        const newId = `QA-${Date.now()}`;
        await db.insert("qa_templates", { id: newId, name: form.name.trim(), category: form.category.trim(), items: cleanItems, created_by: user.name });
        await db.insert("user_activity_log", { user_id: user.id, user_name: user.name, action: "CREATE_TEMPLATE", details: `Created QA template: ${form.name}` });
        setMsg(`✅ Template "${form.name}" created!`);
      }
      setShowModal(false);
      setForm(blankForm);
      setEditTemplate(null);
      load();
    } catch (e) { alert("Error saving template: " + e.message); }
    setSaving(false);
    setTimeout(() => setMsg(""), 4000);
  };

  const deleteTemplate = async (t) => {
    try {
      await db.delete("qa_templates", { id: t.id });
      await db.insert("user_activity_log", { user_id: user.id, user_name: user.name, action: "DELETE_TEMPLATE", details: `Deleted QA template: ${t.name}` });
      setDeleteConfirm(null);
      setMsg(`🗑️ Template "${t.name}" deleted.`);
      load();
    } catch (e) { alert("Error deleting: " + e.message); }
    setTimeout(() => setMsg(""), 4000);
  };

  const canEdit = user.role === "Super Admin" || user.role === "QA Manager";

  return (
    <div style={{ padding: "28px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>📋 QA Templates</h1>
            <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "13px" }}>Reusable quality assurance checklists — stored in Supabase</p>
          </div>
          {canEdit && <button onClick={openNew} style={S.btn("primary")}>+ New Template</button>}
        </div>

        {msg && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#15803d", fontWeight: "600" }}>{msg}</div>}

        {loading ? <Spinner label="Loading QA templates from database..." /> : (
          <>
            {templates.length === 0 && (
              <div style={{ ...S.card, textAlign: "center", padding: "48px", color: "#94a3b8" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                <div style={{ fontWeight: "700", fontSize: "18px", marginBottom: "8px" }}>No templates yet</div>
                <div style={{ fontSize: "14px", marginBottom: "20px" }}>Run the SQL file to seed default templates, or create one now.</div>
                {canEdit && <button onClick={openNew} style={S.btn("primary")}>+ Create First Template</button>}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" }}>
              {templates.map(t => (
                <div key={t.id} style={S.card}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ background: "#eff6ff", borderRadius: "10px", padding: "10px", fontSize: "20px", flexShrink: 0 }}>📋</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "2px" }}>{t.name}</div>
                      <div style={{ color: "#64748b", fontSize: "12px" }}>{t.category}</div>
                    </div>
                    {canEdit && (
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button onClick={() => openEdit(t)} style={{ ...S.btn("ghost"), padding: "5px 10px", fontSize: "12px" }}>✏️ Edit</button>
                        <button onClick={() => setDeleteConfirm(t)} style={{ ...S.btn("danger"), padding: "5px 10px", fontSize: "12px" }}>🗑️</button>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: "12px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px" }}>{t.items.length} checks</span>
                    {t.created_by && <span style={{ fontSize: "11px", color: "#94a3b8" }}>by {t.created_by}</span>}
                  </div>

                  {/* Preview first 3 items */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "12px" }}>
                    {t.items.slice(0, 3).map(i => <span key={i} style={{ background: "#f1f5f9", padding: "3px 9px", borderRadius: "999px", fontSize: "11px", color: "#475569" }}>{i}</span>)}
                    {t.items.length > 3 && <span style={{ background: "#f1f5f9", padding: "3px 9px", borderRadius: "999px", fontSize: "11px", color: "#475569" }}>+{t.items.length - 3} more</span>}
                  </div>

                  <button onClick={() => setExpanded(expanded === t.id ? null : t.id)} style={{ ...S.btn("ghost"), padding: "8px 16px", fontSize: "13px" }}>
                    {expanded === t.id ? "Hide checks ▲" : "View all checks ▼"}
                  </button>

                  {expanded === t.id && (
                    <div style={{ marginTop: "14px", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                      {t.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                          <span style={{ fontSize: "13px", color: "#475569" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
            <h2 style={{ margin: "0 0 24px", fontSize: "20px", fontWeight: "700" }}>
              {editTemplate ? "✏️ Edit Template" : "➕ New QA Template"}
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label style={S.lbl}>Template Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Cream Biscuit QA" style={S.input} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={S.lbl}>Category *</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Cream Filled Biscuits" style={S.input} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <label style={S.lbl}>Check Items * ({form.items.length} items)</label>
                <button onClick={addItem} style={{ ...S.btn("primary"), padding: "5px 12px", fontSize: "12px" }}>+ Add Item</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                {form.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <input
                      value={item}
                      onChange={e => updateItem(i, e.target.value)}
                      placeholder={`Check item ${i + 1}...`}
                      style={{ ...S.input, flex: 1 }}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
                    />
                    {form.items.length > 1 && (
                      <button onClick={() => removeItem(i)} style={{ ...S.btn("danger"), padding: "8px 10px", fontSize: "13px" }}>✕</button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>💡 Press Enter to quickly add another item</div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={save} disabled={saving} style={{ ...S.btn("success"), flex: 1, opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving to database..." : editTemplate ? "✅ Save Changes" : "✅ Create Template"}
              </button>
              <button onClick={() => { setShowModal(false); setForm(blankForm); setEditTemplate(null); }} style={{ ...S.btn("ghost") }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div style={S.modal}>
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "400px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Delete Template?</h3>
            <p style={{ color: "#64748b", marginBottom: "24px", fontSize: "14px" }}>
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => deleteTemplate(deleteConfirm)} style={S.btn("danger")}>Yes, Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={S.btn("ghost")}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN USERS ──────────────────────────────────────────────────────────────
function AdminUsers({ user: currentUser }) {
  const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true); const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "QA Manager" }); const [saving, setSaving] = useState(false); const [editUser, setEditUser] = useState(null); const [msg, setMsg] = useState("");
  const load = async () => { setLoading(true); try { const d = await db.select("app_users", { order: "created_at.asc" }); setUsers(d); } catch (e) { console.error(e); } setLoading(false); };
  useEffect(() => { load(); }, []);
  const createUser = async () => {
    if (!form.name || !form.email || !form.password) { alert("Fill all fields"); return; }
    setSaving(true);
    try {
      await db.insert("app_users", { name: form.name, email: form.email, password: form.password, role: form.role, is_active: true, created_by: currentUser.id });
      await db.insert("user_activity_log", { user_id: currentUser.id, user_name: currentUser.name, action: "CREATE_USER", details: `Created user ${form.name} as ${form.role}` });
      setMsg(`✅ User ${form.name} created!`); setForm({ name: "", email: "", password: "", role: "QA Manager" }); setShowAdd(false); load();
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false); setTimeout(() => setMsg(""), 4000);
  };
  const toggleActive = async (u) => { await db.update("app_users", { is_active: !u.is_active }, { id: u.id }); await db.insert("user_activity_log", { user_id: currentUser.id, user_name: currentUser.name, action: u.is_active ? "DEACTIVATE_USER" : "ACTIVATE_USER", details: `${u.is_active ? "Deactivated" : "Activated"} ${u.name}` }); load(); };
  const updateRole = async (u, role) => { await db.update("app_users", { role }, { id: u.id }); await db.insert("user_activity_log", { user_id: currentUser.id, user_name: currentUser.name, action: "CHANGE_ROLE", details: `Changed ${u.name}'s role to ${role}` }); setEditUser(null); load(); };
  const resetPassword = async (u, newPw) => { if (!newPw) return; await db.update("app_users", { password: newPw }, { id: u.id }); await db.insert("user_activity_log", { user_id: currentUser.id, user_name: currentUser.name, action: "RESET_PASSWORD", details: `Reset password for ${u.name}` }); alert(`✅ Password updated for ${u.name}`); setEditUser(null); };
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div><h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>👥 User Management</h1><p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "13px" }}>Create users, assign roles, manage access</p></div>
          <button onClick={() => setShowAdd(!showAdd)} style={S.btn("primary")}>+ Add User</button>
        </div>
        {msg && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#15803d", fontWeight: "600" }}>{msg}</div>}
        {showAdd && (
          <div style={{ ...S.card, marginBottom: "20px", border: "2px solid #2563eb" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#2563eb" }}>➕ Create New User</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div><label style={S.lbl}>Full Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Arjun Sharma" style={S.input} /></div>
              <div><label style={S.lbl}>Email *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="arjun@sumo.com" style={S.input} /></div>
              <div><label style={S.lbl}>Password *</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" style={S.input} /></div>
              <div><label style={S.lbl}>Role *</label><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={S.input}>{ALL_ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={createUser} disabled={saving} style={S.btn("success")}>{saving ? "Creating..." : "✅ Create User"}</button>
              <button onClick={() => setShowAdd(false)} style={S.btn("ghost")}>Cancel</button>
            </div>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
          <Stat label="Total Users" value={users.length} color="#2563eb" />
          <Stat label="Active" value={users.filter(u => u.is_active).length} color="#16a34a" />
          <Stat label="Inactive" value={users.filter(u => !u.is_active).length} color="#dc2626" />
          <Stat label="Roles" value={new Set(users.map(u => u.role)).size} color="#ca8a04" />
        </div>
        {loading ? <Spinner /> : (
          <div style={S.card}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "2px solid #f1f5f9" }}>{["Name", "Email", "Role", "Status", "Last Login", "Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "12px", color: "#64748b", fontWeight: "700" }}>{h}</th>)}</tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f8fafc", opacity: u.is_active ? 1 : 0.5 }}>
                    <td style={{ padding: "12px", fontWeight: "600", fontSize: "14px" }}>{u.name}{u.role === "Super Admin" && " 👑"}</td>
                    <td style={{ padding: "12px", fontSize: "13px", color: "#64748b" }}>{u.email}</td>
                    <td style={{ padding: "12px" }}>
                      {editUser === u.id ? (
                        <select defaultValue={u.role} onChange={e => updateRole(u, e.target.value)} style={{ ...S.input, padding: "6px 10px", width: "auto", fontSize: "13px" }}>
                          {ALL_ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>
                      ) : <Badge s={u.role === "Super Admin" ? "Super Admin" : u.role.split(" ")[0]} />}
                    </td>
                    <td style={{ padding: "12px" }}><Badge s={u.is_active ? "Active" : "Inactive"} /></td>
                    <td style={{ padding: "12px", fontSize: "12px", color: "#94a3b8" }}>{u.last_login ? new Date(u.last_login).toLocaleDateString() : "Never"}</td>
                    <td style={{ padding: "12px" }}>
                      {u.role !== "Super Admin" && (
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <button onClick={() => setEditUser(editUser === u.id ? null : u.id)} style={{ ...S.btn("ghost"), padding: "5px 10px", fontSize: "12px" }}>✏️ Role</button>
                          <button onClick={() => { const p = prompt(`New password for ${u.name}:`); if (p) resetPassword(u, p); }} style={{ ...S.btn("ghost"), padding: "5px 10px", fontSize: "12px" }}>🔑 PW</button>
                          <button onClick={() => toggleActive(u)} style={{ ...S.btn(u.is_active ? "danger" : "success"), padding: "5px 10px", fontSize: "12px" }}>{u.is_active ? "🔒 Deactivate" : "✅ Activate"}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN ACTIVITY ───────────────────────────────────────────────────────────
function AdminActivity() {
  const [logs, setLogs] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const d = await db.select("user_activity_log", { order: "created_at.desc" }); setLogs(d); } catch (e) { console.error(e); } setLoading(false); })(); }, []);
  const icons = { LOGIN: "🔐", CREATE_USER: "➕", DEACTIVATE_USER: "🔒", ACTIVATE_USER: "✅", CHANGE_ROLE: "✏️", RESET_PASSWORD: "🔑", CREATE_BATCH: "📦", APPROVE_INGREDIENT: "✅", REJECT_INGREDIENT: "❌", CREATE_TEMPLATE: "📋", UPDATE_TEMPLATE: "✏️", DELETE_TEMPLATE: "🗑️", DISPATCH_BATCH: "🚚" };
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "800" }}>📋 Activity Log</h1>
        <p style={{ color: "#64748b", margin: "0 0 24px", fontSize: "13px" }}>Full audit trail of all user actions</p>
        {loading ? <Spinner /> : (
          <div style={S.card}>
            {logs.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No activity yet</div>}
            {logs.map(log => (
              <div key={log.id} style={{ padding: "14px 0", borderBottom: "1px solid #f8fafc", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{icons[log.action] || "📝"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>{log.user_name} <span style={{ fontWeight: "400", color: "#64748b" }}>{log.details}</span></div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px" }}>{new Date(log.created_at).toLocaleString()}</div>
                </div>
                <span style={{ background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", color: "#64748b", fontWeight: "600", flexShrink: 0 }}>{log.action}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, setPage, setSelected, batches, ingredients }) {
  const pending = batches.filter(b => b.status === "In Progress");
  const rejected = batches.filter(b => b.status === "QA Rejected");
  const released = batches.filter(b => b.status === "Released");
  const ingIssues = ingredients.filter(i => i.status !== "Approved");
  const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const go = id => { setSelected(id); setPage("batch-detail"); };

  if (user.role === "Super Admin") return (
    <div style={{ padding: "28px" }}>
      <div style={{ marginBottom: "28px" }}><h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800" }}>{greet()}, {user.name} 👑</h1><p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "14px" }}>Super Admin · Sumo Biscuits Hyderabad Plant</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
        <Stat label="Total Batches" value={batches.length} color="#2563eb" />
        <Stat label="Released" value={released.length} color="#16a34a" />
        <Stat label="QA Rejected" value={rejected.length} color="#dc2626" />
        <Stat label="Ingredient Issues" value={ingIssues.length} color="#ca8a04" />
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <button onClick={() => setPage("admin-users")} style={S.btn("primary")}>👥 Manage Users</button>
        <button onClick={() => setPage("admin-activity")} style={S.btn("ghost")}>📋 Activity Log</button>
        <button onClick={() => setPage("qa-templates")} style={S.btn("ghost")}>📋 QA Templates</button>
        <button onClick={() => setPage("batches")} style={S.btn("ghost")}>📦 All Batches</button>
      </div>
      <div style={S.card}><h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700" }}>📦 Recent Batches</h2>
        {batches.slice(0, 5).map(b => <div key={b.id} onClick={() => go(b.id)} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: "600" }}>{b.product}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{b.id}</div></div><Badge s={b.status} /></div>)}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "28px" }}>
      <div style={{ marginBottom: "28px" }}><h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800" }}>{greet()}, {user.name} 👋</h1><p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "14px" }}>{user.role} · Sumo Biscuits Hyderabad Plant</p></div>
      {user.role === "Raw Material Manager" && <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "24px" }}>
          <Stat label="Approved" value={ingredients.filter(i => i.status === "Approved").length} color="#16a34a" />
          <Stat label="Under Review" value={ingredients.filter(i => i.status === "Under Review").length} color="#ca8a04" />
          <Stat label="Not Received" value={ingredients.filter(i => i.received_status === "Not Received").length} color="#dc2626" />
        </div>
        <button onClick={() => setPage("raw-material")} style={{ ...S.btn("primary"), marginBottom: "24px" }}>🌾 Check Raw Materials</button>
        <div style={S.card}><h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700" }}>⚠️ Needs Attention</h2>
          {ingIssues.length === 0 ? <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>✅ All approved!</div>
            : ingIssues.map(i => <div key={i.id} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}><div style={{ fontWeight: "600" }}>{i.name}</div><div style={{ color: "#dc2626", fontSize: "13px" }}>{i.status}: {i.review_reason}</div></div>)}
        </div>
      </>}
      {user.role === "Cook Manager" && <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "24px" }}>
          <Stat label="Total Batches" value={batches.length} color="#2563eb" /><Stat label="In Progress" value={pending.length} color="#ca8a04" /><Stat label="Completed" value={released.length} color="#16a34a" />
        </div>
        <button onClick={() => setPage("cook-manager")} style={{ ...S.btn("primary"), marginBottom: "24px" }}>👨‍🍳 Manage Cook Records</button>
        <div style={S.card}><h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700" }}>🍪 All Batches</h2>
          {batches.map(b => <div key={b.id} onClick={() => go(b.id)} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: "600" }}>{b.product}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{b.id}</div></div><Badge s={b.status} /></div>)}
        </div>
      </>}
      {user.role === "QA Manager" && <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "24px" }}>
          <Stat label="Pending QA" value={pending.length} color="#ca8a04" /><Stat label="Rejected" value={rejected.length} color="#dc2626" /><Stat label="Released" value={released.length} color="#16a34a" />
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <button onClick={() => setPage("batches")} style={S.btn("primary")}>Review Batches</button>
          <button onClick={() => setPage("qa-templates")} style={S.btn("ghost")}>QA Templates</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={S.card}><h2 style={{ margin: "0 0 14px", color: "#ca8a04", fontSize: "15px", fontWeight: "700" }}>⏳ Pending</h2>
            {pending.length === 0 ? <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>✅ All caught up!</div>
              : pending.map(b => <div key={b.id} onClick={() => go(b.id)} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}><div style={{ fontWeight: "600" }}>{b.product}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{b.id}</div></div>)}
          </div>
          <div style={S.card}><h2 style={{ margin: "0 0 14px", color: "#dc2626", fontSize: "15px", fontWeight: "700" }}>❌ Rejected</h2>
            {rejected.map(b => <div key={b.id} onClick={() => go(b.id)} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}><div style={{ fontWeight: "600" }}>{b.product}</div><div style={{ color: "#dc2626", fontSize: "12px" }}>{(b.rejection_reason || "").substring(0, 60)}...</div></div>)}
          </div>
        </div>
      </>}
      {user.role === "General Manager" && <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
          <Stat label="Total" value={batches.length} color="#2563eb" /><Stat label="Released" value={released.length} color="#16a34a" /><Stat label="Rejected" value={rejected.length} color="#dc2626" /><Stat label="Ing. Issues" value={ingIssues.length} color="#ca8a04" />
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <button onClick={() => setPage("general-manager")} style={S.btn("primary")}>👔 Full Operations</button>
          <button onClick={() => setPage("batches")} style={S.btn("ghost")}>All Batches</button>
        </div>
        <div style={S.card}><h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700" }}>📋 Summary</h2>
          {batches.map(b => <div key={b.id} onClick={() => go(b.id)} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: "600" }}>{b.product}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{b.id}</div></div><Badge s={b.status} /></div>)}
        </div>
      </>}
      {user.role === "Dispatch Manager" && <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "24px" }}>
          <Stat label="Ready to Dispatch" value={released.length} color="#16a34a" /><Stat label="Total Batches" value={batches.length} color="#2563eb" /><Stat label="Locations" value={6} color="#ca8a04" />
        </div>
        <button onClick={() => setPage("dispatch")} style={{ ...S.btn("primary"), marginBottom: "24px" }}>🚚 Manage Dispatches</button>
        <div style={S.card}><h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700" }}>📦 Ready</h2>
          {released.map(b => <div key={b.id} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: "600" }}>{b.product}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{b.id}</div></div><button onClick={() => setPage("dispatch")} style={S.btn("success")}>Dispatch →</button></div>)}
        </div>
      </>}
    </div>
  );
}

// ─── BATCHES LIST ─────────────────────────────────────────────────────────────
function Batches({ setPage, setSelected, batches, ingredients }) {
  const [q, setQ] = useState(""); const [filter, setFilter] = useState("All Status");
  const list = batches.filter(b => { const m = b.product.toLowerCase().includes(q.toLowerCase()) || b.id.toLowerCase().includes(q.toLowerCase()) || (b.sku || "").toLowerCase().includes(q.toLowerCase()); return m && (filter === "All Status" || b.status === filter); });
  const hold = b => ingredients.some(i => i.status === "Under Review") && b.status === "Released";
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div><h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>Batches</h1><p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "13px" }}>{batches.length} total records</p></div>
        <button onClick={() => setPage("new-batch")} style={S.btn("primary")}>+ New Batch</button>
      </div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input placeholder="Search by ID, product, SKU..." value={q} onChange={e => setQ(e.target.value)} style={{ ...S.input, flex: 1 }} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...S.input, width: "180px", flex: "none" }}>
          <option>All Status</option><option>Released</option><option>QA Rejected</option><option>In Progress</option>
        </select>
      </div>
      {list.length === 0 && <div style={{ ...S.card, textAlign: "center", padding: "48px", color: "#94a3b8" }}><div style={{ fontSize: "40px" }}>📭</div><div style={{ marginTop: "12px", fontWeight: "600" }}>No batches found</div></div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" }}>
        {list.map(b => (
          <div key={b.id} onClick={() => { setSelected(b.id); setPage("batch-detail"); }} style={{ ...S.card, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}><div style={{ color: "#94a3b8", fontSize: "12px" }}>{b.id}</div><Badge s={hold(b) ? "On Hold" : b.status} /></div>
            <div style={{ fontWeight: "700", fontSize: "17px", marginBottom: "2px" }}>{b.product}</div>
            <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "12px" }}>SKU: {b.sku}</div>
            <div style={{ fontSize: "13px", color: "#475569" }}>🏭 {b.factory}</div>
            <div style={{ fontSize: "13px", color: "#475569", marginTop: "3px" }}>📅 {b.date} · 📦 {b.quantity} {b.unit}</div>
            {b.line && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px" }}>{b.line} · {b.shift} shift</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NEW BATCH ────────────────────────────────────────────────────────────────
function NewBatch({ setPage, onAdd, user, count, templates }) {
  const blank = { product: "", sku: "", factory: "Sumo Biscuits - Hyderabad Plant", line: "", shift: "", date: "", actualQty: "", notes: "", templateId: "" };
  const [form, setForm] = useState(blank); const [done, setDone] = useState(false); const [newId, setNewId] = useState(""); const [saving, setSaving] = useState(false);
  const ch = e => setForm({ ...form, [e.target.name]: e.target.value });
  const tmpl = templates.find(t => t.id === form.templateId);
  const create = async () => {
    if (!form.product || !form.sku || !form.factory) { alert("Fill Product, SKU and Factory"); return; }
    if (!form.templateId) { alert("Select a QA Template"); return; }
    setSaving(true);
    const now = new Date();
    const id = `BATCH-${now.getFullYear()}-${String(count + 1).padStart(3, "0")}`;
    const dateStr = form.date ? new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const batch = { id, product: form.product, sku: form.sku, factory: form.factory, date: dateStr, quantity: parseInt(form.actualQty) || 0, unit: "packets", status: "In Progress", line: form.line || "Line A", shift: form.shift || "Morning", notes: form.notes, template_id: form.templateId };
    try {
      await db.insert("batches", batch);
      await db.insert("user_activity_log", { user_id: user.id, user_name: user.name, action: "CREATE_BATCH", details: `Created batch ${id} for ${form.product}` });
      onAdd(batch); setNewId(id); setDone(true);
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };
  if (done) return (
    <div style={{ padding: "28px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ ...S.card, maxWidth: "420px", textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ color: "#16a34a", margin: "0 0 8px", fontSize: "22px" }}>Batch Created!</h2>
        <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "12px 20px", margin: "14px auto", display: "inline-block" }}>
          <div style={{ fontSize: "11px", color: "#64748b" }}>Batch ID</div>
          <div style={{ fontWeight: "800", color: "#15803d", fontSize: "20px" }}>{newId}</div>
        </div>
        <p style={{ color: "#64748b", marginBottom: "24px", fontSize: "14px" }}><strong>{form.product}</strong> saved to database.</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={() => setPage("batches")} style={S.btn("primary")}>View All Batches</button>
          <button onClick={() => { setForm(blank); setDone(false); }} style={S.btn("ghost")}>+ Add Another</button>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <button onClick={() => setPage("batches")} style={S.btn("ghost")}>← Back</button>
          <div><h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>New Batch Record</h1><p style={{ color: "#64748b", margin: "3px 0 0", fontSize: "13px" }}>Saved to Supabase — persists after reload</p></div>
        </div>
        <div style={{ ...S.card, marginBottom: "16px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700" }}>📦 Batch Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div><label style={S.lbl}>Product Name *</label><input name="product" value={form.product} onChange={ch} placeholder="Chocolate Cream Biscuit" style={S.input} /></div>
            <div><label style={S.lbl}>Product SKU *</label><input name="sku" value={form.sku} onChange={ch} placeholder="CCB-120G" style={S.input} /></div>
            <div style={{ gridColumn: "span 2" }}><label style={S.lbl}>Factory *</label><input name="factory" value={form.factory} onChange={ch} style={S.input} /></div>
            <div><label style={S.lbl}>Line</label><select name="line" value={form.line} onChange={ch} style={S.input}><option value="">Select</option><option>Line A</option><option>Line B</option><option>Line C</option></select></div>
            <div><label style={S.lbl}>Shift</label><select name="shift" value={form.shift} onChange={ch} style={S.input}><option value="">Select</option><option>Morning</option><option>Evening</option><option>Night</option></select></div>
            <div><label style={S.lbl}>Production Date</label><input type="date" name="date" value={form.date} onChange={ch} style={S.input} /></div>
            <div><label style={S.lbl}>Quantity (packets)</label><input type="number" name="actualQty" value={form.actualQty} onChange={ch} placeholder="10000" style={S.input} /></div>
            <div style={{ gridColumn: "span 2" }}><label style={S.lbl}>Notes</label><textarea name="notes" value={form.notes} onChange={ch} rows={2} style={{ ...S.input, resize: "vertical" }} /></div>
          </div>
        </div>
        <div style={{ ...S.card, marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700" }}>📋 Select QA Template *</h2>
          <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 14px" }}>Templates loaded from your Supabase database.</p>
          {templates.length === 0 ? <div style={{ background: "#fef9c3", borderRadius: "10px", padding: "14px", color: "#b45309", fontSize: "13px" }}>⚠️ No templates found. Go to QA Templates and create one first.</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "14px" }}>
              {templates.map(t => (
                <div key={t.id} onClick={() => setForm({ ...form, templateId: t.id })} style={{ padding: "14px", borderRadius: "10px", border: `2px solid ${form.templateId === t.id ? "#2563eb" : "#e2e8f0"}`, cursor: "pointer", background: form.templateId === t.id ? "#eff6ff" : "white" }}>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: form.templateId === t.id ? "#1d4ed8" : "#0f172a", marginBottom: "3px" }}>{t.name}</div>
                  <div style={{ color: "#64748b", fontSize: "12px" }}>{t.items.length} checks</div>
                </div>
              ))}
            </div>}
          {tmpl && <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "14px", border: "1px solid #bbf7d0" }}>
            <div style={{ fontWeight: "700", fontSize: "13px", color: "#15803d", marginBottom: "8px" }}>✅ {tmpl.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" }}>{tmpl.items.map((it, i) => <div key={i} style={{ fontSize: "12px", color: "#475569" }}>{i + 1}. {it}</div>)}</div>
          </div>}
        </div>
        <button onClick={create} disabled={saving} style={{ ...S.btn("primary"), width: "100%", padding: "14px", fontSize: "15px", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving to database..." : "✅ Create Batch Record"}</button>
      </div>
    </div>
  );
}

// ─── BATCH DETAIL ─────────────────────────────────────────────────────────────
function BatchDetail({ id, setPage, batches, ingredients }) {
  const [tab, setTab] = useState("Details"); const [expIng, setExpIng] = useState(null);
  const [qa, setQa] = useState(Object.fromEntries(["Raw flour quality check", "Sugar and salt measurement", "Biscuit color and texture", "Weight per packet check", "Packaging seal integrity", "Allergen labeling verified", "Expiry date printed correctly"].map(k => [k, { status: null, reason: "" }])));
  const b = batches.find(x => x.id === id);
  if (!b) return <div style={{ padding: "28px" }}><div style={{ ...S.card, textAlign: "center", padding: "48px" }}><h2>Batch not found</h2><button onClick={() => setPage("batches")} style={S.btn("ghost")}>← Back</button></div></div>;
  const hold = ingredients.some(i => i.status === "Under Review") && b.status === "Released";
  const allDone = Object.values(qa).every(c => c.status !== null);
  const allPass = Object.values(qa).every(c => c.status === "pass");
  const approvals = [{ stage: "Submitted for QA", person: "Maria Chen", date: "Jan 15, 2024", done: true }, { stage: "QA Review", person: "James Wilson", date: "Jan 16, 2024", done: true }, { stage: "Final Approval", person: "Sarah Johnson", date: "Jan 16, 2024", done: true }, { stage: "Released", person: "System", date: "Jan 16, 2024", done: b.status === "Released" }];
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <button onClick={() => setPage("batches")} style={S.btn("ghost")}>← Back</button>
          <div style={{ flex: 1 }}><div style={{ color: "#94a3b8", fontSize: "13px" }}>{b.id}</div><h1 style={{ margin: "2px 0 0", fontSize: "22px", fontWeight: "800" }}>{b.product}</h1></div>
          <Badge s={hold ? "On Hold" : b.status} />
        </div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "white", padding: "6px", borderRadius: "12px", width: "fit-content", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {["Details", "Materials", "QA Checks", "Approvals"].map(t => <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 18px", borderRadius: "9px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px", background: tab === t ? "#2563eb" : "transparent", color: tab === t ? "white" : "#64748b" }}>{t}</button>)}
        </div>
        {tab === "Details" && <div style={S.card}>
          <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700" }}>📦 Batch Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            {[["Batch ID", b.id], ["Product", b.product], ["SKU", b.sku], ["Factory", b.factory], ["Date", b.date], ["Line", b.line], ["Shift", b.shift], ["Quantity", `${b.quantity} ${b.unit}`]].map(([l, v]) => <div key={l}><div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "3px" }}>{l}</div><div style={{ fontWeight: "600", fontSize: "14px" }}>{v || "—"}</div></div>)}
            {b.notes && <div style={{ gridColumn: "span 2" }}><div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "3px" }}>Notes</div><div style={{ fontSize: "14px", color: "#475569" }}>{b.notes}</div></div>}
          </div>
          {hold && <div style={{ marginTop: "20px", background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: "12px", padding: "16px" }}><div style={{ fontWeight: "700", color: "#ca8a04" }}>⚠️ On Hold — Ingredient Under Review</div>{ingredients.filter(i => i.status === "Under Review").map(i => <div key={i.id} style={{ color: "#dc2626", fontSize: "13px", marginTop: "4px" }}>❌ {i.name} — {i.supplier}</div>)}</div>}
          {b.status === "QA Rejected" && b.rejection_reason && <div style={{ marginTop: "20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "16px" }}><div style={{ fontWeight: "700", color: "#dc2626", marginBottom: "8px" }}>❌ Rejection Reason</div><div style={{ fontSize: "14px", color: "#475569" }}>{b.rejection_reason}</div></div>}
        </div>}
        {tab === "Materials" && <div style={S.card}>
          <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700" }}>🌾 Raw Ingredients</h2>
          {ingredients.map(ing => (<div key={ing.id}>
            <div style={{ padding: "14px", borderRadius: "10px", background: "#f8fafc", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div><div style={{ fontWeight: "600" }}>{ing.name}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{ing.supplier} · {ing.lot_number}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Badge s={ing.status} />{ing.status === "Under Review" && <button onClick={() => setExpIng(expIng === ing.id ? null : ing.id)} style={{ ...S.btn("ghost"), padding: "5px 12px", fontSize: "12px" }}>Why? ▼</button>}</div>
            </div>
            {expIng === ing.id && <div style={{ background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: "10px", padding: "14px", marginBottom: "8px", marginLeft: "10px" }}><div style={{ fontWeight: "700", color: "#ca8a04", marginBottom: "6px" }}>⚠️ Under Review</div><div style={{ fontSize: "13px", color: "#475569" }}>{ing.review_reason}</div></div>}
          </div>))}
        </div>}
        {tab === "QA Checks" && <div style={S.card}>
          <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700" }}>✅ QA Checklist</h2>
          {Object.entries(qa).map(([item, data]) => (
            <div key={item} style={{ background: data.status === "pass" ? "#f0fdf4" : data.status === "fail" ? "#fef2f2" : "#f8fafc", borderRadius: "10px", padding: "14px", marginBottom: "10px", border: `1px solid ${data.status === "pass" ? "#bbf7d0" : data.status === "fail" ? "#fecaca" : "#e2e8f0"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "500", fontSize: "14px" }}>{item}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setQa(p => ({ ...p, [item]: { ...p[item], status: "pass" } }))} style={{ ...S.btn("ghost"), padding: "7px 16px", background: data.status === "pass" ? "#16a34a" : "#e2e8f0", color: data.status === "pass" ? "white" : "#475569" }}>✓ Pass</button>
                  <button onClick={() => setQa(p => ({ ...p, [item]: { ...p[item], status: "fail" } }))} style={{ ...S.btn("ghost"), padding: "7px 16px", background: data.status === "fail" ? "#dc2626" : "#e2e8f0", color: data.status === "fail" ? "white" : "#475569" }}>✗ Fail</button>
                </div>
              </div>
              {data.status === "fail" && <textarea placeholder="Describe the issue..." value={data.reason} onChange={e => setQa(p => ({ ...p, [item]: { ...p[item], reason: e.target.value } }))} rows={2} style={{ ...S.input, marginTop: "10px", background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626" }} />}
            </div>
          ))}
          {allDone && <div style={{ padding: "20px", borderRadius: "12px", background: allPass ? "#f0fdf4" : "#fef2f2", border: `1px solid ${allPass ? "#bbf7d0" : "#fecaca"}`, textAlign: "center" }}><div style={{ fontSize: "28px" }}>{allPass ? "🎉" : "⚠️"}</div><div style={{ fontWeight: "700", color: allPass ? "#16a34a" : "#dc2626", marginTop: "8px" }}>{allPass ? "All checks passed!" : "Some checks failed."}</div></div>}
        </div>}
        {tab === "Approvals" && <div style={S.card}>
          <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700" }}>🛡️ Approvals</h2>
          {approvals.map(a => (<div key={a.stage} style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "18px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: a.done ? "#dcfce7" : "#f1f5f9", fontSize: "15px", flexShrink: 0 }}>{a.done ? "✅" : "⏳"}</div>
            <div><div style={{ fontWeight: "600", fontSize: "14px" }}>{a.stage}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{a.person} · {a.date}</div></div>
          </div>))}
        </div>}
      </div>
    </div>
  );
}

// ─── RAW MATERIAL MANAGER ─────────────────────────────────────────────────────
function RawMaterialManager({ user }) {
  const [list, setList] = useState([]); const [loading, setLoading] = useState(true); const [exp, setExp] = useState(null); const [note, setNote] = useState({}); const [sec, setSec] = useState("All");
  useEffect(() => { (async () => { try { const d = await db.select("ingredients"); setList(d); } catch (e) { console.error(e); } setLoading(false); })(); }, []);
  const counts = { All: list.length, Approved: list.filter(i => i.status === "Approved").length, "Under Review": list.filter(i => i.status === "Under Review").length, "Not Received": list.filter(i => i.received_status === "Not Received").length, Rejected: list.filter(i => i.status === "Rejected").length };
  const filtered = sec === "All" ? list : sec === "Not Received" ? list.filter(i => i.received_status === "Not Received") : list.filter(i => i.status === sec);
  const approve = async (ing) => { await db.update("ingredients", { status: "Approved" }, { id: ing.id }); await db.insert("user_activity_log", { user_id: user.id, user_name: user.name, action: "APPROVE_INGREDIENT", details: `Approved ${ing.name}` }); setList(p => p.map(i => i.id === ing.id ? { ...i, status: "Approved" } : i)); setExp(null); };
  const reject = async (ing) => { await db.update("ingredients", { status: "Rejected", review_reason: note[ing.id] || "Rejected" }, { id: ing.id }); await db.insert("user_activity_log", { user_id: user.id, user_name: user.name, action: "REJECT_INGREDIENT", details: `Rejected ${ing.name}` }); setList(p => p.map(i => i.id === ing.id ? { ...i, status: "Rejected", review_reason: note[ing.id] || "Rejected" } : i)); setExp(null); };
  const setReceived = async (ing, status) => { await db.update("ingredients", { received_status: status }, { id: ing.id }); setList(p => p.map(i => i.id === ing.id ? { ...i, received_status: status } : i)); };
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "800" }}>🌾 Raw Material Manager</h1>
        <p style={{ color: "#64748b", margin: "0 0 24px", fontSize: "13px" }}>Changes saved to Supabase in real-time</p>
        {loading ? <Spinner /> : <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
            {[["Approved", "#16a34a"], ["Under Review", "#ca8a04"], ["Not Received", "#dc2626"], ["Rejected", "#7c3aed"]].map(([k, c]) => (
              <div key={k} onClick={() => setSec(sec === k ? "All" : k)} style={{ ...S.stat(c), cursor: "pointer", border: sec === k ? `2px solid ${c}` : "1px solid transparent" }}><div style={{ color: "#64748b", fontSize: "12px" }}>{k}</div><div style={{ fontSize: "28px", fontWeight: "800", color: c }}>{counts[k]}</div></div>
            ))}
          </div>
          <div style={S.card}>
            {filtered.map(ing => (
              <div key={ing.id} style={{ marginBottom: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: `2px solid ${ing.status === "Approved" ? "#bbf7d0" : ing.status === "Rejected" ? "#fecaca" : ing.received_status === "Not Received" ? "#fecaca" : "#fef08a"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "15px" }}>{ing.name}</div>
                      <div style={{ color: "#64748b", fontSize: "12px" }}>🏭 {ing.supplier} · 📍 {ing.location}</div>
                      <div style={{ color: "#64748b", fontSize: "12px" }}>🔢 {ing.lot_number} · {ing.quantity}</div>
                      {ing.review_reason && <div style={{ marginTop: "6px", background: "#fffbeb", borderRadius: "6px", padding: "6px 10px", fontSize: "12px", color: "#ca8a04" }}>⚠️ {ing.review_reason}</div>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                      <Badge s={ing.status} />
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => setReceived(ing, "Received")} style={{ ...S.btn("ghost"), padding: "5px 10px", fontSize: "12px", background: ing.received_status === "Received" ? "#16a34a" : "#e2e8f0", color: ing.received_status === "Received" ? "white" : "#475569" }}>✓ Received</button>
                        <button onClick={() => setReceived(ing, "Not Received")} style={{ ...S.btn("ghost"), padding: "5px 10px", fontSize: "12px", background: ing.received_status === "Not Received" ? "#dc2626" : "#e2e8f0", color: ing.received_status === "Not Received" ? "white" : "#475569" }}>✗ Not Received</button>
                      </div>
                      {ing.status !== "Approved" && ing.status !== "Rejected" && ing.received_status === "Received" && <button onClick={() => setExp(exp === ing.id ? null : ing.id)} style={{ ...S.btn("primary"), padding: "7px 14px", fontSize: "12px", width: "100%" }}>🔍 Quality Check ▼</button>}
                    </div>
                  </div>
                </div>
                {exp === ing.id && <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginTop: "6px" }}>
                  <div style={{ fontWeight: "700", color: "#1e40af", marginBottom: "12px" }}>🔍 Quality Check — {ing.name}</div>
                  <textarea placeholder="Quality notes..." value={note[ing.id] || ""} onChange={e => setNote({ ...note, [ing.id]: e.target.value })} rows={3} style={{ ...S.input, marginBottom: "14px", resize: "vertical" }} />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => approve(ing)} style={{ ...S.btn("success"), flex: 1 }}>✅ Approve</button>
                    <button onClick={() => reject(ing)} style={{ ...S.btn("danger"), flex: 1 }}>❌ Reject</button>
                  </div>
                </div>}
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}

// ─── COOK MANAGER ─────────────────────────────────────────────────────────────
function CookManager({ batches, user }) {
  const [recs, setRecs] = useState({}); const [exp, setExp] = useState(null);
  useEffect(() => { (async () => { try { const d = await db.select("cook_records"); const map = {}; d.forEach(r => { map[r.batch_id] = r; }); setRecs(map); } catch (e) { console.error(e); } })(); }, []);
  const save = async (batchId, f) => {
    try {
      await db.insert("cook_records", { batch_id: batchId, oven_number: f.ovenNumber, baking_temp: f.bakingTemp, baking_time: f.bakingTime, mixing_time: f.mixingTime, dough_weight: f.doughWeight, line_used: f.lineUsed, notes: f.notes });
      await db.insert("user_activity_log", { user_id: user.id, user_name: user.name, action: "CREATE_COOK_RECORD", details: `Added cook record for ${batchId}` });
      setRecs(p => ({ ...p, [batchId]: f })); setExp(null);
    } catch (e) { alert("Error: " + e.message); }
  };
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "800" }}>👨‍🍳 Cook Manager</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
          <Stat label="Total Batches" value={batches.length} color="#2563eb" /><Stat label="Records Done" value={Object.keys(recs).length} color="#16a34a" /><Stat label="Pending" value={batches.length - Object.keys(recs).length} color="#ca8a04" />
        </div>
        <div style={S.card}>
          {batches.map(b => { const r = recs[b.id]; return (
            <div key={b.id} style={{ marginBottom: "14px" }}>
              <div style={{ padding: "14px", borderRadius: "12px", background: "#f8fafc", border: `1px solid ${r ? "#bbf7d0" : "#e2e8f0"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div><div style={{ fontWeight: "700" }}>{b.product}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{b.id} · {b.date}</div></div>
                  {r ? <span style={S.badge("Approved")}>✅ Done</span> : <button onClick={() => setExp(exp === b.id ? null : b.id)} style={S.btn("primary")}>+ Add Record</button>}
                </div>
                {r && <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>{[["Oven", r.oven_number || r.ovenNumber], ["Temp", r.baking_temp || r.bakingTemp], ["Baking", r.baking_time || r.bakingTime], ["Mixing", r.mixing_time || r.mixingTime], ["Dough", r.dough_weight || r.doughWeight], ["Line", r.line_used || r.lineUsed]].map(([l, v]) => <div key={l} style={{ background: "white", borderRadius: "8px", padding: "8px 10px" }}><div style={{ fontSize: "11px", color: "#94a3b8" }}>{l}</div><div style={{ fontWeight: "600", fontSize: "13px" }}>{v}</div></div>)}</div>}
              </div>
              {exp === b.id && <CookForm batch={b} onSave={f => save(b.id, f)} />}
            </div>
          ); })}
        </div>
      </div>
    </div>
  );
}
function CookForm({ batch, onSave }) {
  const [f, setF] = useState({ ovenNumber: "", bakingTemp: "", bakingTime: "", mixingTime: "", doughWeight: "", lineUsed: batch.line || "", notes: "" });
  return (
    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginTop: "8px" }}>
      <div style={{ fontWeight: "700", color: "#1e40af", marginBottom: "16px" }}>👨‍🍳 Cook Record — {batch.product}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        {[["ovenNumber", "Oven", "Oven 2"], ["bakingTemp", "Temperature", "185°C"], ["bakingTime", "Baking Time", "12 min"], ["mixingTime", "Mixing Time", "8 min"], ["doughWeight", "Dough Weight", "450 kg"], ["lineUsed", "Line", "Line A"]].map(([k, l, p]) => (
          <div key={k}><label style={S.lbl}>{l}</label><input value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} placeholder={p} style={S.input} /></div>
        ))}
      </div>
      <button onClick={() => { if (!f.ovenNumber || !f.bakingTemp) { alert("Fill Oven and Temperature"); return; } onSave(f); }} style={{ ...S.btn("success"), width: "100%" }}>✅ Save Cook Record</button>
    </div>
  );
}

// ─── DISPATCH MANAGER ─────────────────────────────────────────────────────────
function DispatchManager({ batches, user }) {
  const [disp, setDisp] = useState({}); const [exp, setExp] = useState(null); const [forms, setForms] = useState({});
  useEffect(() => { (async () => { try { const d = await db.select("dispatch_records"); const map = {}; d.forEach(r => { map[r.batch_id] = r; }); setDisp(map); } catch (e) { console.error(e); } })(); }, []);
  const ready = batches.filter(b => b.status === "Released");
  const upd = (bid, k, v) => setForms(p => ({ ...p, [bid]: { ...p[bid], [k]: v } }));
  const tog = (bid, s) => { const cur = forms[bid]?.selectedStores || []; upd(bid, "selectedStores", cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]); };
  const confirm = async (b) => {
    const f = forms[b.id] || {};
    if (!f.vehicle || !f.driver || !f.selectedStores?.length) { alert("Fill all fields"); return; }
    try {
      await db.insert("dispatch_records", { batch_id: b.id, vehicle: f.vehicle, driver: f.driver, selected_stores: f.selectedStores, dispatch_date: new Date().toLocaleDateString() });
      await db.insert("user_activity_log", { user_id: user.id, user_name: user.name, action: "DISPATCH_BATCH", details: `Dispatched ${b.id} via ${f.vehicle} to ${f.selectedStores.join(", ")}` });
      setDisp(p => ({ ...p, [b.id]: { ...f, dispatch_date: new Date().toLocaleDateString() } })); setExp(null);
    } catch (e) { alert("Error: " + e.message); }
  };
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "800" }}>🚚 Dispatch Manager</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
          <Stat label="Ready" value={ready.length} color="#16a34a" /><Stat label="Dispatched" value={Object.keys(disp).length} color="#2563eb" /><Stat label="Locations" value={storeLocations.length} color="#ca8a04" />
        </div>
        <div style={{ ...S.card, marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: "700" }}>📍 Delivery Locations</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px" }}>{storeLocations.map((s, i) => <div key={i} style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: "10px", fontSize: "13px", fontWeight: "500" }}>🏪 {s.name}</div>)}</div>
        </div>
        <div style={S.card}>
          {ready.map(b => { const d = disp[b.id]; const f = forms[b.id] || {}; return (
            <div key={b.id} style={{ marginBottom: "14px" }}>
              <div style={{ padding: "14px", borderRadius: "12px", background: "#f8fafc", border: `1px solid ${d ? "#bbf7d0" : "#e2e8f0"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div><div style={{ fontWeight: "700" }}>{b.product}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{b.id} · {b.quantity} {b.unit}</div></div>
                  {d ? <span style={S.badge("Released")}>🚚 Dispatched</span> : <button onClick={() => setExp(exp === b.id ? null : b.id)} style={S.btn("primary")}>Dispatch</button>}
                </div>
                {d && <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>{[["Vehicle", d.vehicle], ["Driver", d.driver], ["Date", d.dispatch_date], ["Stores", (d.selected_stores || []).join(", ")]].map(([l, v]) => <div key={l} style={{ background: "white", borderRadius: "8px", padding: "8px 10px" }}><div style={{ fontSize: "11px", color: "#94a3b8" }}>{l}</div><div style={{ fontWeight: "600", fontSize: "13px" }}>{v}</div></div>)}</div>}
              </div>
              {exp === b.id && !d && <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginTop: "8px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div><label style={S.lbl}>Vehicle *</label><input value={f.vehicle || ""} onChange={e => upd(b.id, "vehicle", e.target.value)} placeholder="TS 09 AB 1234" style={S.input} /></div>
                  <div><label style={S.lbl}>Driver *</label><input value={f.driver || ""} onChange={e => upd(b.id, "driver", e.target.value)} placeholder="Ravi Kumar" style={S.input} /></div>
                </div>
                <label style={S.lbl}>Select Stores *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", margin: "8px 0 14px" }}>
                  {storeLocations.map((s, i) => { const sel = f.selectedStores?.includes(s.name); return <div key={i} onClick={() => tog(b.id, s.name)} style={{ padding: "10px", borderRadius: "10px", cursor: "pointer", border: `2px solid ${sel ? "#2563eb" : "#e2e8f0"}`, background: sel ? "#eff6ff" : "white", fontSize: "13px", color: sel ? "#2563eb" : "#475569", fontWeight: sel ? "700" : "normal" }}>{sel ? "✓ " : "○ "}{s.name}</div>; })}
                </div>
                <button onClick={() => confirm(b)} style={{ ...S.btn("success"), width: "100%" }}>✅ Confirm Dispatch</button>
              </div>}
            </div>
          ); })}
        </div>
      </div>
    </div>
  );
}

// ─── GENERAL MANAGER ─────────────────────────────────────────────────────────
function GeneralManager({ setPage, setSelected, batches, ingredients }) {
  const issues = ingredients.filter(i => i.status !== "Approved");
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "800" }}>👔 General Manager</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
          <Stat label="Total" value={batches.length} color="#2563eb" /><Stat label="Released" value={batches.filter(b => b.status === "Released").length} color="#16a34a" /><Stat label="Rejected" value={batches.filter(b => b.status === "QA Rejected").length} color="#dc2626" /><Stat label="Ing. Issues" value={issues.length} color="#ca8a04" />
        </div>
        <div style={{ ...S.card, marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: "700" }}>🌾 Raw Material Status</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1, background: "#f1f5f9", borderRadius: "999px", height: "10px" }}><div style={{ width: `${(ingredients.filter(i => i.status === "Approved").length / Math.max(ingredients.length, 1)) * 100}%`, background: "#16a34a", borderRadius: "999px", height: "10px" }} /></div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>{ingredients.filter(i => i.status === "Approved").length}/{ingredients.length}</span>
          </div>
          {issues.map(i => <div key={i.id} style={{ padding: "10px 14px", background: "#fef2f2", borderRadius: "8px", marginBottom: "6px" }}><div style={{ fontWeight: "600", fontSize: "13px" }}>{i.name} — {i.supplier}</div><div style={{ fontSize: "12px", color: "#dc2626" }}>{i.status}</div></div>)}
        </div>
        <div style={S.card}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700" }}>📦 All Batches</h2>
          {batches.map(b => <div key={b.id} onClick={() => { setSelected(b.id); setPage("batch-detail"); }} style={{ padding: "14px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: "600" }}>{b.product}</div><div style={{ color: "#64748b", fontSize: "12px" }}>{b.id} · {b.date}</div></div><Badge s={b.status} /></div>)}
        </div>
      </div>
    </div>
  );
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
function Search({ setPage, setSelected, batches, ingredients }) {
  const [q, setQ] = useState(""); const [results, setResults] = useState([]); const [searched, setSearched] = useState(false); const [type, setType] = useState("all");
  const run = () => {
    if (!q.trim()) return;
    const low = q.toLowerCase(); let found = [];
    if (type === "all" || type === "batch") found = batches.filter(b => b.id.toLowerCase().includes(low) || b.product.toLowerCase().includes(low) || (b.sku || "").toLowerCase().includes(low) || b.factory.toLowerCase().includes(low) || b.status.toLowerCase().includes(low)).map(b => ({ ...b, _type: "batch" }));
    if (type === "all" || type === "ingredient") {
      const ings = ingredients.filter(i => i.name.toLowerCase().includes(low) || i.supplier.toLowerCase().includes(low) || (i.lot_number || "").toLowerCase().includes(low));
      if (ings.length > 0) batches.forEach(b => { if (!found.some(f => f.id === b.id)) found.push({ ...b, _type: "ingredient", _ings: ings }); });
    }
    setResults(found); setSearched(true);
  };
  return (
    <div style={{ padding: "28px" }}>
      <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "800" }}>🔍 Search & Trace</h1>
      <p style={{ color: "#64748b", margin: "0 0 24px", fontSize: "13px" }}>Search across live Supabase database</p>
      <div style={{ ...S.card, marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          {[["all", "🔍 All"], ["batch", "📦 Batch"], ["ingredient", "🌾 Ingredient"]].map(([v, l]) => <button key={v} onClick={() => setType(v)} style={{ ...S.btn("ghost"), padding: "7px 14px", fontSize: "13px", background: type === v ? "#0f172a" : "#f1f5f9", color: type === v ? "white" : "#475569" }}>{l}</button>)}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <input placeholder="Batch ID, product, SKU, supplier, lot number..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ ...S.input, flex: 1 }} />
          <button onClick={run} style={{ ...S.btn("primary"), padding: "11px 28px" }}>Search</button>
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Quick:</span>
          {["Chocolate", "Released", "QA Rejected", "Amul", "Punjab Flour"].map(c => <span key={c} onClick={() => setQ(c)} style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", cursor: "pointer", color: "#475569" }}>{c}</span>)}
        </div>
      </div>
      <div style={S.card}>
        {!searched && <div style={{ textAlign: "center", padding: "56px", color: "#94a3b8" }}><div style={{ fontSize: "52px" }}>🔍</div><div style={{ fontWeight: "700", fontSize: "18px", marginTop: "12px" }}>Search across live database</div></div>}
        {searched && results.length === 0 && <div style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}><div style={{ fontSize: "48px" }}>😕</div><div style={{ fontWeight: "700", marginTop: "12px" }}>No results for "{q}"</div></div>}
        {searched && results.length > 0 && <>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px", fontWeight: "600" }}>{results.length} result{results.length !== 1 ? "s" : ""} for "{q}"</div>
          {results.map(b => (
            <div key={b.id} onClick={() => { setSelected(b.id); setPage("batch-detail"); }} style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "15px" }}>{b.product}</div>
                <div style={{ color: "#64748b", fontSize: "13px" }}>{b.id} · {b.factory}</div>
                {b._type === "ingredient" && b._ings && <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "5px" }}>{b._ings.map(i => <span key={i.id} style={{ background: "#fef9c3", color: "#b45309", fontSize: "11px", padding: "2px 8px", borderRadius: "999px", fontWeight: "600" }}>🌾 {i.name} · {i.supplier}</span>)}</div>}
              </div>
              <Badge s={b.status} />
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [batches, setBatches] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const [b, i, t] = await Promise.all([
          db.select("batches", { order: "created_at.desc" }),
          db.select("ingredients"),
          db.select("qa_templates", { order: "created_at.asc" }),
        ]);
        setBatches(b); setIngredients(i); setTemplates(t);
      } catch (e) { console.error("Load error:", e); }
      setLoading(false);
    })();
  }, [user]);

  const addBatch = b => setBatches(prev => [b, ...prev]);

  if (!user) return <Login onLogin={u => { setUser(u); setPage("dashboard"); }} />;
  if (loading) return <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner label="Loading from Supabase..." /></div>;

  const render = () => {
    switch (page) {
      case "dashboard":        return <Dashboard user={user} setPage={setPage} setSelected={setSelected} batches={batches} ingredients={ingredients} />;
      case "batches":          return <Batches setPage={setPage} setSelected={setSelected} batches={batches} ingredients={ingredients} />;
      case "batch-detail":     return <BatchDetail id={selected} setPage={setPage} batches={batches} ingredients={ingredients} />;
      case "new-batch":        return <NewBatch setPage={setPage} onAdd={addBatch} user={user} count={batches.length} templates={templates} />;
      case "raw-material":     return <RawMaterialManager user={user} />;
      case "cook-manager":     return <CookManager batches={batches} user={user} />;
      case "general-manager":  return <GeneralManager setPage={setPage} setSelected={setSelected} batches={batches} ingredients={ingredients} />;
      case "dispatch":         return <DispatchManager batches={batches} user={user} />;
      case "search":           return <Search setPage={setPage} setSelected={setSelected} batches={batches} ingredients={ingredients} />;
      case "qa-templates":     return <QATemplates user={user} />;
      case "admin-users":      return <AdminUsers user={user} />;
      case "admin-activity":   return <AdminActivity />;
      default:                 return <Dashboard user={user} setPage={setPage} setSelected={setSelected} batches={batches} ingredients={ingredients} />;
    }
  };

  return <div style={S.page}><Navbar user={user} page={page} setPage={setPage} onLogout={() => { setUser(null); setPage("dashboard"); setBatches([]); setIngredients([]); setTemplates([]); }} />{render()}</div>;
}

