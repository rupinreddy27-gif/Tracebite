import { useState } from "react";

const INITIAL_BATCHES = [
  { id: "BATCH-2024-001", product: "Chocolate Cream Biscuit", sku: "CCB-120G", factory: "Sumo Biscuits - Hyderabad Plant", date: "Jan 14, 2024", quantity: 10000, unit: "packets", status: "Released", line: "Line A", shift: "Morning", rejectionReason: null, rejectedBy: null, rejectedDate: null },
  { id: "BATCH-2024-002", product: "Salt Cracker Biscuit", sku: "SCB-80G", factory: "Sumo Biscuits - Hyderabad Plant", date: "Jan 19, 2024", quantity: 8000, unit: "packets", status: "Released", line: "Line B", shift: "Evening", rejectionReason: null, rejectedBy: null, rejectedDate: null },
  { id: "BATCH-2024-003", product: "Butter Cookies", sku: "BTC-150G", factory: "Sumo Biscuits - Hyderabad Plant", date: "Jan 22, 2024", quantity: 6000, unit: "packets", status: "QA Rejected", line: "Line A", shift: "Morning", rejectionReason: "Biscuit weight per packet was 142g instead of required 150g.", rejectedBy: "James Wilson", rejectedDate: "Jan 23, 2024" },
  { id: "BATCH-2024-004", product: "Glucose Biscuit", sku: "GLB-100G", factory: "Sumo Biscuits - Hyderabad Plant", date: "Jan 17, 2024", quantity: 12000, unit: "packets", status: "QA Rejected", line: "Line C", shift: "Night", rejectionReason: "Packaging seal integrity failed on 30% of packets.", rejectedBy: "Maria Chen", rejectedDate: "Jan 18, 2024" },
  { id: "BATCH-2024-005", product: "Coconut Crunch Biscuit", sku: "CCR-100G", factory: "Sumo Biscuits - Hyderabad Plant", date: "Jan 24, 2024", quantity: 9000, unit: "packets", status: "In Progress", line: "Line A", shift: "Morning", rejectionReason: null, rejectedBy: null, rejectedDate: null },
];

const ingredients = [
  { id: "ING-001", name: "Wheat Flour", supplier: "Punjab Flour Mills", location: "Punjab, India", lotNumber: "LOT-WF-2024-01", quantity: "500 kg", status: "Approved", receivedStatus: "Received", reviewReason: null },
  { id: "ING-002", name: "Sugar", supplier: "Renuka Sugars", location: "Kolhapur, Maharashtra", lotNumber: "LOT-SG-2024-01", quantity: "200 kg", status: "Approved", receivedStatus: "Received", reviewReason: null },
  { id: "ING-003", name: "Edible Palm Oil", supplier: "Godrej Agrovet", location: "Mumbai, Maharashtra", lotNumber: "LOT-OL-2024-01", quantity: "150 kg", status: "Approved", receivedStatus: "Received", reviewReason: null },
  { id: "ING-004", name: "Cocoa Powder", supplier: "Barry Callebaut India", location: "Pune, Maharashtra", lotNumber: "LOT-CP-2024-01", quantity: "50 kg", status: "Approved", receivedStatus: "Received", reviewReason: null },
  { id: "ING-005", name: "Milk Powder", supplier: "Amul Dairy", location: "Anand, Gujarat", lotNumber: "LOT-MP-2024-01", quantity: "80 kg", status: "Under Review", receivedStatus: "Received", reviewReason: "Milk powder batch failed moisture content test." },
  { id: "ING-006", name: "Baking Soda", supplier: "Tata Chemicals", location: "Mumbai, Maharashtra", lotNumber: "LOT-BS-2024-01", quantity: "20 kg", status: "Approved", receivedStatus: "Received", reviewReason: null },
  { id: "ING-007", name: "Salt", supplier: "Tata Salt", location: "Mithapur, Gujarat", lotNumber: "LOT-ST-2024-01", quantity: "30 kg", status: "Approved", receivedStatus: "Received", reviewReason: null },
  { id: "ING-008", name: "Vanilla Essence", supplier: "SH Kelkar & Co.", location: "Mumbai, Maharashtra", lotNumber: "LOT-VE-2024-01", quantity: "10 kg", status: "Not Received", receivedStatus: "Not Received", reviewReason: "Delayed shipment. Expected Jan 25, 2024." },
];

const qaTemplates = [
  { id: "QA-001", name: "Biscuit Standard QA", category: "Biscuits & Cookies", items: ["Raw flour quality check","Sugar and salt measurement","Fat and oil ratio check","Dough consistency check","Baking temperature verified","Biscuit color and texture","Weight per packet check","Packaging seal integrity","Allergen labeling verified","Expiry date printed correctly"] },
  { id: "QA-002", name: "Cream Biscuit QA", category: "Cream Filled Biscuits", items: ["Base biscuit quality check","Cream filling weight check","Cream flavor and color check","Filling consistency check","Sandwich seal check","Packet weight verification","Packaging seal integrity","Label and barcode check","Allergen labeling verified","Expiry date printed correctly"] },
  { id: "QA-003", name: "Raw Ingredients QA", category: "Incoming Raw Materials", items: ["Wheat flour moisture content","Sugar purity check","Edible oil freshness check","Milk powder quality check","Cocoa powder check","Baking soda check","Salt iodine content","Packaging material check","Supplier certificate verified","Lot number recorded"] },
];

const storeLocations = [
  { name: "DMart - Kukatpally" },{ name: "Big Bazaar - Ameerpet" },
  { name: "Reliance Fresh - Madhapur" },{ name: "More Supermarket - Begumpet" },
  { name: "Spencer's - Banjara Hills" },{ name: "Star Bazaar - Kondapur" },
];

const users = [
  { email: "rawmaterial@sumo.com", password: "raw123", role: "Raw Material Manager", name: "Arjun Sharma" },
  { email: "cook@sumo.com", password: "cook123", role: "Cook Manager", name: "Priya Patel" },
  { email: "qa@sumo.com", password: "qa123", role: "QA Manager", name: "James Wilson" },
  { email: "gm@sumo.com", password: "gm123", role: "General Manager", name: "Vikram Reddy" },
  { email: "dispatch@sumo.com", password: "dispatch123", role: "Dispatch Manager", name: "Sarah Johnson" },
];

// ── Styles ──────────────────────────────────────────────────────────────────
const S = {
  page: { minHeight:"100vh", background:"#f0f4f8", fontFamily:"'DM Sans','Segoe UI',sans-serif" },
  nav: { background:"#0f172a", padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"58px", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.25)" },
  logo: { fontWeight:"800", fontSize:"20px", color:"#38bdf8", letterSpacing:"-0.5px", cursor:"pointer" },
  navBtn: a => ({ padding:"7px 16px", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"13px", background: a?"#38bdf8":"transparent", color: a?"#0f172a":"#94a3b8" }),
  card: { background:"white", borderRadius:"16px", padding:"24px", boxShadow:"0 1px 4px rgba(0,0,0,0.07)" },
  stat: c => ({ background:"white", borderRadius:"14px", padding:"20px 24px", borderLeft:`4px solid ${c}`, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }),
  btn: v => { const m={primary:{background:"#2563eb",color:"white"},success:{background:"#16a34a",color:"white"},danger:{background:"#dc2626",color:"white"},ghost:{background:"#f1f5f9",color:"#334155"}}; return {...(m[v]||m.primary), padding:"10px 20px", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"600", fontSize:"14px"}; },
  badge: s => { const m={Released:{bg:"#dcfce7",c:"#15803d"},"QA Rejected":{bg:"#fee2e2",c:"#dc2626"},"In Progress":{bg:"#fef9c3",c:"#b45309"},Approved:{bg:"#dcfce7",c:"#15803d"},"Under Review":{bg:"#fef9c3",c:"#b45309"},"Not Received":{bg:"#fee2e2",c:"#dc2626"},Rejected:{bg:"#ede9fe",c:"#7c3aed"},"On Hold":{bg:"#fef9c3",c:"#b45309"},New:{bg:"#dbeafe",c:"#1d4ed8"}}; const t=m[s]||{bg:"#f1f5f9",c:"#64748b"}; return {display:"inline-block",padding:"4px 12px",borderRadius:"999px",fontSize:"12px",fontWeight:"700",background:t.bg,color:t.c}; },
  input: { width:"100%", padding:"11px 14px", borderRadius:"10px", border:"1px solid #e2e8f0", fontSize:"14px", boxSizing:"border-box", outline:"none", background:"white" },
  lbl: { fontSize:"13px", color:"#475569", display:"block", marginBottom:"5px", fontWeight:"600" },
};

const Badge = ({ s }) => <span style={S.badge(s)}>{s}</span>;
const Stat = ({ label, value, color }) => (
  <div style={S.stat(color)}>
    <div style={{color:"#64748b",fontSize:"13px",fontWeight:"500"}}>{label}</div>
    <div style={{fontSize:"34px",fontWeight:"800",color,marginTop:"4px"}}>{value}</div>
  </div>
);

// ── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email,setEmail]=useState(""); const [pw,setPw]=useState(""); const [err,setErr]=useState("");
  const go = () => { const u=users.find(u=>u.email===email&&u.password===pw); if(!u){setErr("Invalid credentials.");return;} onLogin(u); };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a 0%,#1e40af 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <div style={{width:"100%",maxWidth:"440px"}}>
        <div style={{textAlign:"center",marginBottom:"36px"}}>
          <div style={{fontSize:"38px",fontWeight:"900",color:"#38bdf8",letterSpacing:"-1px"}}>TraceBite</div>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:"14px",marginTop:"6px"}}>Traceability & QA Operating System</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:"13px",marginTop:"4px"}}>Sumo Biscuits — Hyderabad Plant</div>
        </div>
        <div style={{background:"white",borderRadius:"20px",padding:"32px",boxShadow:"0 25px 60px rgba(0,0,0,0.4)"}}>
          <h2 style={{margin:"0 0 24px",fontSize:"20px",fontWeight:"700"}}>Sign in</h2>
          <div style={{marginBottom:"14px"}}><label style={S.lbl}>Email</label><input style={S.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@sumo.com" onKeyDown={e=>e.key==="Enter"&&go()} /></div>
          <div style={{marginBottom:"20px"}}><label style={S.lbl}>Password</label><input style={S.input} type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&go()} /></div>
          {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",color:"#dc2626",fontSize:"13px"}}>❌ {err}</div>}
          <button onClick={go} style={{...S.btn("primary"),width:"100%",padding:"14px",fontSize:"15px"}}>Sign In →</button>
          <div style={{marginTop:"20px",background:"#f8fafc",borderRadius:"12px",padding:"14px"}}>
            <div style={{fontSize:"12px",fontWeight:"700",color:"#64748b",marginBottom:"10px"}}>🔑 Click to auto-fill credentials</div>
            {users.map(u=>(
              <div key={u.role} onClick={()=>{setEmail(u.email);setPw(u.password);setErr("");}} style={{padding:"8px 12px",borderRadius:"8px",marginBottom:"5px",cursor:"pointer",background:"white",border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:"600",fontSize:"13px"}}>{u.role}</span>
                <span style={{fontSize:"12px",color:"#94a3b8"}}>{u.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ user, page, setPage, onLogout }) {
  const links = {
    "Raw Material Manager":[["Dashboard","dashboard"],["Raw Materials","raw-material"]],
    "Cook Manager":[["Dashboard","dashboard"],["Cook Records","cook-manager"],["Batches","batches"]],
    "QA Manager":[["Dashboard","dashboard"],["Batches","batches"],["QA Templates","qa-templates"],["Search","search"]],
    "General Manager":[["Dashboard","dashboard"],["Operations","general-manager"],["Batches","batches"],["Search","search"]],
    "Dispatch Manager":[["Dashboard","dashboard"],["Dispatch","dispatch"],["Batches","batches"]],
  }[user.role] || [["Dashboard","dashboard"],["Batches","batches"],["Search","search"]];
  return (
    <div style={S.nav}>
      <div style={S.logo} onClick={()=>setPage("dashboard")}>TraceBite</div>
      <div style={{display:"flex",gap:"4px"}}>{links.map(([l,p])=><button key={p} onClick={()=>setPage(p)} style={S.navBtn(page===p)}>{l}</button>)}</div>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        <div style={{background:"rgba(255,255,255,0.08)",padding:"7px 14px",borderRadius:"10px",fontSize:"13px",color:"#cbd5e1"}}>👤 {user.name}</div>
        <button onClick={onLogout} style={{padding:"7px 14px",background:"#dc2626",color:"white",border:"none",borderRadius:"10px",cursor:"pointer",fontSize:"13px",fontWeight:"600"}}>Logout</button>
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, setPage, setSelected, batches }) {
  const pending=batches.filter(b=>b.status==="In Progress");
  const rejected=batches.filter(b=>b.status==="QA Rejected");
  const released=batches.filter(b=>b.status==="Released");
  const ingIssues=ingredients.filter(i=>i.status!=="Approved");
  const greet=()=>{const h=new Date().getHours();return h<12?"Good morning":h<17?"Good afternoon":"Good evening";};
  const go=id=>{setSelected(id);setPage("batch-detail");};
  return (
    <div style={{padding:"28px"}}>
      <div style={{marginBottom:"28px"}}>
        <h1 style={{margin:0,fontSize:"26px",fontWeight:"800"}}>{greet()}, {user.name} 👋</h1>
        <p style={{color:"#64748b",margin:"4px 0 0",fontSize:"14px"}}>{user.role} · Sumo Biscuits Hyderabad Plant</p>
      </div>
      {user.role==="Raw Material Manager"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"24px"}}>
          <Stat label="Approved" value={ingredients.filter(i=>i.status==="Approved").length} color="#16a34a"/>
          <Stat label="Under Review" value={ingredients.filter(i=>i.status==="Under Review").length} color="#ca8a04"/>
          <Stat label="Not Received" value={ingredients.filter(i=>i.receivedStatus==="Not Received").length} color="#dc2626"/>
        </div>
        <button onClick={()=>setPage("raw-material")} style={{...S.btn("primary"),marginBottom:"24px"}}>🌾 Check Raw Materials</button>
        <div style={S.card}><h2 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700"}}>⚠️ Ingredients Needing Attention</h2>
          {ingIssues.length===0?<div style={{color:"#94a3b8",textAlign:"center",padding:"20px"}}>✅ All approved!</div>
            :ingIssues.map(i=><div key={i.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}><div style={{fontWeight:"600"}}>{i.name}</div><div style={{color:"#dc2626",fontSize:"13px"}}>{i.status}: {i.reviewReason}</div></div>)}
        </div>
      </>}
      {user.role==="Cook Manager"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"24px"}}>
          <Stat label="Total Batches" value={batches.length} color="#2563eb"/>
          <Stat label="In Progress" value={pending.length} color="#ca8a04"/>
          <Stat label="Completed" value={released.length} color="#16a34a"/>
        </div>
        <button onClick={()=>setPage("cook-manager")} style={{...S.btn("primary"),marginBottom:"24px"}}>👨‍🍳 Manage Cook Records</button>
        <div style={S.card}><h2 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700"}}>🍪 All Batches</h2>
          {batches.map(b=><div key={b.id} onClick={()=>go(b.id)} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:"600"}}>{b.product}</div><div style={{color:"#64748b",fontSize:"12px"}}>{b.id}</div></div><Badge s={b.status}/></div>)}
        </div>
      </>}
      {user.role==="QA Manager"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"24px"}}>
          <Stat label="Pending QA" value={pending.length} color="#ca8a04"/>
          <Stat label="QA Rejected" value={rejected.length} color="#dc2626"/>
          <Stat label="Released" value={released.length} color="#16a34a"/>
        </div>
        <div style={{display:"flex",gap:"10px",marginBottom:"24px"}}>
          <button onClick={()=>setPage("batches")} style={S.btn("primary")}>Review Batches</button>
          <button onClick={()=>setPage("qa-templates")} style={S.btn("ghost")}>QA Templates</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
          <div style={S.card}><h2 style={{margin:"0 0 14px",color:"#ca8a04",fontSize:"15px",fontWeight:"700"}}>⏳ Pending QA</h2>
            {pending.length===0?<div style={{color:"#94a3b8",textAlign:"center",padding:"20px"}}>✅ All caught up!</div>
              :pending.map(b=><div key={b.id} onClick={()=>go(b.id)} style={{padding:"10px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}}><div style={{fontWeight:"600"}}>{b.product}</div><div style={{color:"#64748b",fontSize:"12px"}}>{b.id}</div></div>)}
          </div>
          <div style={S.card}><h2 style={{margin:"0 0 14px",color:"#dc2626",fontSize:"15px",fontWeight:"700"}}>❌ Recently Rejected</h2>
            {rejected.map(b=><div key={b.id} onClick={()=>go(b.id)} style={{padding:"10px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}}><div style={{fontWeight:"600"}}>{b.product}</div><div style={{color:"#dc2626",fontSize:"12px"}}>{b.rejectionReason?.substring(0,60)}...</div></div>)}
          </div>
        </div>
      </>}
      {user.role==="General Manager"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"24px"}}>
          <Stat label="Total Batches" value={batches.length} color="#2563eb"/>
          <Stat label="Released" value={released.length} color="#16a34a"/>
          <Stat label="QA Rejected" value={rejected.length} color="#dc2626"/>
          <Stat label="Ingredient Issues" value={ingIssues.length} color="#ca8a04"/>
        </div>
        <div style={{display:"flex",gap:"10px",marginBottom:"24px"}}>
          <button onClick={()=>setPage("general-manager")} style={S.btn("primary")}>👔 Full Operations View</button>
          <button onClick={()=>setPage("batches")} style={S.btn("ghost")}>All Batches</button>
        </div>
        <div style={S.card}><h2 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700"}}>📋 Operations Summary</h2>
          {batches.map(b=><div key={b.id} onClick={()=>go(b.id)} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:"600"}}>{b.product}</div><div style={{color:"#64748b",fontSize:"12px"}}>{b.id}</div></div><Badge s={b.status}/></div>)}
        </div>
      </>}
      {user.role==="Dispatch Manager"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"24px"}}>
          <Stat label="Ready to Dispatch" value={released.length} color="#16a34a"/>
          <Stat label="Total Batches" value={batches.length} color="#2563eb"/>
          <Stat label="Locations" value={6} color="#ca8a04"/>
        </div>
        <button onClick={()=>setPage("dispatch")} style={{...S.btn("primary"),marginBottom:"24px"}}>🚚 Manage Dispatches</button>
        <div style={S.card}><h2 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700"}}>📦 Ready for Dispatch</h2>
          {released.map(b=><div key={b.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:"600"}}>{b.product}</div><div style={{color:"#64748b",fontSize:"12px"}}>{b.id} · {b.quantity} {b.unit}</div></div><button onClick={()=>setPage("dispatch")} style={S.btn("success")}>Dispatch →</button></div>)}
        </div>
      </>}
    </div>
  );
}

// ── Batches List ─────────────────────────────────────────────────────────────
function Batches({ setPage, setSelected, batches }) {
  const [q,setQ]=useState(""); const [filter,setFilter]=useState("All Status");
  const list=batches.filter(b=>{
    const m=b.product.toLowerCase().includes(q.toLowerCase())||b.id.toLowerCase().includes(q.toLowerCase())||b.sku.toLowerCase().includes(q.toLowerCase())||b.factory.toLowerCase().includes(q.toLowerCase());
    return m&&(filter==="All Status"||b.status===filter);
  });
  const hold=b=>ingredients.some(i=>i.status==="Under Review")&&b.status==="Released";
  return (
    <div style={{padding:"28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
        <div><h1 style={{margin:0,fontSize:"24px",fontWeight:"800"}}>Batches</h1><p style={{color:"#64748b",margin:"4px 0 0",fontSize:"13px"}}>{batches.length} total records</p></div>
        <button onClick={()=>setPage("new-batch")} style={S.btn("primary")}>+ New Batch</button>
      </div>
      <div style={{display:"flex",gap:"12px",marginBottom:"24px"}}>
        <input placeholder="Search by ID, product, SKU, factory..." value={q} onChange={e=>setQ(e.target.value)} style={{...S.input,flex:1}}/>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{...S.input,width:"180px",flex:"none"}}>
          <option>All Status</option><option>Released</option><option>QA Rejected</option><option>In Progress</option><option>New</option>
        </select>
      </div>
      {list.length===0&&<div style={{...S.card,textAlign:"center",padding:"48px",color:"#94a3b8"}}><div style={{fontSize:"40px"}}>📭</div><div style={{marginTop:"12px",fontWeight:"600"}}>No batches found</div></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"16px"}}>
        {list.map(b=>(
          <div key={b.id} onClick={()=>{setSelected(b.id);setPage("batch-detail");}} style={{...S.card,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
              <div style={{color:"#94a3b8",fontSize:"12px"}}>{b.id}</div>
              <Badge s={hold(b)?"On Hold":b.status}/>
            </div>
            <div style={{fontWeight:"700",fontSize:"17px",marginBottom:"2px"}}>{b.product}</div>
            <div style={{color:"#64748b",fontSize:"13px",marginBottom:"12px"}}>SKU: {b.sku}</div>
            <div style={{fontSize:"13px",color:"#475569"}}>🏭 {b.factory}</div>
            <div style={{fontSize:"13px",color:"#475569",marginTop:"3px"}}>📅 {b.date} · 📦 {b.quantity} {b.unit}</div>
            {b.line&&<div style={{fontSize:"12px",color:"#94a3b8",marginTop:"3px"}}>{b.line} · {b.shift} shift</div>}
          </div>
        ))}
      </div>
      <button onClick={()=>setPage("dashboard")} style={{...S.btn("ghost"),marginTop:"24px"}}>← Back to Dashboard</button>
    </div>
  );
}

// ── New Batch ────────────────────────────────────────────────────────────────
function NewBatch({ setPage, onAdd, count }) {
  const blank = { product:"", sku:"", factory:"Sumo Biscuits - Hyderabad Plant", line:"", shift:"", date:"", targetQty:"", actualQty:"", notes:"", templateId:"" };
  const [form,setForm]=useState(blank);
  const [done,setDone]=useState(false);
  const [newId,setNewId]=useState("");
  const ch=e=>setForm({...form,[e.target.name]:e.target.value});
  const tmpl=qaTemplates.find(t=>t.id===form.templateId);

  const create=()=>{
    if(!form.product||!form.sku||!form.factory){alert("Please fill Product, SKU and Factory");return;}
    if(!form.templateId){alert("Please select a QA Template");return;}
    const id=`BATCH-2024-0${String(count+1).padStart(2,"0")}`;
    const dateStr=form.date?new Date(form.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
    onAdd({ id, product:form.product, sku:form.sku, factory:form.factory, date:dateStr,
      quantity:parseInt(form.actualQty||form.targetQty)||0, unit:"packets",
      status:"In Progress", line:form.line||"Line A", shift:form.shift||"Morning",
      rejectionReason:null, rejectedBy:null, rejectedDate:null, notes:form.notes, templateId:form.templateId });
    setNewId(id); setDone(true);
  };

  if(done) return (
    <div style={{padding:"28px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <div style={{...S.card,maxWidth:"420px",textAlign:"center",padding:"40px"}}>
        <div style={{fontSize:"52px",marginBottom:"16px"}}>🎉</div>
        <h2 style={{color:"#16a34a",margin:"0 0 8px",fontSize:"22px"}}>Batch Created!</h2>
        <div style={{background:"#f0fdf4",borderRadius:"10px",padding:"12px 20px",margin:"14px auto",display:"inline-block"}}>
          <div style={{fontSize:"11px",color:"#64748b"}}>Batch ID</div>
          <div style={{fontWeight:"800",color:"#15803d",fontSize:"20px",letterSpacing:"1px"}}>{newId}</div>
        </div>
        <p style={{color:"#64748b",marginBottom:"24px",fontSize:"14px"}}>
          <strong>{form.product}</strong> added with status <strong>In Progress</strong>.
          It now appears in the Batches list.
        </p>
        <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
          <button onClick={()=>setPage("batches")} style={S.btn("primary")}>View All Batches</button>
          <button onClick={()=>{setForm(blank);setDone(false);}} style={S.btn("ghost")}>+ Add Another</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{padding:"28px"}}>
      <div style={{maxWidth:"720px",margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"24px"}}>
          <button onClick={()=>setPage("batches")} style={S.btn("ghost")}>← Back</button>
          <div><h1 style={{margin:0,fontSize:"22px",fontWeight:"800"}}>New Batch Record</h1><p style={{color:"#64748b",margin:"3px 0 0",fontSize:"13px"}}>New batch will appear in the list immediately after creation</p></div>
        </div>

        <div style={{...S.card,marginBottom:"16px"}}>
          <h2 style={{margin:"0 0 20px",fontSize:"16px",fontWeight:"700"}}>📦 Batch Information</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
            <div><label style={S.lbl}>Product Name *</label><input name="product" value={form.product} onChange={ch} placeholder="Chocolate Cream Biscuit" style={S.input}/></div>
            <div><label style={S.lbl}>Product SKU *</label><input name="sku" value={form.sku} onChange={ch} placeholder="CCB-120G" style={S.input}/></div>
            <div style={{gridColumn:"span 2"}}><label style={S.lbl}>Factory Name *</label><input name="factory" value={form.factory} onChange={ch} style={S.input}/></div>
            <div><label style={S.lbl}>Production Line</label><select name="line" value={form.line} onChange={ch} style={S.input}><option value="">Select Line</option><option>Line A</option><option>Line B</option><option>Line C</option></select></div>
            <div><label style={S.lbl}>Shift</label><select name="shift" value={form.shift} onChange={ch} style={S.input}><option value="">Select Shift</option><option>Morning</option><option>Evening</option><option>Night</option></select></div>
            <div><label style={S.lbl}>Production Date</label><input type="date" name="date" value={form.date} onChange={ch} style={S.input}/></div>
            <div><label style={S.lbl}>Target Quantity (packets)</label><input type="number" name="targetQty" value={form.targetQty} onChange={ch} placeholder="10000" style={S.input}/></div>
            <div style={{gridColumn:"span 2"}}><label style={S.lbl}>Actual Quantity (packets)</label><input type="number" name="actualQty" value={form.actualQty} onChange={ch} placeholder="9800" style={S.input}/></div>
            <div style={{gridColumn:"span 2"}}><label style={S.lbl}>Notes</label><textarea name="notes" value={form.notes} onChange={ch} placeholder="Any observations..." rows={2} style={{...S.input,resize:"vertical"}}/></div>
          </div>
        </div>

        <div style={{...S.card,marginBottom:"20px"}}>
          <h2 style={{margin:"0 0 8px",fontSize:"16px",fontWeight:"700"}}>📋 Select QA Template *</h2>
          <p style={{color:"#64748b",fontSize:"13px",margin:"0 0 14px"}}>Choose a QA checklist for this batch.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
            {qaTemplates.map(t=>(
              <div key={t.id} onClick={()=>setForm({...form,templateId:t.id})} style={{padding:"14px",borderRadius:"10px",border:`2px solid ${form.templateId===t.id?"#2563eb":"#e2e8f0"}`,cursor:"pointer",background:form.templateId===t.id?"#eff6ff":"white"}}>
                <div style={{fontWeight:"700",fontSize:"13px",color:form.templateId===t.id?"#1d4ed8":"#0f172a",marginBottom:"3px"}}>{t.name}</div>
                <div style={{color:"#64748b",fontSize:"12px"}}>{t.items.length} checks</div>
              </div>
            ))}
          </div>
          {tmpl&&<div style={{marginTop:"14px",background:"#f0fdf4",borderRadius:"10px",padding:"14px",border:"1px solid #bbf7d0"}}>
            <div style={{fontWeight:"700",fontSize:"13px",color:"#15803d",marginBottom:"8px"}}>✅ {tmpl.name} — checks that will be loaded:</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px"}}>
              {tmpl.items.map((it,i)=><div key={it} style={{fontSize:"12px",color:"#475569",padding:"3px 0"}}>{i+1}. {it}</div>)}
            </div>
          </div>}
        </div>

        <button onClick={create} style={{...S.btn("primary"),width:"100%",padding:"14px",fontSize:"15px"}}>✅ Create Batch Record</button>
      </div>
    </div>
  );
}

// ── Batch Detail ─────────────────────────────────────────────────────────────
function BatchDetail({ id, setPage, batches }) {
  const [tab,setTab]=useState("Details"); const [expIng,setExpIng]=useState(null);
  const [qa,setQa]=useState(Object.fromEntries(["Raw flour quality check","Sugar and salt measurement","Biscuit color and texture","Weight per packet check","Packaging seal integrity","Allergen labeling verified","Expiry date printed correctly"].map(k=>[k,{status:null,reason:""}])));
  const b=batches.find(x=>x.id===id);
  if(!b) return <div style={{padding:"28px"}}><div style={{...S.card,textAlign:"center",padding:"48px"}}><h2>Batch not found</h2><button onClick={()=>setPage("batches")} style={S.btn("ghost")}>← Back</button></div></div>;
  const hold=ingredients.some(i=>i.status==="Under Review")&&b.status==="Released";
  const tabs=["Details","Materials","QA Checks","Approvals"];
  const allDone=Object.values(qa).every(c=>c.status!==null);
  const allPass=Object.values(qa).every(c=>c.status==="pass");
  const approvals=[{stage:"Submitted for QA",person:"Maria Chen",date:"Jan 15, 2024 9:30 AM",done:true},{stage:"QA Review",person:"James Wilson",date:"Jan 16, 2024 4:15 AM",done:true},{stage:"Final Approval",person:"Sarah Johnson",date:"Jan 16, 2024 11:00 AM",done:true},{stage:"Released",person:"System",date:"Jan 16, 2024 11:01 AM",done:b.status==="Released"}];
  return (
    <div style={{padding:"28px"}}>
      <div style={{maxWidth:"820px",margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"24px"}}>
          <button onClick={()=>setPage("batches")} style={S.btn("ghost")}>← Back</button>
          <div style={{flex:1}}><div style={{color:"#94a3b8",fontSize:"13px"}}>{b.id}</div><h1 style={{margin:"2px 0 0",fontSize:"22px",fontWeight:"800"}}>{b.product}</h1></div>
          <Badge s={hold?"On Hold":b.status}/>
        </div>
        <div style={{display:"flex",gap:"4px",marginBottom:"24px",background:"white",padding:"6px",borderRadius:"12px",width:"fit-content",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
          {tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",borderRadius:"9px",border:"none",cursor:"pointer",fontWeight:"600",fontSize:"13px",background:tab===t?"#2563eb":"transparent",color:tab===t?"white":"#64748b"}}>{t}</button>)}
        </div>
        {tab==="Details"&&<div style={S.card}>
          <h2 style={{margin:"0 0 20px",fontSize:"16px",fontWeight:"700"}}>📦 Batch Information</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"18px"}}>
            {[["Batch ID",b.id],["Product",b.product],["SKU",b.sku],["Factory",b.factory],["Date",b.date],["Line",b.line],["Shift",b.shift],["Quantity",`${b.quantity} ${b.unit}`]].map(([l,v])=>(
              <div key={l}><div style={{fontSize:"12px",color:"#94a3b8",marginBottom:"3px"}}>{l}</div><div style={{fontWeight:"600",fontSize:"14px"}}>{v||"—"}</div></div>
            ))}
            {b.notes&&<div style={{gridColumn:"span 2"}}><div style={{fontSize:"12px",color:"#94a3b8",marginBottom:"3px"}}>Notes</div><div style={{fontSize:"14px",color:"#475569"}}>{b.notes}</div></div>}
          </div>
          {hold&&<div style={{marginTop:"20px",background:"#fffbeb",border:"1px solid #fbbf24",borderRadius:"12px",padding:"16px"}}><div style={{fontWeight:"700",color:"#ca8a04"}}>⚠️ On Hold — Ingredient Under Review</div>{ingredients.filter(i=>i.status==="Under Review").map(i=><div key={i.id} style={{color:"#dc2626",fontSize:"13px",marginTop:"4px"}}>❌ {i.name} — {i.supplier}</div>)}</div>}
          {b.status==="QA Rejected"&&b.rejectionReason&&<div style={{marginTop:"20px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"12px",padding:"16px"}}><div style={{fontWeight:"700",color:"#dc2626",marginBottom:"8px"}}>❌ QA Rejection Reason</div><div style={{fontSize:"14px",color:"#475569"}}>{b.rejectionReason}</div><div style={{fontSize:"12px",color:"#94a3b8",marginTop:"8px"}}>By: {b.rejectedBy} · {b.rejectedDate}</div></div>}
        </div>}
        {tab==="Materials"&&<div style={S.card}>
          <h2 style={{margin:"0 0 20px",fontSize:"16px",fontWeight:"700"}}>🌾 Raw Ingredients</h2>
          {ingredients.map(ing=>(
            <div key={ing.id}>
              <div style={{padding:"14px",borderRadius:"10px",background:"#f8fafc",marginBottom:"8px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
                <div><div style={{fontWeight:"600"}}>{ing.name}</div><div style={{color:"#64748b",fontSize:"12px"}}>{ing.supplier} · {ing.lotNumber} · {ing.quantity}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <Badge s={ing.status}/>
                  {ing.status==="Under Review"&&<button onClick={()=>setExpIng(expIng===ing.id?null:ing.id)} style={{...S.btn("ghost"),padding:"5px 12px",fontSize:"12px"}}>Why? ▼</button>}
                </div>
              </div>
              {expIng===ing.id&&<div style={{background:"#fffbeb",border:"1px solid #fbbf24",borderRadius:"10px",padding:"14px",marginBottom:"8px",marginLeft:"10px"}}><div style={{fontWeight:"700",color:"#ca8a04",marginBottom:"6px"}}>⚠️ Under Review</div><div style={{fontSize:"13px",color:"#475569"}}>{ing.reviewReason}</div></div>}
            </div>
          ))}
        </div>}
        {tab==="QA Checks"&&<div style={S.card}>
          <h2 style={{margin:"0 0 20px",fontSize:"16px",fontWeight:"700"}}>✅ QA Checklist</h2>
          {Object.entries(qa).map(([item,data])=>(
            <div key={item} style={{background:data.status==="pass"?"#f0fdf4":data.status==="fail"?"#fef2f2":"#f8fafc",borderRadius:"10px",padding:"14px",marginBottom:"10px",border:`1px solid ${data.status==="pass"?"#bbf7d0":data.status==="fail"?"#fecaca":"#e2e8f0"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:"500",fontSize:"14px"}}>{item}</span>
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={()=>setQa(p=>({...p,[item]:{...p[item],status:"pass"}}))} style={{...S.btn("ghost"),padding:"7px 16px",background:data.status==="pass"?"#16a34a":"#e2e8f0",color:data.status==="pass"?"white":"#475569"}}>✓ Pass</button>
                  <button onClick={()=>setQa(p=>({...p,[item]:{...p[item],status:"fail"}}))} style={{...S.btn("ghost"),padding:"7px 16px",background:data.status==="fail"?"#dc2626":"#e2e8f0",color:data.status==="fail"?"white":"#475569"}}>✗ Fail</button>
                </div>
              </div>
              {data.status==="fail"&&<textarea placeholder="Describe the issue..." value={data.reason} onChange={e=>setQa(p=>({...p,[item]:{...p[item],reason:e.target.value}}))} rows={2} style={{...S.input,marginTop:"10px",background:"#fff5f5",border:"1px solid #fecaca",color:"#dc2626"}}/>}
            </div>
          ))}
          {allDone&&<div style={{padding:"20px",borderRadius:"12px",background:allPass?"#f0fdf4":"#fef2f2",border:`1px solid ${allPass?"#bbf7d0":"#fecaca"}`,textAlign:"center",marginTop:"8px"}}><div style={{fontSize:"28px"}}>{allPass?"🎉":"⚠️"}</div><div style={{fontWeight:"700",color:allPass?"#16a34a":"#dc2626",marginTop:"8px"}}>{allPass?"All checks passed!":"Some checks failed — review required."}</div></div>}
        </div>}
        {tab==="Approvals"&&<div style={S.card}>
          <h2 style={{margin:"0 0 20px",fontSize:"16px",fontWeight:"700"}}>🛡️ Approvals & Status</h2>
          {approvals.map(a=>(
            <div key={a.stage} style={{display:"flex",gap:"14px",alignItems:"flex-start",marginBottom:"18px"}}>
              <div style={{width:"34px",height:"34px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:a.done?"#dcfce7":"#f1f5f9",fontSize:"15px",flexShrink:0}}>{a.done?"✅":"⏳"}</div>
              <div><div style={{fontWeight:"600",fontSize:"14px"}}>{a.stage}</div><div style={{color:"#64748b",fontSize:"12px"}}>{a.person} · {a.date}</div></div>
            </div>
          ))}
          {b.status==="Released"&&<div style={{marginTop:"20px",background:"#f0fdf4",borderRadius:"12px",padding:"20px",textAlign:"center"}}><div style={{fontSize:"28px"}}>🚚</div><div style={{fontWeight:"700",color:"#16a34a",marginTop:"8px"}}>Batch Released</div></div>}
        </div>}
      </div>
    </div>
  );
}

// ── Enhanced Search ──────────────────────────────────────────────────────────
function Search({ setPage, setSelected, batches }) {
  const [q,setQ]=useState(""); const [results,setResults]=useState([]); const [searched,setSearched]=useState(false); const [type,setType]=useState("all");

  const run=()=>{
    if(!q.trim())return;
    const low=q.toLowerCase(); let found=[];
    if(type==="all"||type==="batch"){
      found=batches.filter(b=>
        b.id.toLowerCase().includes(low)||b.product.toLowerCase().includes(low)||
        b.sku.toLowerCase().includes(low)||b.factory.toLowerCase().includes(low)||
        (b.line||"").toLowerCase().includes(low)||b.status.toLowerCase().includes(low)
      ).map(b=>({...b,_type:"batch"}));
    }
    if(type==="all"||type==="ingredient"){
      const ings=ingredients.filter(i=>i.name.toLowerCase().includes(low)||i.supplier.toLowerCase().includes(low)||i.location.toLowerCase().includes(low)||i.lotNumber.toLowerCase().includes(low));
      if(ings.length>0){
        batches.forEach(b=>{if(!found.some(f=>f.id===b.id))found.push({...b,_type:"ingredient",_ings:ings});});
      }
    }
    setResults(found); setSearched(true);
  };

  const chips=["Chocolate","Released","QA Rejected","Line A","Amul","Punjab Flour","Glucose","Coconut"];

  return (
    <div style={{padding:"28px"}}>
      <h1 style={{margin:"0 0 4px",fontSize:"24px",fontWeight:"800"}}>🔍 Search & Trace</h1>
      <p style={{color:"#64748b",margin:"0 0 24px",fontSize:"13px"}}>Search by batch ID, product, SKU, factory, ingredient name, supplier or lot number</p>

      <div style={{...S.card,marginBottom:"20px"}}>
        <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
          {[["all","🔍 All"],["batch","📦 Batch Only"],["ingredient","🌾 Ingredient/Supplier"]].map(([v,l])=>(
            <button key={v} onClick={()=>setType(v)} style={{...S.btn("ghost"),padding:"7px 14px",fontSize:"13px",background:type===v?"#0f172a":"#f1f5f9",color:type===v?"white":"#475569"}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:"12px"}}>
          <input placeholder={type==="ingredient"?"Ingredient, supplier, lot number...":"Batch ID, product, SKU, factory, status..."} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&run()} style={{...S.input,flex:1}}/>
          <button onClick={run} style={{...S.btn("primary"),padding:"11px 28px"}}>Search</button>
        </div>
        <div style={{display:"flex",gap:"6px",marginTop:"10px",flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:"12px",color:"#94a3b8"}}>Quick:</span>
          {chips.map(c=><span key={c} onClick={()=>setQ(c)} style={{background:"#f1f5f9",padding:"4px 10px",borderRadius:"999px",fontSize:"12px",cursor:"pointer",color:"#475569",fontWeight:"500"}}>{c}</span>)}
        </div>
      </div>

      <div style={S.card}>
        {!searched&&(
          <div style={{textAlign:"center",padding:"56px 24px",color:"#94a3b8"}}>
            <div style={{fontSize:"52px",marginBottom:"16px"}}>🔍</div>
            <div style={{fontWeight:"700",fontSize:"18px",marginBottom:"8px"}}>Search across all data</div>
            <div style={{fontSize:"14px",maxWidth:"380px",margin:"0 auto",lineHeight:"1.6"}}>Search batches by ID, product, SKU, factory — or search by ingredient name, supplier, or lot number</div>
            <div style={{marginTop:"20px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",maxWidth:"360px",margin:"20px auto 0"}}>
              {[["📦","Batches",batches.length],["🌾","Ingredients","8"],["🏪","Locations","6"]].map(([icon,l,v])=>(
                <div key={l} style={{background:"#f8fafc",borderRadius:"10px",padding:"14px",textAlign:"center"}}>
                  <div style={{fontSize:"20px"}}>{icon}</div>
                  <div style={{fontWeight:"700",fontSize:"18px",marginTop:"4px"}}>{v}</div>
                  <div style={{fontSize:"12px",color:"#94a3b8"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {searched&&results.length===0&&(
          <div style={{textAlign:"center",padding:"48px",color:"#94a3b8"}}>
            <div style={{fontSize:"48px"}}>😕</div>
            <div style={{fontWeight:"700",marginTop:"12px",fontSize:"16px"}}>No results for "{q}"</div>
            <div style={{fontSize:"14px",marginTop:"8px"}}>Try a different term or switch the search type above</div>
          </div>
        )}
        {searched&&results.length>0&&<>
          <div style={{fontSize:"13px",color:"#64748b",marginBottom:"16px",fontWeight:"600"}}>{results.length} result{results.length!==1?"s":""} for "{q}"</div>
          {results.map(b=>(
            <div key={b.id} onClick={()=>{setSelected(b.id);setPage("batch-detail");}} style={{padding:"16px",borderBottom:"1px solid #f1f5f9",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:"700",fontSize:"15px"}}>{b.product}</div>
                <div style={{color:"#64748b",fontSize:"13px",marginTop:"2px"}}>{b.id} · {b.factory}</div>
                <div style={{color:"#94a3b8",fontSize:"12px",marginTop:"2px"}}>{b.date} · {b.quantity} {b.unit}{b.line?` · ${b.line}`:""}</div>
                {b._type==="ingredient"&&b._ings&&(
                  <div style={{marginTop:"6px",display:"flex",flexWrap:"wrap",gap:"5px"}}>
                    {b._ings.map(i=><span key={i.id} style={{background:"#fef9c3",color:"#b45309",fontSize:"11px",padding:"2px 8px",borderRadius:"999px",fontWeight:"600"}}>🌾 {i.name} · {i.supplier}</span>)}
                  </div>
                )}
              </div>
              <Badge s={b.status}/>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

// ── Raw Material Manager ─────────────────────────────────────────────────────
function RawMaterialManager() {
  const [list,setList]=useState(ingredients); const [exp,setExp]=useState(null); const [note,setNote]=useState({}); const [sec,setSec]=useState("All");
  const counts={All:list.length,Approved:list.filter(i=>i.status==="Approved").length,"Under Review":list.filter(i=>i.status==="Under Review").length,"Not Received":list.filter(i=>i.receivedStatus==="Not Received").length,Rejected:list.filter(i=>i.status==="Rejected").length};
  const filtered=sec==="All"?list:sec==="Not Received"?list.filter(i=>i.receivedStatus==="Not Received"):list.filter(i=>i.status===sec);
  return (
    <div style={{padding:"28px"}}>
      <div style={{maxWidth:"900px",margin:"0 auto"}}>
        <h1 style={{margin:"0 0 4px",fontSize:"24px",fontWeight:"800"}}>🌾 Raw Material Manager</h1>
        <p style={{color:"#64748b",margin:"0 0 24px",fontSize:"13px"}}>Check incoming materials, verify sources and approve quality</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px"}}>
          {[["Approved","#16a34a"],["Under Review","#ca8a04"],["Not Received","#dc2626"],["Rejected","#7c3aed"]].map(([k,c])=>(
            <div key={k} onClick={()=>setSec(sec===k?"All":k)} style={{...S.stat(c),cursor:"pointer",border:sec===k?`2px solid ${c}`:"1px solid transparent"}}>
              <div style={{color:"#64748b",fontSize:"12px"}}>{k}</div>
              <div style={{fontSize:"28px",fontWeight:"800",color:c}}>{counts[k]}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"8px",marginBottom:"20px"}}>
          {["All","Approved","Under Review","Not Received","Rejected"].map(t=>(
            <button key={t} onClick={()=>setSec(t)} style={{padding:"8px 14px",borderRadius:"10px",border:"none",cursor:"pointer",fontWeight:"600",fontSize:"13px",background:sec===t?"#2563eb":"#f1f5f9",color:sec===t?"white":"#475569"}}>{t} ({counts[t]})</button>
          ))}
        </div>
        <div style={S.card}>
          {filtered.map(ing=>(
            <div key={ing.id} style={{marginBottom:"14px"}}>
              <div style={{padding:"16px",borderRadius:"12px",background:"#f8fafc",border:`2px solid ${ing.status==="Approved"?"#bbf7d0":ing.status==="Rejected"?"#fecaca":ing.receivedStatus==="Not Received"?"#fecaca":"#fef08a"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"10px"}}>
                  <div>
                    <div style={{fontWeight:"700",fontSize:"15px"}}>{ing.name}</div>
                    <div style={{color:"#64748b",fontSize:"12px"}}>🏭 {ing.supplier} · 📍 {ing.location}</div>
                    <div style={{color:"#64748b",fontSize:"12px"}}>🔢 {ing.lotNumber} · {ing.quantity}</div>
                    {ing.reviewReason&&<div style={{marginTop:"6px",background:"#fffbeb",borderRadius:"6px",padding:"6px 10px",fontSize:"12px",color:"#ca8a04"}}>⚠️ {ing.reviewReason}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px",alignItems:"flex-end"}}>
                    <Badge s={ing.status}/>
                    <div style={{display:"flex",gap:"6px"}}>
                      <button onClick={()=>setList(p=>p.map(i=>i.id===ing.id?{...i,receivedStatus:"Received"}:i))} style={{...S.btn("ghost"),padding:"5px 10px",fontSize:"12px",background:ing.receivedStatus==="Received"?"#16a34a":"#e2e8f0",color:ing.receivedStatus==="Received"?"white":"#475569"}}>✓ Received</button>
                      <button onClick={()=>setList(p=>p.map(i=>i.id===ing.id?{...i,receivedStatus:"Not Received"}:i))} style={{...S.btn("ghost"),padding:"5px 10px",fontSize:"12px",background:ing.receivedStatus==="Not Received"?"#dc2626":"#e2e8f0",color:ing.receivedStatus==="Not Received"?"white":"#475569"}}>✗ Not Received</button>
                    </div>
                    {ing.status!=="Approved"&&ing.status!=="Rejected"&&ing.receivedStatus==="Received"&&<button onClick={()=>setExp(exp===ing.id?null:ing.id)} style={{...S.btn("primary"),padding:"7px 14px",fontSize:"12px",width:"100%"}}>🔍 Quality Check ▼</button>}
                  </div>
                </div>
              </div>
              {exp===ing.id&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"12px",padding:"20px",marginTop:"6px"}}>
                <div style={{fontWeight:"700",color:"#1e40af",marginBottom:"12px"}}>🔍 Quality Check — {ing.name}</div>
                <textarea placeholder="Quality notes..." value={note[ing.id]||""} onChange={e=>setNote({...note,[ing.id]:e.target.value})} rows={3} style={{...S.input,marginBottom:"14px",resize:"vertical"}}/>
                <div style={{display:"flex",gap:"10px"}}>
                  <button onClick={()=>{setList(p=>p.map(i=>i.id===ing.id?{...i,status:"Approved"}:i));setExp(null);}} style={{...S.btn("success"),flex:1}}>✅ Approve</button>
                  <button onClick={()=>{setList(p=>p.map(i=>i.id===ing.id?{...i,status:"Rejected",reviewReason:note[ing.id]||"Rejected"}:i));setExp(null);}} style={{...S.btn("danger"),flex:1}}>❌ Reject</button>
                </div>
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Cook Manager ─────────────────────────────────────────────────────────────
function CookManager({ batches }) {
  const [recs,setRecs]=useState({}); const [exp,setExp]=useState(null);
  return (
    <div style={{padding:"28px"}}>
      <div style={{maxWidth:"900px",margin:"0 auto"}}>
        <h1 style={{margin:"0 0 4px",fontSize:"24px",fontWeight:"800"}}>👨‍🍳 Cook Manager</h1>
        <p style={{color:"#64748b",margin:"0 0 24px",fontSize:"13px"}}>Record baking details for each batch</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"24px"}}>
          <Stat label="Total Batches" value={batches.length} color="#2563eb"/>
          <Stat label="Records Done" value={Object.keys(recs).length} color="#16a34a"/>
          <Stat label="Pending" value={batches.length-Object.keys(recs).length} color="#ca8a04"/>
        </div>
        <div style={S.card}>
          <h2 style={{margin:"0 0 20px",fontSize:"16px",fontWeight:"700"}}>🍪 Batch Cook Records</h2>
          {batches.map(b=>{const r=recs[b.id];return(
            <div key={b.id} style={{marginBottom:"14px"}}>
              <div style={{padding:"14px",borderRadius:"12px",background:"#f8fafc",border:`1px solid ${r?"#bbf7d0":"#e2e8f0"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
                  <div><div style={{fontWeight:"700"}}>{b.product}</div><div style={{color:"#64748b",fontSize:"12px"}}>{b.id} · {b.date}</div></div>
                  {r?<span style={S.badge("Approved")}>✅ Done</span>:<button onClick={()=>setExp(exp===b.id?null:b.id)} style={S.btn("primary")}>+ Add Record</button>}
                </div>
                {r&&<div style={{marginTop:"12px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>{[["Oven",r.ovenNumber],["Temp",r.bakingTemp],["Baking",r.bakingTime],["Mixing",r.mixingTime],["Dough",r.doughWeight],["Line",r.lineUsed]].map(([l,v])=><div key={l} style={{background:"white",borderRadius:"8px",padding:"8px 10px"}}><div style={{fontSize:"11px",color:"#94a3b8"}}>{l}</div><div style={{fontWeight:"600",fontSize:"13px"}}>{v}</div></div>)}</div>}
              </div>
              {exp===b.id&&<CookForm batch={b} onSave={d=>{setRecs(p=>({...p,[b.id]:d}));setExp(null);}}/>}
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}
function CookForm({ batch, onSave }) {
  const [f,setF]=useState({ovenNumber:"",bakingTemp:"",bakingTime:"",mixingTime:"",doughWeight:"",lineUsed:batch.line||"",notes:""});
  return (
    <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"12px",padding:"20px",marginTop:"8px"}}>
      <div style={{fontWeight:"700",color:"#1e40af",marginBottom:"16px"}}>👨‍🍳 Cook Record — {batch.product}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
        {[["ovenNumber","Oven Number","Oven 2"],["bakingTemp","Temperature","185°C"],["bakingTime","Baking Time","12 min"],["mixingTime","Mixing Time","8 min"],["doughWeight","Dough Weight","450 kg"],["lineUsed","Line Used","Line A"]].map(([k,l,p])=>(
          <div key={k}><label style={S.lbl}>{l}</label><input value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} placeholder={p} style={S.input}/></div>
        ))}
      </div>
      <button onClick={()=>{if(!f.ovenNumber||!f.bakingTemp){alert("Fill Oven and Temperature");return;}onSave(f);}} style={{...S.btn("success"),width:"100%"}}>✅ Save Cook Record</button>
    </div>
  );
}

// ── General Manager ──────────────────────────────────────────────────────────
function GeneralManager({ setPage, setSelected, batches }) {
  const issues=ingredients.filter(i=>i.status!=="Approved");
  return (
    <div style={{padding:"28px"}}>
      <div style={{maxWidth:"900px",margin:"0 auto"}}>
        <h1 style={{margin:"0 0 4px",fontSize:"24px",fontWeight:"800"}}>👔 General Manager</h1>
        <p style={{color:"#64748b",margin:"0 0 24px",fontSize:"13px"}}>Full operations overview</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px"}}>
          <Stat label="Total Batches" value={batches.length} color="#2563eb"/>
          <Stat label="Released" value={batches.filter(b=>b.status==="Released").length} color="#16a34a"/>
          <Stat label="QA Rejected" value={batches.filter(b=>b.status==="QA Rejected").length} color="#dc2626"/>
          <Stat label="Ingredient Issues" value={issues.length} color="#ca8a04"/>
        </div>
        <div style={{...S.card,marginBottom:"20px"}}>
          <h2 style={{margin:"0 0 14px",fontSize:"16px",fontWeight:"700"}}>🌾 Raw Material Status</h2>
          <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px"}}>
            <div style={{flex:1,background:"#f1f5f9",borderRadius:"999px",height:"10px"}}><div style={{width:`${(ingredients.filter(i=>i.status==="Approved").length/ingredients.length)*100}%`,background:"#16a34a",borderRadius:"999px",height:"10px"}}/></div>
            <span style={{fontSize:"13px",fontWeight:"700",color:"#16a34a"}}>{ingredients.filter(i=>i.status==="Approved").length}/{ingredients.length}</span>
          </div>
          {issues.map(i=><div key={i.id} style={{padding:"10px 14px",background:"#fef2f2",borderRadius:"8px",marginBottom:"6px"}}><div style={{fontWeight:"600",fontSize:"13px"}}>{i.name} — {i.supplier}</div><div style={{fontSize:"12px",color:"#dc2626"}}>{i.status}</div></div>)}
        </div>
        <div style={S.card}>
          <h2 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700"}}>📦 All Batches ({batches.length})</h2>
          {batches.map(b=><div key={b.id} onClick={()=>{setSelected(b.id);setPage("batch-detail");}} style={{padding:"14px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:"600"}}>{b.product}</div><div style={{color:"#64748b",fontSize:"12px"}}>{b.id} · {b.date}</div></div><Badge s={b.status}/></div>)}
        </div>
      </div>
    </div>
  );
}

// ── Dispatch Manager ─────────────────────────────────────────────────────────
function DispatchManager({ batches }) {
  const [disp,setDisp]=useState({}); const [exp,setExp]=useState(null); const [forms,setForms]=useState({});
  const ready=batches.filter(b=>b.status==="Released");
  const upd=(bid,k,v)=>setForms(p=>({...p,[bid]:{...p[bid],[k]:v}}));
  const tog=(bid,s)=>{const cur=forms[bid]?.selectedStores||[];upd(bid,"selectedStores",cur.includes(s)?cur.filter(x=>x!==s):[...cur,s]);};
  return (
    <div style={{padding:"28px"}}>
      <div style={{maxWidth:"900px",margin:"0 auto"}}>
        <h1 style={{margin:"0 0 4px",fontSize:"24px",fontWeight:"800"}}>🚚 Dispatch Manager</h1>
        <p style={{color:"#64748b",margin:"0 0 24px",fontSize:"13px"}}>Manage dispatches across Hyderabad</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"24px"}}>
          <Stat label="Ready to Dispatch" value={ready.length} color="#16a34a"/>
          <Stat label="Dispatched Today" value={Object.keys(disp).length} color="#2563eb"/>
          <Stat label="Locations" value={storeLocations.length} color="#ca8a04"/>
        </div>
        <div style={{...S.card,marginBottom:"20px"}}>
          <h2 style={{margin:"0 0 14px",fontSize:"16px",fontWeight:"700"}}>📍 Delivery Locations</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"8px"}}>{storeLocations.map((s,i)=><div key={i} style={{padding:"10px 14px",background:"#f8fafc",borderRadius:"10px",fontSize:"13px",fontWeight:"500"}}>🏪 {s.name}</div>)}</div>
        </div>
        <div style={S.card}>
          <h2 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700"}}>📦 Ready for Dispatch</h2>
          {ready.length===0&&<div style={{textAlign:"center",padding:"32px",color:"#94a3b8"}}>No batches ready yet</div>}
          {ready.map(b=>{const d=disp[b.id];const f=forms[b.id]||{};return(
            <div key={b.id} style={{marginBottom:"14px"}}>
              <div style={{padding:"14px",borderRadius:"12px",background:"#f8fafc",border:`1px solid ${d?"#bbf7d0":"#e2e8f0"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
                  <div><div style={{fontWeight:"700"}}>{b.product}</div><div style={{color:"#64748b",fontSize:"12px"}}>{b.id} · {b.quantity} {b.unit}</div></div>
                  {d?<span style={S.badge("Released")}>🚚 Dispatched</span>:<button onClick={()=>setExp(exp===b.id?null:b.id)} style={S.btn("primary")}>Dispatch</button>}
                </div>
                {d&&<div style={{marginTop:"10px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>{[["Vehicle",d.vehicle],["Driver",d.driver],["Date",d.date],["Stores",d.selectedStores?.join(", ")]].map(([l,v])=><div key={l} style={{background:"white",borderRadius:"8px",padding:"8px 10px"}}><div style={{fontSize:"11px",color:"#94a3b8"}}>{l}</div><div style={{fontWeight:"600",fontSize:"13px"}}>{v}</div></div>)}</div>}
              </div>
              {exp===b.id&&!d&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"12px",padding:"20px",marginTop:"8px"}}>
                <div style={{fontWeight:"700",color:"#1e40af",marginBottom:"14px"}}>🚚 Dispatch Details</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px"}}>
                  <div><label style={S.lbl}>Vehicle Number *</label><input value={f.vehicle||""} onChange={e=>upd(b.id,"vehicle",e.target.value)} placeholder="TS 09 AB 1234" style={S.input}/></div>
                  <div><label style={S.lbl}>Driver Name *</label><input value={f.driver||""} onChange={e=>upd(b.id,"driver",e.target.value)} placeholder="Ravi Kumar" style={S.input}/></div>
                </div>
                <label style={S.lbl}>Select Delivery Stores *</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 14px"}}>
                  {storeLocations.map((s,i)=>{const sel=f.selectedStores?.includes(s.name);return<div key={i} onClick={()=>tog(b.id,s.name)} style={{padding:"10px",borderRadius:"10px",cursor:"pointer",border:`2px solid ${sel?"#2563eb":"#e2e8f0"}`,background:sel?"#eff6ff":"white",fontSize:"13px",fontWeight:sel?"700":"normal",color:sel?"#2563eb":"#475569"}}>{sel?"✓ ":"○ "}{s.name}</div>;})}
                </div>
                <button onClick={()=>{if(!f.vehicle||!f.driver||!f.selectedStores?.length){alert("Fill all fields");return;}setDisp(p=>({...p,[b.id]:{...f,date:new Date().toLocaleDateString()}}));setExp(null);}} style={{...S.btn("success"),width:"100%"}}>✅ Confirm Dispatch</button>
              </div>}
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

// ── QA Templates ─────────────────────────────────────────────────────────────
function QATemplates() {
  const [sel,setSel]=useState(null);
  return (
    <div style={{padding:"28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
        <div><h1 style={{margin:0,fontSize:"24px",fontWeight:"800"}}>QA Templates</h1><p style={{color:"#64748b",margin:"4px 0 0",fontSize:"13px"}}>Reusable quality assurance checklists</p></div>
        <button style={S.btn("primary")}>+ New Template</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"16px"}}>
        {qaTemplates.map(t=>(
          <div key={t.id} style={S.card}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px"}}>
              <div style={{background:"#eff6ff",borderRadius:"10px",padding:"10px",fontSize:"20px"}}>📋</div>
              <div><div style={{fontWeight:"700",fontSize:"15px"}}>{t.name}</div><div style={{color:"#64748b",fontSize:"12px"}}>{t.category}</div></div>
            </div>
            <div style={{color:"#475569",fontSize:"13px",marginBottom:"12px"}}>{t.items.length} check items</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"14px"}}>
              {t.items.slice(0,3).map(i=><span key={i} style={{background:"#f1f5f9",padding:"4px 10px",borderRadius:"999px",fontSize:"12px",color:"#475569"}}>{i}</span>)}
              {t.items.length>3&&<span style={{background:"#f1f5f9",padding:"4px 10px",borderRadius:"999px",fontSize:"12px",color:"#475569"}}>+{t.items.length-3} more</span>}
            </div>
            <button onClick={()=>setSel(sel===t.id?null:t.id)} style={S.btn("ghost")}>{sel===t.id?"Hide ▲":"View Items ▼"}</button>
            {sel===t.id&&<div style={{marginTop:"14px",borderTop:"1px solid #f1f5f9",paddingTop:"14px"}}>{t.items.map((it,i)=><div key={it} style={{padding:"8px 0",borderBottom:"1px solid #f8fafc",fontSize:"13px",color:"#475569"}}>{i+1}. {it}</div>)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [selected,setSelected]=useState(null);
  const [batches,setBatches]=useState(INITIAL_BATCHES); // ← shared state

  const addBatch=b=>setBatches(prev=>[b,...prev]);

  if(!user) return <Login onLogin={u=>{setUser(u);setPage("dashboard");}}/>;

  const render=()=>{
    switch(page){
      case "dashboard":       return <Dashboard user={user} setPage={setPage} setSelected={setSelected} batches={batches}/>;
      case "batches":         return <Batches setPage={setPage} setSelected={setSelected} batches={batches}/>;
      case "batch-detail":    return <BatchDetail id={selected} setPage={setPage} batches={batches}/>;
      case "new-batch":       return <NewBatch setPage={setPage} onAdd={addBatch} count={batches.length}/>;
      case "raw-material":    return <RawMaterialManager/>;
      case "cook-manager":    return <CookManager batches={batches}/>;
      case "general-manager": return <GeneralManager setPage={setPage} setSelected={setSelected} batches={batches}/>;
      case "dispatch":        return <DispatchManager batches={batches}/>;
      case "search":          return <Search setPage={setPage} setSelected={setSelected} batches={batches}/>;
      case "qa-templates":    return <QATemplates/>;
      default:                return <Dashboard user={user} setPage={setPage} setSelected={setSelected} batches={batches}/>;
    }
  };

  return <div style={S.page}><Navbar user={user} page={page} setPage={setPage} onLogout={()=>{setUser(null);setPage("dashboard");}}/>{render()}</div>;
}
