import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import {
  Calendar as CalendarIcon, Check, X, ArrowLeftRight, Upload, LogOut,
  Plus, Pencil, Copy, ClipboardCheck, Loader, Bell, CreditCard,
  Stethoscope, Users, FileText, Clock, Eye, EyeOff, ShieldCheck, User
} from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
`;

const SPORTS = [
  { id:"natacion", name:"Natación",      emoji:"🏊", color:"#2E9CAB", alias:"natacion.carriles.pagos" },
  { id:"voley",    name:"Vóley",         emoji:"🏐", color:"#E8622C", alias:"voley.carriles.pagos"    },
  { id:"matro",    name:"Matronatación", emoji:"🌊", color:"#7CB9C9", alias:"matro.carriles.pagos"    },
  { id:"handball", name:"Handball",      emoji:"🤾", color:"#F2C230", alias:"handball.carriles.pagos" },
];
const DAYS      = ["Lun","Mar","Mie","Jue","Vie","Sab"];
const DAY_LABELS= { Lun:"Lun",Mar:"Mar",Mie:"Mié",Jue:"Jue",Vie:"Vie",Sab:"Sáb" };
const HOURS     = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const DIAS_ES   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MESES_ES  = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const MESES_LABEL=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function calcEdad(fechaNac) {
  if (!fechaNac) return null;
  const hoy = new Date();
  const nac = new Date(fechaNac);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

function nextDateForDay(dayName) {
  const now=new Date(), todayDow=now.getDay();
  const targetDow={Lun:1,Mar:2,Mie:3,Jue:4,Vie:5,Sab:6}[dayName]||1;
  let diff=targetDow-todayDow; if(diff<0)diff+=7;
  const d=new Date(now); d.setDate(now.getDate()+diff); return d;
}
function formatShortDate(d){ return `${DIAS_ES[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`; }
function useClock(){ const [now,setNow]=useState(new Date()); useEffect(()=>{const t=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(t);},[]);return now; }

function Badge({children,tone="aqua"}){
  const s={aqua:{background:"#E4F2F3",color:"#0B3D4C"},orange:{background:"#FCE7DC",color:"#B4441C"},yellow:{background:"#FDF3D6",color:"#8A6A0A"},green:{background:"#E1F0E3",color:"#2C6E31"}};
  return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{fontFamily:"Inter",...(s[tone]||s.aqua)}}>{children}</span>;
}

/* ── LOGIN ── */
function Login({onLogin}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const handleLogin=async()=>{
    setLoading(true); setError("");
    const {data,error:authErr}=await supabase.auth.signInWithPassword({email,password});
    if(authErr){setError("Email o contraseña incorrectos.");setLoading(false);return;}
    const {data:userData,error:dbErr}=await supabase.from("usuarios").select("*").eq("id",data.user.id).single();
    if(dbErr||!userData){setError("No se encontró el perfil.");setLoading(false);return;}
    onLogin(userData);
    setLoading(false);
  };

  return(
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 relative overflow-hidden" style={{background:"#0B3D4C"}}>
      <style>{FONT_IMPORT}</style>
      <svg className="absolute top-0 left-0 w-full opacity-20" style={{height:"100px"}} viewBox="0 0 400 100" preserveAspectRatio="none">
        <path d="M0,60 Q100,20 200,60 T400,60" stroke="#F2C230" strokeWidth="3" fill="none"/>
        <path d="M0,75 Q100,35 200,75 T400,75" stroke="#2E9CAB" strokeWidth="3" fill="none"/>
      </svg>
      <div className="relative z-10 max-w-sm mx-auto w-full">
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color:"#F2C230",fontFamily:"Inter"}}>Club Escuela Deportiva</p>
        <h1 className="text-4xl mb-1" style={{color:"#F7F5EF",fontFamily:"Fraunces",fontWeight:600}}>Carriles</h1>
        <p className="text-sm mb-6" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Ingresá con tu email y contraseña</p>
        <div className="rounded-2xl p-4" style={{background:"#123B4A",border:"1px solid rgba(46,156,171,0.3)"}}>
          <label className="text-xs font-bold uppercase tracking-wide" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="tu@email.com"
            className="w-full rounded-lg px-3 py-2.5 mt-1 mb-3 text-sm" style={{background:"#0B3D4C",color:"#F7F5EF",border:"1px solid rgba(46,156,171,0.4)",fontFamily:"Inter",outline:"none"}}/>
          <label className="text-xs font-bold uppercase tracking-wide" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••"
            className="w-full rounded-lg px-3 py-2.5 mt-1 mb-3 text-sm" style={{background:"#0B3D4C",color:"#F7F5EF",border:"1px solid rgba(46,156,171,0.4)",fontFamily:"Inter",outline:"none"}}/>
          {error&&<p className="text-xs mb-3" style={{color:"#F2A08C",fontFamily:"Inter"}}>{error}</p>}
          <button onClick={handleLogin} disabled={loading} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{background:"#E8622C",border:"none",cursor:"pointer",fontFamily:"Inter"}}>
            {loading?"Ingresando...":"Ingresar"}
          </button>
        </div>
        <p className="text-xs mt-6 text-center" style={{color:"#5D8A96",fontFamily:"Inter"}}>Diplomatura IA FCE-UBA 2026</p>
      </div>
    </div>
  );
}

/* ── CREAR USUARIO (Admin) ── */
function CrearUsuario({onBack}){
  const [form,setForm]=useState({nombre:"",email:"",password:"12345678",rol:"usuario",deportes:[],dni:"",fecha_nacimiento:"",sexo:"",apellido:""});
  const [showPass,setShowPass]=useState(false);
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);
  const opDep=["natacion","voley","handball","matro"];

  const toggleDep=(d)=>setForm(prev=>({...prev,deportes:prev.deportes.includes(d)?prev.deportes.filter(x=>x!==d):[...prev.deportes,d]}));

  const crear=async()=>{
    if(!form.email||!form.nombre){setMsg("Nombre y email son obligatorios.");return;}
    setLoading(true); setMsg("Procesando...");
    const {data,error:authErr}=await supabase.auth.signUp({email:form.email,password:form.password});
    if(authErr){setMsg("Error Auth: "+authErr.message);setLoading(false);return;}
    const deportesFinales = (form.rol==="staff"||form.rol==="admin")
      ? SPORTS.map(s=>s.id).join(";")
      : form.deportes.join(";");
    const {error:dbErr}=await supabase.from("usuarios").insert([{
      id:data.user.id, usuario:form.email, rol:form.rol,
      nombre:form.nombre, apellido:form.apellido,
      deportes:deportesFinales,
      dni:form.dni, fecha_nacimiento:form.fecha_nacimiento||null, sexo:form.sexo,
    }]);
    if(dbErr){setMsg("Error DB: "+dbErr.message);}
    else{setMsg(`✓ Usuario creado: ${form.nombre}`); setForm({nombre:"",email:"",password:"12345678",rol:"usuario",deportes:[],dni:"",fecha_nacimiento:"",sexo:"",apellido:""});}
    setLoading(false);
  };

  return(
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#2E9CAB",fontFamily:"Inter",fontSize:"14px"}}>← Volver</button>
        <h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Crear usuario</h2>
      </div>
      <div className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
        <div className="flex flex-col gap-3">
          {[["Nombre","nombre","text","Nombre"],["Apellido","apellido","text","Apellido"],["Email","email","email","email@ejemplo.com"],["DNI","dni","text","12345678"]].map(([label,key,type,ph])=>(
            <div key={key}>
              <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{label}</label>
              <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/>
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Fecha de nacimiento</label>
            <input type="date" value={form.fecha_nacimiento} onChange={e=>setForm({...form,fecha_nacimiento:e.target.value})}
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/>
            {form.fecha_nacimiento&&<p className="text-xs mt-1" style={{color:"#2E9CAB",fontFamily:"Inter"}}>Edad: {calcEdad(form.fecha_nacimiento)} años</p>}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sexo</label>
            <select value={form.sexo} onChange={e=>setForm({...form,sexo:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}>
              <option value="">Sin especificar</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="X">No binario</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Contraseña</label>
            <div className="relative mt-1">
              <input type={showPass?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                className="w-full border rounded-lg px-3 py-2 text-sm pr-10" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:"8px",top:"8px",background:"none",border:"none",cursor:"pointer"}}>
                {showPass?<EyeOff size={16} color="#8A99A3"/>:<Eye size={16} color="#8A99A3"/>}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Rol</label>
            <select value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}>
              <option value="usuario">Alumno</option><option value="profesor">Profesor</option><option value="staff">Secretaría</option><option value="admin">Admin</option>
            </select>
          </div>
          {form.rol!=="staff"&&form.rol!=="admin"&&(
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{color:"#8A99A3",fontFamily:"Inter"}}>Deportes</label>
            <div className="grid grid-cols-2 gap-2">
              {opDep.map(d=>{const s=SPORTS.find(sp=>sp.id===d);return(
                <button key={d} type="button" onClick={()=>toggleDep(d)}
                  className="p-2 rounded-xl text-sm font-semibold"
                  style={{background:form.deportes.includes(d)?s?.color:"#F1F3F4",color:form.deportes.includes(d)?"#fff":"#33414A",border:"none",cursor:"pointer",fontFamily:"Inter"}}>
                  {s?.emoji} {s?.name}
                </button>
              );})}
            </div>
          </div>
          )}
          <button onClick={crear} disabled={loading} className="w-full text-white text-sm font-semibold rounded-lg py-2.5" style={{background:"#0B3D4C",border:"none",cursor:"pointer",fontFamily:"Inter"}}>
            {loading?"Creando...":"Crear usuario"}
          </button>
        </div>
        {msg&&<p className="mt-3 p-2 text-sm rounded-lg" style={{background:"#E4F2F3",color:"#0B3D4C",fontFamily:"Inter"}}>{msg}</p>}
      </div>
    </div>
  );
}

/* ── EDITAR ALUMNO (Admin/Secretaria) ── */
function EditarAlumno({alumno,onSave,onBack}){
  const [form,setForm]=useState({
    nombre:alumno.nombre||"", apellido:alumno.apellido||"",
    dni:alumno.dni||"", fecha_nacimiento:alumno.fecha_nacimiento||"",
    sexo:alumno.sexo||"", deportes:alumno.deportes?alumno.deportes.split(";"):[], rol:alumno.rol||"usuario",
  });
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const opDep=["natacion","voley","handball","matro"];
  const toggleDep=(d)=>setForm(prev=>({...prev,deportes:prev.deportes.includes(d)?prev.deportes.filter(x=>x!==d):[...prev.deportes,d]}));

  const save=async()=>{
    setSaving(true);
    const {error}=await supabase.from("usuarios").update({
      nombre:form.nombre, apellido:form.apellido, dni:form.dni,
      fecha_nacimiento:form.fecha_nacimiento||null, sexo:form.sexo,
      deportes:form.deportes.join(";"), rol:form.rol,
    }).eq("id",alumno.id);
    if(error)setMsg("Error: "+error.message);
    else{setMsg("✓ Guardado"); onSave({...alumno,...form,deportes:form.deportes.join(";")});}
    setSaving(false);
  };

  return(
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#2E9CAB",fontFamily:"Inter",fontSize:"14px"}}>← Volver</button>
        <h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Editar alumno</h2>
      </div>
      <div className="rounded-2xl p-3 mb-3 flex items-center gap-3" style={{background:"#E4F2F3",border:"1px solid #2E9CAB22"}}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{background:"#2E9CAB22",color:"#0B3D4C"}}>@</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Usuario de login</p>
          <p className="text-sm font-semibold" style={{color:"#0B3D4C",fontFamily:"IBM Plex Mono"}}>{alumno.usuario}</p>
        </div>
      </div>
      <div className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
        <div className="flex flex-col gap-3">
          {[["Nombre","nombre"],["Apellido","apellido"],["DNI","dni"]].map(([label,key])=>(
            <div key={key}>
              <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{label}</label>
              <input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/>
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Fecha de nacimiento</label>
            <input type="date" value={form.fecha_nacimiento} onChange={e=>setForm({...form,fecha_nacimiento:e.target.value})}
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/>
            {form.fecha_nacimiento&&<p className="text-xs mt-1" style={{color:"#2E9CAB",fontFamily:"Inter"}}>Edad: {calcEdad(form.fecha_nacimiento)} años</p>}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sexo</label>
            <select value={form.sexo} onChange={e=>setForm({...form,sexo:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}>
              <option value="">Sin especificar</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="X">No binario</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Rol</label>
            <select value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}>
              <option value="usuario">Alumno</option><option value="profesor">Profesor</option><option value="staff">Secretaría</option><option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{color:"#8A99A3",fontFamily:"Inter"}}>Deportes asignados</label>
            <div className="grid grid-cols-2 gap-2">
              {opDep.map(d=>{const s=SPORTS.find(sp=>sp.id===d);return(
                <button key={d} type="button" onClick={()=>toggleDep(d)}
                  className="p-2 rounded-xl text-sm font-semibold"
                  style={{background:form.deportes.includes(d)?s?.color:"#F1F3F4",color:form.deportes.includes(d)?"#fff":"#33414A",border:"none",cursor:"pointer",fontFamily:"Inter"}}>
                  {s?.emoji} {s?.name}
                </button>
              );})}
            </div>
          </div>
          <button onClick={save} disabled={saving} className="w-full text-white text-sm font-semibold rounded-lg py-2.5" style={{background:"#0B3D4C",border:"none",cursor:"pointer",fontFamily:"Inter"}}>
            {saving?"Guardando...":"Guardar cambios"}
          </button>
          <div className="mt-3 pt-3" style={{borderTop:"1px solid #E2E8ED"}}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>Contraseña</p>
            <button onClick={async()=>{
              const {error}=await supabase.auth.resetPasswordForEmail(alumno.usuario,{redirectTo:window.location.origin});
              if(error)setMsg("Error: "+error.message);
              else setMsg("✓ Email de restablecimiento enviado a "+alumno.usuario);
            }} className="w-full text-sm font-semibold rounded-lg py-2.5" style={{background:"#FDF3D6",color:"#8A6A0A",border:"1px solid #F2C230",cursor:"pointer",fontFamily:"Inter"}}>
              🔑 Enviar email para restablecer contraseña
            </button>
            <p className="text-xs mt-1.5" style={{color:"#8A99A3",fontFamily:"Inter"}}>El alumno recibirá un link de un solo uso para elegir una nueva contraseña.</p>
          </div>
        </div>
        {msg&&<p className="mt-3 p-2 text-sm rounded-lg" style={{background:"#E4F2F3",color:"#0B3D4C",fontFamily:"Inter"}}>{msg}</p>}
      </div>
    </div>
  );
}

/* ── PERFIL ── */
function PerfilView({profile,users,setUsers,role}){
  const canEdit=role==="staff"||role==="admin";
  const [editing,setEditing]=useState(false);
  const fullUser=users.find(u=>u.id===profile.id)||profile;
  const [form,setForm]=useState({nombre:fullUser.nombre||"",apellido:fullUser.apellido||"",dni:fullUser.dni||"",fecha_nacimiento:fullUser.fecha_nacimiento||"",sexo:fullUser.sexo||""});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");

  const save=async()=>{
    setSaving(true);
    const {error}=await supabase.from("usuarios").update({...form,fecha_nacimiento:form.fecha_nacimiento||null}).eq("id",profile.id);
    if(error)setMsg("Error: "+error.message);
    else{setMsg("✓ Perfil actualizado"); setUsers(prev=>prev.map(u=>u.id===profile.id?{...u,...form}:u)); setEditing(false);}
    setSaving(false);
  };

  const edad=calcEdad(fullUser.fecha_nacimiento);
  const sexoLabel={M:"Masculino",F:"Femenino",X:"No binario"};
  const roleLabel={usuario:"Alumno",profesor:"Profesor",staff:"Secretaría",admin:"Admin"};

  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>Mi perfil</h2>
      <div className="rounded-2xl p-5 mb-3" style={{background:"#0B3D4C"}}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-3 mx-auto" style={{background:"rgba(255,255,255,0.15)",color:"#F7F5EF",fontFamily:"Fraunces"}}>
          {(fullUser.nombre||"?")[0]}
        </div>
        <p className="text-center font-semibold text-lg" style={{color:"#F7F5EF",fontFamily:"Fraunces"}}>{fullUser.nombre} {fullUser.apellido}</p>
        <p className="text-center text-sm" style={{color:"#9FC4CE",fontFamily:"Inter"}}>{fullUser.usuario}</p>
        <div className="flex justify-center mt-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{background:"rgba(242,194,48,0.2)",color:"#F2C230",fontFamily:"Inter"}}>{roleLabel[fullUser.rol]||fullUser.rol}</span>
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
        {editing?(
          <div className="flex flex-col gap-3">
            {[["Nombre","nombre"],["Apellido","apellido"],["DNI","dni"]].map(([label,key])=>(
              <div key={key}>
                <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{label}</label>
                <input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/>
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Fecha de nacimiento</label>
              <input type="date" value={form.fecha_nacimiento} onChange={e=>setForm({...form,fecha_nacimiento:e.target.value})}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/>
              {form.fecha_nacimiento&&<p className="text-xs mt-1" style={{color:"#2E9CAB",fontFamily:"Inter"}}>Edad: {calcEdad(form.fecha_nacimiento)} años</p>}
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sexo</label>
              <select value={form.sexo} onChange={e=>setForm({...form,sexo:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}>
                <option value="">Sin especificar</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="X">No binario</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold rounded-lg py-2" style={{background:"#0B3D4C",border:"none",cursor:"pointer"}}>{saving?"Guardando...":"Guardar"}</button>
              <button onClick={()=>setEditing(false)} className="flex-1 text-sm font-semibold rounded-lg py-2" style={{background:"#F1F3F4",color:"#33414A",border:"none",cursor:"pointer"}}>Cancelar</button>
            </div>
            {msg&&<p className="text-xs p-2 rounded-lg" style={{background:"#E4F2F3",color:"#0B3D4C",fontFamily:"Inter"}}>{msg}</p>}
          </div>
        ):(
          <>
            <div className="flex flex-col gap-3">
              {[
                ["Nombre completo",`${fullUser.nombre||""} ${fullUser.apellido||""}`.trim()],
                ["DNI",fullUser.dni||"—"],
                ["Fecha de nacimiento",fullUser.fecha_nacimiento||"—"],
                ["Edad",edad?`${edad} años`:"—"],
                ["Sexo",sexoLabel[fullUser.sexo]||"—"],
                ["Email",fullUser.usuario||"—"],
              ].map(([label,val])=>(
                <div key={label} className="flex items-center justify-between p-3 rounded-xl" style={{background:"#F7F5EF"}}>
                  <p className="text-xs uppercase font-semibold" style={{color:"#8A99A3",fontFamily:"Inter"}}>{label}</p>
                  <p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{val}</p>
                </div>
              ))}
              {fullUser.deportes&&(
                <div className="flex flex-wrap gap-2 mt-1">
                  {fullUser.deportes.split(";").map(d=>{const s=SPORTS.find(sp=>sp.id===d.trim());return s?(<span key={d} className="text-xs font-semibold px-2 py-1 rounded-full" style={{background:s.color+"22",color:s.color,fontFamily:"Inter"}}>{s.emoji} {s.name}</span>):null;})}
                </div>
              )}
            </div>
            {canEdit&&<button onClick={()=>setEditing(true)} className="w-full text-sm font-semibold rounded-lg py-2 mt-4" style={{background:"#E4F2F3",color:"#0B3D4C",border:"none",cursor:"pointer"}}>✏️ Editar perfil</button>}
          </>
        )}
      </div>
    </div>
  );
}

/* ── HEADER ── */
function Header({profile,title,onLogout,pendingCount,onBell}){
  const now=useClock();
  const roleLabel={usuario:"Alumno",profesor:"Profesor",staff:"Secretaría",admin:"Admin"};
  return(
    <div className="px-4 pt-5 pb-4 rounded-b-3xl relative overflow-hidden" style={{background:"#0B3D4C"}}>
      <style>{FONT_IMPORT}</style>
      <svg className="absolute top-0 right-0 opacity-10" style={{width:"150px",height:"80px"}} viewBox="0 0 200 100">
        <path d="M0,50 Q50,20 100,50 T200,50" stroke="#F2C230" strokeWidth="3" fill="none"/>
      </svg>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{color:"#9FC4CE",fontFamily:"Inter"}}>{roleLabel[profile.rol]||profile.rol}</p>
          <h1 className="text-xl" style={{color:"#F7F5EF",fontFamily:"Fraunces",fontWeight:600}}>{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {(profile.rol==="staff"||profile.rol==="admin")&&(
            <button onClick={onBell} className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer"}}>
              <Bell size={16} color="#F7F5EF"/>
              {pendingCount>0&&<span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{background:"#E8622C",color:"#fff"}}>{pendingCount}</span>}
            </button>
          )}
          <button onClick={onLogout} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer"}}>
            <LogOut size={16} color="#F7F5EF"/>
          </button>
        </div>
      </div>
      <p className="relative z-10 text-sm mt-1" style={{color:"#F2C230",fontFamily:"Inter"}}>{profile.nombre} {profile.apellido||""}</p>
      {(profile.rol==="usuario"||profile.rol==="profesor")&&(
        <p className="relative z-10 text-xs mt-0.5" style={{color:"#7FA8B3",fontFamily:"Inter"}}>
          {DIAS_ES[now.getDay()]} {now.getDate()} de {MESES_ES[now.getMonth()]} · {String(now.getHours()).padStart(2,"0")}:{String(now.getMinutes()).padStart(2,"0")}
        </p>
      )}
    </div>
  );
}

/* ── NOTIFICATIONS ── */
function NotificationsPanel({notifications,onResolve,onClose}){
  return(
    <div className="fixed inset-0 z-50 flex flex-col" style={{background:"rgba(11,61,76,0.6)"}} onClick={onClose}>
      <div className="mt-auto rounded-t-3xl p-4 max-h-[70vh] overflow-y-auto" style={{background:"#F7F5EF"}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>🔔 Notificaciones</h2>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8A99A3"}}><X size={20}/></button>
        </div>
        {notifications.length===0&&<p className="text-sm text-center py-6" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin notificaciones pendientes</p>}
        <div className="flex flex-col gap-2.5">
          {notifications.map((n,i)=>(
            <div key={i} className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
              <div className="flex items-center gap-2 mb-1">
                {n.type==="solicitud"?<ArrowLeftRight size={14} color="#2E9CAB"/>:<CreditCard size={14} color="#E8622C"/>}
                <span className="text-xs font-bold uppercase" style={{color:n.type==="solicitud"?"#2E9CAB":"#E8622C",fontFamily:"Inter"}}>
                  {n.type==="solicitud"?"Cambio de horario":"Comprobante de pago"}
                </span>
              </div>
              <p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{n.usuario}</p>
              <p className="text-xs mb-3" style={{color:"#8A99A3",fontFamily:"Inter"}}>
                {n.type==="solicitud"?`${n.desde} → ${n.hasta} · ${n.deporte}`:`${n.deporte} · ${n.fecha}`}
              </p>
              <div className="flex gap-2">
                <button onClick={()=>onResolve(n,"aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#E1F0E3",color:"#2C6E31",border:"none",cursor:"pointer"}}>✓ Aprobar</button>
                <button onClick={()=>onResolve(n,"rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#FCE7DC",color:"#B4441C",border:"none",cursor:"pointer"}}>✗ Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SPORT TABS ── */
function SportTabs({sports,active,onChange}){
  const list=sports?SPORTS.filter(s=>sports.includes(s.id)):SPORTS;
  return(
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 pt-4" style={{scrollbarWidth:"none"}}>
      {list.map(s=>{
        const isActive=active===s.id;
        return(
          <button key={s.id} onClick={()=>onChange(s.id)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-semibold"
            style={{background:isActive?s.color:"#fff",borderColor:isActive?s.color:"#E2E8ED",color:isActive?"#fff":"#33414A",cursor:"pointer",fontFamily:"Inter"}}>
            {s.emoji} {s.name}
          </button>
        );
      })}
    </div>
  );
}

/* ── BOTTOM NAV ── */
function BottomNav({tabs,active,onChange}){
  return(
    <div className="fixed bottom-0 left-0 right-0 flex justify-around px-2 py-2 max-w-2xl mx-auto" style={{background:"#fff",borderTop:"1px solid #E2E8ED"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onChange(t.id)} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
          style={{background:active===t.id?"#E4F2F3":"transparent",border:"none",cursor:"pointer"}}>
          <t.icon size={20} color={active===t.id?"#0B3D4C":"#8A99A3"} strokeWidth={2.1}/>
          <span className="text-[10px] font-semibold" style={{color:active===t.id?"#0B3D4C":"#8A99A3",fontFamily:"Inter"}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── SCHEDULE ── */
function ScheduleView({schedule,setSchedule,sport,role,myClaseIds,addLog,userName}){
  const canEdit=role==="staff"||role==="admin";
  const canCreate=role==="admin";
  const [editing,setEditing]=useState(null);
  const [creating,setCreating]=useState(false);
  const [draft,setDraft]=useState({dia:"Lun",hora:"17:00",profesor:"",lugar:"",cupo:10});
  const [saving,setSaving]=useState(false);

  const items=role==="usuario"
    ?schedule.filter(s=>s.deporte===sport&&myClaseIds.includes(String(s.id)))
    :schedule.filter(s=>s.deporte===sport);

  const saveEdit=async(id,patch)=>{
    setSaving(true);
    await supabase.from("clases").update(patch).eq("id",id);
    setSchedule(prev=>prev.map(s=>s.id===id?{...s,...patch}:s));
    addLog(`Editó clase ${sport}`);
    setSaving(false); setEditing(null);
  };

  const deleteClass=async(id)=>{
    await supabase.from("clases").delete().eq("id",id);
    setSchedule(prev=>prev.filter(s=>s.id!==id));
    addLog(`Eliminó clase ${sport}`);
    setEditing(null);
  };

  const saveNew=async()=>{
    setSaving(true);
    const {data}=await supabase.from("clases").insert([{...draft,deporte:sport,inscriptos:0}]).select().single();
    if(data)setSchedule(prev=>[...prev,data]);
    addLog(`Creó clase ${sport} ${draft.dia} ${draft.hora}`);
    setSaving(false); setCreating(false); setDraft({dia:"Lun",hora:"17:00",profesor:"",lugar:"",cupo:10});
  };

  if(role==="usuario"&&items.length===0){
    return(<div className="px-4 pt-10 pb-24 text-center"><p className="text-4xl mb-3">📭</p><p className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>No tenés clases asignadas en este deporte</p><p className="text-sm mt-1" style={{color:"#8A99A3",fontFamily:"Inter"}}>Consultá en secretaría para inscribirte.</p></div>);
  }

  return(
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Clases de la semana</h2>
        {canCreate&&<button onClick={()=>setCreating(true)} className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-full" style={{background:"#E8622C",border:"none",cursor:"pointer"}}><Plus size={14}/> Nueva</button>}
      </div>
      {creating&&(
        <div className="rounded-2xl p-4 mb-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
          <p className="text-sm font-semibold mb-2" style={{color:"#33414A",fontFamily:"Inter"}}>Nueva clase</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={draft.dia} onChange={e=>setDraft({...draft,dia:e.target.value})} className="border rounded-lg px-2 py-1.5 text-sm" style={{borderColor:"#E2E8ED"}}>
              {DAYS.map(d=><option key={d} value={d}>{DAY_LABELS[d]}</option>)}
            </select>
            <input value={draft.hora} onChange={e=>setDraft({...draft,hora:e.target.value})} placeholder="Hora" className="border rounded-lg px-2 py-1.5 text-sm" style={{borderColor:"#E2E8ED"}}/>
            <input value={draft.profesor} onChange={e=>setDraft({...draft,profesor:e.target.value})} placeholder="Profesor/a" className="border rounded-lg px-2 py-1.5 text-sm col-span-2" style={{borderColor:"#E2E8ED"}}/>
            <input value={draft.lugar} onChange={e=>setDraft({...draft,lugar:e.target.value})} placeholder="Lugar" className="border rounded-lg px-2 py-1.5 text-sm" style={{borderColor:"#E2E8ED"}}/>
            <input type="number" value={draft.cupo} onChange={e=>setDraft({...draft,cupo:+e.target.value})} placeholder="Cupo" className="border rounded-lg px-2 py-1.5 text-sm" style={{borderColor:"#E2E8ED"}}/>
          </div>
          <div className="flex gap-2">
            <button onClick={saveNew} disabled={saving} className="flex-1 text-white text-sm font-semibold rounded-lg py-2" style={{background:"#0B3D4C",border:"none",cursor:"pointer"}}>{saving?"Guardando...":"Guardar"}</button>
            <button onClick={()=>setCreating(false)} className="flex-1 text-sm font-semibold rounded-lg py-2" style={{background:"#F1F3F4",color:"#33414A",border:"none",cursor:"pointer"}}>Cancelar</button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {items.length===0&&<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>No hay clases para este deporte.</p>}
        {items.map(it=>(
          <div key={it.id} className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
            {editing===it.id?(
              <EditClassForm it={it} onSave={saveEdit} onDelete={deleteClass} onCancel={()=>setEditing(null)} saving={saving}/>
            ):(
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{DAY_LABELS[it.dia]||it.dia}</span>
                    <span className="text-sm" style={{color:"#33414A",fontFamily:"IBM Plex Mono"}}>{it.hora}</span>
                  </div>
                  <p className="font-semibold text-sm" style={{color:"#33414A",fontFamily:"Inter"}}>{it.profesor}</p>
                  <p className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{it.lugar}{role!=="usuario"?` · ${it.inscriptos}/${it.cupo} cupos`:""}</p>
                </div>
                {canEdit&&<button onClick={()=>setEditing(it.id)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:"#F1F3F4",border:"none",cursor:"pointer"}}><Pencil size={14} color="#33414A"/></button>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditClassForm({it,onSave,onDelete,onCancel,saving}){
  const [vals,setVals]=useState({hora:it.hora,profesor:it.profesor,lugar:it.lugar});
  return(
    <div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input value={vals.hora} onChange={e=>setVals({...vals,hora:e.target.value})} className="border rounded-lg px-2 py-1.5 text-sm" style={{borderColor:"#E2E8ED"}}/>
        <input value={vals.profesor} onChange={e=>setVals({...vals,profesor:e.target.value})} className="border rounded-lg px-2 py-1.5 text-sm" style={{borderColor:"#E2E8ED"}}/>
        <input value={vals.lugar} onChange={e=>setVals({...vals,lugar:e.target.value})} className="border rounded-lg px-2 py-1.5 text-sm col-span-2" style={{borderColor:"#E2E8ED"}}/>
      </div>
      <div className="flex gap-3">
        <button onClick={()=>onSave(it.id,vals)} disabled={saving} className="text-xs font-semibold" style={{color:"#2E9CAB",background:"none",border:"none",cursor:"pointer"}}>{saving?"...":"✓ Listo"}</button>
        <button onClick={()=>onDelete(it.id)} className="text-xs font-semibold" style={{color:"#E8622C",background:"none",border:"none",cursor:"pointer"}}>🗑 Eliminar</button>
        <button onClick={onCancel} className="text-xs font-semibold" style={{color:"#8A99A3",background:"none",border:"none",cursor:"pointer"}}>Cancelar</button>
      </div>
    </div>
  );
}

/* ── REQUESTS ── */
function RequestsView({requests,setRequests,sport,role,userName}){
  const canManage=role==="staff"||role==="admin";
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({from:"",to:""});
  const [saving,setSaving]=useState(false);
  const filtered=canManage?requests.filter(r=>r.deporte===sport):requests.filter(r=>r.deporte===sport&&r.usuario===userName);
  const update=async(id,estado)=>{await supabase.from("solicitudes").update({estado}).eq("id",id);setRequests(prev=>prev.map(r=>r.id===id?{...r,estado}:r));};
  const create=async()=>{
    if(!form.from||!form.to)return; setSaving(true);
    const {data}=await supabase.from("solicitudes").insert([{usuario:userName,deporte:sport,desde:form.from,hasta:form.to,estado:"pendiente"}]).select().single();
    if(data)setRequests(prev=>[...prev,data]);
    setForm({from:"",to:""}); setShowForm(false); setSaving(false);
  };
  const statusTone={pendiente:"yellow",aprobado:"green",rechazado:"orange"};
  return(
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Solicitudes de cambio</h2>
        {!canManage&&<button onClick={()=>setShowForm(!showForm)} className="text-xs font-semibold text-white px-3 py-1.5 rounded-full" style={{background:"#2E9CAB",border:"none",cursor:"pointer"}}>⇄ Solicitar</button>}
      </div>
      {showForm&&(
        <div className="rounded-2xl p-4 mb-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
          <input value={form.from} onChange={e=>setForm({...form,from:e.target.value})} placeholder="Horario actual (ej: Lun 17:00)" className="w-full border rounded-lg px-2 py-1.5 text-sm mb-2" style={{borderColor:"#E2E8ED"}}/>
          <input value={form.to} onChange={e=>setForm({...form,to:e.target.value})} placeholder="Horario deseado (ej: Vie 18:00)" className="w-full border rounded-lg px-2 py-1.5 text-sm mb-2" style={{borderColor:"#E2E8ED"}}/>
          <button onClick={create} disabled={saving} className="w-full text-white text-sm font-semibold rounded-lg py-2" style={{background:"#0B3D4C",border:"none",cursor:"pointer"}}>{saving?"Enviando...":"Enviar solicitud"}</button>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {filtered.length===0&&<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin solicitudes.</p>}
        {filtered.map(r=>(
          <div key={r.id} className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{r.usuario}</p>
              <Badge tone={statusTone[r.estado]||"aqua"}>{r.estado}</Badge>
            </div>
            <p className="text-sm" style={{color:"#33414A",fontFamily:"IBM Plex Mono"}}>{r.desde} → {r.hasta}</p>
            {canManage&&r.estado==="pendiente"&&(
              <div className="flex gap-2 mt-3">
                <button onClick={()=>update(r.id,"aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#E1F0E3",color:"#2C6E31",border:"none",cursor:"pointer"}}>✓ Aprobar</button>
                <button onClick={()=>update(r.id,"rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#FCE7DC",color:"#B4441C",border:"none",cursor:"pointer"}}>✗ Rechazar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PAGOS ── */
function PaymentView({sport,role,comprobantes,setComprobantes,mySports,userName}){
  const [uploaded,setUploaded]=useState(false);
  const [copied,setCopied]=useState(false);
  const [fileName,setFileName]=useState("");
  const [selDep,setSelDep]=useState(sport);
  const canManage=role==="staff"||role==="admin";
  const sportList=canManage?SPORTS:SPORTS.filter(s=>mySports.includes(s.id));
  const sportData=sportList.find(s=>s.id===selDep)||sportList[0];
  const allComp=canManage&&selDep==="todos"?comprobantes:comprobantes.filter(c=>c.deporte===selDep);
  const handleFile=async(e)=>{
    const f=e.target.files[0]; if(!f)return;
    setFileName(f.name); setUploaded(true);
    const {data}=await supabase.from("comprobantes").insert([{usuario:userName,deporte:sport,fecha:new Date().toLocaleDateString(),archivo:f.name,estado:"pendiente"}]).select().single();
    if(data)setComprobantes(prev=>[...prev,data]);
  };
  const approve=async(id,estado)=>{await supabase.from("comprobantes").update({estado}).eq("id",id);setComprobantes(prev=>prev.map(c=>c.id===id?{...c,estado}:c));};

  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>Pagos{sportData?` — ${sportData.name}`:""}</h2>
      {!canManage&&sportData&&(
        <>
          {sportList.length>1&&(
            <div className="flex gap-2 overflow-x-auto mb-3" style={{scrollbarWidth:"none"}}>
              {sportList.map(s=>(
                <button key={s.id} onClick={()=>setSelDep(s.id)} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{background:selDep===s.id?s.color:"#fff",color:selDep===s.id?"#fff":"#33414A",border:`1px solid ${selDep===s.id?s.color:"#E2E8ED"}`,cursor:"pointer",fontFamily:"Inter"}}>
                  {s.emoji} {s.name}
                </button>
              ))}
            </div>
          )}
          <div className="rounded-2xl p-5 mb-3" style={{background:"#0B3D4C"}}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Alias para transferencia</p>
            <div className="flex items-center justify-between">
              <span className="text-base" style={{color:"#F7F5EF",fontFamily:"IBM Plex Mono"}}>{sportData.alias}</span>
              <button onClick={()=>{navigator.clipboard?.writeText(sportData.alias);setCopied(true);setTimeout(()=>setCopied(false),1500);}} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer"}}><Copy size={15} color="#F7F5EF"/></button>
            </div>
            {copied&&<p className="text-xs mt-2" style={{color:"#F2C230",fontFamily:"Inter"}}>✓ Alias copiado</p>}
          </div>
          <div className="rounded-2xl p-5 mb-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
            <p className="text-sm font-semibold mb-1" style={{color:"#33414A",fontFamily:"Inter"}}>Subí tu comprobante</p>
            <p className="text-xs mb-3" style={{color:"#8A99A3",fontFamily:"Inter"}}>El nombre del archivo queda registrado en el sistema.</p>
            {!uploaded
              ?<label className="rounded-xl py-6 flex flex-col items-center gap-2 cursor-pointer" style={{border:"2px dashed #2E9CAB",color:"#2E9CAB",display:"flex"}}><Upload size={22}/><span className="text-sm font-semibold" style={{fontFamily:"Inter"}}>Seleccioná un archivo</span><input type="file" className="hidden" onChange={handleFile}/></label>
              :<div className="rounded-xl py-4 flex flex-col items-center gap-1.5" style={{background:"#E1F0E3"}}><Check size={20} color="#2C6E31"/><span className="text-sm font-semibold" style={{color:"#2C6E31",fontFamily:"Inter"}}>Cargado: {fileName}</span><span className="text-xs" style={{color:"#5A9060",fontFamily:"Inter"}}>Pendiente de revisión</span></div>
            }
          </div>
        </>
      )}
      {canManage&&(
        <>
          <div className="flex gap-2 overflow-x-auto mb-3" style={{scrollbarWidth:"none"}}>
            {[{id:"todos",name:"Todos",emoji:"📋",color:"#0B3D4C"},...SPORTS].map(s=>(
              <button key={s.id} onClick={()=>setSelDep(s.id)} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{background:selDep===s.id?s.color:"#fff",color:selDep===s.id?"#fff":"#33414A",border:`1px solid ${selDep===s.id?s.color:"#E2E8ED"}`,cursor:"pointer",fontFamily:"Inter"}}>
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            {allComp.length===0&&<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin comprobantes.</p>}
            {allComp.map(c=>(
              <div key={c.id} className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{c.usuario}</p>
                  <Badge tone={c.estado==="aprobado"?"green":c.estado==="rechazado"?"orange":"yellow"}>{c.estado}</Badge>
                </div>
                <p className="text-xs mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>{c.fecha} · {c.archivo} · {c.deporte}</p>
                {c.estado==="pendiente"&&(
                  <div className="flex gap-2">
                    <button onClick={()=>approve(c.id,"aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#E1F0E3",color:"#2C6E31",border:"none",cursor:"pointer"}}>✓ Aprobar</button>
                    <button onClick={()=>approve(c.id,"rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#FCE7DC",color:"#B4441C",border:"none",cursor:"pointer"}}>✗ Rechazar</button>
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
function AttendanceView({schedule,sport,inscripciones,users}){
  const sessions=schedule.filter(s=>s.deporte===sport);
  const [selSession,setSelSession]=useState(null);
  const [attendance,setAttendance]=useState({});
  const sel=selSession||(sessions[0]?.id||null);
  const session=sessions.find(s=>s.id===sel)||sessions[0];
  const alumnosEnClase=inscripciones.filter(i=>String(i.clase_id)===String(sel)).map(i=>{const u=users.find(u=>u.usuario===i.usuario);return u?`${u.nombre}${u.apellido?" "+u.apellido:""}`:i.usuario;});
  const toggle=(who)=>setAttendance(prev=>({...prev,[sel+"_"+who]:!prev[sel+"_"+who]}));
  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>Asistencia</h2>
      <div className="flex gap-2 overflow-x-auto mb-4" style={{scrollbarWidth:"none"}}>
        {sessions.map(s=>(
          <button key={s.id} onClick={()=>setSelSession(s.id)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{background:sel===s.id?"#0B3D4C":"#fff",color:sel===s.id?"#fff":"#33414A",border:`1px solid ${sel===s.id?"#0B3D4C":"#E2E8ED"}`,cursor:"pointer"}}>
            {DAY_LABELS[s.dia]||s.dia} {s.hora}
          </button>
        ))}
      </div>
      {!session?<p className="text-sm text-center py-8" style={{color:"#8A99A3"}}>No hay clases.</p>:(
        <>
          <div className="rounded-2xl p-4 mb-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
            <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{color:"#8A99A3",fontFamily:"Inter"}}>Profesor/a</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{session.profesor}</span>
              <button onClick={()=>toggle("__prof__")} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:attendance[sel+"___prof__"]?"#E1F0E3":"#F1F3F4",border:"none",cursor:"pointer"}}>
                <Check size={15} color={attendance[sel+"___prof__"]?"#2C6E31":"#8A99A3"}/>
              </button>
            </div>
          </div>
          <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>Alumnos</p>
          {alumnosEnClase.length===0&&<p className="text-sm text-center py-4" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin alumnos inscriptos.</p>}
          <div className="flex flex-col gap-2">
            {alumnosEnClase.map(s=>(
              <div key={s} className="rounded-xl p-3 flex items-center justify-between" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
                <span className="text-sm" style={{color:"#33414A",fontFamily:"Inter"}}>{s}</span>
                <button onClick={()=>toggle(s)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:attendance[sel+"_"+s]?"#E1F0E3":"#F1F3F4",border:"none",cursor:"pointer"}}>
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

/* ── PROFESOR ── */
function ProfesorView({schedule,inscripciones,users,userName}){
  const myClasses=schedule.filter(s=>s.usuario_profesor===userName);
  const [view,setView]=useState("clases");
  const [selClass,setSelClass]=useState(null);
  const [attendance,setAttendance]=useState({});
  const sel=selClass||(myClasses[0]?.id||null);
  const session=myClasses.find(s=>s.id===sel)||myClasses[0];
  const alumnosEnClase=inscripciones.filter(i=>String(i.clase_id)===String(sel)).map(i=>{const u=users.find(u=>u.usuario===i.usuario);return u?`${u.nombre}${u.apellido?" "+u.apellido:""}`:i.usuario;});
  const toggle=(who)=>setAttendance(prev=>({...prev,[sel+"_"+who]:!prev[sel+"_"+who]}));
  if(myClasses.length===0)return(<div className="px-4 pt-10 pb-24 text-center"><p className="text-4xl mb-3">📭</p><p className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>No tenés clases asignadas</p></div>);
  return(
    <div className="px-4 pt-4 pb-24">
      <div className="flex gap-2 mb-4">
        {["clases","asistencia"].map(v=>(
          <button key={v} onClick={()=>setView(v)} className="flex-1 text-sm font-semibold py-2 rounded-xl"
            style={{background:view===v?"#0B3D4C":"#fff",color:view===v?"#fff":"#33414A",border:`1px solid ${view===v?"#0B3D4C":"#E2E8ED"}`,cursor:"pointer",fontFamily:"Inter"}}>
            {v==="clases"?"Mis clases":"Asistencia"}
          </button>
        ))}
      </div>
      {view==="clases"&&(
        <div className="flex flex-col gap-2.5">
          {myClasses.map(it=>{const sport=SPORTS.find(s=>s.id===it.deporte);const nextDate=nextDateForDay(it.dia);return(
            <div key={it.id} className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
              <div className="flex items-center gap-2 mb-2"><span className="text-lg">{sport?.emoji}</span><span className="text-sm font-bold" style={{color:"#33414A",fontFamily:"Inter"}}>{sport?.name}</span></div>
              <div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold px-2 py-1 rounded-full" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{DAY_LABELS[it.dia]||it.dia}</span><span className="text-sm" style={{color:"#33414A",fontFamily:"IBM Plex Mono"}}>{it.hora}</span></div>
              <p className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{it.lugar}</p>
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg" style={{background:"#FDF3D6",display:"inline-flex"}}><Clock size={12} color="#8A6A0A"/><span className="text-xs font-semibold" style={{color:"#8A6A0A",fontFamily:"Inter"}}>Próxima: {formatShortDate(nextDate)}</span></div>
            </div>
          );})}
        </div>
      )}
      {view==="asistencia"&&(
        <>
          <div className="flex gap-2 overflow-x-auto mb-4" style={{scrollbarWidth:"none"}}>
            {myClasses.map(s=>{const sport=SPORTS.find(sp=>sp.id===s.deporte);return(
              <button key={s.id} onClick={()=>setSelClass(s.id)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{background:sel===s.id?"#0B3D4C":"#fff",color:sel===s.id?"#fff":"#33414A",border:`1px solid ${sel===s.id?"#0B3D4C":"#E2E8ED"}`,cursor:"pointer"}}>
                {sport?.emoji} {DAY_LABELS[s.dia]||s.dia} {s.hora}
              </button>
            );})}
          </div>
          {session&&(
            <>
              <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-lg" style={{background:"#FDF3D6",display:"inline-flex"}}><Clock size={12} color="#8A6A0A"/><span className="text-xs font-semibold" style={{color:"#8A6A0A",fontFamily:"Inter"}}>Próxima: {formatShortDate(nextDateForDay(session.dia))}</span></div>
              <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>Alumnos</p>
              {alumnosEnClase.length===0&&<p className="text-sm text-center py-4" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin alumnos inscriptos.</p>}
              <div className="flex flex-col gap-2">
                {alumnosEnClase.map(s=>(
                  <div key={s} className="rounded-xl p-3 flex items-center justify-between" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
                    <span className="text-sm" style={{color:"#33414A",fontFamily:"Inter"}}>{s}</span>
                    <button onClick={()=>toggle(s)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:attendance[sel+"_"+s]?"#E1F0E3":"#F1F3F4",border:"none",cursor:"pointer"}}>
                      <Check size={15} color={attendance[sel+"_"+s]?"#2C6E31":"#8A99A3"}/>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ── REVISION MEDICA ── */
function RevisionMedica({revisiones,setRevisiones,role,userName,users}){
  const canEdit=role==="staff"||role==="admin";
  const now=new Date();
  const mesLabel=MESES_LABEL[now.getMonth()];
  const alumnos=canEdit?users.filter(u=>u.rol==="usuario"&&u.id!==undefined):[];
  const [selected,setSelected]=useState(canEdit?(alumnos[0]?.usuario||""):userName);
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState({});
  const [saving,setSaving]=useState(false);
  const rev=revisiones.find(r=>r.usuario===selected)||{usuario:selected,rev1:"",rev2:"",apto:""};
  const startEdit=()=>{setDraft({...rev,usuario:selected});setEditing(true);};
  const [saveError,setSaveError]=useState("");
  const saveEdit=async()=>{
    if(!draft.rev1||!draft.rev2){setSaveError("Las dos fechas son obligatorias.");return;}
    setSaveError(""); setSaving(true);
    const exists=revisiones.find(r=>r.usuario===selected);
    if(exists){await supabase.from("revisiones").update({rev1:draft.rev1,rev2:draft.rev2,apto:draft.apto}).eq("usuario",selected);setRevisiones(prev=>prev.map(r=>r.usuario===selected?{...r,...draft}:r));}
    else{const {data}=await supabase.from("revisiones").insert([{...draft}]).select().single();if(data)setRevisiones(prev=>[...prev,data]);}
    setSaving(false); setEditing(false);
  };
  const quickOk=async(usuario)=>{
    const exists=revisiones.find(r=>r.usuario===usuario);
    if(exists){await supabase.from("revisiones").update({apto:"si"}).eq("usuario",usuario);setRevisiones(prev=>prev.map(r=>r.usuario===usuario?{...r,apto:"si"}:r));}
    else{const {data}=await supabase.from("revisiones").insert([{usuario,apto:"si",rev1:"",rev2:""}]).select().single();if(data)setRevisiones(prev=>[...prev,data]);}
  };
  const aptoStyle=(apto)=>apto==="si"?{background:"#E1F0E3",color:"#2C6E31",label:"✓ Apto"}:apto==="no"?{background:"#FCE7DC",color:"#B4441C",label:"✗ No apto"}:{background:"#FDF3D6",color:"#8A6A0A",label:"Sin definir"};

  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-1" style={{color:"#33414A",fontFamily:"Inter"}}>Revisión Médica</h2>
      <p className="text-sm mb-3" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mesLabel} {now.getFullYear()}</p>
      {canEdit&&alumnos.length>0&&(
        <div className="rounded-2xl p-4 mb-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>Estado rápido — alumnos</p>
          <div className="flex flex-col gap-2">
            {alumnos.map(u=>{
              const r=revisiones.find(rv=>rv.usuario===u.usuario)||{apto:""};
              const st=aptoStyle(r.apto);
              const nombreCompleto=`${u.nombre||""}${u.apellido?" "+u.apellido:""}`.trim();
              return(
                <div key={u.id||u.usuario} className="flex items-center justify-between gap-2">
                  <button onClick={()=>setSelected(u.usuario)} className="flex-1 flex items-center gap-2 text-left px-3 py-2 rounded-xl"
                    style={{background:selected===u.usuario?"#E4F2F3":"#F7F5EF",border:"none",cursor:"pointer"}}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{(nombreCompleto||"?")[0]}</div>
                    <span className="text-sm" style={{color:"#33414A",fontFamily:"Inter"}}>{nombreCompleto||u.usuario}</span>
                    <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:st.background,color:st.color,fontFamily:"Inter"}}>{st.label}</span>
                  </button>
                  {r.apto!=="si"&&<button onClick={()=>quickOk(u.usuario)} className="shrink-0 text-xs font-semibold px-2 py-1.5 rounded-lg" style={{background:"#E1F0E3",color:"#2C6E31",border:"none",cursor:"pointer"}}>✓ OK</button>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="rounded-2xl p-5" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
        {/* Mostrar nombre si canEdit, o nada si es el propio alumno */}
        {canEdit && (
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope size={18} color="#2E9CAB"/>
            <span className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>
              {(()=>{const u=alumnos.find(a=>a.usuario===selected); return u?`${u.nombre||""} ${u.apellido||""}`.trim():selected;})()}
            </span>
            <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full" style={{...aptoStyle(rev.apto),fontFamily:"Inter"}}>{aptoStyle(rev.apto).label}</span>
          </div>
        )}
        {!canEdit && (
          <div className="flex items-center justify-end mb-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{...aptoStyle(rev.apto),fontFamily:"Inter"}}>{aptoStyle(rev.apto).label}</span>
          </div>
        )}
        {editing?(
          <>
            <div className="flex flex-col gap-2 mb-3">
              <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mesLabel} — Primera revisión</label><input type="date" value={draft.rev1} onChange={e=>setDraft({...draft,rev1:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}/></div>
              <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mesLabel} — Segunda revisión</label><input type="date" value={draft.rev2} onChange={e=>setDraft({...draft,rev2:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}/></div>
              <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Estado</label>
                <select value={draft.apto} onChange={e=>setDraft({...draft,apto:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}>
                  <option value="">Sin definir</option><option value="si">Apto</option><option value="no">No apto</option>
                </select>
              </div>
            </div>
            {saveError&&<p className="text-xs mb-2" style={{color:"#B4441C",fontFamily:"Inter"}}>⚠ {saveError}</p>}
            <div className="flex gap-2">
              <button onClick={saveEdit} disabled={saving} className="flex-1 text-white text-sm font-semibold rounded-lg py-2" style={{background:"#0B3D4C",border:"none",cursor:"pointer"}}>{saving?"Guardando...":"Guardar"}</button>
              <button onClick={()=>{setEditing(false);setSaveError("");}} className="flex-1 text-sm font-semibold rounded-lg py-2" style={{background:"#F1F3F4",color:"#33414A",border:"none",cursor:"pointer"}}>Cancelar</button>
            </div>
          </>
        ):(
          <>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{background:"#F7F5EF"}}><div><p className="text-xs uppercase font-semibold" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mesLabel} — Primera revisión</p><p className="text-sm font-semibold mt-0.5" style={{color:"#33414A",fontFamily:"IBM Plex Mono"}}>{rev.rev1||"—"}</p></div><span style={{fontSize:"20px"}}>📋</span></div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{background:"#F7F5EF"}}><div><p className="text-xs uppercase font-semibold" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mesLabel} — Segunda revisión</p><p className="text-sm font-semibold mt-0.5" style={{color:"#33414A",fontFamily:"IBM Plex Mono"}}>{rev.rev2||"—"}</p></div><span style={{fontSize:"20px"}}>📋</span></div>
            </div>
            {canEdit&&<button onClick={startEdit} className="w-full text-sm font-semibold rounded-lg py-2" style={{background:"#E4F2F3",color:"#0B3D4C",border:"none",cursor:"pointer"}}>✏️ Editar revisión</button>}
          </>
        )}
      </div>
    </div>
  );
}

/* ── ALUMNOS ── */
function AlumnosView({schedule,sport,users,inscripciones,setUsers}){
  const [view,setView]=useState("deporte");
  const [selDep,setSelDep]=useState("todos");
  const [selSession,setSelSession]=useState(null);
  const [editingAlumno,setEditingAlumno]=useState(null);
  const sel=selSession||(schedule.filter(s=>s.deporte===(selDep==="todos"?s.deporte:selDep))[0]?.id||null);
  const sportAlumnos=selDep==="todos"?users.filter(u=>u.rol==="usuario"):users.filter(u=>u.rol==="usuario"&&u.deportes&&u.deportes.split(";").map(s=>s.trim()).includes(selDep));
  const alumnosEnClase=inscripciones.filter(i=>String(i.clase_id)===String(sel)).map(i=>{const u=users.find(u=>u.usuario===i.usuario);return u?{...u,displayName:`${u.nombre||""}${u.apellido?" "+u.apellido:""}`.trim()}:{displayName:i.usuario};});
  const depOpts=[{id:"todos",name:"Todos",emoji:"👥",color:"#0B3D4C"},...SPORTS];

  if(editingAlumno)return<EditarAlumno alumno={editingAlumno} onSave={(updated)=>{setUsers(prev=>prev.map(u=>u.id===updated.id?{...u,...updated}:u));setEditingAlumno(null);}} onBack={()=>setEditingAlumno(null)}/>;

  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>Alumnos inscriptos</h2>
      <div className="flex gap-2 mb-3">
        {["deporte","clase"].map(v=>(
          <button key={v} onClick={()=>setView(v)} className="flex-1 text-sm font-semibold py-2 rounded-xl"
            style={{background:view===v?"#0B3D4C":"#fff",color:view===v?"#fff":"#33414A",border:`1px solid ${view===v?"#0B3D4C":"#E2E8ED"}`,cursor:"pointer",fontFamily:"Inter"}}>
            {v==="deporte"?"Por deporte":"Por clase"}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto mb-4" style={{scrollbarWidth:"none"}}>
        {depOpts.map(s=>(
          <button key={s.id} onClick={()=>{setSelDep(s.id);setSelSession(null);}} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{background:selDep===s.id?s.color:"#fff",color:selDep===s.id?"#fff":"#33414A",border:`1px solid ${selDep===s.id?s.color:"#E2E8ED"}`,cursor:"pointer",fontFamily:"Inter"}}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>
      {view==="deporte"?(
        <div className="flex flex-col gap-2">
          {sportAlumnos.length===0?<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin alumnos.</p>
            :sportAlumnos.map(u=>{
              const nombreCompleto=`${u.nombre||""}${u.apellido?" "+u.apellido:""}`.trim();
              const edad=calcEdad(u.fecha_nacimiento);
              return(
                <div key={u.id||u.usuario} className="rounded-xl p-3 flex items-center gap-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{(nombreCompleto||"?")[0]}</div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{nombreCompleto||u.usuario}</span>
                    <div className="flex gap-2 mt-0.5 flex-wrap items-center">
                      {edad&&<span className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{edad} años</span>}
                      {u.deportes&&u.deportes.split(";").map(d=>{const s=SPORTS.find(sp=>sp.id===d.trim());return s?<span key={d} className="text-xs" style={{color:s.color,fontFamily:"Inter"}}>{s.emoji}</span>:null;})}
                    </div>
                    <p className="text-xs mt-0.5" style={{color:"#8A99A3",fontFamily:"IBM Plex Mono"}}>{u.usuario}</p>
                  </div>
                  <button onClick={()=>setEditingAlumno(u)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{background:"#F1F3F4",border:"none",cursor:"pointer"}}><Pencil size={13} color="#33414A"/></button>
                </div>
              );
            })
          }
        </div>
      ):(
        <>
          {selDep!=="todos"&&(
            <div className="flex gap-2 overflow-x-auto mb-4" style={{scrollbarWidth:"none"}}>
              {schedule.filter(s=>s.deporte===selDep).map(s=>(
                <button key={s.id} onClick={()=>setSelSession(s.id)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{background:sel===s.id?"#0B3D4C":"#fff",color:sel===s.id?"#fff":"#33414A",border:`1px solid ${sel===s.id?"#0B3D4C":"#E2E8ED"}`,cursor:"pointer"}}>
                  {DAY_LABELS[s.dia]||s.dia} {s.hora}
                </button>
              ))}
            </div>
          )}
          {alumnosEnClase.length===0?<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin alumnos en esta clase.</p>
            :<div className="flex flex-col gap-2">{alumnosEnClase.map(a=>(
                <div key={a.id||a.usuario} className="rounded-xl p-3 flex items-center gap-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{(a.displayName||"?")[0]}</div>
                  <span className="text-sm" style={{color:"#33414A",fontFamily:"Inter"}}>{a.displayName}</span>
                </div>
              ))}</div>
          }
        </>
      )}
    </div>
  );
}

/* ── CALENDARIO ── */
function CalendarDashboard({schedule}){
  const [activeSport,setActiveSport]=useState("natacion");
  const sport=SPORTS.find(s=>s.id===activeSport);
  const items=schedule.filter(s=>s.deporte===activeSport);
  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>Panel de disponibilidad</h2>
      <div className="flex gap-2 overflow-x-auto mb-4" style={{scrollbarWidth:"none"}}>
        {SPORTS.map(s=>(
          <button key={s.id} onClick={()=>setActiveSport(s.id)} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
            style={{background:activeSport===s.id?s.color:"#fff",color:activeSport===s.id?"#fff":"#33414A",border:`1px solid ${activeSport===s.id?s.color:"#E2E8ED"}`,cursor:"pointer",fontFamily:"Inter"}}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden text-xs" style={{border:"1px solid #E2E8ED"}}>
        <div className="grid" style={{gridTemplateColumns:"52px repeat(6,1fr)",background:"#0B3D4C"}}>
          <div className="p-1.5 text-center" style={{color:"#9FC4CE",fontFamily:"IBM Plex Mono"}}>Hora</div>
          {DAYS.map(d=><div key={d} className="p-1.5 text-center font-bold" style={{color:"#9FC4CE",fontFamily:"Inter"}}>{DAY_LABELS[d]}</div>)}
        </div>
        {HOURS.map((hour,i)=>(
          <div key={hour} className="grid" style={{gridTemplateColumns:"52px repeat(6,1fr)",background:i%2===0?"#fff":"#F7F5EF",borderTop:"1px solid #E2E8ED"}}>
            <div className="p-1.5 text-center" style={{color:"#8A99A3",fontFamily:"IBM Plex Mono",borderRight:"1px solid #E2E8ED",fontSize:"10px"}}>{hour}</div>
            {DAYS.map(d=>{const cls=items.find(it=>it.dia===d&&it.hora===hour);return(
              <div key={d} className="p-0.5 min-h-[30px]" style={{borderRight:"1px solid #E2E8ED"}}>
                {cls&&<div className="rounded px-1 py-0.5 leading-tight" style={{background:+cls.inscriptos>=+cls.cupo?"#FCE7DC":sport.color+"22",color:+cls.inscriptos>=+cls.cupo?"#B4441C":"#33414A",fontFamily:"Inter",fontSize:"9px",fontWeight:600}}>
                  {cls.profesor?.split(" ")[0]}<br/><span style={{fontFamily:"IBM Plex Mono",fontSize:"8px"}}>{cls.inscriptos}/{cls.cupo}</span>
                </div>}
              </div>
            );})}
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>🟠 completa · color = cupo disponible</p>
    </div>
  );
}

/* ── LOG ── */
function LogPanel({log}){
  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>📋 Log de actividad</h2>
      {log.length===0&&<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin actividad registrada aún.</p>}
      <div className="flex flex-col gap-2">
        {[...log].reverse().map((e,i)=>(
          <div key={i} className="rounded-xl p-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-bold" style={{color:"#0B3D4C",fontFamily:"Inter"}}>{e.usuario}</span>
              <span className="text-xs" style={{color:"#8A99A3",fontFamily:"IBM Plex Mono"}}>{e.hora}</span>
            </div>
            <p className="text-sm" style={{color:"#33414A",fontFamily:"Inter"}}>{e.accion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── APP ROOT ── */
export default function App(){
  const [profile,setProfile]           = useState(null);
  const [tab,setTab]                   = useState("horarios");
  const [sport,setSport]               = useState("natacion");
  const [schedule,setSchedule]         = useState([]);
  const [requests,setRequests]         = useState([]);
  const [revisiones,setRevisiones]     = useState([]);
  const [comprobantes,setComprobantes] = useState([]);
  const [inscripciones,setInscripciones]=useState([]);
  const [users,setUsers]               = useState([]);
  const [loading,setLoading]           = useState(false);
  const [showNotif,setShowNotif]       = useState(false);
  const [showCrear,setShowCrear]       = useState(false);
  const [log,setLog]                   = useState([]);

  useEffect(()=>{
    if(!profile)return;
    setLoading(true);
    Promise.all([
      supabase.from("clases").select("*"),
      supabase.from("solicitudes").select("*"),
      supabase.from("revisiones").select("*"),
      supabase.from("comprobantes").select("*"),
      supabase.from("usuarios").select("*"),
      supabase.from("inscripciones").select("*"),
    ]).then(([cl,so,re,co,us,in_])=>{
      setSchedule(cl.data||[]);
      setRequests(so.data||[]);
      setRevisiones(re.data||[]);
      setComprobantes(co.data||[]);
      setUsers(us.data||[]);
      setInscripciones(in_.data||[]);
      setLoading(false);
    });
  },[profile]);

  const addLog=(accion)=>{
    const now=new Date();
    setLog(prev=>[...prev,{usuario:profile?.nombre||profile?.usuario||"",accion,hora:`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`}]);
  };

  const handleLogout=async()=>{
    await supabase.auth.signOut();
    setProfile(null); setSchedule([]); setRequests([]); setLog([]); setShowCrear(false);
  };

  if(!profile)return <Login onLogin={p=>{setProfile(p);setTab(p.rol==="admin"?"calendario":"horarios");}}/>;

  const role=profile.rol;
  const mySports=profile.deportes?profile.deportes.split(";").map(s=>s.trim()):SPORTS.map(s=>s.id);
  const myClaseIds=inscripciones.filter(i=>i.usuario===profile.usuario).map(i=>String(i.clase_id));
  const notifications=[
    ...requests.filter(r=>r.estado==="pendiente").map(r=>({...r,type:"solicitud"})),
    ...comprobantes.filter(c=>c.estado==="pendiente").map(c=>({...c,type:"comprobante"})),
  ];

  const handleNotifResolve=async(n,estado)=>{
    if(n.type==="solicitud"){await supabase.from("solicitudes").update({estado}).eq("id",n.id);setRequests(prev=>prev.map(r=>r.id===n.id?{...r,estado}:r));}
    else{await supabase.from("comprobantes").update({estado}).eq("id",n.id);setComprobantes(prev=>prev.map(c=>c.id===n.id?{...c,estado}:c));}
    addLog(`${estado} ${n.type} de ${n.usuario}`);
  };

  const tabs=role==="usuario"
    ?[{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Cambios",icon:ArrowLeftRight},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope},{id:"perfil",label:"Perfil",icon:User}]
    :role==="profesor"
    ?[{id:"profesor",label:"Mis clases",icon:CalendarIcon},{id:"medica",label:"Médica",icon:Stethoscope},{id:"perfil",label:"Perfil",icon:User}]
    :role==="staff"
    ?[{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Cambios",icon:ArrowLeftRight},{id:"asistencia",label:"Asistencia",icon:ClipboardCheck},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope},{id:"perfil",label:"Perfil",icon:User}]
    :[{id:"calendario",label:"Calendario",icon:CalendarIcon},{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"alumnos",label:"Alumnos",icon:Users},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope},{id:"log",label:"Log",icon:FileText}];

  const titles={horarios:"Mis clases",solicitudes:"Solicitudes",pagos:"Pagos",asistencia:"Asistencia",calendario:"Disponibilidad",medica:"Revisión Médica",alumnos:"Alumnos",profesor:"Mis clases",log:"Log de actividad",perfil:"Mi perfil"};
  const activeSport=mySports.includes(sport)?sport:(mySports[0]||"natacion");

  if(showCrear)return(
    <div className="min-h-screen max-w-2xl mx-auto" style={{background:"#F7F5EF"}}>
      <style>{FONT_IMPORT}</style>
      <div className="px-4 pt-5 pb-4 rounded-b-3xl" style={{background:"#0B3D4C"}}>
        <div className="flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wider" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Admin</p><h1 className="text-xl" style={{color:"#F7F5EF",fontFamily:"Fraunces",fontWeight:600}}>Crear usuario</h1></div>
          <button onClick={handleLogout} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer"}}><LogOut size={16} color="#F7F5EF"/></button>
        </div>
        <p className="text-sm mt-1" style={{color:"#F2C230",fontFamily:"Inter"}}>{profile.nombre}</p>
      </div>
      <CrearUsuario onBack={()=>setShowCrear(false)}/>
    </div>
  );

  return(
    <div className="min-h-screen max-w-2xl mx-auto" style={{background:"#F7F5EF"}}>
      <style>{FONT_IMPORT}</style>
      <Header profile={profile} title={titles[tab]} onLogout={handleLogout} pendingCount={notifications.length} onBell={()=>setShowNotif(true)}/>
      {role==="admin"&&(
        <div className="px-4 pt-3">
          <button onClick={()=>setShowCrear(true)} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl" style={{background:"#0B3D4C",color:"#F2C230",border:"none",cursor:"pointer",fontFamily:"Inter"}}>
            <ShieldCheck size={14}/> Crear usuario
          </button>
        </div>
      )}
      {tab!=="calendario"&&tab!=="profesor"&&tab!=="log"&&tab!=="perfil"&&<SportTabs sports={role==="usuario"?mySports:null} active={activeSport} onChange={setSport}/>}
      {loading
        ?<div className="flex items-center justify-center py-16 gap-2" style={{color:"#8A99A3"}}><Loader size={20} className="animate-spin"/><span style={{fontFamily:"Inter"}}>Cargando datos...</span></div>
        :<>
          {tab==="horarios"    &&<ScheduleView schedule={schedule} setSchedule={setSchedule} sport={activeSport} role={role} myClaseIds={myClaseIds} addLog={addLog} userName={profile.usuario}/>}
          {tab==="solicitudes" &&<RequestsView requests={requests} setRequests={setRequests} sport={activeSport} role={role} userName={profile.usuario}/>}
          {tab==="pagos"       &&<PaymentView sport={activeSport} role={role} comprobantes={comprobantes} setComprobantes={setComprobantes} mySports={mySports} userName={profile.usuario}/>}
          {tab==="asistencia"  &&<AttendanceView schedule={schedule} sport={activeSport} inscripciones={inscripciones} users={users}/>}
          {tab==="calendario"  &&<CalendarDashboard schedule={schedule}/>}
          {tab==="medica"      &&<RevisionMedica revisiones={revisiones} setRevisiones={setRevisiones} role={role} userName={profile.usuario} users={users}/>}
          {tab==="alumnos"     &&<AlumnosView schedule={schedule} sport={activeSport} users={users} inscripciones={inscripciones} setUsers={setUsers}/>}
          {tab==="profesor"    &&<ProfesorView schedule={schedule} inscripciones={inscripciones} users={users} userName={profile.usuario}/>}
          {tab==="log"         &&<LogPanel log={log}/>}
          {tab==="perfil"      &&<PerfilView profile={profile} users={users} setUsers={setUsers} role={role}/>}
        </>
      }
      <BottomNav tabs={tabs} active={tab} onChange={t=>setTab(t)}/>
      {showNotif&&<NotificationsPanel notifications={notifications} onResolve={handleNotifResolve} onClose={()=>setShowNotif(false)}/>}
    </div>
  );
}
