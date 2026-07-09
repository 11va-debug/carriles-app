import React, { useState, useMemo } from "react";
import {
  Waves, CircleDot, Hand, Users, ShieldCheck, Calendar as CalendarIcon,
  Check, X, Clock, ArrowLeftRight, Upload, LogOut, Plus, Pencil,
  ChevronLeft, ChevronRight, Copy, ClipboardCheck
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS
   Color:  pileta #0B3D4C (fondo/marca) · aqua #2E9CAB (acento primario)
           tiza #F7F5EF (fondo claro) · cancha #E8622C (acento acción)
           carril #F2C230 (highlight/alerta) · pizarra #33414A (texto)
   Type:   Fraunces (display) / Inter (cuerpo) / IBM Plex Mono (datos-horarios)
   Firma:  tabs de deporte como "carriles de pileta" + swoosh de header
------------------------------------------------------------------*/

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const SPORTS = [
  { id: "natacion", name: "Natación", icon: Waves, color: "#2E9CAB" },
  { id: "voley", name: "Vóley", icon: CircleDot, color: "#E8622C" },
  { id: "matro", name: "Matronatación", icon: Waves, color: "#7CB9C9" },
  { id: "handball", name: "Handball", icon: Hand, color: "#F2C230" },
];

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const initialSchedule = [
  { id: 1, sport: "natacion", day: "Lun", time: "17:00", prof: "Marina Sosa", loc: "Pileta 1", cap: 12, enrolled: 10 },
  { id: 2, sport: "natacion", day: "Mié", time: "17:00", prof: "Marina Sosa", loc: "Pileta 1", cap: 12, enrolled: 12 },
  { id: 3, sport: "natacion", day: "Vie", time: "18:00", prof: "Diego Ríos", loc: "Pileta 2", cap: 10, enrolled: 6 },
  { id: 4, sport: "voley", day: "Mar", time: "19:00", prof: "Lucía Fernández", loc: "Cancha A", cap: 16, enrolled: 14 },
  { id: 5, sport: "voley", day: "Jue", time: "19:00", prof: "Lucía Fernández", loc: "Cancha A", cap: 16, enrolled: 15 },
  { id: 6, sport: "matro", day: "Sáb", time: "10:00", prof: "Marina Sosa", loc: "Pileta 1", cap: 8, enrolled: 5 },
  { id: 7, sport: "handball", day: "Lun", time: "18:30", prof: "Tomás Vega", loc: "Cancha B", cap: 14, enrolled: 9 },
  { id: 8, sport: "handball", day: "Jue", time: "18:30", prof: "Tomás Vega", loc: "Cancha B", cap: 14, enrolled: 11 },
];

const initialRequests = [
  { id: 1, student: "Juan Pérez", sport: "natacion", from: "Lun 17:00", to: "Vie 18:00", status: "pendiente" },
  { id: 2, student: "Juan Pérez", sport: "voley", from: "Mar 19:00", to: "Jue 19:00", status: "aprobado" },
];

const initialRoster = {
  1: { students: ["Juan Pérez", "Sofía Díaz", "Nico Alba"], prof: "Marina Sosa" },
  4: { students: ["Juan Pérez", "Carla Ruiz", "Iván Soto"], prof: "Lucía Fernández" },
};

const DEMO_PROFILES = [
  { role: "usuario", label: "Alumno", name: "Juan Pérez", desc: "Ve sus clases y solicitudes", icon: Users, color: "#2E9CAB", user: "alumno", pass: "alumno123" },
  { role: "staff", label: "Recepción / Profesor", name: "Lucía Fernández", desc: "Ve, edita y toma asistencia", icon: ClipboardCheck, color: "#E8622C", user: "recepcion", pass: "recepcion123" },
  { role: "admin", label: "Admin", name: "Diego Parras", desc: "Control total y calendario", icon: ShieldCheck, color: "#0B3D4C", user: "admin", pass: "admin123" },
];

function Badge({ children, tone = "aqua" }) {
  const tones = {
    aqua: "bg-[#E4F2F3] text-[#0B3D4C]",
    orange: "bg-[#FCE7DC] text-[#B4441C]",
    yellow: "bg-[#FDF3D6] text-[#8A6A0A]",
    green: "bg-[#E1F0E3] text-[#2C6E31]",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tones[tone]}`}>
      {children}
    </span>
  );
}

function SportIcon({ id, size = 16, color }) {
  const s = SPORTS.find((x) => x.id === id);
  const Icon = s?.icon || Waves;
  return <Icon size={size} color={color || s?.color} strokeWidth={2.2} />;
}

/* ---------------- LOGIN ---------------- */
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = DEMO_PROFILES.find((p) => p.user === username.trim().toLowerCase() && p.pass === password);
    if (match) {
      setError("");
      onLogin(match);
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  const fillDemo = (p) => {
    setUsername(p.user);
    setPassword(p.pass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#0B3D4C] flex flex-col justify-center px-6 py-12 relative overflow-hidden">
      <style>{FONT_IMPORT}</style>
      {/* lane-line swoosh */}
      <svg className="absolute top-0 left-0 w-full h-40 opacity-20" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path d="M0,60 Q100,20 200,60 T400,60" stroke="#F2C230" strokeWidth="3" fill="none" />
        <path d="M0,75 Q100,35 200,75 T400,75" stroke="#2E9CAB" strokeWidth="3" fill="none" />
      </svg>
      <div className="relative z-10">
        <p className="text-[#F2C230] text-sm font-semibold tracking-widest uppercase" style={{ fontFamily: "Inter" }}>
          Club Escuela Deportiva
        </p>
        <h1 className="text-4xl text-[#F7F5EF] mt-1 mb-1" style={{ fontFamily: "Fraunces", fontWeight: 600 }}>
          Carriles
        </h1>
        <p className="text-[#9FC4CE] mb-6" style={{ fontFamily: "Inter" }}>
          Ingresá con tu usuario y contraseña
        </p>

        <form onSubmit={handleSubmit} className="bg-[#123B4A] border border-[#2E9CAB]/30 rounded-2xl p-4 mb-4">
          <label className="text-[#9FC4CE] text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: "Inter" }}>Usuario</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ej: alumno"
            className="w-full bg-[#0B3D4C] text-[#F7F5EF] border border-[#2E9CAB]/40 rounded-lg px-3 py-2.5 mt-1 mb-3 text-sm outline-none"
            style={{ fontFamily: "Inter" }}
          />
          <label className="text-[#9FC4CE] text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: "Inter" }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#0B3D4C] text-[#F7F5EF] border border-[#2E9CAB]/40 rounded-lg px-3 py-2.5 mt-1 mb-3 text-sm outline-none"
            style={{ fontFamily: "Inter" }}
          />
          {error && <p className="text-[#F2A08C] text-xs mb-3" style={{ fontFamily: "Inter" }}>{error}</p>}
          <button type="submit" className="w-full bg-[#E8622C] text-white font-semibold rounded-lg py-2.5 text-sm" style={{ fontFamily: "Inter" }}>
            Ingresar
          </button>
        </form>

        <p className="text-[#9FC4CE] text-xs font-semibold uppercase tracking-wide mb-2" style={{ fontFamily: "Inter" }}>
          Cuentas de prueba — tocá para autocompletar
        </p>
        <div className="flex flex-col gap-2">
          {DEMO_PROFILES.map((p) => (
            <button
              key={p.role}
              onClick={() => fillDemo(p)}
              className="w-full bg-[#0F2E3A] hover:bg-[#164a5c] border border-[#2E9CAB]/20 rounded-xl p-3 flex items-center gap-3 text-left transition-colors"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: p.color + "22" }}>
                <p.icon size={18} color={p.color} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-[#F7F5EF] font-semibold text-sm" style={{ fontFamily: "Inter" }}>{p.label}</div>
                <div className="text-[#7FA8B3] text-xs" style={{ fontFamily: "IBM Plex Mono" }}>{p.user} / {p.pass}</div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[#5D8A96] text-xs mt-6 text-center" style={{ fontFamily: "Inter" }}>
          Maqueta de demostración — login ficticio, sin autenticación real
        </p>
      </div>
    </div>
  );
}

/* ---------------- SPORT TABS (lane lines) ---------------- */
function SportTabs({ sports, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
      {sports.map((id) => {
        const s = SPORTS.find((x) => x.id === id);
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-colors"
            style={{
              backgroundColor: isActive ? s.color : "#fff",
              borderColor: isActive ? s.color : "#E2E8ED",
              color: isActive ? "#fff" : "#33414A",
            }}
          >
            <SportIcon id={id} size={15} color={isActive ? "#fff" : s.color} />
            <span className="text-sm font-semibold" style={{ fontFamily: "Inter" }}>{s.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- HEADER / SHELL ---------------- */
function Header({ profile, onLogout, title }) {
  return (
    <div className="bg-[#0B3D4C] px-4 pt-6 pb-5 rounded-b-3xl relative overflow-hidden">
      <style>{FONT_IMPORT}</style>
      <svg className="absolute top-0 right-0 w-1/2 h-full opacity-10" viewBox="0 0 200 100" preserveAspectRatio="none">
        <path d="M0,50 Q50,20 100,50 T200,50" stroke="#F2C230" strokeWidth="3" fill="none" />
      </svg>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[#9FC4CE] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "Inter" }}>
            {profile.label}
          </p>
          <h1 className="text-[#F7F5EF] text-xl" style={{ fontFamily: "Fraunces", fontWeight: 600 }}>
            {title}
          </h1>
        </div>
        <button onClick={onLogout} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <LogOut size={16} color="#F7F5EF" />
        </button>
      </div>
      <p className="relative z-10 text-[#F2C230] text-sm mt-2" style={{ fontFamily: "Inter" }}>
        {profile.name}
      </p>
    </div>
  );
}

function BottomNav({ tabs, active, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8ED] px-2 py-2 flex justify-around max-w-md mx-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: active === t.id ? "#E4F2F3" : "transparent" }}
        >
          <t.icon size={20} color={active === t.id ? "#0B3D4C" : "#8A99A3"} strokeWidth={2.1} />
          <span
            className="text-[10px] font-semibold"
            style={{ color: active === t.id ? "#0B3D4C" : "#8A99A3", fontFamily: "Inter" }}
          >
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ---------------- SCHEDULE VIEW ---------------- */
function ScheduleView({ schedule, sport, canEdit, canCreate, onEdit, onCreate }) {
  const items = schedule.filter((s) => s.sport === sport);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ day: "Lun", time: "17:00", prof: "", loc: "", cap: 10 });

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[#33414A] font-semibold" style={{ fontFamily: "Inter" }}>
          Clases de la semana
        </h2>
        {canCreate && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1 text-xs font-semibold text-white bg-[#E8622C] px-3 py-1.5 rounded-full"
          >
            <Plus size={14} /> Nueva
          </button>
        )}
      </div>

      {creating && (
        <div className="bg-white border border-[#E2E8ED] rounded-2xl p-4 mb-3">
          <p className="text-sm font-semibold text-[#33414A] mb-2" style={{ fontFamily: "Inter" }}>Nueva clase</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={draft.day} onChange={(e) => setDraft({ ...draft, day: e.target.value })} className="border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm">
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <input value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} placeholder="Hora" className="border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm" />
            <input value={draft.prof} onChange={(e) => setDraft({ ...draft, prof: e.target.value })} placeholder="Profesor/a" className="border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm col-span-2" />
            <input value={draft.loc} onChange={(e) => setDraft({ ...draft, loc: e.target.value })} placeholder="Lugar" className="border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm" />
            <input type="number" value={draft.cap} onChange={(e) => setDraft({ ...draft, cap: +e.target.value })} placeholder="Cupo" className="border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { onCreate({ ...draft, sport, enrolled: 0 }); setCreating(false); setDraft({ day: "Lun", time: "17:00", prof: "", loc: "", cap: 10 }); }} className="flex-1 bg-[#0B3D4C] text-white text-sm font-semibold rounded-lg py-2">Guardar</button>
            <button onClick={() => setCreating(false)} className="flex-1 bg-[#F1F3F4] text-[#33414A] text-sm font-semibold rounded-lg py-2">Cancelar</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {items.map((it) => (
          <div key={it.id} className="bg-white border border-[#E2E8ED] rounded-2xl p-4">
            {editing === it.id ? (
              <div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input defaultValue={it.time} onBlur={(e) => onEdit(it.id, { time: e.target.value })} className="border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm" />
                  <input defaultValue={it.prof} onBlur={(e) => onEdit(it.id, { prof: e.target.value })} className="border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm" />
                  <input defaultValue={it.loc} onBlur={(e) => onEdit(it.id, { loc: e.target.value })} className="border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm col-span-2" />
                </div>
                <button onClick={() => setEditing(null)} className="text-xs font-semibold text-[#2E9CAB]">Listo</button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone="aqua">{it.day}</Badge>
                    <span className="text-sm font-mono text-[#33414A]" style={{ fontFamily: "IBM Plex Mono" }}>{it.time}</span>
                  </div>
                  <p className="text-[#33414A] font-semibold text-sm" style={{ fontFamily: "Inter" }}>{it.prof}</p>
                  <p className="text-[#8A99A3] text-xs" style={{ fontFamily: "Inter" }}>{it.loc} · {it.enrolled}/{it.cap} cupos</p>
                </div>
                {canEdit && (
                  <button onClick={() => setEditing(it.id)} className="w-8 h-8 rounded-full bg-[#F1F3F4] flex items-center justify-center">
                    <Pencil size={14} color="#33414A" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-[#8A99A3] text-sm text-center py-8" style={{ fontFamily: "Inter" }}>No hay clases cargadas para este deporte.</p>}
      </div>
    </div>
  );
}

/* ---------------- REQUESTS VIEW ---------------- */
function RequestsView({ requests, canManage, onUpdate, onCreate, sport }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ from: "", to: "" });
  const filtered = requests.filter((r) => r.sport === sport);
  const statusTone = { pendiente: "yellow", aprobado: "green", rechazado: "orange" };

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[#33414A] font-semibold" style={{ fontFamily: "Inter" }}>Solicitudes de cambio</h2>
        {!canManage && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-xs font-semibold text-white bg-[#2E9CAB] px-3 py-1.5 rounded-full">
            <ArrowLeftRight size={13} /> Solicitar
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-[#E2E8ED] rounded-2xl p-4 mb-3">
          <input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} placeholder="Horario actual (ej: Lun 17:00)" className="w-full border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm mb-2" />
          <input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} placeholder="Horario deseado (ej: Vie 18:00)" className="w-full border border-[#E2E8ED] rounded-lg px-2 py-1.5 text-sm mb-2" />
          <button
            onClick={() => { if (form.from && form.to) { onCreate({ sport, from: form.from, to: form.to }); setForm({ from: "", to: "" }); setShowForm(false); } }}
            className="w-full bg-[#0B3D4C] text-white text-sm font-semibold rounded-lg py-2"
          >
            Enviar solicitud
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white border border-[#E2E8ED] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[#33414A]" style={{ fontFamily: "Inter" }}>{r.student}</p>
              <Badge tone={statusTone[r.status]}>{r.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#33414A]" style={{ fontFamily: "IBM Plex Mono" }}>
              <span>{r.from}</span> <ArrowLeftRight size={13} color="#8A99A3" /> <span>{r.to}</span>
            </div>
            {canManage && r.status === "pendiente" && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => onUpdate(r.id, "aprobado")} className="flex-1 flex items-center justify-center gap-1 bg-[#E1F0E3] text-[#2C6E31] text-xs font-semibold rounded-lg py-1.5">
                  <Check size={13} /> Aprobar
                </button>
                <button onClick={() => onUpdate(r.id, "rechazado")} className="flex-1 flex items-center justify-center gap-1 bg-[#FCE7DC] text-[#B4441C] text-xs font-semibold rounded-lg py-1.5">
                  <X size={13} /> Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-[#8A99A3] text-sm text-center py-8" style={{ fontFamily: "Inter" }}>Sin solicitudes para este deporte.</p>}
      </div>
    </div>
  );
}

/* ---------------- PAYMENT VIEW (simulada) ---------------- */
function PaymentView() {
  const [uploaded, setUploaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const alias = "escuela.deportes.pagos";

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="text-[#33414A] font-semibold mb-3" style={{ fontFamily: "Inter" }}>Pagos</h2>
      <div className="bg-[#0B3D4C] rounded-2xl p-5 mb-3">
        <p className="text-[#9FC4CE] text-xs uppercase tracking-wide mb-1" style={{ fontFamily: "Inter" }}>Alias para transferencia</p>
        <div className="flex items-center justify-between">
          <span className="text-[#F7F5EF] text-lg" style={{ fontFamily: "IBM Plex Mono" }}>{alias}</span>
          <button
            onClick={() => { navigator.clipboard?.writeText(alias); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Copy size={15} color="#F7F5EF" />
          </button>
        </div>
        {copied && <p className="text-[#F2C230] text-xs mt-2" style={{ fontFamily: "Inter" }}>Alias copiado</p>}
      </div>

      <div className="bg-white border border-[#E2E8ED] rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#33414A] mb-2" style={{ fontFamily: "Inter" }}>Subí tu comprobante</p>
        <p className="text-xs text-[#8A99A3] mb-3" style={{ fontFamily: "Inter" }}>Esta acción es solo demostrativa — no procesa pagos reales.</p>
        {!uploaded ? (
          <button onClick={() => setUploaded(true)} className="w-full border-2 border-dashed border-[#2E9CAB] rounded-xl py-6 flex flex-col items-center gap-2 text-[#2E9CAB]">
            <Upload size={22} />
            <span className="text-sm font-semibold" style={{ fontFamily: "Inter" }}>Toca para simular subida</span>
          </button>
        ) : (
          <div className="bg-[#E1F0E3] rounded-xl py-4 flex flex-col items-center gap-1.5">
            <Check size={20} color="#2C6E31" />
            <span className="text-sm font-semibold text-[#2C6E31]" style={{ fontFamily: "Inter" }}>Comprobante cargado (simulado)</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- ATTENDANCE VIEW ---------------- */
function AttendanceView({ schedule, sport, roster, onToggle }) {
  const items = schedule.filter((s) => s.sport === sport);
  const [selected, setSelected] = useState(items[0]?.id || null);
  const session = items.find((i) => i.id === selected);
  const list = roster[selected];

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="text-[#33414A] font-semibold mb-3" style={{ fontFamily: "Inter" }}>Asistencia</h2>
      <div className="flex gap-2 overflow-x-auto mb-4 -mx-4 px-4">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setSelected(it.id)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: selected === it.id ? "#0B3D4C" : "#fff",
              color: selected === it.id ? "#fff" : "#33414A",
              borderColor: selected === it.id ? "#0B3D4C" : "#E2E8ED",
            }}
          >
            {it.day} {it.time}
          </button>
        ))}
      </div>

      {!list ? (
        <p className="text-[#8A99A3] text-sm text-center py-8" style={{ fontFamily: "Inter" }}>
          No hay nómina cargada para esta clase todavía.
        </p>
      ) : (
        <>
          <div className="bg-white border border-[#E2E8ED] rounded-2xl p-4 mb-3">
            <p className="text-xs uppercase tracking-wide text-[#8A99A3] mb-1" style={{ fontFamily: "Inter" }}>Profesor/a</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#33414A]" style={{ fontFamily: "Inter" }}>{list.prof}</span>
              <button
                onClick={() => onToggle(selected, "prof")}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: list.profPresent ? "#E1F0E3" : "#F1F3F4" }}
              >
                <Check size={15} color={list.profPresent ? "#2C6E31" : "#8A99A3"} />
              </button>
            </div>
          </div>
          <p className="text-xs uppercase tracking-wide text-[#8A99A3] mb-2" style={{ fontFamily: "Inter" }}>Alumnos</p>
          <div className="flex flex-col gap-2">
            {list.students.map((s) => (
              <div key={s} className="bg-white border border-[#E2E8ED] rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-[#33414A]" style={{ fontFamily: "Inter" }}>{s}</span>
                <button
                  onClick={() => onToggle(selected, s)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: list.present?.[s] ? "#E1F0E3" : "#F1F3F4" }}
                >
                  <Check size={15} color={list.present?.[s] ? "#2C6E31" : "#8A99A3"} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- ADMIN CALENDAR DASHBOARD ---------------- */
function CalendarDashboard({ schedule }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const bySport = useMemo(() => {
    const map = {};
    SPORTS.forEach((s) => (map[s.id] = schedule.filter((it) => it.sport === s.id)));
    return map;
  }, [schedule]);

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#33414A] font-semibold" style={{ fontFamily: "Inter" }}>Disponibilidad — Semana</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => setWeekOffset(weekOffset - 1)} className="w-7 h-7 rounded-full bg-[#F1F3F4] flex items-center justify-center">
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-mono text-[#8A99A3] w-6 text-center" style={{ fontFamily: "IBM Plex Mono" }}>{weekOffset === 0 ? "S0" : weekOffset > 0 ? `+${weekOffset}` : weekOffset}</span>
          <button onClick={() => setWeekOffset(weekOffset + 1)} className="w-7 h-7 rounded-full bg-[#F1F3F4] flex items-center justify-center">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1.5 mb-5">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-[#8A99A3] uppercase" style={{ fontFamily: "Inter" }}>{d}</div>
        ))}
      </div>

      {SPORTS.map((s) => (
        <div key={s.id} className="mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <SportIcon id={s.id} size={14} />
            <span className="text-xs font-semibold text-[#33414A]" style={{ fontFamily: "Inter" }}>{s.name}</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {DAYS.map((d) => {
              const cls = bySport[s.id].filter((it) => it.day === d);
              return (
                <div key={d} className="min-h-[52px] bg-[#F7F5EF] rounded-lg p-1 flex flex-col gap-1">
                  {cls.map((c) => {
                    const full = c.enrolled >= c.cap;
                    return (
                      <div
                        key={c.id}
                        className="rounded px-1 py-0.5 text-[9px] leading-tight font-semibold"
                        style={{
                          backgroundColor: full ? "#FCE7DC" : s.color + "22",
                          color: full ? "#B4441C" : "#33414A",
                          fontFamily: "IBM Plex Mono",
                        }}
                        title={`${c.time} · ${c.enrolled}/${c.cap}`}
                      >
                        {c.time}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-[10px] text-[#8A99A3] text-center mt-2" style={{ fontFamily: "Inter" }}>
        Celda naranja = clase completa · celda de color = cupo disponible
      </p>
    </div>
  );
}

/* ---------------- APP ROOT ---------------- */
export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("horarios");
  const [sport, setSport] = useState("natacion");
  const [schedule, setSchedule] = useState(initialSchedule);
  const [requests, setRequests] = useState(initialRequests);
  const [roster, setRoster] = useState(initialRoster);
  const [nextId, setNextId] = useState(100);

  if (!profile) return <Login onLogin={(p) => { setProfile(p); setTab(p.role === "admin" ? "calendario" : "horarios"); }} />;

  const canEdit = profile.role === "staff" || profile.role === "admin";
  const canCreate = profile.role === "admin";
  const canManageReq = profile.role === "staff" || profile.role === "admin";

  const handleEditSchedule = (id, patch) => setSchedule(schedule.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const handleCreateSchedule = (item) => { setSchedule([...schedule, { ...item, id: nextId }]); setNextId(nextId + 1); };
  const handleUpdateRequest = (id, status) => setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
  const handleCreateRequest = (r) => { setRequests([...requests, { ...r, id: nextId, student: profile.name, status: "pendiente" }]); setNextId(nextId + 1); };
  const handleToggleAttendance = (sessionId, who) => {
    setRoster((prev) => {
      const cur = prev[sessionId] || { students: [], present: {} };
      if (who === "prof") return { ...prev, [sessionId]: { ...cur, profPresent: !cur.profPresent } };
      const present = { ...(cur.present || {}), [who]: !cur.present?.[who] };
      return { ...prev, [sessionId]: { ...cur, present } };
    });
  };

  const userTabs =
    profile.role === "usuario"
      ? [
          { id: "horarios", label: "Clases", icon: CalendarIcon },
          { id: "solicitudes", label: "Cambios", icon: ArrowLeftRight },
          { id: "pagos", label: "Pagos", icon: Copy },
        ]
      : profile.role === "staff"
      ? [
          { id: "horarios", label: "Clases", icon: CalendarIcon },
          { id: "solicitudes", label: "Cambios", icon: ArrowLeftRight },
          { id: "asistencia", label: "Asistencia", icon: ClipboardCheck },
        ]
      : [
          { id: "calendario", label: "Calendario", icon: CalendarIcon },
          { id: "horarios", label: "Clases", icon: CalendarIcon },
          { id: "solicitudes", label: "Cambios", icon: ArrowLeftRight },
          { id: "asistencia", label: "Asistencia", icon: ClipboardCheck },
        ];

  const titles = {
    horarios: "Mis clases",
    solicitudes: "Solicitudes",
    pagos: "Pagos",
    asistencia: "Asistencia",
    calendario: "Panel de disponibilidad",
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] max-w-md mx-auto relative">
      <style>{FONT_IMPORT}</style>
      <Header profile={profile} title={titles[tab]} onLogout={() => setProfile(null)} />

      {tab !== "calendario" && (
        <div className="px-4 pt-4">
          <SportTabs sports={SPORTS.map((s) => s.id)} active={sport} onChange={setSport} />
        </div>
      )}

      {tab === "horarios" && (
        <ScheduleView schedule={schedule} sport={sport} canEdit={canEdit} canCreate={canCreate} onEdit={handleEditSchedule} onCreate={handleCreateSchedule} />
      )}
      {tab === "solicitudes" && (
        <RequestsView requests={requests} sport={sport} canManage={canManageReq} onUpdate={handleUpdateRequest} onCreate={handleCreateRequest} />
      )}
      {tab === "pagos" && <PaymentView />}
      {tab === "asistencia" && <AttendanceView schedule={schedule} sport={sport} roster={roster} onToggle={handleToggleAttendance} />}
      {tab === "calendario" && <CalendarDashboard schedule={schedule} />}

      <BottomNav tabs={userTabs} active={tab} onChange={setTab} />
    </div>
  );
}
