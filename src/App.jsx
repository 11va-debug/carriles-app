import React, { useState, useEffect, useRef } from "react";
import {
  Waves, CircleDot, Hand, Users, ShieldCheck, Calendar as CalendarIcon,
  Check, X, ArrowLeftRight, Upload, LogOut, Plus, Pencil,
  Copy, ClipboardCheck, Loader, Bell, FileText, CreditCard,
  Stethoscope, ChevronDown
} from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
`;

const SHEET_BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTA-OFF1wrHuj9AiCTEKZiTeAwOFZvPDsQINttJFRMvXhShcFRTPNmrTAo3lhKtOXWYpFC1Rjr1HcmV/pub";
const URL_USUARIOS    = `${SHEET_BASE}?gid=0&single=true&output=csv`;
const URL_CLASES      = `${SHEET_BASE}?gid=725628139&single=true&output=csv`;
const URL_SOLICITUDES = `${SHEET_BASE}?gid=2029079044&single=true&output=csv`;
const URL_REVISIONES  = `${SHEET_BASE}?gid=1817774281&single=true&output=csv`;
const URL_COMPROBANTES  = `${SHEET_BASE}?gid=324277509&single=true&output=csv`;
const URL_INSCRIPCIONES = `${SHEET_BASE}?gid=491872981&single=true&output=csv`;

const SPORTS = [
  { id: "natacion", name: "Natación",      emoji: "🏊", color: "#2E9CAB", alias: "natacion.carriles.pagos" },
  { id: "voley",    name: "Vóley",         emoji: "🏐", color: "#E8622C", alias: "voley.carriles.pagos"    },
  { id: "matro",    name: "Matronatación", emoji: "🌊", color: "#7CB9C9", alias: "matro.carriles.pagos"    },
  { id: "handball", name: "Handball",      emoji: "🤾", color: "#F2C230", alias: "handball.carriles.pagos" },
];
const DAYS = ["Lun","Mar","Mie","Jue","Vie","Sab"];
const DAY_LABELS = { Lun:"Lun", Mar:"Mar", Mie:"Mié", Jue:"Jue", Vie:"Vie", Sab:"Sáb" };
const HOURS = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];

async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).filter(l => l.trim()).map((line, idx) => {
    const vals = [];
    let cur = "", inQ = false;
    for (const ch of line) {
      if (ch === '"') inQ = !inQ;
      else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    vals.push(cur.trim());
    const obj = { _idx: idx };
    headers.forEach((h, i) => obj[h] = (vals[i] || "").replace(/^"|"$/g, ""));
    return obj;
  });
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  return now;
}

const DIAS_ES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MESES_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function formatDate(d) {
  return `${DIAS_ES[d.getDay()]} ${d.getDate()} de ${MESES_ES[d.getMonth()]} · ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

/* ── BADGE ── */
function Badge({ children, tone = "aqua" }) {
  const tones = { aqua:"background:#E4F2F3;color:#0B3D4C", orange:"background:#FCE7DC;color:#B4441C", yellow:"background:#FDF3D6;color:#8A6A0A", green:"background:#E1F0E3;color:#2C6E31", red:"background:#FCE7DC;color:#B4441C" };
  return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ fontFamily:"Inter", ...(Object.fromEntries(tones[tone].split(";").map(s => { const [k,v] = s.split(":"); return [k.trim(),v?.trim()]; }))) }}>{children}</span>;
}

/* ── LOGIN ── */
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCSV(URL_USUARIOS).then(d => { setUsers(d); setLoading(false); }).catch(() => { setError("No se pudo cargar la base de usuarios."); setLoading(false); });
  }, []);

  const handleLogin = () => {
    const match = users.find(u => u.usuario === username.trim().toLowerCase() && u.password === password);
    if (match) onLogin(match); else setError("Usuario o contraseña incorrectos.");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 relative overflow-hidden" style={{ background:"#0B3D4C" }}>
      <style>{FONT_IMPORT}</style>
      <svg className="absolute top-0 left-0 w-full opacity-20" style={{ height:"100px" }} viewBox="0 0 400 100" preserveAspectRatio="none">
        <path d="M0,60 Q100,20 200,60 T400,60" stroke="#F2C230" strokeWidth="3" fill="none"/>
        <path d="M0,75 Q100,35 200,75 T400,75" stroke="#2E9CAB" strokeWidth="3" fill="none"/>
      </svg>
      <div className="relative z-10 max-w-sm mx-auto w-full">
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color:"#F2C230", fontFamily:"Inter" }}>Club Escuela Deportiva</p>
        <h1 className="text-4xl mb-1" style={{ color:"#F7F5EF", fontFamily:"Fraunces", fontWeight:600 }}>Carriles</h1>
        <p className="text-sm mb-6" style={{ color:"#9FC4CE", fontFamily:"Inter" }}>Ingresá con tu usuario y contraseña</p>
        {loading ? (
          <div className="flex items-center gap-2 justify-center py-8" style={{ color:"#9FC4CE" }}>
            <Loader size={18} className="animate-spin"/> <span style={{ fontFamily:"Inter" }}>Cargando...</span>
          </div>
        ) : (
          <div className="rounded-2xl p-4" style={{ background:"#123B4A", border:"1px solid rgba(46,156,171,0.3)" }}>
            <label className="text-xs font-bold uppercase tracking-wide" style={{ color:"#9FC4CE", fontFamily:"Inter" }}>Usuario</label>
            <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key==="Enter" && handleLogin()} placeholder="tu usuario"
              className="w-full rounded-lg px-3 py-2.5 mt-1 mb-3 text-sm" style={{ background:"#0B3D4C", color:"#F7F5EF", border:"1px solid rgba(46,156,171,0.4)", fontFamily:"Inter", outline:"none" }}/>
            <label className="text-xs font-bold uppercase tracking-wide" style={{ color:"#9FC4CE", fontFamily:"Inter" }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter" && handleLogin()} placeholder="••••••••"
              className="w-full rounded-lg px-3 py-2.5 mt-1 mb-3 text-sm" style={{ background:"#0B3D4C", color:"#F7F5EF", border:"1px solid rgba(46,156,171,0.4)", fontFamily:"Inter", outline:"none" }}/>
            {error && <p className="text-xs mb-3" style={{ color:"#F2A08C", fontFamily:"Inter" }}>{error}</p>}
            <button onClick={handleLogin} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{ background:"#E8622C", border:"none", cursor:"pointer", fontFamily:"Inter" }}>Ingresar</button>
          </div>
        )}
        <p className="text-xs mt-6 text-center" style={{ color:"#5D8A96", fontFamily:"Inter" }}>Maqueta de demostración</p>
      </div>
    </div>
  );
}

/* ── HEADER ── */
function Header({ profile, title, onLogout, notifications, onBell }) {
  const now = useClock();
  const roleLabel = { usuario:"Alumno", secretaria:"Secretaría", admin:"Admin" };
  const pendingCount = notifications.filter(n => n.type === "solicitud" && n.estado === "pendiente").length
    + notifications.filter(n => n.type === "comprobante" && n.estado === "pendiente").length;

  return (
    <div className="px-4 pt-5 pb-4 rounded-b-3xl relative overflow-hidden" style={{ background:"#0B3D4C" }}>
      <style>{FONT_IMPORT}</style>
      <svg className="absolute top-0 right-0 opacity-10" style={{ width:"150px", height:"80px" }} viewBox="0 0 200 100">
        <path d="M0,50 Q50,20 100,50 T200,50" stroke="#F2C230" strokeWidth="3" fill="none"/>
      </svg>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color:"#9FC4CE", fontFamily:"Inter" }}>{roleLabel[profile.rol] || profile.rol}</p>
          <h1 className="text-xl" style={{ color:"#F7F5EF", fontFamily:"Fraunces", fontWeight:600 }}>{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {(profile.rol === "admin" || profile.rol === "secretaria") && (
            <button onClick={onBell} className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background:"rgba(255,255,255,0.1)", border:"none", cursor:"pointer" }}>
              <Bell size={16} color="#F7F5EF"/>
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background:"#E8622C", color:"#fff", fontFamily:"Inter" }}>{pendingCount}</span>
              )}
            </button>
          )}
          <button onClick={onLogout} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background:"rgba(255,255,255,0.1)", border:"none", cursor:"pointer" }}>
            <LogOut size={16} color="#F7F5EF"/>
          </button>
        </div>
      </div>
      <p className="relative z-10 text-sm mt-1" style={{ color:"#F2C230", fontFamily:"Inter" }}>{profile.nombre}</p>
      {profile.rol === "usuario" && (
        <p className="relative z-10 text-xs mt-0.5" style={{ color:"#7FA8B3", fontFamily:"Inter" }}>{formatDate(now)}</p>
      )}
    </div>
  );
}

/* ── NOTIFICATIONS PANEL ── */
function NotificationsPanel({ notifications, onResolve, onClose }) {
  const pending = notifications.filter(n => n.estado === "pendiente");
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background:"rgba(11,61,76,0.6)" }} onClick={onClose}>
      <div className="mt-auto rounded-t-3xl p-4 max-h-[70vh] overflow-y-auto" style={{ background:"#F7F5EF" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color:"#33414A", fontFamily:"Inter" }}>🔔 Notificaciones</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#8A99A3" }}><X size={20}/></button>
        </div>
        {pending.length === 0 && <p className="text-sm text-center py-6" style={{ color:"#8A99A3", fontFamily:"Inter" }}>Sin notificaciones pendientes</p>}
        <div className="flex flex-col gap-2.5">
          {pending.map((n,i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
              <div className="flex items-center gap-2 mb-1">
                {n.type === "solicitud" ? <ArrowLeftRight size={14} color="#2E9CAB"/> : <CreditCard size={14} color="#E8622C"/>}
                <span className="text-xs font-bold uppercase" style={{ color: n.type==="solicitud"?"#2E9CAB":"#E8622C", fontFamily:"Inter" }}>
                  {n.type === "solicitud" ? "Cambio de horario" : "Comprobante de pago"}
                </span>
              </div>
              <p className="text-sm font-semibold" style={{ color:"#33414A", fontFamily:"Inter" }}>{n.usuario}</p>
              <p className="text-xs mb-3" style={{ color:"#8A99A3", fontFamily:"Inter" }}>
                {n.type === "solicitud" ? `${n.desde} → ${n.hasta} · ${n.deporte}` : `${n.deporte} · ${n.fecha}`}
              </p>
              <div className="flex gap-2">
                <button onClick={() => onResolve(n, "aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{ background:"#E1F0E3", color:"#2C6E31", border:"none", cursor:"pointer" }}>✓ Aprobar</button>
                <button onClick={() => onResolve(n, "rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{ background:"#FCE7DC", color:"#B4441C", border:"none", cursor:"pointer" }}>✗ Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SPORT TABS ── */
function SportTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 pt-4" style={{ scrollbarWidth:"none" }}>
      {SPORTS.map(s => {
        const isActive = active === s.id;
        return (
          <button key={s.id} onClick={() => onChange(s.id)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-semibold"
            style={{ background: isActive?s.color:"#fff", borderColor: isActive?s.color:"#E2E8ED", color: isActive?"#fff":"#33414A", cursor:"pointer", fontFamily:"Inter" }}>
            {s.emoji} {s.name}
          </button>
        );
      })}
    </div>
  );
}

/* ── BOTTOM NAV ── */
function BottomNav({ tabs, active, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around px-2 py-2 max-w-2xl mx-auto" style={{ background:"#fff", borderTop:"1px solid #E2E8ED" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
          style={{ background: active===t.id?"#E4F2F3":"transparent", border:"none", cursor:"pointer" }}>
          <t.icon size={20} color={active===t.id?"#0B3D4C":"#8A99A3"} strokeWidth={2.1}/>
          <span className="text-[10px] font-semibold" style={{ color: active===t.id?"#0B3D4C":"#8A99A3", fontFamily:"Inter" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── SCHEDULE ── */
function ScheduleView({ schedule, sport, role, userSports, inscripciones, userName, onEdit, onCreate }) {
  const canEdit   = role==="secretaria"||role==="admin";
  const canCreate = role==="admin";
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ dia:"Lun", hora:"17:00", profesor:"", lugar:"", cupo:10 });

  const myClaseIds = inscripciones.filter(i=>i.usuario===userName).map(i=>String(i.clase_id));
  const items = role==="usuario"
    ? schedule.filter(s => s.deporte===sport && myClaseIds.includes(String(s.id||s._idx)))
    : schedule.filter(s => s.deporte===sport);

  if (role==="usuario" && !userSports.includes(sport)) {
    return (
      <div className="px-4 pt-10 pb-24 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="font-semibold" style={{ color:"#33414A", fontFamily:"Inter" }}>No tenés acceso a este deporte</p>
        <p className="text-sm mt-1" style={{ color:"#8A99A3", fontFamily:"Inter" }}>Consultá en secretaría para inscribirte.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold" style={{ color:"#33414A", fontFamily:"Inter" }}>Clases de la semana</h2>
        {canCreate && <button onClick={() => setCreating(true)} className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-full" style={{ background:"#E8622C", border:"none", cursor:"pointer" }}><Plus size={14}/> Nueva</button>}
      </div>
      {creating && (
        <div className="rounded-2xl p-4 mb-3" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
          <p className="text-sm font-semibold mb-2" style={{ color:"#33414A", fontFamily:"Inter" }}>Nueva clase</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={draft.dia} onChange={e => setDraft({...draft, dia:e.target.value})} className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor:"#E2E8ED" }}>
              {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
            </select>
            <input value={draft.hora} onChange={e => setDraft({...draft, hora:e.target.value})} placeholder="Hora" className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor:"#E2E8ED" }}/>
            <input value={draft.profesor} onChange={e => setDraft({...draft, profesor:e.target.value})} placeholder="Profesor/a" className="border rounded-lg px-2 py-1.5 text-sm col-span-2" style={{ borderColor:"#E2E8ED" }}/>
            <input value={draft.lugar} onChange={e => setDraft({...draft, lugar:e.target.value})} placeholder="Lugar" className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor:"#E2E8ED" }}/>
            <input type="number" value={draft.cupo} onChange={e => setDraft({...draft, cupo:+e.target.value})} placeholder="Cupo" className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor:"#E2E8ED" }}/>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { onCreate({...draft, deporte:sport, inscriptos:0}); setCreating(false); setDraft({dia:"Lun",hora:"17:00",profesor:"",lugar:"",cupo:10}); }}
              className="flex-1 text-white text-sm font-semibold rounded-lg py-2" style={{ background:"#0B3D4C", border:"none", cursor:"pointer" }}>Guardar</button>
            <button onClick={() => setCreating(false)} className="flex-1 text-sm font-semibold rounded-lg py-2" style={{ background:"#F1F3F4", color:"#33414A", border:"none", cursor:"pointer" }}>Cancelar</button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {items.length===0 && <p className="text-sm text-center py-8" style={{ color:"#8A99A3", fontFamily:"Inter" }}>No hay clases para este deporte.</p>}
        {items.map(it => (
          <div key={it.id||it._idx} className="rounded-2xl p-4" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
            {editing===(it.id||it._idx) ? (
              <div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input defaultValue={it.hora} onBlur={e => onEdit(it.id||it._idx,{hora:e.target.value})} className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor:"#E2E8ED" }}/>
                  <input defaultValue={it.profesor} onBlur={e => onEdit(it.id||it._idx,{profesor:e.target.value})} className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor:"#E2E8ED" }}/>
                  <input defaultValue={it.lugar} onBlur={e => onEdit(it.id||it._idx,{lugar:e.target.value})} className="border rounded-lg px-2 py-1.5 text-sm col-span-2" style={{ borderColor:"#E2E8ED" }}/>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(null)} className="text-xs font-semibold" style={{ color:"#2E9CAB", background:"none", border:"none", cursor:"pointer" }}>✓ Listo</button>
                  <button onClick={() => { const idx = schedule.findIndex(s=>(s.id||s._idx)===(it.id||it._idx)); if(idx!==-1){ const ns=[...schedule]; ns.splice(idx,1); onCreate(null, ns); } setEditing(null); }}
                    className="text-xs font-semibold" style={{ color:"#E8622C", background:"none", border:"none", cursor:"pointer" }}>🗑 Eliminar</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background:"#E4F2F3", color:"#0B3D4C" }}>{DAY_LABELS[it.dia]||it.dia}</span>
                    <span className="text-sm" style={{ color:"#33414A", fontFamily:"IBM Plex Mono" }}>{it.hora}</span>
                  </div>
                  <p className="font-semibold text-sm" style={{ color:"#33414A", fontFamily:"Inter" }}>{it.profesor}</p>
                  <p className="text-xs" style={{ color:"#8A99A3", fontFamily:"Inter" }}>{it.lugar}{role!=="usuario" ? ` · ${it.inscriptos}/${it.cupo} cupos`:""}</p>
                </div>
                {canEdit && (
                  <button onClick={() => setEditing(it.id||it._idx)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:"#F1F3F4", border:"none", cursor:"pointer" }}>
                    <Pencil size={14} color="#33414A"/>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── REQUESTS ── */
function RequestsView({ requests, sport, role, userName, onUpdate, onCreate }) {
  const canManage = role==="secretaria"||role==="admin";
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ from:"", to:"" });
  const filtered = requests.filter(r => r.deporte===sport);
  const statusTone = { pendiente:"yellow", aprobado:"green", rechazado:"orange" };

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold" style={{ color:"#33414A", fontFamily:"Inter" }}>Solicitudes de cambio</h2>
        {!canManage && <button onClick={() => setShowForm(!showForm)} className="text-xs font-semibold text-white px-3 py-1.5 rounded-full" style={{ background:"#2E9CAB", border:"none", cursor:"pointer" }}>⇄ Solicitar</button>}
      </div>
      {showForm && (
        <div className="rounded-2xl p-4 mb-3" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
          <input value={form.from} onChange={e => setForm({...form,from:e.target.value})} placeholder="Horario actual (ej: Lun 17:00)" className="w-full border rounded-lg px-2 py-1.5 text-sm mb-2" style={{ borderColor:"#E2E8ED" }}/>
          <input value={form.to} onChange={e => setForm({...form,to:e.target.value})} placeholder="Horario deseado (ej: Vie 18:00)" className="w-full border rounded-lg px-2 py-1.5 text-sm mb-2" style={{ borderColor:"#E2E8ED" }}/>
          <button onClick={() => { if(form.from&&form.to){ onCreate({deporte:sport,desde:form.from,hasta:form.to,usuario:userName}); setForm({from:"",to:""}); setShowForm(false); } }}
            className="w-full text-white text-sm font-semibold rounded-lg py-2" style={{ background:"#0B3D4C", border:"none", cursor:"pointer" }}>Enviar solicitud</button>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {filtered.length===0 && <p className="text-sm text-center py-8" style={{ color:"#8A99A3", fontFamily:"Inter" }}>Sin solicitudes para este deporte.</p>}
        {filtered.map(r => (
          <div key={r.id||r._idx} className="rounded-2xl p-4" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold" style={{ color:"#33414A", fontFamily:"Inter" }}>{r.usuario}</p>
              <Badge tone={statusTone[r.estado]||"aqua"}>{r.estado}</Badge>
            </div>
            <p className="text-sm" style={{ color:"#33414A", fontFamily:"IBM Plex Mono" }}>{r.desde} → {r.hasta}</p>
            {canManage && r.estado==="pendiente" && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => onUpdate(r.id||r._idx,"aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{ background:"#E1F0E3", color:"#2C6E31", border:"none", cursor:"pointer" }}>✓ Aprobar</button>
                <button onClick={() => onUpdate(r.id||r._idx,"rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{ background:"#FCE7DC", color:"#B4441C", border:"none", cursor:"pointer" }}>✗ Rechazar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PAGOS ── */
function PaymentView({ sport, role, comprobantes, onApprove }) {
  const [uploaded, setUploaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const [localComp, setLocalComp] = useState([]);
  const sportData = SPORTS.find(s=>s.id===sport)||SPORTS[0];
  const canManage = role==="secretaria"||role==="admin";
  const allComp = [...comprobantes.filter(c=>c.deporte===sport), ...localComp.filter(c=>c.deporte===sport)];

  const handleFile = (e) => {
    const f = e.target.files[0];
    if(f){ setFileName(f.name); setUploaded(true); setLocalComp(prev=>[...prev,{id:Date.now(),usuario:"yo",deporte:sport,fecha:new Date().toLocaleDateString(),archivo:f.name,estado:"pendiente",_local:true}]); }
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{ color:"#33414A", fontFamily:"Inter" }}>Pagos — {sportData.name}</h2>
      {!canManage && (
        <>
          <div className="rounded-2xl p-5 mb-3" style={{ background:"#0B3D4C" }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color:"#9FC4CE", fontFamily:"Inter" }}>Alias para transferencia</p>
            <div className="flex items-center justify-between">
              <span className="text-base" style={{ color:"#F7F5EF", fontFamily:"IBM Plex Mono" }}>{sportData.alias}</span>
              <button onClick={() => { navigator.clipboard?.writeText(sportData.alias); setCopied(true); setTimeout(()=>setCopied(false),1500); }}
                className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background:"rgba(255,255,255,0.1)", border:"none", cursor:"pointer" }}>
                <Copy size={15} color="#F7F5EF"/>
              </button>
            </div>
            {copied && <p className="text-xs mt-2" style={{ color:"#F2C230", fontFamily:"Inter" }}>✓ Alias copiado</p>}
          </div>
          <div className="rounded-2xl p-5 mb-3" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
            <p className="text-sm font-semibold mb-1" style={{ color:"#33414A", fontFamily:"Inter" }}>Subí tu comprobante</p>
            <p className="text-xs mb-3" style={{ color:"#8A99A3", fontFamily:"Inter" }}>Adjuntá el comprobante de tu transferencia.</p>
            {!uploaded ? (
              <label className="rounded-xl py-6 flex flex-col items-center gap-2 cursor-pointer" style={{ border:"2px dashed #2E9CAB", color:"#2E9CAB", display:"flex" }}>
                <Upload size={22}/><span className="text-sm font-semibold" style={{ fontFamily:"Inter" }}>Seleccioná un archivo</span>
                <input type="file" className="hidden" onChange={handleFile}/>
              </label>
            ) : (
              <div className="rounded-xl py-4 flex flex-col items-center gap-1.5" style={{ background:"#E1F0E3" }}>
                <Check size={20} color="#2C6E31"/>
                <span className="text-sm font-semibold" style={{ color:"#2C6E31", fontFamily:"Inter" }}>Archivo cargado: {fileName}</span>
                <span className="text-xs" style={{ color:"#5A9060", fontFamily:"Inter" }}>Comprobante enviado · pendiente de revisión</span>
              </div>
            )}
          </div>
        </>
      )}
      {canManage && (
        <>
          <h3 className="text-sm font-semibold mb-2" style={{ color:"#33414A", fontFamily:"Inter" }}>Comprobantes recibidos</h3>
          <div className="flex flex-col gap-2.5">
            {allComp.length===0 && <p className="text-sm text-center py-8" style={{ color:"#8A99A3", fontFamily:"Inter" }}>Sin comprobantes para este deporte.</p>}
            {allComp.map(c => (
              <div key={c.id||c._idx} className="rounded-2xl p-4" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold" style={{ color:"#33414A", fontFamily:"Inter" }}>{c.usuario}</p>
                  <Badge tone={c.estado==="aprobado"?"green":c.estado==="rechazado"?"orange":"yellow"}>{c.estado}</Badge>
                </div>
                <p className="text-xs mb-2" style={{ color:"#8A99A3", fontFamily:"Inter" }}>{c.fecha} · {c.archivo}</p>
                {c.estado==="pendiente" && (
                  <div className="flex gap-2">
                    <button onClick={() => onApprove(c.id||c._idx,"aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{ background:"#E1F0E3", color:"#2C6E31", border:"none", cursor:"pointer" }}>✓ Aprobar pago</button>
                    <button onClick={() => onApprove(c.id||c._idx,"rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{ background:"#FCE7DC", color:"#B4441C", border:"none", cursor:"pointer" }}>✗ Rechazar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── ASISTENCIA ── */
function AttendanceView({ schedule, sport }) {
  const sessions = schedule.filter(s=>s.deporte===sport);
  const [selSession, setSelSession] = useState(null);
  const [attendance, setAttendance] = useState({});
  const sel = selSession||(sessions[0]?.id||sessions[0]?._idx);
  const session = sessions.find(s=>(s.id||s._idx)===sel)||sessions[0];
  const mockStudents = ["Juan Pérez","Sofía Díaz","Nico Alba","Carla Ruiz"];
  const toggle = (who) => setAttendance(prev=>({...prev,[sel+"_"+who]:!prev[sel+"_"+who]}));

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{ color:"#33414A", fontFamily:"Inter" }}>Asistencia</h2>
      <div className="flex gap-2 overflow-x-auto mb-4" style={{ scrollbarWidth:"none" }}>
        {sessions.map(s => {
          const id=s.id||s._idx;
          return (
            <button key={id} onClick={() => setSelSession(id)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background:sel===id?"#0B3D4C":"#fff", color:sel===id?"#fff":"#33414A", border:`1px solid ${sel===id?"#0B3D4C":"#E2E8ED"}`, cursor:"pointer" }}>
              {DAY_LABELS[s.dia]||s.dia} {s.hora}
            </button>
          );
        })}
      </div>
      {!session ? <p className="text-sm text-center py-8" style={{ color:"#8A99A3" }}>No hay clases para este deporte.</p> : (
        <>
          <div className="rounded-2xl p-4 mb-3" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
            <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color:"#8A99A3", fontFamily:"Inter" }}>Profesor/a</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color:"#33414A", fontFamily:"Inter" }}>{session.profesor}</span>
              <button onClick={() => toggle("__prof__")} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:attendance[sel+"___prof__"]?"#E1F0E3":"#F1F3F4", border:"none", cursor:"pointer" }}>
                <Check size={15} color={attendance[sel+"___prof__"]?"#2C6E31":"#8A99A3"}/>
              </button>
            </div>
          </div>
          <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color:"#8A99A3", fontFamily:"Inter" }}>Alumnos</p>
          <div className="flex flex-col gap-2">
            {mockStudents.map(s => (
              <div key={s} className="rounded-xl p-3 flex items-center justify-between" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
                <span className="text-sm" style={{ color:"#33414A", fontFamily:"Inter" }}>{s}</span>
                <button onClick={() => toggle(s)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:attendance[sel+"_"+s]?"#E1F0E3":"#F1F3F4", border:"none", cursor:"pointer" }}>
                  <Check size={15} color={attendance[sel+"_"+s]?"#2C6E31":"#8A99A3"}/>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── REVISION MEDICA ── */
function RevisionMedica({ revisiones, role, userName, onUpdate }) {
  const canEdit = role==="secretaria"||role==="admin";
  const [selected, setSelected] = useState(canEdit ? (revisiones[0]?.usuario||"") : userName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  const rev = revisiones.find(r=>r.usuario===selected)||{ usuario:selected, rev1:"", rev2:"", apto:"" };

  const startEdit = () => { setDraft({...rev}); setEditing(true); };
  const saveEdit = () => { onUpdate(draft); setEditing(false); };

  const aptoColor = rev.apto==="si"?"#2C6E31":rev.apto==="no"?"#B4441C":"#8A6A0A";
  const aptoBg    = rev.apto==="si"?"#E1F0E3":rev.apto==="no"?"#FCE7DC":"#FDF3D6";
  const aptoLabel = rev.apto==="si"?"✓ Apto":rev.apto==="no"?"✗ No apto":"Sin definir";

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{ color:"#33414A", fontFamily:"Inter" }}>Revisión Médica</h2>
      {canEdit && (
        <div className="mb-3">
          <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" style={{ borderColor:"#E2E8ED", fontFamily:"Inter" }}>
            {revisiones.map(r => <option key={r.usuario} value={r.usuario}>{r.usuario}</option>)}
          </select>
        </div>
      )}
      <div className="rounded-2xl p-5" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope size={18} color="#2E9CAB"/>
          <span className="font-semibold" style={{ color:"#33414A", fontFamily:"Inter" }}>{selected}</span>
          <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full" style={{ background:aptoBg, color:aptoColor, fontFamily:"Inter" }}>{aptoLabel}</span>
        </div>
        {editing ? (
          <>
            <div className="flex flex-col gap-2 mb-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color:"#8A99A3", fontFamily:"Inter" }}>1ª Revisión (mes)</label>
                <input type="date" value={draft.rev1} onChange={e=>setDraft({...draft,rev1:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{ borderColor:"#E2E8ED" }}/>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color:"#8A99A3", fontFamily:"Inter" }}>2ª Revisión (+15 días)</label>
                <input type="date" value={draft.rev2} onChange={e=>setDraft({...draft,rev2:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{ borderColor:"#E2E8ED" }}/>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color:"#8A99A3", fontFamily:"Inter" }}>Estado</label>
                <select value={draft.apto} onChange={e=>setDraft({...draft,apto:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{ borderColor:"#E2E8ED" }}>
                  <option value="">Sin definir</option>
                  <option value="si">Apto</option>
                  <option value="no">No apto</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveEdit} className="flex-1 text-white text-sm font-semibold rounded-lg py-2" style={{ background:"#0B3D4C", border:"none", cursor:"pointer" }}>Guardar</button>
              <button onClick={() => setEditing(false)} className="flex-1 text-sm font-semibold rounded-lg py-2" style={{ background:"#F1F3F4", color:"#33414A", border:"none", cursor:"pointer" }}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background:"#F7F5EF" }}>
                <div>
                  <p className="text-xs uppercase font-semibold" style={{ color:"#8A99A3", fontFamily:"Inter" }}>1ª Revisión</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color:"#33414A", fontFamily:"IBM Plex Mono" }}>{rev.rev1||"—"}</p>
                </div>
                <span style={{ fontSize:"20px" }}>📋</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background:"#F7F5EF" }}>
                <div>
                  <p className="text-xs uppercase font-semibold" style={{ color:"#8A99A3", fontFamily:"Inter" }}>2ª Revisión</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color:"#33414A", fontFamily:"IBM Plex Mono" }}>{rev.rev2||"—"}</p>
                </div>
                <span style={{ fontSize:"20px" }}>📋</span>
              </div>
            </div>
            {canEdit && <button onClick={startEdit} className="w-full text-sm font-semibold rounded-lg py-2" style={{ background:"#E4F2F3", color:"#0B3D4C", border:"none", cursor:"pointer" }}>✏️ Editar revisión</button>}
          </>
        )}
      </div>
    </div>
  );
}

/* ── ALUMNOS (admin) ── */
function AlumnosView({ schedule, sport, users, inscripciones }) {
  const [view, setView] = useState("clase");
  const sessions = schedule.filter(s=>s.deporte===sport);
  const [selSession, setSelSession] = useState(null);
  const sel = selSession||(sessions[0]?.id||sessions[0]?._idx);

  const sportAlumnos = users.filter(u=>u.rol==="usuario" && u.deportes && u.deportes.split(";").map(s=>s.trim()).includes(sport));

  const alumnosEnClase = inscripciones
    .filter(i=>String(i.clase_id)===String(sel))
    .map(i=>{ const u=users.find(u=>u.usuario===i.usuario); return u?u.nombre:i.usuario; });

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{ color:"#33414A", fontFamily:"Inter" }}>Alumnos inscriptos</h2>
      <div className="flex gap-2 mb-4">
        {["clase","deporte"].map(v=>(
          <button key={v} onClick={()=>setView(v)} className="flex-1 text-sm font-semibold py-2 rounded-xl"
            style={{ background:view===v?"#0B3D4C":"#fff", color:view===v?"#fff":"#33414A", border:`1px solid ${view===v?"#0B3D4C":"#E2E8ED"}`, cursor:"pointer", fontFamily:"Inter" }}>
            {v==="clase"?"Por clase":"Por deporte"}
          </button>
        ))}
      </div>
      {view==="clase" ? (
        <>
          <div className="flex gap-2 overflow-x-auto mb-4" style={{ scrollbarWidth:"none" }}>
            {sessions.map(s=>{const id=s.id||s._idx;return(
              <button key={id} onClick={()=>setSelSession(id)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background:sel===id?"#0B3D4C":"#fff", color:sel===id?"#fff":"#33414A", border:`1px solid ${sel===id?"#0B3D4C":"#E2E8ED"}`, cursor:"pointer" }}>
                {DAY_LABELS[s.dia]||s.dia} {s.hora}
              </button>
            );})}
          </div>
          {alumnosEnClase.length===0
            ? <p className="text-sm text-center py-8" style={{ color:"#8A99A3", fontFamily:"Inter" }}>Sin alumnos inscriptos en esta clase.</p>
            : <div className="flex flex-col gap-2">
                {alumnosEnClase.map(s=>(
                  <div key={s} className="rounded-xl p-3 flex items-center gap-3" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background:"#E4F2F3", color:"#0B3D4C" }}>{s[0]}</div>
                    <span className="text-sm" style={{ color:"#33414A", fontFamily:"Inter" }}>{s}</span>
                  </div>
                ))}
              </div>
          }
        </>
      ) : (
        <div className="flex flex-col gap-2">
          {sportAlumnos.length===0 && mockStudents.map(s=>(
            <div key={s} className="rounded-xl p-3 flex items-center gap-3" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background:"#E4F2F3", color:"#0B3D4C" }}>{s[0]}</div>
              <span className="text-sm" style={{ color:"#33414A", fontFamily:"Inter" }}>{s}</span>
            </div>
          ))}
          {sportAlumnos.map(u=>(
            <div key={u.usuario} className="rounded-xl p-3 flex items-center gap-3" style={{ background:"#fff", border:"1px solid #E2E8ED" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background:"#E4F2F3", color:"#0B3D4C" }}>{u.nombre[0]}</div>
              <span className="text-sm" style={{ color:"#33414A", fontFamily:"Inter" }}>{u.nombre}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── CALENDARIO ADMIN ── */
function CalendarDashboard({ schedule }) {
  const [activeSport, setActiveSport] = useState("natacion");
  const sport = SPORTS.find(s=>s.id===activeSport);
  const items = schedule.filter(s=>s.deporte===activeSport);

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{ color:"#33414A", fontFamily:"Inter" }}>Panel de disponibilidad</h2>
      <div className="flex gap-2 overflow-x-auto mb-4" style={{ scrollbarWidth:"none" }}>
        {SPORTS.map(s=>(
          <button key={s.id} onClick={()=>setActiveSport(s.id)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
            style={{ background:activeSport===s.id?s.color:"#fff", color:activeSport===s.id?"#fff":"#33414A", border:`1px solid ${activeSport===s.id?s.color:"#E2E8ED"}`, cursor:"pointer", fontFamily:"Inter" }}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden text-xs" style={{ border:"1px solid #E2E8ED" }}>
        <div className="grid" style={{ gridTemplateColumns:"56px repeat(6,1fr)", background:"#0B3D4C" }}>
          <div className="p-1.5 text-center" style={{ color:"#9FC4CE", fontFamily:"IBM Plex Mono" }}>Hora</div>
          {DAYS.map(d=><div key={d} className="p-1.5 text-center font-bold" style={{ color:"#9FC4CE", fontFamily:"Inter" }}>{DAY_LABELS[d]}</div>)}
        </div>
        {HOURS.map((hour,i)=>(
          <div key={hour} className="grid" style={{ gridTemplateColumns:"56px repeat(6,1fr)", background:i%2===0?"#fff":"#F7F5EF", borderTop:"1px solid #E2E8ED" }}>
            <div className="p-1.5 text-center" style={{ color:"#8A99A3", fontFamily:"IBM Plex Mono", borderRight:"1px solid #E2E8ED", fontSize:"10px" }}>{hour}</div>
            {DAYS.map(d=>{
              const cls=items.find(it=>it.dia===d&&it.hora===hour);
              return(
                <div key={d} className="p-0.5 min-h-[32px]" style={{ borderRight:"1px solid #E2E8ED" }}>
                  {cls&&(
                    <div className="rounded px-1 py-0.5 leading-tight"
                      style={{ background:+cls.inscriptos>=+cls.cupo?"#FCE7DC":sport.color+"22", color:+cls.inscriptos>=+cls.cupo?"#B4441C":"#33414A", fontFamily:"Inter", fontSize:"9px", fontWeight:600 }}>
                      {cls.profesor?.split(" ")[0]}<br/>
                      <span style={{ fontFamily:"IBM Plex Mono", fontSize:"8px" }}>{cls.inscriptos}/{cls.cupo}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-2" style={{ color:"#8A99A3", fontFamily:"Inter" }}>🟠 completa · color = cupo disponible</p>
    </div>
  );
}

/* ── APP ROOT ── */
export default function App() {
  const [profile, setProfile]         = useState(null);
  const [tab, setTab]                 = useState("horarios");
  const [sport, setSport]             = useState("natacion");
  const [schedule, setSchedule]       = useState([]);
  const [requests, setRequests]       = useState([]);
  const [revisiones, setRevisiones]   = useState([]);
  const [comprobantes, setComprobantes]     = useState([]);
  const [inscripciones, setInscripciones]   = useState([]);
  const [users, setUsers]                   = useState([]);
  const [loading, setLoading]         = useState(false);
  const [showNotif, setShowNotif]     = useState(false);
  const [nextId, setNextId]           = useState(300);

  useEffect(() => {
    if(!profile) return;
    setLoading(true);
    Promise.all([
      fetchCSV(URL_CLASES),
      fetchCSV(URL_SOLICITUDES),
      fetchCSV(URL_REVISIONES),
      fetchCSV(URL_COMPROBANTES),
      fetchCSV(URL_USUARIOS),
      fetchCSV(URL_INSCRIPCIONES),
    ]).then(([cls,reqs,revs,comps,usrs,inscs]) => {
      setSchedule(cls.map(c=>({...c,id:c.id||c._idx,cupo:+c.cupo||10,inscriptos:+c.inscriptos||0})));
      setRequests(reqs.map(r=>({...r,id:r.id||r._idx})));
      setRevisiones(revs);
      setComprobantes(comps.map(c=>({...c,id:c.id||c._idx})));
      setUsers(usrs);
      setInscripciones(inscs);
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, [profile]);

  if(!profile) return <Login onLogin={p=>{setProfile(p);}}/>;

  const role = profile.rol;
  const userSports = profile.deportes ? profile.deportes.split(";").map(s=>s.trim()) : SPORTS.map(s=>s.id);

  const notifications = [
    ...requests.filter(r=>r.estado==="pendiente").map(r=>({...r,type:"solicitud"})),
    ...comprobantes.filter(c=>c.estado==="pendiente").map(c=>({...c,type:"comprobante"})),
  ];

  const handleEditSchedule  = (id,patch) => setSchedule(schedule.map(s=>(s.id||s._idx)===id?{...s,...patch}:s));
  const handleCreateSchedule= (item,newArr) => { if(newArr){setSchedule(newArr);return;} setSchedule([...schedule,{...item,id:nextId}]); setNextId(nextId+1); };
  const handleUpdateRequest = (id,estado) => setRequests(requests.map(r=>(r.id||r._idx)===id?{...r,estado}:r));
  const handleCreateRequest = (r) => { setRequests([...requests,{...r,id:nextId,estado:"pendiente"}]); setNextId(nextId+1); };
  const handleApproveComp   = (id,estado) => setComprobantes(comprobantes.map(c=>(c.id||c._idx)===id?{...c,estado}:c));
  const handleUpdateRev     = (rev) => { const exists=revisiones.find(r=>r.usuario===rev.usuario); if(exists) setRevisiones(revisiones.map(r=>r.usuario===rev.usuario?rev:r)); else setRevisiones([...revisiones,rev]); };
  const handleNotifResolve  = (n,estado) => { if(n.type==="solicitud") handleUpdateRequest(n.id||n._idx,estado); else handleApproveComp(n.id||n._idx,estado); };

  const tabs =
    role==="usuario"
      ? [{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Cambios",icon:ArrowLeftRight},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope}]
    : role==="secretaria"
      ? [{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Cambios",icon:ArrowLeftRight},{id:"asistencia",label:"Asistencia",icon:ClipboardCheck},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope}]
    : [{id:"calendario",label:"Calendario",icon:CalendarIcon},{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"alumnos",label:"Alumnos",icon:Users},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope}];

  const titles = { horarios:"Mis clases", solicitudes:"Solicitudes", pagos:"Pagos", asistencia:"Asistencia", calendario:"Disponibilidad", medica:"Revisión Médica", alumnos:"Alumnos" };

  return (
    <div className="min-h-screen max-w-2xl mx-auto" style={{ background:"#F7F5EF" }}>
      <style>{FONT_IMPORT}</style>
      <Header profile={profile} title={titles[tab]} onLogout={()=>{setProfile(null);setSchedule([]);setRequests([]);}} notifications={notifications} onBell={()=>setShowNotif(true)}/>
      {tab!=="calendario" && <SportTabs active={sport} onChange={setSport}/>}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2" style={{ color:"#8A99A3" }}>
          <Loader size={20} className="animate-spin"/><span style={{ fontFamily:"Inter" }}>Cargando datos...</span>
        </div>
      ) : (
        <>
          {tab==="horarios"    && <ScheduleView schedule={schedule} sport={sport} role={role} userSports={userSports} inscripciones={inscripciones} userName={profile.usuario} onEdit={handleEditSchedule} onCreate={handleCreateSchedule}/>}
          {tab==="solicitudes" && <RequestsView requests={requests} sport={sport} role={role} userName={profile.usuario} onUpdate={handleUpdateRequest} onCreate={handleCreateRequest}/>}
          {tab==="pagos"       && <PaymentView sport={sport} role={role} comprobantes={comprobantes} onApprove={handleApproveComp}/>}
          {tab==="asistencia"  && <AttendanceView schedule={schedule} sport={sport}/>}
          {tab==="calendario"  && <CalendarDashboard schedule={schedule}/>}
          {tab==="medica"      && <RevisionMedica revisiones={revisiones} role={role} userName={profile.usuario} onUpdate={handleUpdateRev}/>}
          {tab==="alumnos"     && <AlumnosView schedule={schedule} sport={sport} users={users} inscripciones={inscripciones}/>}
        </>
      )}
      <BottomNav tabs={tabs} active={tab} onChange={t=>{setTab(t);}}/>
      {showNotif && <NotificationsPanel notifications={notifications} onResolve={handleNotifResolve} onClose={()=>setShowNotif(false)}/>}
    </div>
  );
}
