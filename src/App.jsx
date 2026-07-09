import React, { useState, useEffect, useMemo } from "react";
import {
  Waves, CircleDot, Hand, Users, ShieldCheck, Calendar as CalendarIcon,
  Check, X, ArrowLeftRight, Upload, LogOut, Plus, Pencil,
  ChevronLeft, ChevronRight, Copy, ClipboardCheck, Loader
} from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const SHEET_BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTA-OFF1wrHuj9AiCTEKZiTeAwOFZvPDsQINttJFRMvXhShcFRTPNmrTAo3lhKtOXWYpFC1Rjr1HcmV/pub";
const URL_USUARIOS    = `${SHEET_BASE}?gid=0&single=true&output=csv`;
const URL_CLASES      = `${SHEET_BASE}?gid=725628139&single=true&output=csv`;
const URL_SOLICITUDES = `${SHEET_BASE}?gid=2029079044&single=true&output=csv`;

const SPORTS = [
  { id: "natacion", name: "Natación",      emoji: "🏊", color: "#2E9CAB" },
  { id: "voley",    name: "Vóley",         emoji: "🏐", color: "#E8622C" },
  { id: "matro",    name: "Matronatación", emoji: "🌊", color: "#7CB9C9" },
  { id: "handball", name: "Handball",      emoji: "🤾", color: "#F2C230" },
];
const DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const DAY_LABELS = { Lun:"Lun", Mar:"Mar", Mie:"Mié", Jue:"Jue", Vie:"Vie", Sab:"Sáb" };

async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || "");
    return obj;
  });
}

function Badge({ children, tone = "aqua" }) {
  const tones = {
    aqua:   "bg-[#E4F2F3] text-[#0B3D4C]",
    orange: "bg-[#FCE7DC] text-[#B4441C]",
    yellow: "bg-[#FDF3D6] text-[#8A6A0A]",
    green:  "bg-[#E1F0E3] text-[#2C6E31]",
  };
  return <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tones[tone]}`}>{children}</span>;
}

/* ── LOGIN ── */
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCSV(URL_USUARIOS)
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => { setError("No se pudo cargar la base de usuarios."); setLoading(false); });
  }, []);

  const handleLogin = () => {
    const match = users.find(u => u.usuario === username.trim().toLowerCase() && u.password === password);
    if (match) {
      onLogin(match);
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  const fillDemo = (u) => { setUsername(u.usuario); setPassword(u.password); setError(""); };

  const roleColor = { usuario: "#2E9CAB", staff: "#E8622C", admin: "#0B3D4C" };
  const roleEmoji = { usuario: "👤", staff: "📋", admin: "🛡️" };
  const roleLabel = { usuario: "Alumno", staff: "Recepción / Profesor", admin: "Admin" };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 relative overflow-hidden" style={{ background: "#0B3D4C" }}>
      <style>{FONT_IMPORT}</style>
      <svg className="absolute top-0 left-0 w-full opacity-20" style={{ height: "120px" }} viewBox="0 0 400 100" preserveAspectRatio="none">
        <path d="M0,60 Q100,20 200,60 T400,60" stroke="#F2C230" strokeWidth="3" fill="none" />
        <path d="M0,75 Q100,35 200,75 T400,75" stroke="#2E9CAB" strokeWidth="3" fill="none" />
      </svg>
      <div className="relative z-10 max-w-sm mx-auto w-full">
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#F2C230", fontFamily: "Inter" }}>Club Escuela Deportiva</p>
        <h1 className="text-4xl mb-1" style={{ color: "#F7F5EF", fontFamily: "Fraunces", fontWeight: 600 }}>Carriles</h1>
        <p className="text-sm mb-6" style={{ color: "#9FC4CE", fontFamily: "Inter" }}>Ingresá con tu usuario y contraseña</p>

        {loading ? (
          <div className="flex items-center gap-2 justify-center py-8" style={{ color: "#9FC4CE" }}>
            <Loader size={18} className="animate-spin" /> <span style={{ fontFamily: "Inter" }}>Cargando usuarios...</span>
          </div>
        ) : (
          <>
            <div className="rounded-2xl p-4 mb-4" style={{ background: "#123B4A", border: "1px solid rgba(46,156,171,0.3)" }}>
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "#9FC4CE", fontFamily: "Inter" }}>Usuario</label>
              <input value={username} onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="ej: alumno"
                className="w-full rounded-lg px-3 py-2.5 mt-1 mb-3 text-sm"
                style={{ background: "#0B3D4C", color: "#F7F5EF", border: "1px solid rgba(46,156,171,0.4)", fontFamily: "Inter", outline: "none" }} />
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "#9FC4CE", fontFamily: "Inter" }}>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full rounded-lg px-3 py-2.5 mt-1 mb-3 text-sm"
                style={{ background: "#0B3D4C", color: "#F7F5EF", border: "1px solid rgba(46,156,171,0.4)", fontFamily: "Inter", outline: "none" }} />
              {error && <p className="text-xs mb-3" style={{ color: "#F2A08C", fontFamily: "Inter" }}>{error}</p>}
              <button onClick={handleLogin} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{ background: "#E8622C", border: "none", cursor: "pointer", fontFamily: "Inter" }}>
                Ingresar
              </button>
            </div>

            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#9FC4CE", fontFamily: "Inter" }}>Cuentas de prueba</p>
            <div className="flex flex-col gap-2">
              {users.map(u => (
                <button key={u.usuario} onClick={() => fillDemo(u)}
                  className="w-full rounded-xl p-3 flex items-center gap-3 text-left"
                  style={{ background: "#0F2E3A", border: "1px solid rgba(46,156,171,0.2)", cursor: "pointer" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: (roleColor[u.rol] || "#2E9CAB") + "22" }}>
                    <span style={{ fontSize: "18px" }}>{roleEmoji[u.rol] || "👤"}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "#F7F5EF", fontFamily: "Inter" }}>{roleLabel[u.rol] || u.rol} — {u.nombre}</div>
                    <div className="text-xs" style={{ color: "#7FA8B3", fontFamily: "IBM Plex Mono" }}>{u.usuario} / {u.password}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
        <p className="text-xs mt-6 text-center" style={{ color: "#5D8A96", fontFamily: "Inter" }}>Maqueta de demostración — login ficticio</p>
      </div>
    </div>
  );
}

/* ── HEADER ── */
function Header({ profile, title, onLogout }) {
  const roleLabel = { usuario: "Alumno", staff: "Recepción / Profesor", admin: "Admin" };
  return (
    <div className="px-4 pt-5 pb-4 rounded-b-3xl relative overflow-hidden" style={{ background: "#0B3D4C" }}>
      <style>{FONT_IMPORT}</style>
      <svg className="absolute top-0 right-0 opacity-10" style={{ width: "150px", height: "80px" }} viewBox="0 0 200 100">
        <path d="M0,50 Q50,20 100,50 T200,50" stroke="#F2C230" strokeWidth="3" fill="none" />
      </svg>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9FC4CE", fontFamily: "Inter" }}>{roleLabel[profile.rol] || profile.rol}</p>
          <h1 className="text-xl" style={{ color: "#F7F5EF", fontFamily: "Fraunces", fontWeight: 600 }}>{title}</h1>
        </div>
        <button onClick={onLogout} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer" }}>
          <LogOut size={16} color="#F7F5EF" />
        </button>
      </div>
      <p className="relative z-10 text-sm mt-1" style={{ color: "#F2C230", fontFamily: "Inter" }}>{profile.nombre}</p>
    </div>
  );
}

/* ── SPORT TABS ── */
function SportTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 pt-4" style={{ scrollbarWidth: "none" }}>
      {SPORTS.map(s => {
        const isActive = active === s.id;
        return (
          <button key={s.id} onClick={() => onChange(s.id)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-semibold transition-colors"
            style={{ background: isActive ? s.color : "#fff", borderColor: isActive ? s.color : "#E2E8ED", color: isActive ? "#fff" : "#33414A", cursor: "pointer", fontFamily: "Inter" }}>
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
    <div className="fixed bottom-0 left-0 right-0 flex justify-around px-2 py-2 max-w-2xl mx-auto"
      style={{ background: "#fff", borderTop: "1px solid #E2E8ED" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
          style={{ background: active === t.id ? "#E4F2F3" : "transparent", border: "none", cursor: "pointer" }}>
          <t.icon size={20} color={active === t.id ? "#0B3D4C" : "#8A99A3"} strokeWidth={2.1} />
          <span className="text-[10px] font-semibold" style={{ color: active === t.id ? "#0B3D4C" : "#8A99A3", fontFamily: "Inter" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── SCHEDULE ── */
function ScheduleView({ schedule, sport, role, userSports, onEdit, onCreate }) {
  const canEdit   = role === "staff" || role === "admin";
  const canCreate = role === "admin";
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ day: "Lun", time: "17:00", prof: "", loc: "", cap: 10 });

  const items = schedule.filter(s => s.deporte === sport && (role !== "usuario" || userSports.includes(sport)));

  if (role === "usuario" && !userSports.includes(sport)) {
    return (
      <div className="px-4 pt-6 pb-24 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="font-semibold" style={{ color: "#33414A", fontFamily: "Inter" }}>No tenés acceso a este deporte</p>
        <p className="text-sm mt-1" style={{ color: "#8A99A3", fontFamily: "Inter" }}>Consultá en recepción para inscribirte.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold" style={{ color: "#33414A", fontFamily: "Inter" }}>Clases de la semana</h2>
        {canCreate && (
          <button onClick={() => setCreating(true)} className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-full" style={{ background: "#E8622C", border: "none", cursor: "pointer" }}>
            <Plus size={14} /> Nueva
          </button>
        )}
      </div>

      {creating && (
        <div className="rounded-2xl p-4 mb-3" style={{ background: "#fff", border: "1px solid #E2E8ED" }}>
          <p className="text-sm font-semibold mb-2" style={{ color: "#33414A", fontFamily: "Inter" }}>Nueva clase</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={draft.day} onChange={e => setDraft({ ...draft, day: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "#E2E8ED" }}>
              {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
            </select>
            <input value={draft.time} onChange={e => setDraft({ ...draft, time: e.target.value })} placeholder="Hora" className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "#E2E8ED" }} />
            <input value={draft.prof} onChange={e => setDraft({ ...draft, prof: e.target.value })} placeholder="Profesor/a" className="border rounded-lg px-2 py-1.5 text-sm col-span-2" style={{ borderColor: "#E2E8ED" }} />
            <input value={draft.loc} onChange={e => setDraft({ ...draft, loc: e.target.value })} placeholder="Lugar" className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "#E2E8ED" }} />
            <input type="number" value={draft.cap} onChange={e => setDraft({ ...draft, cap: +e.target.value })} placeholder="Cupo" className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "#E2E8ED" }} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { onCreate({ ...draft, deporte: sport, inscriptos: 0 }); setCreating(false); setDraft({ day: "Lun", time: "17:00", prof: "", loc: "", cap: 10 }); }}
              className="flex-1 text-white text-sm font-semibold rounded-lg py-2" style={{ background: "#0B3D4C", border: "none", cursor: "pointer" }}>Guardar</button>
            <button onClick={() => setCreating(false)} className="flex-1 text-sm font-semibold rounded-lg py-2" style={{ background: "#F1F3F4", color: "#33414A", border: "none", cursor: "pointer" }}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {items.length === 0 && <p className="text-sm text-center py-8" style={{ color: "#8A99A3", fontFamily: "Inter" }}>No hay clases cargadas para este deporte.</p>}
        {items.map(it => (
          <div key={it.id} className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #E2E8ED" }}>
            {editing === it.id ? (
              <div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input defaultValue={it.hora} onBlur={e => onEdit(it.id, { hora: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "#E2E8ED" }} />
                  <input defaultValue={it.profesor} onBlur={e => onEdit(it.id, { profesor: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "#E2E8ED" }} />
                  <input defaultValue={it.lugar} onBlur={e => onEdit(it.id, { lugar: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm col-span-2" style={{ borderColor: "#E2E8ED" }} />
                </div>
                <button onClick={() => setEditing(null)} className="text-xs font-semibold" style={{ color: "#2E9CAB", background: "none", border: "none", cursor: "pointer" }}>✓ Listo</button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#E4F2F3", color: "#0B3D4C" }}>{DAY_LABELS[it.dia] || it.dia}</span>
                    <span className="text-sm" style={{ color: "#33414A", fontFamily: "IBM Plex Mono" }}>{it.hora}</span>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "#33414A", fontFamily: "Inter" }}>{it.profesor}</p>
                  <p className="text-xs" style={{ color: "#8A99A3", fontFamily: "Inter" }}>{it.lugar} · {it.inscriptos}/{it.cupo} cupos</p>
                </div>
                {canEdit && (
                  <button onClick={() => setEditing(it.id)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F1F3F4", border: "none", cursor: "pointer" }}>
                    <Pencil size={14} color="#33414A" />
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
  const canManage = role === "staff" || role === "admin";
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ from: "", to: "" });
  const filtered = requests.filter(r => r.deporte === sport);
  const statusTone = { pendiente: "yellow", aprobado: "green", rechazado: "orange" };

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold" style={{ color: "#33414A", fontFamily: "Inter" }}>Solicitudes de cambio</h2>
        {!canManage && (
          <button onClick={() => setShowForm(!showForm)} className="text-xs font-semibold text-white px-3 py-1.5 rounded-full" style={{ background: "#2E9CAB", border: "none", cursor: "pointer" }}>
            ⇄ Solicitar
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-2xl p-4 mb-3" style={{ background: "#fff", border: "1px solid #E2E8ED" }}>
          <input value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} placeholder="Horario actual (ej: Lun 17:00)" className="w-full border rounded-lg px-2 py-1.5 text-sm mb-2" style={{ borderColor: "#E2E8ED" }} />
          <input value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} placeholder="Horario deseado (ej: Vie 18:00)" className="w-full border rounded-lg px-2 py-1.5 text-sm mb-2" style={{ borderColor: "#E2E8ED" }} />
          <button onClick={() => { if (form.from && form.to) { onCreate({ deporte: sport, desde: form.from, hasta: form.to, usuario: userName }); setForm({ from: "", to: "" }); setShowForm(false); } }}
            className="w-full text-white text-sm font-semibold rounded-lg py-2" style={{ background: "#0B3D4C", border: "none", cursor: "pointer" }}>
            Enviar solicitud
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 && <p className="text-sm text-center py-8" style={{ color: "#8A99A3", fontFamily: "Inter" }}>Sin solicitudes para este deporte.</p>}
        {filtered.map(r => (
          <div key={r.id} className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #E2E8ED" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold" style={{ color: "#33414A", fontFamily: "Inter" }}>{r.usuario}</p>
              <Badge tone={statusTone[r.estado] || "aqua"}>{r.estado}</Badge>
            </div>
            <p className="text-sm" style={{ color: "#33414A", fontFamily: "IBM Plex Mono" }}>{r.desde} → {r.hasta}</p>
            {canManage && r.estado === "pendiente" && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => onUpdate(r.id, "aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{ background: "#E1F0E3", color: "#2C6E31", border: "none", cursor: "pointer" }}>✓ Aprobar</button>
                <button onClick={() => onUpdate(r.id, "rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{ background: "#FCE7DC", color: "#B4441C", border: "none", cursor: "pointer" }}>✗ Rechazar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PAGOS ── */
function PaymentView() {
  const [uploaded, setUploaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const alias = "escuela.deportes.pagos";

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFileName(f.name); setUploaded(true); }
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{ color: "#33414A", fontFamily: "Inter" }}>Pagos</h2>
      <div className="rounded-2xl p-5 mb-3" style={{ background: "#0B3D4C" }}>
        <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "#9FC4CE", fontFamily: "Inter" }}>Alias para transferencia</p>
        <div className="flex items-center justify-between">
          <span className="text-lg" style={{ color: "#F7F5EF", fontFamily: "IBM Plex Mono" }}>{alias}</span>
          <button onClick={() => { navigator.clipboard?.writeText(alias); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer" }}>
            <Copy size={15} color="#F7F5EF" />
          </button>
        </div>
        {copied && <p className="text-xs mt-2" style={{ color: "#F2C230", fontFamily: "Inter" }}>✓ Alias copiado</p>}
      </div>
      <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #E2E8ED" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "#33414A", fontFamily: "Inter" }}>Subí tu comprobante</p>
        <p className="text-xs mb-3" style={{ color: "#8A99A3", fontFamily: "Inter" }}>Adjuntá el comprobante de tu transferencia.</p>
        {!uploaded ? (
          <label className="rounded-xl py-6 flex flex-col items-center gap-2 cursor-pointer" style={{ border: "2px dashed #2E9CAB", color: "#2E9CAB", display: "flex" }}>
            <Upload size={22} />
            <span className="text-sm font-semibold" style={{ fontFamily: "Inter" }}>Seleccioná un archivo</span>
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
        ) : (
          <div className="rounded-xl py-4 flex flex-col items-center gap-1.5" style={{ background: "#E1F0E3" }}>
            <Check size={20} color="#2C6E31" />
            <span className="text-sm font-semibold" style={{ color: "#2C6E31", fontFamily: "Inter" }}>Archivo cargado: {fileName}</span>
            <span className="text-xs" style={{ color: "#5A9060", fontFamily: "Inter" }}>El comprobante fue recibido (simulado)</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── ASISTENCIA ── */
function AttendanceView({ schedule, sport }) {
  const sessions = schedule.filter(s => s.deporte === sport);
  const [selSession, setSelSession] = useState(sessions[0]?.id || null);
  const [attendance, setAttendance] = useState({});

  const mockRoster = {
    prof: sessions.find(s => s.id === selSession)?.profesor || "",
    students: ["Juan Pérez", "Sofía Díaz", "Nico Alba"],
  };

  const toggle = (who) => {
    setAttendance(prev => ({ ...prev, [selSession + "_" + who]: !prev[selSession + "_" + who] }));
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{ color: "#33414A", fontFamily: "Inter" }}>Asistencia</h2>
      <div className="flex gap-2 overflow-x-auto mb-4" style={{ scrollbarWidth: "none" }}>
        {sessions.map(s => (
          <button key={s.id} onClick={() => setSelSession(s.id)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: selSession === s.id ? "#0B3D4C" : "#fff", color: selSession === s.id ? "#fff" : "#33414A", border: `1px solid ${selSession === s.id ? "#0B3D4C" : "#E2E8ED"}`, cursor: "pointer" }}>
            {DAY_LABELS[s.dia] || s.dia} {s.hora}
          </button>
        ))}
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "#8A99A3" }}>No hay clases para este deporte.</p>
      ) : (
        <>
          <div className="rounded-2xl p-4 mb-3" style={{ background: "#fff", border: "1px solid #E2E8ED" }}>
            <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: "#8A99A3", fontFamily: "Inter" }}>Profesor/a</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: "#33414A", fontFamily: "Inter" }}>{mockRoster.prof}</span>
              <button onClick={() => toggle("__prof__")} className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: attendance[selSession + "___prof__"] ? "#E1F0E3" : "#F1F3F4", border: "none", cursor: "pointer" }}>
                <Check size={15} color={attendance[selSession + "___prof__"] ? "#2C6E31" : "#8A99A3"} />
              </button>
            </div>
          </div>
          <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: "#8A99A3", fontFamily: "Inter" }}>Alumnos</p>
          <div className="flex flex-col gap-2">
            {mockRoster.students.map(s => (
              <div key={s} className="rounded-xl p-3 flex items-center justify-between" style={{ background: "#fff", border: "1px solid #E2E8ED" }}>
                <span className="text-sm" style={{ color: "#33414A", fontFamily: "Inter" }}>{s}</span>
                <button onClick={() => toggle(s)} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: attendance[selSession + "_" + s] ? "#E1F0E3" : "#F1F3F4", border: "none", cursor: "pointer" }}>
                  <Check size={15} color={attendance[selSession + "_" + s] ? "#2C6E31" : "#8A99A3"} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── CALENDARIO ADMIN ── */
function CalendarDashboard({ schedule }) {
  const [activeSport, setActiveSport] = useState("natacion");
  const sport = SPORTS.find(s => s.id === activeSport);
  const items = schedule.filter(s => s.deporte === activeSport);

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{ color: "#33414A", fontFamily: "Inter" }}>Panel de disponibilidad</h2>

      {/* Sport filter buttons */}
      <div className="flex gap-2 overflow-x-auto mb-4" style={{ scrollbarWidth: "none" }}>
        {SPORTS.map(s => (
          <button key={s.id} onClick={() => setActiveSport(s.id)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold"
            style={{ background: activeSport === s.id ? s.color : "#fff", color: activeSport === s.id ? "#fff" : "#33414A", border: `1px solid ${activeSport === s.id ? s.color : "#E2E8ED"}`, cursor: "pointer", fontFamily: "Inter" }}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E2E8ED" }}>
        {/* Header row */}
        <div className="grid" style={{ gridTemplateColumns: "80px repeat(6, 1fr)", background: "#0B3D4C" }}>
          <div className="p-2 text-xs font-bold" style={{ color: "#9FC4CE", fontFamily: "Inter" }}>Hora</div>
          {DAYS.map(d => (
            <div key={d} className="p-2 text-center text-xs font-bold" style={{ color: "#9FC4CE", fontFamily: "Inter" }}>{DAY_LABELS[d]}</div>
          ))}
        </div>

        {/* Time slots */}
        {["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"].map((hour, i) => (
          <div key={hour} className="grid" style={{ gridTemplateColumns: "80px repeat(6, 1fr)", background: i % 2 === 0 ? "#fff" : "#F7F5EF", borderTop: "1px solid #E2E8ED" }}>
            <div className="p-2 text-xs font-semibold" style={{ color: "#8A99A3", fontFamily: "IBM Plex Mono", borderRight: "1px solid #E2E8ED" }}>{hour}</div>
            {DAYS.map(d => {
              const cls = items.find(it => it.dia === d && it.hora === hour);
              return (
                <div key={d} className="p-1 min-h-[36px]" style={{ borderRight: "1px solid #E2E8ED" }}>
                  {cls && (
                    <div className="rounded px-1 py-0.5 text-[10px] font-semibold leading-tight"
                      style={{ background: +cls.inscriptos >= +cls.cupo ? "#FCE7DC" : sport.color + "22", color: +cls.inscriptos >= +cls.cupo ? "#B4441C" : "#33414A", fontFamily: "Inter" }}>
                      {cls.profesor?.split(" ")[0]}<br />
                      <span style={{ fontFamily: "IBM Plex Mono", fontSize: "9px" }}>{cls.inscriptos}/{cls.cupo}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-2" style={{ color: "#8A99A3", fontFamily: "Inter" }}>🟠 clase completa · color = cupo disponible</p>
    </div>
  );
}

/* ── APP ROOT ── */
export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("horarios");
  const [sport, setSport] = useState("natacion");
  const [schedule, setSchedule] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextId, setNextId] = useState(200);

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    Promise.all([fetchCSV(URL_CLASES), fetchCSV(URL_SOLICITUDES)])
      .then(([cls, reqs]) => {
        setSchedule(cls.map((c, i) => ({ ...c, id: c.id || i + 1, cupo: +c.cupo || 10, inscriptos: +c.inscriptos || 0 })));
        setRequests(reqs.map((r, i) => ({ ...r, id: r.id || i + 1 })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [profile]);

  if (!profile) return <Login onLogin={p => { setProfile(p); }} />;

  const role = profile.rol;

  // deportes habilitados para el usuario (columna "deportes" en la sheet, ej: "natacion,voley")
  const userSports = profile.deportes
    ? profile.deportes.split(";").map(s => s.trim())
    : SPORTS.map(s => s.id);

  const handleEditSchedule = (id, patch) => setSchedule(schedule.map(s => s.id === id ? { ...s, ...patch } : s));
  const handleCreateSchedule = (item) => { setSchedule([...schedule, { ...item, id: nextId }]); setNextId(nextId + 1); };
  const handleUpdateRequest = (id, estado) => setRequests(requests.map(r => r.id === id ? { ...r, estado } : r));
  const handleCreateRequest = (r) => { setRequests([...requests, { ...r, id: nextId, estado: "pendiente" }]); setNextId(nextId + 1); };

  const tabs =
    role === "usuario"
      ? [{ id: "horarios", label: "Clases", icon: CalendarIcon }, { id: "solicitudes", label: "Cambios", icon: ArrowLeftRight }, { id: "pagos", label: "Pagos", icon: Copy }]
      : role === "staff"
      ? [{ id: "horarios", label: "Clases", icon: CalendarIcon }, { id: "solicitudes", label: "Cambios", icon: ArrowLeftRight }, { id: "asistencia", label: "Asistencia", icon: ClipboardCheck }]
      : [{ id: "calendario", label: "Calendario", icon: CalendarIcon }, { id: "horarios", label: "Clases", icon: CalendarIcon }, { id: "solicitudes", label: "Cambios", icon: ArrowLeftRight }, { id: "asistencia", label: "Asistencia", icon: ClipboardCheck }];

  const titles = { horarios: "Mis clases", solicitudes: "Solicitudes", pagos: "Pagos", asistencia: "Asistencia", calendario: "Disponibilidad" };

  return (
    <div className="min-h-screen max-w-2xl mx-auto" style={{ background: "#F7F5EF" }}>
      <style>{FONT_IMPORT}</style>
      <Header profile={profile} title={titles[tab]} onLogout={() => { setProfile(null); setSchedule([]); setRequests([]); }} />

      {tab !== "calendario" && <SportTabs active={sport} onChange={setSport} />}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2" style={{ color: "#8A99A3" }}>
          <Loader size={20} className="animate-spin" />
          <span style={{ fontFamily: "Inter" }}>Cargando datos...</span>
        </div>
      ) : (
        <>
          {tab === "horarios"    && <ScheduleView schedule={schedule} sport={sport} role={role} userSports={userSports} onEdit={handleEditSchedule} onCreate={handleCreateSchedule} />}
          {tab === "solicitudes" && <RequestsView requests={requests} sport={sport} role={role} userName={profile.usuario} onUpdate={handleUpdateRequest} onCreate={handleCreateRequest} />}
          {tab === "pagos"       && <PaymentView />}
          {tab === "asistencia"  && <AttendanceView schedule={schedule} sport={sport} />}
          {tab === "calendario"  && <CalendarDashboard schedule={schedule} />}
        </>
      )}

      <BottomNav tabs={tabs} active={tab} onChange={t => { setTab(t); if (t === "calendario") setSport("natacion"); }} />
    </div>
  );
}
