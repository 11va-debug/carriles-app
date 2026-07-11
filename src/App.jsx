import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";
import {
  Calendar as CalendarIcon, Check, X, ArrowLeftRight, Upload, LogOut,
  Plus, Pencil, Copy, Loader, Bell, CreditCard,
  Stethoscope, Users, FileText, Clock, Eye, EyeOff, ShieldCheck,
  User, MessageSquare, Megaphone, ChevronDown, UserPlus
} from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
`;

const SPORTS = [
  { id:"natacion", name:"Natación",      emoji:"🏊", color:"#2E9CAB", alias:"natacion.carriles.pagos",
    bg:"radial-gradient(ellipse at 80% 20%, #1a5f6e 0%, #0B3D4C 60%)",
    categorias:["Infantil","Juvenil","Adulto Inicial","Adulto Intermedio","Adulto Avanzado"],
    lugares:["Carril 1","Carril 2","Carril 3","Carril 4","Carril 5","Carril 6"] },
  { id:"voley",    name:"Vóley",         emoji:"🏐", color:"#E8622C", alias:"voley.carriles.pagos",
    bg:"radial-gradient(ellipse at 80% 20%, #8B3A1C 0%, #5C2010 60%)",
    categorias:["Iniciación","Intermedio","Avanzado","Competitivo"],
    lugares:["Cancha A","Cancha B"] },
  { id:"matro",    name:"Matronatación", emoji:"🌊", color:"#7CB9C9", alias:"matro.carriles.pagos",
    bg:"radial-gradient(ellipse at 80% 20%, #3a7a8a 0%, #1B4F5C 60%)",
    categorias:[],
    lugares:["Pileta"] },
  { id:"handball", name:"Handball",      emoji:"🤾", color:"#F2C230", alias:"handball.carriles.pagos",
    bg:"radial-gradient(ellipse at 80% 20%, #7a6010 0%, #4A3A08 60%)",
    categorias:["Iniciación","Intermedio","Avanzado","Competitivo"],
    lugares:["Cancha A","Cancha B"] },
];

const DAYS      = ["Lun","Mar","Mie","Jue","Vie","Sab"];
const DAY_LABELS= { Lun:"Lun",Mar:"Mar",Mie:"Mié",Jue:"Jue",Vie:"Vie",Sab:"Sáb" };
const HOURS     = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const DIAS_ES   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MESES_ES  = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const MESES_LABEL=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function calcEdad(f){if(!f)return null;const h=new Date(),n=new Date(f);let e=h.getFullYear()-n.getFullYear();if(h.getMonth()-n.getMonth()<0||(h.getMonth()-n.getMonth()===0&&h.getDate()<n.getDate()))e--;return e;}
function nextDateForDay(d){const now=new Date(),dow=now.getDay();const t={Lun:1,Mar:2,Mie:3,Jue:4,Vie:5,Sab:6}[d]||1;let diff=t-dow;if(diff<0)diff+=7;const r=new Date(now);r.setDate(now.getDate()+diff);return r;}
function formatShortDate(d){return `${DIAS_ES[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`;}
function useClock(){const [now,setNow]=useState(new Date());useEffect(()=>{const t=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(t);},[]);return now;}

function Badge({children,tone="aqua"}){
  const s={aqua:{background:"#E4F2F3",color:"#0B3D4C"},orange:{background:"#FCE7DC",color:"#B4441C"},yellow:{background:"#FDF3D6",color:"#8A6A0A"},green:{background:"#E1F0E3",color:"#2C6E31"}};
  return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{fontFamily:"Inter",...(s[tone]||s.aqua)}}>{children}</span>;
}

function Login({onLogin,resetError,onClearError}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [showForgot,setShowForgot]=useState(false);
  const [forgotEmail,setForgotEmail]=useState("");
  const [forgotMsg,setForgotMsg]=useState("");
  const handleLogin=async()=>{
    setLoading(true);setError("");
    const {data,error:ae}=await supabase.auth.signInWithPassword({email,password});
    if(ae){setError("Email o contraseña incorrectos.");setLoading(false);return;}
    const {data:ud}=await supabase.from("usuarios").select("*").eq("id",data.user.id).single();
    if(!ud){setError("No se encontró el perfil.");setLoading(false);return;}
    onLogin(ud);setLoading(false);
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
          {resetError&&<div className="rounded-lg p-3 mb-3" style={{background:"#FCE7DC"}}><p className="text-xs font-semibold" style={{color:"#B4441C",fontFamily:"Inter"}}>⚠ {resetError}</p><button onClick={onClearError} className="text-xs mt-1 underline" style={{color:"#B4441C",background:"none",border:"none",cursor:"pointer",fontFamily:"Inter"}}>Cerrar</button></div>}
          <button onClick={handleLogin} disabled={loading} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{background:"#E8622C",border:"none",cursor:"pointer",fontFamily:"Inter"}}>{loading?"Ingresando...":"Ingresar"}</button>
          {!showForgot
            ?<button onClick={()=>setShowForgot(true)} className="w-full mt-2 text-xs" style={{background:"none",border:"none",cursor:"pointer",color:"#9FC4CE",fontFamily:"Inter"}}>¿Olvidaste tu contraseña?</button>
            :<div className="mt-3 p-3 rounded-xl" style={{background:"rgba(0,0,0,0.2)"}}>
              <p className="text-xs font-semibold mb-2" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Ingresá tu email y te mandamos un link</p>
              <input value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} placeholder="tu@email.com"
                className="w-full rounded-lg px-3 py-2 text-sm mb-2" style={{background:"#0B3D4C",color:"#F7F5EF",border:"1px solid rgba(46,156,171,0.4)",fontFamily:"Inter",outline:"none"}}/>
              {forgotMsg&&<p className="text-xs mb-2" style={{color:forgotMsg.startsWith("✓")?"#7ECBA1":"#F2A08C",fontFamily:"Inter"}}>{forgotMsg}</p>}
              <div className="flex gap-2">
                <button onClick={async()=>{if(!forgotEmail){setForgotMsg("Ingresá tu email.");return;}const{error}=await supabase.auth.resetPasswordForEmail(forgotEmail,{redirectTo:window.location.origin});if(error)setForgotMsg("Error: "+error.message);else setForgotMsg("✓ Email enviado. Revisá tu casilla.");}} className="flex-1 text-xs font-semibold rounded-lg py-1.5 text-white" style={{background:"#2E9CAB",border:"none",cursor:"pointer",fontFamily:"Inter"}}>Enviar link</button>
                <button onClick={()=>{setShowForgot(false);setForgotMsg("");}} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"rgba(255,255,255,0.1)",color:"#9FC4CE",border:"none",cursor:"pointer",fontFamily:"Inter"}}>Cancelar</button>
              </div>
            </div>
          }
        </div>
        <p className="text-xs mt-6 text-center" style={{color:"#5D8A96",fontFamily:"Inter"}}>Diplomatura IA FCE-UBA 2026</p>
      </div>
    </div>
  );
}

function ResetPassword({onDone}){
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState(false);
  const [loading,setLoading]=useState(false);
  const save=async()=>{
    if(password.length<6){setError("Mínimo 6 caracteres.");return;}
    if(password!==confirm){setError("Las contraseñas no coinciden.");return;}
    setLoading(true);setError("");
    const {error:err}=await supabase.auth.updateUser({password});
    if(err){setError("Error: "+err.message);setLoading(false);return;}
    setSuccess(true);setLoading(false);setTimeout(()=>onDone(),2000);
  };
  return(
    <div className="min-h-screen flex flex-col justify-center px-6 py-12" style={{background:"#0B3D4C"}}>
      <style>{FONT_IMPORT}</style>
      <div className="relative z-10 max-w-sm mx-auto w-full">
        <h1 className="text-4xl mb-1" style={{color:"#F7F5EF",fontFamily:"Fraunces",fontWeight:600}}>Carriles</h1>
        <p className="text-sm mb-6" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Elegí tu nueva contraseña</p>
        {success
          ?<div className="rounded-2xl p-5 text-center" style={{background:"#E1F0E3"}}><p className="text-2xl mb-2">✓</p><p className="font-semibold" style={{color:"#2C6E31",fontFamily:"Inter"}}>Contraseña actualizada</p></div>
          :<div className="rounded-2xl p-4" style={{background:"#123B4A",border:"1px solid rgba(46,156,171,0.3)"}}>
            <label className="text-xs font-bold uppercase tracking-wide" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Nueva contraseña</label>
            <div className="relative mt-1 mb-3">
              <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                className="w-full rounded-lg px-3 py-2.5 text-sm pr-10" style={{background:"#0B3D4C",color:"#F7F5EF",border:"1px solid rgba(46,156,171,0.4)",fontFamily:"Inter",outline:"none"}}/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:"10px",top:"10px",background:"none",border:"none",cursor:"pointer"}}>{showPass?<EyeOff size={16} color="#9FC4CE"/>:<Eye size={16} color="#9FC4CE"/>}</button>
            </div>
            <label className="text-xs font-bold uppercase tracking-wide" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Confirmá</label>
            <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repetí la contraseña"
              className="w-full rounded-lg px-3 py-2.5 mt-1 mb-3 text-sm" style={{background:"#0B3D4C",color:"#F7F5EF",border:"1px solid rgba(46,156,171,0.4)",fontFamily:"Inter",outline:"none"}}/>
            {error&&<p className="text-xs mb-3" style={{color:"#F2A08C",fontFamily:"Inter"}}>{error}</p>}
            <button onClick={save} disabled={loading} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{background:"#E8622C",border:"none",cursor:"pointer",fontFamily:"Inter"}}>{loading?"Guardando...":"Guardar nueva contraseña"}</button>
          </div>
        }
      </div>
    </div>
  );
}

function AnuncioPopup({anuncio,onClose,onMarcarLeido}){
  if(!anuncio)return null;
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:"rgba(11,61,76,0.7)"}}>
      <div className="rounded-2xl p-6 max-w-sm w-full" style={{background:"#fff",border:"2px solid #2E9CAB"}}>
        <div className="flex items-center gap-2 mb-3">
          <Megaphone size={20} color="#2E9CAB"/>
          <span className="font-semibold" style={{color:"#0B3D4C",fontFamily:"Fraunces",fontSize:"18px"}}>Anuncio</span>
          <span className="text-xs ml-auto" style={{color:"#8A99A3",fontFamily:"Inter"}}>{anuncio.autor}</span>
        </div>
        <p className="text-sm mb-4" style={{color:"#33414A",fontFamily:"Inter",lineHeight:1.6}}>{anuncio.contenido}</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 text-sm font-semibold rounded-lg py-2.5 text-white" style={{background:"#2E9CAB",border:"none",cursor:"pointer",fontFamily:"Inter"}}>Aceptar</button>
          <button onClick={onMarcarLeido} className="flex-1 text-sm font-semibold rounded-lg py-2.5" style={{background:"#F1F3F4",color:"#33414A",border:"none",cursor:"pointer",fontFamily:"Inter"}}>Marcar como leído</button>
        </div>
        <p className="text-xs mt-2 text-center" style={{color:"#8A99A3",fontFamily:"Inter"}}>Aceptar → vuelve a aparecer · Leído → no vuelve</p>
      </div>
    </div>
  );
}

function CrearUsuario({onBack}){
  const [form,setForm]=useState({nombre:"",apellido:"",email:"",password:"12345678",rol:"usuario",deportes:[],dni:"",fecha_nacimiento:"",sexo:""});
  const [showPass,setShowPass]=useState(false);
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);
  const opDep=["natacion","voley","handball","matro"];
  const toggleDep=(d)=>setForm(p=>({...p,deportes:p.deportes.includes(d)?p.deportes.filter(x=>x!==d):[...p.deportes,d]}));
  const crear=async()=>{
    if(!form.email||!form.nombre){setMsg("Nombre y email obligatorios.");return;}
    setLoading(true);setMsg("Procesando...");
    const {data,error:ae}=await supabase.auth.signUp({email:form.email,password:form.password});
    if(ae){setMsg("Error Auth: "+ae.message);setLoading(false);return;}
    const depFinal=(form.rol==="staff"||form.rol==="admin")?SPORTS.map(s=>s.id).join(";"):form.deportes.join(";");
    const {error:de}=await supabase.from("usuarios").insert([{id:data.user.id,usuario:form.email,rol:form.rol,nombre:form.nombre,apellido:form.apellido,deportes:depFinal,dni:form.dni,fecha_nacimiento:form.fecha_nacimiento||null,sexo:form.sexo}]);
    if(de)setMsg("Error DB: "+de.message);
    else{setMsg("✓ Usuario creado: "+form.nombre);setForm({nombre:"",apellido:"",email:"",password:"12345678",rol:"usuario",deportes:[],dni:"",fecha_nacimiento:"",sexo:""});}
    setLoading(false);
  };
  return(
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center gap-3 mb-4"><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#2E9CAB",fontFamily:"Inter",fontSize:"14px"}}>← Volver</button><h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Crear usuario</h2></div>
      <div className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
        <div className="flex flex-col gap-3">
          {[["Nombre","nombre","text"],["Apellido","apellido","text"],["Email","email","email"],["DNI","dni","text"]].map(([l,k,t])=>(
            <div key={k}><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{l}</label><input type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/></div>
          ))}
          <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Fecha de nacimiento</label><input type="date" value={form.fecha_nacimiento} onChange={e=>setForm({...form,fecha_nacimiento:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}/>{form.fecha_nacimiento&&<p className="text-xs mt-1" style={{color:"#2E9CAB",fontFamily:"Inter"}}>Edad: {calcEdad(form.fecha_nacimiento)} años</p>}</div>
          <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sexo</label><select value={form.sexo} onChange={e=>setForm({...form,sexo:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}><option value="">Sin especificar</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="X">No binario</option></select></div>
          <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Contraseña</label><div className="relative mt-1"><input type={showPass?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm pr-10" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/><button type="button" onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:"8px",top:"8px",background:"none",border:"none",cursor:"pointer"}}>{showPass?<EyeOff size={16} color="#8A99A3"/>:<Eye size={16} color="#8A99A3"/>}</button></div></div>
          <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Rol</label><select value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}><option value="usuario">Alumno</option><option value="profesor">Profesor</option><option value="staff">Secretaría</option><option value="admin">Admin</option></select></div>
          {(form.rol==="usuario"||form.rol==="profesor")&&(
            <div><label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{color:"#8A99A3",fontFamily:"Inter"}}>Deportes</label><div className="grid grid-cols-2 gap-2">{opDep.map(d=>{const s=SPORTS.find(sp=>sp.id===d);return(<button key={d} type="button" onClick={()=>toggleDep(d)} className="p-2 rounded-xl text-sm font-semibold" style={{background:form.deportes.includes(d)?s?.color:"#F1F3F4",color:form.deportes.includes(d)?"#fff":"#33414A",border:"none",cursor:"pointer",fontFamily:"Inter"}}>{s?.emoji} {s?.name}</button>);})}</div></div>
          )}
          <button onClick={crear} disabled={loading} className="w-full text-white text-sm font-semibold rounded-lg py-2.5" style={{background:"#0B3D4C",border:"none",cursor:"pointer",fontFamily:"Inter"}}>{loading?"Creando...":"Crear usuario"}</button>
        </div>
        {msg&&<p className="mt-3 p-2 text-sm rounded-lg" style={{background:"#E4F2F3",color:"#0B3D4C",fontFamily:"Inter"}}>{msg}</p>}
      </div>
    </div>
  );
}

function Header({profile,title,onLogout,pendingCount,onBell,sport,activeProfile}){
  const now=useClock();
  const roleLabel={usuario:"Alumno",profesor:"Profesor",staff:"Staff",admin:"Admin"};
  const activeSport=SPORTS.find(s=>s.id===sport);
  const usesSportBg=["usuario","profesor"].includes(profile.rol)&&activeSport;
  const roleBg={
    admin:"linear-gradient(135deg,#0B3D4C 0%,#123B4A 100%)",
    staff:"linear-gradient(135deg,#2D1B69 0%,#4A2F8A 100%)",
  };
  const headerBg=usesSportBg?activeSport.bg:(roleBg[profile.rol]||"linear-gradient(135deg,#0B3D4C 0%,#123B4A 100%)");
  const ap=activeProfile||profile;
  const displayName=`${ap.nombre||""} ${ap.apellido||""}`.trim();
  return(
    <div className="px-4 pt-5 pb-4 rounded-b-3xl relative overflow-hidden" style={{background:headerBg}}>
      <style>{FONT_IMPORT}</style>
      {usesSportBg&&<div className="absolute top-0 right-0 text-6xl opacity-10 pr-4 pt-2 select-none">{activeSport.emoji}</div>}
      {!usesSportBg&&<svg className="absolute top-0 right-0 opacity-10" style={{width:"150px",height:"80px"}} viewBox="0 0 200 100"><path d="M0,50 Q50,20 100,50 T200,50" stroke="#F2C230" strokeWidth="3" fill="none"/></svg>}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{color:"rgba(255,255,255,0.6)",fontFamily:"Inter"}}>{roleLabel[profile.rol]||profile.rol}</p>
          <h1 className="text-xl" style={{color:"#F7F5EF",fontFamily:"Fraunces",fontWeight:600}}>{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {(profile.rol==="staff"||profile.rol==="admin")&&(
            <button onClick={onBell} className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer"}}>
              <Bell size={16} color="#F7F5EF"/>
              {pendingCount>0&&<span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{background:"#E8622C",color:"#fff"}}>{pendingCount}</span>}
            </button>
          )}
          <button onClick={onLogout} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer"}}><LogOut size={16} color="#F7F5EF"/></button>
        </div>
      </div>
      <p className="relative z-10 text-sm mt-1" style={{color:"#F2C230",fontFamily:"Inter"}}>{displayName}</p>
      {(profile.rol==="usuario"||profile.rol==="profesor")&&(
        <p className="relative z-10 text-xs mt-0.5" style={{color:"rgba(255,255,255,0.5)",fontFamily:"Inter"}}>
          {DIAS_ES[now.getDay()]} {now.getDate()} de {MESES_ES[now.getMonth()]} · {String(now.getHours()).padStart(2,"0")}:{String(now.getMinutes()).padStart(2,"0")}
        </p>
      )}
    </div>
  );
}

function ProfileSelector({profile,dependientes,activeProfile,setActiveProfile}){
  const [open,setOpen]=useState(false);
  const options=[{...profile,_self:true},...dependientes];
  const current=activeProfile||profile;
  const nombre=`${current.nombre||""} ${current.apellido||""}`.trim();
  return(
    <div className="px-4 pt-3 relative">
      <button onClick={()=>setOpen(!open)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold" style={{background:"#E4F2F3",border:"none",cursor:"pointer",fontFamily:"Inter",color:"#0B3D4C"}}>
        <User size={14}/> {nombre||"Mi perfil"} <ChevronDown size={14}/>
      </button>
      {open&&(
        <div className="absolute left-4 top-12 z-40 rounded-2xl shadow-lg overflow-hidden" style={{background:"#fff",border:"1px solid #E2E8ED",minWidth:"200px"}}>
          {options.map((p,i)=>{
            const n=`${p.nombre||""} ${p.apellido||""}`.trim();
            const isCurrent=activeProfile?activeProfile.id===p.id:p._self;
            return(
              <button key={p.id||i} onClick={()=>{setActiveProfile(p._self?null:p);setOpen(false);}}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm" style={{background:isCurrent?"#E4F2F3":"#fff",border:"none",cursor:"pointer",fontFamily:"Inter",color:"#33414A",borderBottom:"1px solid #F1F3F4"}}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{background:isCurrent?"#2E9CAB":"#F1F3F4",color:isCurrent?"#fff":"#33414A"}}>{(n||"?")[0]}</div>
                <span>{n||"Sin nombre"}{p._self?" (yo)":""}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NotificationsPanel({notifications,onResolve,onClose}){
  return(
    <div className="fixed inset-0 z-50 flex flex-col" style={{background:"rgba(11,61,76,0.6)"}} onClick={onClose}>
      <div className="mt-auto rounded-t-3xl p-4 max-h-[70vh] overflow-y-auto" style={{background:"#F7F5EF"}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>🔔 Notificaciones</h2><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8A99A3"}}><X size={20}/></button></div>
        {notifications.length===0&&<p className="text-sm text-center py-6" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin notificaciones pendientes</p>}
        <div className="flex flex-col gap-2.5">
          {notifications.map((n,i)=>(
            <div key={i} className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
              <div className="flex items-center gap-2 mb-1">
                {n.type==="solicitud"?<ArrowLeftRight size={14} color="#2E9CAB"/>:n.type==="mensaje"?<MessageSquare size={14} color="#7CB9C9"/>:<CreditCard size={14} color="#E8622C"/>}
                <span className="text-xs font-bold uppercase" style={{color:n.type==="solicitud"?"#2E9CAB":n.type==="mensaje"?"#7CB9C9":"#E8622C",fontFamily:"Inter"}}>{n.type==="solicitud"?"Cambio de horario":n.type==="mensaje"?"Mensaje nuevo":"Comprobante"}</span>
              </div>
              <p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{n.de||n.usuario}</p>
              <p className="text-xs mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>{n.type==="mensaje"?(n.contenido||"").slice(0,60)+"...":n.type==="solicitud"?`${n.desde} → ${n.hasta}`:`${n.deporte} · ${n.fecha}`}</p>
              {n.type!=="mensaje"&&n.estado==="pendiente"&&(
                <div className="flex gap-2">
                  <button onClick={()=>onResolve(n,"aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#E1F0E3",color:"#2C6E31",border:"none",cursor:"pointer"}}>✓ Aprobar</button>
                  <button onClick={()=>onResolve(n,"rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#FCE7DC",color:"#B4441C",border:"none",cursor:"pointer"}}>✗ Rechazar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SportTabs({sports,active,onChange}){
  const list=sports?SPORTS.filter(s=>sports.includes(s.id)):SPORTS;
  if(list.length<=1)return null;
  return(
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 pt-4" style={{scrollbarWidth:"none"}}>
      {list.map(s=>{const isActive=active===s.id;return(
        <button key={s.id} onClick={()=>onChange(s.id)} className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-semibold"
          style={{background:isActive?s.color:"#fff",borderColor:isActive?s.color:"#E2E8ED",color:isActive?"#fff":"#33414A",cursor:"pointer",fontFamily:"Inter"}}>
          {s.emoji} {s.name}
        </button>
      );})}
    </div>
  );
}

function BottomNav({tabs,active,onChange,mensajesNuevos}){
  return(
    <div className="fixed bottom-0 left-0 right-0 flex justify-around px-2 py-2 max-w-2xl mx-auto" style={{background:"#fff",borderTop:"1px solid #E2E8ED"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onChange(t.id)} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative" style={{background:active===t.id?"#E4F2F3":"transparent",border:"none",cursor:"pointer"}}>
          <t.icon size={20} color={active===t.id?"#0B3D4C":"#8A99A3"} strokeWidth={2.1}/>
          {t.id==="solicitudes"&&mensajesNuevos>0&&<span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{background:"#E8622C"}}/>}
          <span className="text-[10px] font-semibold" style={{color:active===t.id?"#0B3D4C":"#8A99A3",fontFamily:"Inter"}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function ClasesView({schedule,setSchedule,sport,role,users,userName,inscripciones,activeUserId}){
  const sportData=SPORTS.find(s=>s.id===sport);
  const canManage=role==="admin"||role==="staff";
  const myClaseIds=inscripciones.filter(i=>i.usuario===(activeUserId||userName)).map(i=>String(i.clase_id));
  const items=role==="profesor"
    ?schedule.filter(s=>s.deporte===sport&&s.usuario_profesor===userName)
    :role==="usuario"
    ?schedule.filter(s=>s.deporte===sport&&myClaseIds.includes(String(s.id)))
    :schedule.filter(s=>s.deporte===sport);

  const DAYS_LIST=["Lun","Mar","Mie","Jue","Vie","Sab"];
  const HOURS_LIST=["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
  const profesores=users.filter(u=>u.rol==="profesor"&&u.deportes&&u.deportes.split(";").map(s=>s.trim()).includes(sport));

  // Vista día
  const today=new Date();
  const todayIdx=today.getDay()===0?6:today.getDay()-1; // 0=Lun
  const [dayIdx,setDayIdx]=useState(todayIdx<6?todayIdx:0);
  const [vistaCalendario,setVistaCalendario]=useState(false);
  const [showNueva,setShowNueva]=useState(false);
  const [draft,setDraft]=useState({dia:"Lun",hora:"09:00",hora_fin:"10:00",lugar:sportData?.lugares?.[0]||"",cupo:10,categoria:sportData?.categorias?.[0]||"",selProf:""});
  const [saving,setSaving]=useState(false);
  const [editModal,setEditModal]=useState(null);

  const dayKey=DAYS_LIST[dayIdx];
  const dayItems=items.filter(it=>it.dia===dayKey).sort((a,b)=>a.hora.localeCompare(b.hora));

  const saveNueva=async()=>{
    if(!draft.selProf||!draft.lugar)return;
    setSaving(true);
    const profUser=users.find(u=>u.usuario===draft.selProf);
    const profNombre=profUser?`${profUser.nombre||""} ${profUser.apellido||""}`.trim():"";
    const {data}=await supabase.from("clases").insert([{deporte:sport,dia:draft.dia,hora:draft.hora,hora_fin:draft.hora_fin,profesor:profNombre,usuario_profesor:draft.selProf,lugar:draft.lugar,cupo:draft.cupo,inscriptos:0,categoria:draft.categoria}]).select().single();
    if(data)setSchedule(p=>[...p,data]);
    setSaving(false);setShowNueva(false);
  };

  const saveEdit=async()=>{
    if(!editModal)return;
    setSaving(true);
    const profUser=users.find(u=>u.usuario===editModal.selProf);
    const profNombre=profUser?`${profUser.nombre||""} ${profUser.apellido||""}`.trim():editModal.profesor;
    await supabase.from("clases").update({dia:editModal.dia,hora:editModal.hora,hora_fin:editModal.hora_fin,profesor:profNombre,usuario_profesor:editModal.selProf,lugar:editModal.lugar,cupo:editModal.cupo,categoria:editModal.categoria}).eq("id",editModal.id);
    setSchedule(p=>p.map(s=>s.id===editModal.id?{...s,...editModal,profesor:profNombre}:s));
    setSaving(false);setEditModal(null);
  };

  const deleteClase=async(id)=>{
    await supabase.from("clases").delete().eq("id",id);
    setSchedule(p=>p.filter(s=>s.id!==id));
    setEditModal(null);
  };

  if(role==="usuario"&&items.length===0){
    return(<div className="px-4 pt-10 pb-24 text-center"><p className="text-4xl mb-3">📭</p><p className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>No tenés clases asignadas en este deporte</p><p className="text-sm mt-1" style={{color:"#8A99A3",fontFamily:"Inter"}}>Consultá en secretaría.</p></div>);
  }

  // Modal form compartido (nueva o editar)
  const ModalForm=({data,setData,onSave,onDelete,onClose,title})=>(
    <div className="fixed inset-0 z-50 flex items-end" style={{background:"rgba(11,61,76,0.6)"}} onClick={onClose}>
      <div className="w-full max-w-2xl mx-auto rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto" style={{background:"#F7F5EF"}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg" style={{color:"#33414A",fontFamily:"Fraunces"}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8A99A3"}}><X size={20}/></button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Día</label>
              <select value={data.dia} onChange={e=>setData({...data,dia:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}>
                {DAYS_LIST.map(d=><option key={d} value={d}>{DAY_LABELS[d]||d}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Cupo</label>
              <input type="number" value={data.cupo} onChange={e=>setData({...data,cupo:+e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Hora inicio</label>
              <select value={data.hora} onChange={e=>setData({...data,hora:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}>
                {HOURS_LIST.map(h=><option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Hora fin</label>
              <select value={data.hora_fin||""} onChange={e=>setData({...data,hora_fin:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}>
                <option value="">Sin fin</option>
                {HOURS_LIST.map(h=><option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
          <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Profesor/a</label>
            <select value={data.selProf||""} onChange={e=>setData({...data,selProf:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}>
              <option value="">— Seleccioná —</option>
              {profesores.map(p=><option key={p.id} value={p.usuario}>{p.nombre} {p.apellido||""}</option>)}
            </select>
          </div>
          {sportData?.lugares&&sportData.lugares.length>0&&(
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{sport==="natacion"?"Carril":"Lugar"}</label>
              <select value={data.lugar||""} onChange={e=>setData({...data,lugar:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}>
                {sportData.lugares.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          )}
          {sportData?.categorias&&sportData.categorias.length>0&&(
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Categoría</label>
              <select value={data.categoria||""} onChange={e=>setData({...data,categoria:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}>
                <option value="">Sin categoría</option>
                {sportData.categorias.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onSave} disabled={saving} className="flex-1 text-white text-sm font-semibold rounded-lg py-2.5" style={{background:"#0B3D4C",border:"none",cursor:"pointer"}}>{saving?"Guardando...":"Guardar"}</button>
          {onDelete&&<button onClick={onDelete} className="text-sm font-semibold rounded-lg py-2.5 px-4" style={{background:"#FCE7DC",color:"#B4441C",border:"none",cursor:"pointer"}}>🗑</button>}
          <button onClick={onClose} className="text-sm font-semibold rounded-lg py-2.5 px-4" style={{background:"#F1F3F4",color:"#33414A",border:"none",cursor:"pointer"}}>Cancelar</button>
        </div>
      </div>
    </div>
  );

  // Vista semana (calendario simplificado)
  if(vistaCalendario){
    const sport_=SPORTS.find(s=>s.id===sport);
    return(
      <div className="px-4 pt-4 pb-24">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Semana — {sportData?.name}</h2>
          <button onClick={()=>setVistaCalendario(false)} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{background:"#E4F2F3",color:"#0B3D4C",border:"none",cursor:"pointer"}}>Vista Día</button>
        </div>
        <div className="rounded-2xl overflow-hidden text-xs" style={{border:"1px solid #E2E8ED"}}>
          <div className="grid" style={{gridTemplateColumns:"40px repeat(6,1fr)",background:"#0B3D4C"}}>
            <div className="p-1 text-center text-xs" style={{color:"#9FC4CE"}}></div>
            {DAYS_LIST.map(d=><div key={d} className="p-1 text-center font-bold text-xs" style={{color:"#9FC4CE",fontFamily:"Inter"}}>{DAY_LABELS[d]}</div>)}
          </div>
          {HOURS_LIST.map((hour,i)=>(
            <div key={hour} className="grid" style={{gridTemplateColumns:"40px repeat(6,1fr)",background:i%2===0?"#fff":"#F7F5EF",borderTop:"1px solid #E2E8ED"}}>
              <div className="p-1 text-center" style={{color:"#8A99A3",fontFamily:"IBM Plex Mono",borderRight:"1px solid #E2E8ED",fontSize:"9px"}}>{hour}</div>
              {DAYS_LIST.map(d=>{
                const clases=items.filter(it=>it.dia===d&&it.hora===hour);
                return(
                  <div key={d} className="p-0.5 min-h-[30px] flex flex-col gap-0.5" style={{borderRight:"1px solid #E2E8ED"}}>
                    {clases.map(cls=>(
                      <button key={cls.id} onClick={canManage?()=>setEditModal({...cls,selProf:cls.usuario_profesor||""}):undefined}
                        className="w-full rounded px-0.5 py-0.5 text-left"
                        style={{background:+cls.inscriptos>=+cls.cupo?"#FCE7DC":sport_?.color+"33",color:+cls.inscriptos>=+cls.cupo?"#B4441C":"#33414A",fontFamily:"Inter",fontSize:"8px",fontWeight:600,border:"none",cursor:canManage?"pointer":"default"}}>
                        {cls.categoria?cls.categoria.slice(0,5):cls.profesor?.split(" ")[0]}<br/>
                        <span style={{fontFamily:"IBM Plex Mono",fontSize:"7px"}}>{cls.lugar?.replace("Carril ","C")||""} {cls.inscriptos}/{cls.cupo}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {editModal&&<ModalForm data={editModal} setData={setEditModal} onSave={saveEdit} onDelete={()=>deleteClase(editModal.id)} onClose={()=>setEditModal(null)} title="Editar clase"/>}
      </div>
    );
  }

  // Vista día (default)
  return(
    <div className="px-4 pt-4 pb-24">
      {/* Header día */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={()=>setDayIdx(i=>(i-1+6)%6)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:"#fff",border:"1px solid #E2E8ED",cursor:"pointer",fontSize:"16px"}}>‹</button>
          <div>
            <p className="font-semibold" style={{color:"#33414A",fontFamily:"Fraunces",fontSize:"18px"}}>{DAY_LABELS[dayKey]||dayKey}</p>
            <p className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{formatShortDate(nextDateForDay(dayKey))}</p>
          </div>
          <button onClick={()=>setDayIdx(i=>(i+1)%6)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:"#fff",border:"1px solid #E2E8ED",cursor:"pointer",fontSize:"16px"}}>›</button>
        </div>
        <div className="flex gap-2">
          {canManage&&<button onClick={()=>{setDraft({dia:dayKey,hora:"09:00",hora_fin:"10:00",lugar:sportData?.lugares?.[0]||"",cupo:10,categoria:sportData?.categorias?.[0]||"",selProf:""});setShowNueva(true);}} className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-full" style={{background:"#E8622C",border:"none",cursor:"pointer"}}><Plus size={13}/>Nueva</button>}
          <button onClick={()=>setVistaCalendario(true)} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{background:"#E4F2F3",color:"#0B3D4C",border:"none",cursor:"pointer"}}>Semana</button>
        </div>
      </div>

      {dayItems.length===0
        ?<div className="text-center py-12"><p className="text-3xl mb-2">📅</p><p className="text-sm" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin clases este día{canManage?" · Tocá + Nueva para agregar":""}</p></div>
        :<div className="flex flex-col gap-3">
          {dayItems.map(it=>(
            <div key={it.id} className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold" style={{color:"#0B3D4C",fontFamily:"IBM Plex Mono"}}>{it.hora}{it.hora_fin?" – "+it.hora_fin:""}</span>
                    {it.categoria&&<span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:sportData?.color+"22",color:sportData?.color,fontFamily:"Inter"}}>{it.categoria}</span>}
                  </div>
                  <p className="font-semibold text-sm" style={{color:"#33414A",fontFamily:"Inter"}}>{it.profesor}</p>
                  <p className="text-xs mt-0.5" style={{color:"#8A99A3",fontFamily:"Inter"}}>{it.lugar} · {it.inscriptos}/{it.cupo} cupos</p>
                </div>
                {canManage&&<button onClick={()=>setEditModal({...it,selProf:it.usuario_profesor||""})} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{background:"#F1F3F4",border:"none",cursor:"pointer"}}><Pencil size={13} color="#33414A"/></button>}
              </div>
            </div>
          ))}
        </div>
      }
      {showNueva&&<ModalForm data={draft} setData={setDraft} onSave={saveNueva} onClose={()=>setShowNueva(false)} title="Nueva clase"/>}
      {editModal&&<ModalForm data={editModal} setData={setEditModal} onSave={saveEdit} onDelete={()=>deleteClase(editModal.id)} onClose={()=>setEditModal(null)} title="Editar clase"/>}
    </div>
  );
}

function SolicitudesView({requests,setRequests,mensajes,setMensajes,sport,role,userName,schedule,setSchedule,inscripciones,setInscripciones,users,activeUserId}){
  const [subTab,setSubTab]=useState("cambios");
  const canManage=role==="staff"||role==="admin";
  const efectiveUser=activeUserId||userName;
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({from:"",to:""});
  const [saving,setSaving]=useState(false);
  const filtered=canManage?requests.filter(r=>r.deporte===sport):requests.filter(r=>r.deporte===sport&&r.usuario===efectiveUser);
  const updateReq=async(r,estado)=>{
    await supabase.from("solicitudes").update({estado}).eq("id",r.id);
    setRequests(p=>p.map(x=>x.id===r.id?{...x,estado}:x));
    if(estado==="aprobado"){
      const co=schedule.find(c=>c.deporte===r.deporte&&`${DAY_LABELS[c.dia]||c.dia} ${c.hora}`===r.desde);
      const cd=schedule.find(c=>c.deporte===r.deporte&&`${DAY_LABELS[c.dia]||c.dia} ${c.hora}`===r.hasta);
      if(co){const ni=Math.max(0,(co.inscriptos||0)-1);await supabase.from("clases").update({inscriptos:ni}).eq("id",co.id);setSchedule(p=>p.map(s=>s.id===co.id?{...s,inscriptos:ni}:s));}
      if(cd){const ni=(cd.inscriptos||0)+1;await supabase.from("clases").update({inscriptos:ni}).eq("id",cd.id);setSchedule(p=>p.map(s=>s.id===cd.id?{...s,inscriptos:ni}:s));
        if(co){await supabase.from("inscripciones").delete().eq("usuario",r.usuario).eq("clase_id",co.id);const {data}=await supabase.from("inscripciones").insert([{usuario:r.usuario,clase_id:cd.id}]).select().single();if(data)setInscripciones(p=>[...p.filter(i=>!(i.usuario===r.usuario&&String(i.clase_id)===String(co.id))),data]);}
      }
    }
  };
  const createReq=async()=>{
    if(!form.from||!form.to)return;setSaving(true);
    const {data}=await supabase.from("solicitudes").insert([{usuario:efectiveUser,deporte:sport,desde:form.from,hasta:form.to,estado:"pendiente"}]).select().single();
    if(data)setRequests(p=>[...p,data]);
    setForm({from:"",to:""});setShowForm(false);setSaving(false);
  };
  const staffUsers=users.filter(u=>u.rol==="staff"||u.rol==="admin");
  const profUsers=users.filter(u=>u.rol==="profesor"&&u.deportes&&u.deportes.split(";").map(s=>s.trim()).includes(sport));
  const [selConv,setSelConv]=useState(null);
  const [newMsg,setNewMsg]=useState("");
  const [newAnuncio,setNewAnuncio]=useState("");
  const [showAnuncio,setShowAnuncio]=useState(false);
  const msgEndRef=useRef(null);
  const myConvs=canManage
    ?[...new Set(mensajes.map(m=>m.de===userName?m.para:m.para===userName?m.de:null).filter(Boolean))]
    :[...new Set(mensajes.filter(m=>m.de===efectiveUser||m.para===efectiveUser).map(m=>m.de===efectiveUser?m.para:m.de))];
  const convMessages=selConv?mensajes.filter(m=>(m.de===selConv&&m.para===userName)||(m.de===userName&&m.para===selConv)||(m.de===selConv&&m.para===efectiveUser)||(m.de===efectiveUser&&m.para===selConv)):[];
  const sendMsg=async()=>{
    if(!newMsg.trim()||!selConv)return;
    const {data}=await supabase.from("mensajes").insert([{de:canManage?userName:efectiveUser,para:selConv,contenido:newMsg.trim(),leido:false,tipo:"privado"}]).select().single();
    if(data)setMensajes(p=>[...p,data]);
    await supabase.from("mensajes").update({leido:true}).eq("de",selConv).eq("para",canManage?userName:efectiveUser);
    setMensajes(p=>p.map(m=>m.de===selConv&&m.para===(canManage?userName:efectiveUser)?{...m,leido:true}:m));
    setNewMsg("");
    setTimeout(()=>msgEndRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };
  const sendAnuncio=async()=>{
    if(!newAnuncio.trim())return;
    await supabase.from("anuncios").insert([{autor:userName,contenido:newAnuncio.trim(),activo:true}]);
    setNewAnuncio("");setShowAnuncio(false);
  };
  const hasUnread=(conv)=>mensajes.some(m=>m.de===conv&&m.para===(canManage?userName:efectiveUser)&&!m.leido);
  const getUserName=(uid)=>{const u=users.find(x=>x.usuario===uid);return u?`${u.nombre||""} ${u.apellido||""}`.trim():uid;};
  const statusTone={pendiente:"yellow",aprobado:"green",rechazado:"orange"};
  return(
    <div className="pb-24">
      <div className="flex gap-2 px-4 pt-4 mb-1">
        {(role==="profesor"?["mensajeria"]:["cambios","mensajeria"]).map(v=>(
          <button key={v} onClick={()=>setSubTab(v)} className="flex-1 text-sm font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5"
            style={{background:subTab===v?"#0B3D4C":"#fff",color:subTab===v?"#fff":"#33414A",border:`1px solid ${subTab===v?"#0B3D4C":"#E2E8ED"}`,cursor:"pointer",fontFamily:"Inter"}}>
            {v==="cambios"?<><ArrowLeftRight size={14}/>Cambios</>:<><MessageSquare size={14}/>Mensajería</>}
          </button>
        ))}
      </div>
      {subTab==="cambios"&&(
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Cambios de horario</h2>
            {!canManage&&<button onClick={()=>setShowForm(!showForm)} className="text-xs font-semibold text-white px-3 py-1.5 rounded-full" style={{background:"#2E9CAB",border:"none",cursor:"pointer"}}>⇄ Solicitar</button>}
          </div>
          {showForm&&(
            <div className="rounded-2xl p-4 mb-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
              <input value={form.from} onChange={e=>setForm({...form,from:e.target.value})} placeholder="Horario actual (ej: Lun 17:00)" className="w-full border rounded-lg px-2 py-1.5 text-sm mb-2" style={{borderColor:"#E2E8ED"}}/>
              <input value={form.to} onChange={e=>setForm({...form,to:e.target.value})} placeholder="Horario deseado (ej: Vie 18:00)" className="w-full border rounded-lg px-2 py-1.5 text-sm mb-2" style={{borderColor:"#E2E8ED"}}/>
              <button onClick={createReq} disabled={saving} className="w-full text-white text-sm font-semibold rounded-lg py-2" style={{background:"#0B3D4C",border:"none",cursor:"pointer"}}>{saving?"Enviando...":"Enviar solicitud"}</button>
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            {filtered.length===0&&<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin solicitudes.</p>}
            {filtered.map(r=>(
              <div key={r.id} className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
                <div className="flex items-center justify-between mb-2"><p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{r.usuario}</p><Badge tone={statusTone[r.estado]||"aqua"}>{r.estado}</Badge></div>
                <p className="text-sm" style={{color:"#33414A",fontFamily:"IBM Plex Mono"}}>{r.desde} → {r.hasta}</p>
                {canManage&&r.estado==="pendiente"&&(
                  <div className="flex gap-2 mt-3">
                    <button onClick={()=>updateReq(r,"aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#E1F0E3",color:"#2C6E31",border:"none",cursor:"pointer"}}>✓ Aprobar</button>
                    <button onClick={()=>updateReq(r,"rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#FCE7DC",color:"#B4441C",border:"none",cursor:"pointer"}}>✗ Rechazar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {subTab==="mensajeria"&&(
        <div className="px-4 pt-3">
          {canManage&&(
            <div className="mb-3">
              {!showAnuncio
                ?<button onClick={()=>setShowAnuncio(true)} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl w-full" style={{background:"#FDF3D6",color:"#8A6A0A",border:"1px solid #F2C230",cursor:"pointer",fontFamily:"Inter"}}><Megaphone size={14}/> Enviar anuncio general</button>
                :<div className="rounded-2xl p-4" style={{background:"#FDF3D6",border:"1px solid #F2C230"}}>
                    <p className="text-xs font-semibold mb-2" style={{color:"#8A6A0A",fontFamily:"Inter"}}>📢 Anuncio general</p>
                    <textarea value={newAnuncio} onChange={e=>setNewAnuncio(e.target.value)} placeholder="Escribí el anuncio..." rows={3} className="w-full border rounded-lg px-3 py-2 text-sm mb-2" style={{borderColor:"#F2C230",fontFamily:"Inter",resize:"none"}}/>
                    <div className="flex gap-2">
                      <button onClick={sendAnuncio} className="flex-1 text-white text-sm font-semibold rounded-lg py-2" style={{background:"#8A6A0A",border:"none",cursor:"pointer"}}>Publicar</button>
                      <button onClick={()=>setShowAnuncio(false)} className="flex-1 text-sm font-semibold rounded-lg py-2" style={{background:"#F1F3F4",color:"#33414A",border:"none",cursor:"pointer"}}>Cancelar</button>
                    </div>
                  </div>
              }
            </div>
          )}
          {!selConv?(
            <>
              {!canManage&&(
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>Escribir a</p>
                  <div className="flex flex-col gap-1.5">
                    {[...staffUsers,...profUsers].filter((u,i,a)=>a.findIndex(x=>x.usuario===u.usuario)===i).map(u=>(
                      <button key={u.usuario} onClick={()=>setSelConv(u.usuario)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left" style={{background:"#fff",border:"1px solid #E2E8ED",cursor:"pointer"}}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{(u.nombre||"?")[0]}</div>
                        <div><p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{u.nombre} {u.apellido||""}</p><p className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{u.rol==="staff"||u.rol==="admin"?"Secretaría":"Profesor"}</p></div>
                        {hasUnread(u.usuario)&&<span className="ml-auto w-2.5 h-2.5 rounded-full" style={{background:"#E8622C"}}/>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {myConvs.length>0&&(
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>{canManage?"Mensajes recibidos":"Conversaciones activas"}</p>
                  <div className="flex flex-col gap-1.5">
                    {myConvs.map(conv=>(
                      <button key={conv} onClick={()=>setSelConv(conv)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left" style={{background:"#fff",border:"1px solid #E2E8ED",cursor:"pointer"}}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{(getUserName(conv)||"?")[0]}</div>
                        <div className="flex-1"><p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{getUserName(conv)}</p><p className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mensajes.filter(m=>(m.de===conv&&m.para===userName)||(m.de===userName&&m.para===conv)).slice(-1)[0]?.contenido?.slice(0,40)||""}</p></div>
                        {hasUnread(conv)&&<span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:"#E8622C"}}/>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ):(
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <button onClick={()=>setSelConv(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#2E9CAB",fontFamily:"Inter",fontSize:"14px"}}>← Volver</button>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{(getUserName(selConv)||"?")[0]}</div>
                <span className="font-semibold text-sm" style={{color:"#33414A",fontFamily:"Inter"}}>{getUserName(selConv)}</span>
              </div>
              <div className="flex flex-col gap-2 mb-3 max-h-72 overflow-y-auto">
                {convMessages.length===0&&<p className="text-sm text-center py-4" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin mensajes aún.</p>}
                {convMessages.map((m,i)=>{
                  const isMine=m.de===(canManage?userName:efectiveUser);
                  return(
                    <div key={m.id||i} className={`flex ${isMine?"justify-end":"justify-start"}`}>
                      <div className="rounded-2xl px-3 py-2 max-w-[80%]" style={{background:isMine?"#0B3D4C":"#fff",border:isMine?"none":"1px solid #E2E8ED"}}>
                        <p className="text-sm" style={{color:isMine?"#F7F5EF":"#33414A",fontFamily:"Inter"}}>{m.contenido}</p>
                        <p className="text-xs mt-0.5" style={{color:isMine?"rgba(255,255,255,0.5)":"#8A99A3",fontFamily:"IBM Plex Mono",fontSize:"10px"}}>{new Date(m.created_at).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={msgEndRef}/>
              </div>
              <div className="flex gap-2">
                <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Escribí un mensaje..." className="flex-1 border rounded-xl px-3 py-2 text-sm" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/>
                <button onClick={sendMsg} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:"#2E9CAB",border:"none",cursor:"pointer"}}>Enviar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PaymentView({sport,role,comprobantes,setComprobantes,mySports,activeUserId,userName}){
  const [uploaded,setUploaded]=useState(false);
  const [copied,setCopied]=useState(false);
  const [fileName,setFileName]=useState("");
  const [selDep,setSelDep]=useState(sport);
  const canManage=role==="staff"||role==="admin";
  const sportList=canManage?SPORTS:SPORTS.filter(s=>mySports.includes(s.id));
  const sportData=sportList.find(s=>s.id===selDep)||sportList[0];
  const efectiveUser=activeUserId||userName;
  const allComp=canManage&&selDep==="todos"?comprobantes:comprobantes.filter(c=>c.deporte===selDep);
  const handleFile=async(e)=>{
    const f=e.target.files[0];if(!f)return;
    setFileName(f.name);setUploaded(true);
    const {data}=await supabase.from("comprobantes").insert([{usuario:efectiveUser,deporte:sport,fecha:new Date().toLocaleDateString(),archivo:f.name,estado:"pendiente"}]).select().single();
    if(data)setComprobantes(p=>[...p,data]);
  };
  const approve=async(id,estado)=>{await supabase.from("comprobantes").update({estado}).eq("id",id);setComprobantes(p=>p.map(c=>c.id===id?{...c,estado}:c));};
  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>Pagos</h2>
      {!canManage&&sportData&&(
        <>
          <div className="rounded-2xl p-5 mb-3" style={{background:"#0B3D4C"}}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Alias — {sportData.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-base" style={{color:"#F7F5EF",fontFamily:"IBM Plex Mono"}}>{sportData.alias}</span>
              <button onClick={()=>{navigator.clipboard?.writeText(sportData.alias);setCopied(true);setTimeout(()=>setCopied(false),1500);}} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer"}}><Copy size={15} color="#F7F5EF"/></button>
            </div>
            {copied&&<p className="text-xs mt-2" style={{color:"#F2C230",fontFamily:"Inter"}}>✓ Alias copiado</p>}
          </div>
          <div className="rounded-2xl p-5 mb-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
            <p className="text-sm font-semibold mb-1" style={{color:"#33414A",fontFamily:"Inter"}}>Subí tu comprobante</p>
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
                <div className="flex items-center justify-between mb-1"><p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{c.usuario}</p><Badge tone={c.estado==="aprobado"?"green":c.estado==="rechazado"?"orange":"yellow"}>{c.estado}</Badge></div>
                <p className="text-xs mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>{c.fecha} · {c.archivo} · {c.deporte}</p>
                {c.estado==="pendiente"&&(<div className="flex gap-2"><button onClick={()=>approve(c.id,"aprobado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#E1F0E3",color:"#2C6E31",border:"none",cursor:"pointer"}}>✓ Aprobar</button><button onClick={()=>approve(c.id,"rechazado")} className="flex-1 text-xs font-semibold rounded-lg py-1.5" style={{background:"#FCE7DC",color:"#B4441C",border:"none",cursor:"pointer"}}>✗ Rechazar</button></div>)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RevisionMedica({revisiones,setRevisiones,role,userName,users,activeUserId}){
  const canEdit=role==="staff"||role==="admin";
  const now=new Date();
  const mesLabel=MESES_LABEL[now.getMonth()];
  const esSegundaFase=now.getDate()>=18;
  const efectiveUser=activeUserId||userName;
  const alumnos=canEdit?users.filter(u=>u.rol==="usuario"&&u.deportes&&u.deportes.split(";").includes("natacion")):[];
  const [selected,setSelected]=useState(canEdit?(alumnos[0]?.usuario||""):efectiveUser);
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState({});
  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState("");
  const rev=revisiones.find(r=>r.usuario===selected)||{usuario:selected,rev1:"",rev2:"",apto:""};
  const saveEdit=async()=>{
    if(!draft.rev1){setSaveError("La primera revisión es obligatoria.");return;}
    if(esSegundaFase&&!draft.rev2){setSaveError("La segunda revisión es obligatoria a partir del día 18.");return;}
    setSaveError("");setSaving(true);
    const exists=revisiones.find(r=>r.usuario===selected);
    if(exists){await supabase.from("revisiones").update({rev1:draft.rev1,rev2:draft.rev2||null,apto:draft.apto}).eq("usuario",selected);setRevisiones(p=>p.map(r=>r.usuario===selected?{...r,...draft}:r));}
    else{const {data}=await supabase.from("revisiones").insert([{...draft,usuario:selected}]).select().single();if(data)setRevisiones(p=>[...p,data]);}
    setSaving(false);setEditing(false);
  };
  const quickOk=async(usuario)=>{
    const exists=revisiones.find(r=>r.usuario===usuario);
    if(exists){await supabase.from("revisiones").update({apto:"si"}).eq("usuario",usuario);setRevisiones(p=>p.map(r=>r.usuario===usuario?{...r,apto:"si"}:r));}
    else{const {data}=await supabase.from("revisiones").insert([{usuario,apto:"si",rev1:"",rev2:""}]).select().single();if(data)setRevisiones(p=>[...p,data]);}
  };
  const aptoStyle=(a)=>a==="si"?{background:"#E1F0E3",color:"#2C6E31",label:"✓ Apto"}:a==="no"?{background:"#FCE7DC",color:"#B4441C",label:"✗ No apto"}:{background:"#FDF3D6",color:"#8A6A0A",label:"Sin definir"};
  const getNombre=(u)=>{const x=users.find(y=>y.usuario===u);return x?`${x.nombre||""} ${x.apellido||""}`.trim():u;};
  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-1" style={{color:"#33414A",fontFamily:"Inter"}}>Revisión Médica 🏊</h2>
      <p className="text-sm mb-3" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mesLabel} {now.getFullYear()} · Solo Natación</p>
      {canEdit&&alumnos.length>0&&(
        <div className="rounded-2xl p-4 mb-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{color:"#8A99A3",fontFamily:"Inter"}}>Estado rápido</p>
          <div className="flex flex-col gap-2">
            {alumnos.map(u=>{
              const r=revisiones.find(rv=>rv.usuario===u.usuario)||{apto:""};
              const st=aptoStyle(r.apto);
              const nombre=`${u.nombre||""} ${u.apellido||""}`.trim();
              return(
                <div key={u.id||u.usuario} className="flex items-center justify-between gap-2">
                  <button onClick={()=>setSelected(u.usuario)} className="flex-1 flex items-center gap-2 text-left px-3 py-2 rounded-xl" style={{background:selected===u.usuario?"#E4F2F3":"#F7F5EF",border:"none",cursor:"pointer"}}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{(nombre||"?")[0]}</div>
                    <span className="text-sm" style={{color:"#33414A",fontFamily:"Inter"}}>{nombre||u.usuario}</span>
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
        {canEdit&&<div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{getNombre(selected)[0]||"?"}</div><span className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{getNombre(selected)}</span><span className="ml-auto text-xs font-bold px-3 py-1 rounded-full" style={{...aptoStyle(rev.apto),fontFamily:"Inter"}}>{aptoStyle(rev.apto).label}</span></div>}
        {!canEdit&&<div className="flex justify-end mb-4"><span className="text-xs font-bold px-3 py-1 rounded-full" style={{...aptoStyle(rev.apto),fontFamily:"Inter"}}>{aptoStyle(rev.apto).label}</span></div>}
        {editing?(
          <>
            <div className="flex flex-col gap-2 mb-3">
              <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mesLabel} — Primera revisión</label><input type="date" value={draft.rev1||""} onChange={e=>setDraft({...draft,rev1:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}/></div>
              {esSegundaFase?<div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mesLabel} — Segunda revisión</label><input type="date" value={draft.rev2||""} onChange={e=>setDraft({...draft,rev2:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}/></div>:<div className="p-3 rounded-xl" style={{background:"#FDF3D6"}}><p className="text-xs font-semibold" style={{color:"#8A6A0A",fontFamily:"Inter"}}>⏳ Segunda revisión disponible a partir del día 18</p></div>}
              <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Estado</label><select value={draft.apto||""} onChange={e=>setDraft({...draft,apto:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}><option value="">Sin definir</option><option value="si">Apto</option><option value="no">No apto</option></select></div>
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
              {esSegundaFase?<div className="flex items-center justify-between p-3 rounded-xl" style={{background:"#F7F5EF"}}><div><p className="text-xs uppercase font-semibold" style={{color:"#8A99A3",fontFamily:"Inter"}}>{mesLabel} — Segunda revisión</p><p className="text-sm font-semibold mt-0.5" style={{color:"#33414A",fontFamily:"IBM Plex Mono"}}>{rev.rev2||"—"}</p></div><span style={{fontSize:"20px"}}>📋</span></div>:<div className="p-3 rounded-xl" style={{background:"#FDF3D6"}}><p className="text-xs font-semibold" style={{color:"#8A6A0A",fontFamily:"Inter"}}>⏳ Segunda revisión disponible a partir del día 18</p></div>}
            </div>
            {canEdit&&<button onClick={()=>{setDraft({...rev});setEditing(true);setSaveError("");}} className="w-full text-sm font-semibold rounded-lg py-2" style={{background:"#E4F2F3",color:"#0B3D4C",border:"none",cursor:"pointer"}}>✏️ Editar revisión</button>}
          </>
        )}
      </div>
    </div>
  );
}

function EditarAlumno({alumno,onSave,onBack}){
  const [form,setForm]=useState({nombre:alumno.nombre||"",apellido:alumno.apellido||"",dni:alumno.dni||"",fecha_nacimiento:alumno.fecha_nacimiento||"",sexo:alumno.sexo||"",deportes:alumno.deportes?alumno.deportes.split(";"):[],rol:alumno.rol||"usuario"});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const [resetMsg,setResetMsg]=useState("");
  const opDep=["natacion","voley","handball","matro"];
  const toggleDep=(d)=>setForm(p=>({...p,deportes:p.deportes.includes(d)?p.deportes.filter(x=>x!==d):[...p.deportes,d]}));
  const save=async()=>{
    setSaving(true);
    const {error}=await supabase.from("usuarios").update({nombre:form.nombre,apellido:form.apellido,dni:form.dni,fecha_nacimiento:form.fecha_nacimiento||null,sexo:form.sexo,deportes:form.deportes.join(";"),rol:form.rol}).eq("id",alumno.id);
    if(error)setMsg("Error: "+error.message);
    else{setMsg("✓ Guardado");onSave({...alumno,...form,deportes:form.deportes.join(";")});}
    setSaving(false);
  };
  const resetPass=async()=>{
    const {error}=await supabase.auth.resetPasswordForEmail(alumno.usuario,{redirectTo:window.location.origin});
    if(error)setResetMsg("Error: "+error.message);
    else setResetMsg("✓ Email enviado a "+alumno.usuario);
  };
  return(
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center gap-3 mb-3"><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#2E9CAB",fontFamily:"Inter",fontSize:"14px"}}>← Volver</button><h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Editar alumno</h2></div>
      <div className="rounded-2xl p-3 mb-3 flex items-center gap-3" style={{background:"#E4F2F3",border:"1px solid #2E9CAB22"}}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:"#2E9CAB22",color:"#0B3D4C"}}>@</div>
        <div><p className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Usuario de login</p><p className="text-sm font-semibold" style={{color:"#0B3D4C",fontFamily:"IBM Plex Mono"}}>{alumno.usuario}</p></div>
      </div>
      <div className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
        <div className="flex flex-col gap-3">
          {[["Nombre","nombre"],["Apellido","apellido"],["DNI","dni"]].map(([l,k])=>(<div key={k}><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{l}</label><input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/></div>))}
          <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Fecha de nacimiento</label><input type="date" value={form.fecha_nacimiento} onChange={e=>setForm({...form,fecha_nacimiento:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}/>{form.fecha_nacimiento&&<p className="text-xs mt-1" style={{color:"#2E9CAB",fontFamily:"Inter"}}>Edad: {calcEdad(form.fecha_nacimiento)} años</p>}</div>
          <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sexo</label><select value={form.sexo} onChange={e=>setForm({...form,sexo:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}><option value="">Sin especificar</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="X">No binario</option></select></div>
          <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Rol</label><select value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}><option value="usuario">Alumno</option><option value="profesor">Profesor</option><option value="staff">Secretaría</option><option value="admin">Admin</option></select></div>
          <div><label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{color:"#8A99A3",fontFamily:"Inter"}}>Deportes</label><div className="grid grid-cols-2 gap-2">{opDep.map(d=>{const s=SPORTS.find(sp=>sp.id===d);return(<button key={d} type="button" onClick={()=>toggleDep(d)} className="p-2 rounded-xl text-sm font-semibold" style={{background:form.deportes.includes(d)?s?.color:"#F1F3F4",color:form.deportes.includes(d)?"#fff":"#33414A",border:"none",cursor:"pointer",fontFamily:"Inter"}}>{s?.emoji} {s?.name}</button>);})}</div></div>
          <button onClick={save} disabled={saving} className="w-full text-white text-sm font-semibold rounded-lg py-2.5" style={{background:"#0B3D4C",border:"none",cursor:"pointer",fontFamily:"Inter"}}>{saving?"Guardando...":"Guardar cambios"}</button>
          <div className="pt-3" style={{borderTop:"1px solid #E2E8ED"}}>
            <button onClick={resetPass} className="w-full text-sm font-semibold rounded-lg py-2.5" style={{background:"#FDF3D6",color:"#8A6A0A",border:"1px solid #F2C230",cursor:"pointer",fontFamily:"Inter"}}>🔑 Enviar email para restablecer contraseña</button>
            {resetMsg&&<p className="text-xs mt-2 font-semibold" style={{color:"#2C6E31",fontFamily:"Inter"}}>{resetMsg}</p>}
          </div>
        </div>
        {msg&&<p className="mt-3 p-2 text-sm rounded-lg" style={{background:"#E4F2F3",color:"#0B3D4C",fontFamily:"Inter"}}>{msg}</p>}
      </div>
    </div>
  );
}

function GestionarClases({alumno,schedule,inscripciones,setInscripciones,setSchedule,onBack}){
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const mySports=alumno.deportes?alumno.deportes.split(";").map(s=>s.trim()):[];
  const [activeSport,setActiveSport]=useState(mySports[0]||null);
  const myClaseIds=inscripciones.filter(i=>i.usuario===alumno.usuario).map(i=>String(i.clase_id));
  const isAssigned=(id)=>myClaseIds.includes(String(id));
  const getConflict=(c)=>schedule.filter(s=>myClaseIds.includes(String(s.id))).find(s=>s.dia===c.dia&&s.hora===c.hora&&s.id!==c.id);
  const toggle=async(clase)=>{
    setSaving(true);setMsg("");
    if(isAssigned(clase.id)){
      await supabase.from("inscripciones").delete().eq("usuario",alumno.usuario).eq("clase_id",clase.id);
      setInscripciones(p=>p.filter(i=>!(i.usuario===alumno.usuario&&String(i.clase_id)===String(clase.id))));
      const ni=Math.max(0,(clase.inscriptos||0)-1);
      await supabase.from("clases").update({inscriptos:ni}).eq("id",clase.id);
      setSchedule(p=>p.map(s=>s.id===clase.id?{...s,inscriptos:ni}:s));
      setMsg("✓ Removido de "+DAY_LABELS[clase.dia]+" "+clase.hora);
    } else {
      const conflict=getConflict(clase);
      if(conflict){setMsg("⚠ Ya tiene clase el "+(DAY_LABELS[conflict.dia]||conflict.dia)+" a las "+conflict.hora);setSaving(false);return;}
      const {data}=await supabase.from("inscripciones").insert([{usuario:alumno.usuario,clase_id:clase.id}]).select().single();
      if(data)setInscripciones(p=>[...p,data]);
      const ni=(clase.inscriptos||0)+1;
      await supabase.from("clases").update({inscriptos:ni}).eq("id",clase.id);
      setSchedule(p=>p.map(s=>s.id===clase.id?{...s,inscriptos:ni}:s));
      setMsg("✓ Inscripto en "+(DAY_LABELS[clase.dia]||clase.dia)+" "+clase.hora);
    }
    setSaving(false);
  };
  const clases=schedule.filter(s=>s.deporte===activeSport);
  return(
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center gap-3 mb-2"><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#2E9CAB",fontFamily:"Inter",fontSize:"14px"}}>← Volver</button><h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Clases de {alumno.nombre}</h2></div>
      <div className="flex gap-2 overflow-x-auto mb-4" style={{scrollbarWidth:"none"}}>
        {mySports.map(sid=>{const s=SPORTS.find(x=>x.id===sid);return(
          <button key={sid} onClick={()=>setActiveSport(sid)} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{background:activeSport===sid?s?.color:"#fff",color:activeSport===sid?"#fff":"#33414A",border:`1px solid ${activeSport===sid?s?.color:"#E2E8ED"}`,cursor:"pointer",fontFamily:"Inter"}}>
            {s?.emoji} {s?.name}
          </button>
        );})}
      </div>
      {msg&&<div className="rounded-xl p-3 mb-3" style={{background:msg.startsWith("⚠")?"#FCE7DC":"#E1F0E3"}}><p className="text-sm font-semibold" style={{color:msg.startsWith("⚠")?"#B4441C":"#2C6E31",fontFamily:"Inter"}}>{msg}</p></div>}
      {clases.length===0?<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>No hay clases para este deporte.</p>
        :<div className="flex flex-col gap-2">
          {clases.map(c=>{
            const assigned=isAssigned(c.id);const conflict=!assigned&&getConflict(c);
            return(
              <button key={c.id} onClick={()=>toggle(c)} disabled={saving} className="w-full rounded-xl p-3 flex items-center justify-between text-left"
                style={{background:assigned?"#E1F0E3":conflict?"#FDF3D6":"#fff",border:`1px solid ${assigned?"#2C6E31":conflict?"#F2C230":"#E2E8ED"}`,cursor:"pointer"}}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{DAY_LABELS[c.dia]||c.dia}</span>
                    <span className="text-sm" style={{color:"#33414A",fontFamily:"IBM Plex Mono"}}>{c.hora}</span>
                    {c.categoria&&<span className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{c.categoria}</span>}
                  </div>
                  <p className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{c.profesor} · {c.lugar} · {c.inscriptos}/{c.cupo}</p>
                  {conflict&&<p className="text-xs mt-0.5 font-semibold" style={{color:"#8A6A0A",fontFamily:"Inter"}}>⚠ Conflicto con {DAY_LABELS[conflict.dia]||conflict.dia} {conflict.hora}</p>}
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{background:assigned?"#2C6E31":"#F1F3F4"}}>
                  {assigned?<Check size={14} color="#fff"/>:<Plus size={14} color="#8A99A3"/>}
                </div>
              </button>
            );
          })}
        </div>
      }
    </div>
  );
}

function PerfilView({profile,users,setUsers,role}){
  const canEdit=role==="staff"||role==="admin";
  const fullUser=users.find(u=>u.id===profile.id)||profile;
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({nombre:fullUser.nombre||"",apellido:fullUser.apellido||"",dni:fullUser.dni||"",fecha_nacimiento:fullUser.fecha_nacimiento||"",sexo:fullUser.sexo||""});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const save=async()=>{
    setSaving(true);
    const {error}=await supabase.from("usuarios").update({...form,fecha_nacimiento:form.fecha_nacimiento||null}).eq("id",profile.id);
    if(error)setMsg("Error: "+error.message);
    else{setMsg("✓ Actualizado");setUsers(p=>p.map(u=>u.id===profile.id?{...u,...form}:u));setEditing(false);}
    setSaving(false);
  };
  const edad=calcEdad(fullUser.fecha_nacimiento);
  const sexoLabel={M:"Masculino",F:"Femenino",X:"No binario"};
  const roleLabel={usuario:"Alumno",profesor:"Profesor",staff:"Staff",admin:"Admin"};
  const mySports=fullUser.deportes?fullUser.deportes.split(";").map(s=>s.trim()):[];
  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>Mi perfil</h2>
      <div className="rounded-2xl p-5 mb-3" style={{background:"#0B3D4C"}}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-3 mx-auto" style={{background:"rgba(255,255,255,0.15)",color:"#F7F5EF",fontFamily:"Fraunces"}}>{(fullUser.nombre||"?")[0]}</div>
        <p className="text-center font-semibold text-lg" style={{color:"#F7F5EF",fontFamily:"Fraunces"}}>{fullUser.nombre} {fullUser.apellido}</p>
        <p className="text-center text-sm" style={{color:"#9FC4CE",fontFamily:"Inter"}}>{fullUser.usuario}</p>
        <div className="flex justify-center gap-2 mt-2 flex-wrap">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{background:"rgba(242,194,48,0.2)",color:"#F2C230",fontFamily:"Inter"}}>{roleLabel[fullUser.rol]||fullUser.rol}</span>
          {mySports.map(d=>{const s=SPORTS.find(sp=>sp.id===d);return s?<span key={d} className="text-xs font-semibold px-2 py-1 rounded-full" style={{background:s.color+"33",color:s.color,fontFamily:"Inter"}}>{s.emoji} {s.name}</span>:null;})}
        </div>
      </div>
      <div className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
        {editing?(
          <div className="flex flex-col gap-3">
            {[["Nombre","nombre"],["Apellido","apellido"],["DNI","dni"]].map(([l,k])=>(<div key={k}><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{l}</label><input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/></div>))}
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Fecha de nacimiento</label><input type="date" value={form.fecha_nacimiento} onChange={e=>setForm({...form,fecha_nacimiento:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}/>{form.fecha_nacimiento&&<p className="text-xs mt-1" style={{color:"#2E9CAB",fontFamily:"Inter"}}>Edad: {calcEdad(form.fecha_nacimiento)} años</p>}</div>
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sexo</label><select value={form.sexo} onChange={e=>setForm({...form,sexo:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}><option value="">Sin especificar</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="X">No binario</option></select></div>
            <div className="flex gap-2"><button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold rounded-lg py-2" style={{background:"#0B3D4C",border:"none",cursor:"pointer"}}>{saving?"Guardando...":"Guardar"}</button><button onClick={()=>setEditing(false)} className="flex-1 text-sm font-semibold rounded-lg py-2" style={{background:"#F1F3F4",color:"#33414A",border:"none",cursor:"pointer"}}>Cancelar</button></div>
            {msg&&<p className="text-xs p-2 rounded-lg" style={{background:"#E4F2F3",color:"#0B3D4C",fontFamily:"Inter"}}>{msg}</p>}
          </div>
        ):(
          <>
            <div className="flex flex-col gap-3">
              {[["Nombre completo",`${fullUser.nombre||""} ${fullUser.apellido||""}`.trim()],["DNI",fullUser.dni||"—"],["Fecha de nac.",fullUser.fecha_nacimiento||"—"],["Edad",edad?`${edad} años`:"—"],["Sexo",sexoLabel[fullUser.sexo]||"—"],["Email",fullUser.usuario||"—"]].map(([l,v])=>(
                <div key={l} className="flex items-center justify-between p-3 rounded-xl" style={{background:"#F7F5EF"}}><p className="text-xs uppercase font-semibold" style={{color:"#8A99A3",fontFamily:"Inter"}}>{l}</p><p className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{v}</p></div>
              ))}
            </div>
            {canEdit&&<button onClick={()=>setEditing(true)} className="w-full text-sm font-semibold rounded-lg py-2 mt-4" style={{background:"#E4F2F3",color:"#0B3D4C",border:"none",cursor:"pointer"}}>✏️ Editar perfil</button>}
          </>
        )}
      </div>
    </div>
  );
}

function DependientesView({profile,dependientes,setDependientes,inscripciones,setInscripciones,schedule,setSchedule}){
  const [view,setView]=useState("lista");
  const [formDep,setFormDep]=useState({nombre:"",apellido:"",dni:"",fecha_nacimiento:"",sexo:"",deportes:[]});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const [gestionando,setGestionando]=useState(null);
  const opDep=["natacion","voley","handball","matro"];
  const toggleDep=(d)=>setFormDep(p=>({...p,deportes:p.deportes.includes(d)?p.deportes.filter(x=>x!==d):[...p.deportes,d]}));
  const addDep=async()=>{
    if(!formDep.nombre){setMsg("El nombre es obligatorio.");return;}
    setSaving(true);
    const {data,error}=await supabase.from("dependientes").insert([{tutor_id:profile.id,nombre:formDep.nombre,apellido:formDep.apellido,dni:formDep.dni,fecha_nacimiento:formDep.fecha_nacimiento||null,sexo:formDep.sexo,deportes:formDep.deportes.join(";")}]).select().single();
    if(error)setMsg("Error: "+error.message);
    else{setDependientes(p=>[...p,data]);setMsg("✓ Dependiente agregado");setFormDep({nombre:"",apellido:"",dni:"",fecha_nacimiento:"",sexo:"",deportes:[]});setView("lista");}
    setSaving(false);
  };
  const emancipar=async(dep)=>{
    await supabase.from("dependientes").update({emancipado:true}).eq("id",dep.id);
    setDependientes(p=>p.map(d=>d.id===dep.id?{...d,emancipado:true}:d));
    setMsg(dep.nombre+" marcado para emancipación. El admin debe crearle un usuario.");
  };
  if(gestionando)return<GestionarClases alumno={{...gestionando,usuario:String(gestionando.id)+"_dep"}} schedule={schedule} inscripciones={inscripciones} setInscripciones={setInscripciones} setSchedule={setSchedule} onBack={()=>setGestionando(null)}/>;
  return(
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>Mi familia</h2>
        <button onClick={()=>setView(view==="lista"?"nuevo":"lista")} className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-full" style={{background:"#E8622C",border:"none",cursor:"pointer"}}><Plus size={14}/>{view==="lista"?"Agregar":"Cancelar"}</button>
      </div>
      {msg&&<div className="rounded-xl p-3 mb-3" style={{background:"#E4F2F3"}}><p className="text-sm" style={{color:"#0B3D4C",fontFamily:"Inter"}}>{msg}</p></div>}
      {view==="nuevo"&&(
        <div className="rounded-2xl p-4 mb-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
          <p className="text-sm font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>Nuevo dependiente</p>
          <div className="flex flex-col gap-3">
            {[["Nombre","nombre"],["Apellido","apellido"],["DNI","dni"]].map(([l,k])=>(<div key={k}><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{l}</label><input value={formDep[k]} onChange={e=>setFormDep({...formDep,[k]:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/></div>))}
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Fecha de nacimiento</label><input type="date" value={formDep.fecha_nacimiento} onChange={e=>setFormDep({...formDep,fecha_nacimiento:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED"}}/>{formDep.fecha_nacimiento&&<p className="text-xs mt-1" style={{color:"#2E9CAB",fontFamily:"Inter"}}>Edad: {calcEdad(formDep.fecha_nacimiento)} años</p>}</div>
            <div><label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sexo</label><select value={formDep.sexo} onChange={e=>setFormDep({...formDep,sexo:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}><option value="">Sin especificar</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="X">No binario</option></select></div>
            <div><label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{color:"#8A99A3",fontFamily:"Inter"}}>Deportes</label><div className="grid grid-cols-2 gap-2">{opDep.map(d=>{const s=SPORTS.find(sp=>sp.id===d);return(<button key={d} type="button" onClick={()=>toggleDep(d)} className="p-2 rounded-xl text-sm font-semibold" style={{background:formDep.deportes.includes(d)?s?.color:"#F1F3F4",color:formDep.deportes.includes(d)?"#fff":"#33414A",border:"none",cursor:"pointer",fontFamily:"Inter"}}>{s?.emoji} {s?.name}</button>);})}</div></div>
            <button onClick={addDep} disabled={saving} className="w-full text-white text-sm font-semibold rounded-lg py-2.5" style={{background:"#0B3D4C",border:"none",cursor:"pointer",fontFamily:"Inter"}}>{saving?"Guardando...":"Agregar dependiente"}</button>
          </div>
        </div>
      )}
      {dependientes.length===0&&view==="lista"&&<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>No tenés dependientes registrados.</p>}
      <div className="flex flex-col gap-2.5">
        {dependientes.map(dep=>{
          const edad=calcEdad(dep.fecha_nacimiento);
          const nombre=`${dep.nombre||""} ${dep.apellido||""}`.trim();
          const depSports=dep.deportes?dep.deportes.split(";").map(s=>s.trim()):[];
          return(
            <div key={dep.id} className="rounded-2xl p-4" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{(nombre[0]||"?")}</div>
                <div className="flex-1">
                  <p className="font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{nombre}</p>
                  <div className="flex gap-2 items-center flex-wrap">
                    {edad&&<span className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{edad} años</span>}
                    {depSports.map(d=>{const s=SPORTS.find(sp=>sp.id===d);return s?<span key={d} className="text-xs" style={{color:s.color}}>{s.emoji}</span>:null;})}
                    {dep.emancipado&&<span className="text-xs px-2 py-0.5 rounded-full" style={{background:"#FDF3D6",color:"#8A6A0A",fontFamily:"Inter"}}>Emancipación pendiente</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setGestionando(dep)} className="flex-1 text-xs font-semibold rounded-lg py-1.5 flex items-center justify-center gap-1" style={{background:"#E4F2F3",color:"#0B3D4C",border:"none",cursor:"pointer"}}><CalendarIcon size={12}/>Clases</button>
                {!dep.emancipado&&<button onClick={()=>emancipar(dep)} className="flex-1 text-xs font-semibold rounded-lg py-1.5 flex items-center justify-center gap-1" style={{background:"#F1F3F4",color:"#33414A",border:"none",cursor:"pointer"}}><UserPlus size={12}/>Emancipar</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlumnosView({schedule,users,inscripciones,setInscripciones,setSchedule,setUsers,dependientes}){
  const [view,setView]=useState("deporte");
  const [selDep,setSelDep]=useState("todos");
  const [selSession,setSelSession]=useState(null);
  const [editingAlumno,setEditingAlumno]=useState(null);
  const [gestionandoAlumno,setGestionandoAlumno]=useState(null);
  const depOpts=[{id:"todos",name:"Todos",emoji:"👥",color:"#0B3D4C"},...SPORTS];
  const sel=selSession||(schedule.filter(s=>selDep==="todos"||s.deporte===selDep)[0]?.id||null);
  const sportAlumnos=selDep==="todos"?users.filter(u=>u.rol==="usuario"):users.filter(u=>u.rol==="usuario"&&u.deportes&&u.deportes.split(";").map(s=>s.trim()).includes(selDep));
  const alumnosEnClase=inscripciones.filter(i=>String(i.clase_id)===String(sel)).map(i=>{const u=users.find(u=>u.usuario===i.usuario);return u?{...u,displayName:`${u.nombre||""} ${u.apellido||""}`.trim()}:{displayName:i.usuario};});
  if(editingAlumno)return<EditarAlumno alumno={editingAlumno} onSave={(updated)=>{setUsers(p=>p.map(u=>u.id===updated.id?{...u,...updated}:u));setEditingAlumno(null);}} onBack={()=>setEditingAlumno(null)}/>;
  if(gestionandoAlumno)return<GestionarClases alumno={gestionandoAlumno} schedule={schedule} inscripciones={inscripciones} setInscripciones={setInscripciones} setSchedule={setSchedule} onBack={()=>setGestionandoAlumno(null)}/>;
  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-3" style={{color:"#33414A",fontFamily:"Inter"}}>Alumnos</h2>
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
              const nc=`${u.nombre||""} ${u.apellido||""}`.trim();
              const edad=calcEdad(u.fecha_nacimiento);
              const deps=(dependientes||[]).filter(d=>d.tutor_id===u.id);
              return(
                <div key={u.id||u.usuario} className="rounded-xl p-3 flex items-center gap-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{(nc||"?")[0]}</div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"Inter"}}>{nc||u.usuario}</span>
                    <div className="flex gap-2 mt-0.5 flex-wrap items-center">
                      {edad&&<span className="text-xs" style={{color:"#8A99A3",fontFamily:"Inter"}}>{edad} años</span>}
                      {u.deportes&&u.deportes.split(";").map(d=>{const s=SPORTS.find(sp=>sp.id===d.trim());return s?<span key={d} className="text-xs" style={{color:s.color}}>{s.emoji}</span>:null;})}
                      {deps.length>0&&<span className="text-xs px-1.5 py-0.5 rounded-full" style={{background:"#FDF3D6",color:"#8A6A0A",fontFamily:"Inter"}}>+{deps.length} dep.</span>}
                    </div>
                    <p className="text-xs mt-0.5" style={{color:"#8A99A3",fontFamily:"IBM Plex Mono"}}>{u.usuario}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={()=>setGestionandoAlumno(u)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:"#E4F2F3",border:"none",cursor:"pointer"}}><CalendarIcon size={13} color="#0B3D4C"/></button>
                    <button onClick={()=>setEditingAlumno(u)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:"#F1F3F4",border:"none",cursor:"pointer"}}><Pencil size={13} color="#33414A"/></button>
                  </div>
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
                  {DAY_LABELS[s.dia]||s.dia} {s.hora}{s.categoria?" · "+s.categoria:""}
                </button>
              ))}
            </div>
          )}
          {alumnosEnClase.length===0?<p className="text-sm text-center py-8" style={{color:"#8A99A3",fontFamily:"Inter"}}>Sin alumnos en esta clase.</p>
            :<div className="flex flex-col gap-2">{alumnosEnClase.map((a,i)=>(
                <div key={i} className="rounded-xl p-3 flex items-center gap-3" style={{background:"#fff",border:"1px solid #E2E8ED"}}>
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

function CalendarDashboard({schedule,setSchedule,users}){
  const [activeSport,setActiveSport]=useState("natacion");
  const sport=SPORTS.find(s=>s.id===activeSport);
  const items=schedule.filter(s=>s.deporte===activeSport);
  const profesores=users.filter(u=>u.rol==="profesor"&&u.deportes&&u.deportes.split(";").map(s=>s.trim()).includes(activeSport));
  const [modal,setModal]=useState(null);
  const [selProf,setSelProf]=useState("");
  const [lugar,setLugar]=useState("");
  const [cupo,setCupo]=useState(10);
  const [categoria,setCategoria]=useState("");
  const [saving,setSaving]=useState(false);
  const openNew=(dia,hora)=>{setModal({type:"new",dia,hora});setSelProf("");setLugar(sport?.lugares?.[0]||"");setCupo(10);setCategoria(sport?.categorias?.[0]||"");};
  const openEdit=(cls)=>{setModal({type:"edit",clase:cls,dia:cls.dia,hora:cls.hora});setSelProf(cls.usuario_profesor||"");setLugar(cls.lugar||"");setCupo(cls.cupo||10);setCategoria(cls.categoria||"");};
  const closeModal=()=>setModal(null);
  const saveNew=async()=>{
    if(!selProf||!lugar)return;setSaving(true);
    const profUser=users.find(u=>u.usuario===selProf);
    const profNombre=profUser?`${profUser.nombre||""} ${profUser.apellido||""}`.trim():"";
    const {data}=await supabase.from("clases").insert([{deporte:activeSport,dia:modal.dia,hora:modal.hora,profesor:profNombre,usuario_profesor:selProf,lugar,cupo,inscriptos:0,categoria}]).select().single();
    if(data)setSchedule(p=>[...p,data]);
    setSaving(false);closeModal();
  };
  const saveEdit=async()=>{
    setSaving(true);
    const profUser=users.find(u=>u.usuario===selProf);
    const profNombre=profUser?`${profUser.nombre||""} ${profUser.apellido||""}`.trim():modal.clase.profesor;
    await supabase.from("clases").update({profesor:profNombre,usuario_profesor:selProf,lugar,cupo,categoria}).eq("id",modal.clase.id);
    setSchedule(p=>p.map(s=>s.id===modal.clase.id?{...s,profesor:profNombre,usuario_profesor:selProf,lugar,cupo,categoria}:s));
    setSaving(false);closeModal();
  };
  const deleteClass=async(id)=>{
    await supabase.from("clases").delete().eq("id",id);
    setSchedule(p=>p.filter(s=>s.id!==id));closeModal();
  };
  const getCellClases=(dia,hora)=>items.filter(it=>it.dia===dia&&it.hora===hora);
  return(
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-semibold mb-1" style={{color:"#33414A",fontFamily:"Inter"}}>Panel de disponibilidad</h2>
      <p className="text-xs mb-3" style={{color:"#8A99A3",fontFamily:"Inter"}}>Tocá una celda vacía para agregar · tocá una clase para editar</p>
      <div className="flex gap-2 overflow-x-auto mb-4" style={{scrollbarWidth:"none"}}>
        {SPORTS.map(s=>(
          <button key={s.id} onClick={()=>setActiveSport(s.id)} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
            style={{background:activeSport===s.id?s.color:"#fff",color:activeSport===s.id?"#fff":"#33414A",border:`1px solid ${activeSport===s.id?s.color:"#E2E8ED"}`,cursor:"pointer",fontFamily:"Inter"}}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden text-xs" style={{border:"1px solid #E2E8ED"}}>
        <div className="grid" style={{gridTemplateColumns:"48px repeat(6,1fr)",background:"#0B3D4C"}}>
          <div className="p-1 text-center text-xs" style={{color:"#9FC4CE"}}>h</div>
          {DAYS.map(d=><div key={d} className="p-1 text-center font-bold text-xs" style={{color:"#9FC4CE",fontFamily:"Inter"}}>{DAY_LABELS[d]}</div>)}
        </div>
        {HOURS.map((hour,i)=>(
          <div key={hour} className="grid" style={{gridTemplateColumns:"48px repeat(6,1fr)",background:i%2===0?"#fff":"#F7F5EF",borderTop:"1px solid #E2E8ED"}}>
            <div className="p-1 text-center" style={{color:"#8A99A3",fontFamily:"IBM Plex Mono",borderRight:"1px solid #E2E8ED",fontSize:"9px"}}>{hour}</div>
            {DAYS.map(d=>{
              const clases=getCellClases(d,hour);
              return(
                <div key={d} className="p-0.5 min-h-[32px] flex flex-col gap-0.5" style={{borderRight:"1px solid #E2E8ED"}}>
                  {clases.map(cls=>(
                    <button key={cls.id} onClick={()=>openEdit(cls)} className="w-full rounded px-0.5 py-0.5 leading-tight text-left"
                      style={{background:+cls.inscriptos>=+cls.cupo?"#FCE7DC":sport.color+"33",color:+cls.inscriptos>=+cls.cupo?"#B4441C":"#33414A",fontFamily:"Inter",fontSize:"8px",fontWeight:600,border:"none",cursor:"pointer"}}>
                      {cls.categoria?cls.categoria.slice(0,5):cls.profesor?.split(" ")[0]}<br/>
                      <span style={{fontFamily:"IBM Plex Mono",fontSize:"7px"}}>{cls.lugar?.replace("Carril ","C")||""} {cls.inscriptos}/{cls.cupo}</span>
                    </button>
                  ))}
                  <button onClick={()=>openNew(d,hour)} className="w-full rounded flex items-center justify-center opacity-0 hover:opacity-100"
                    style={{background:sport.color+"11",border:`1px dashed ${sport.color}44`,cursor:"pointer",fontSize:"12px",color:sport.color,minHeight:"16px",transition:"opacity 0.15s"}}>+</button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {modal&&(
        <div className="fixed inset-0 z-50 flex items-end" style={{background:"rgba(11,61,76,0.6)"}} onClick={closeModal}>
          <div className="w-full max-w-2xl mx-auto rounded-t-3xl p-5" style={{background:"#F7F5EF"}} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{sport?.emoji} {sport?.name}</p>
                <h3 className="font-semibold text-lg" style={{color:"#33414A",fontFamily:"Fraunces"}}>{modal.type==="new"?"Nueva clase":"Editar clase"}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:"#E4F2F3",color:"#0B3D4C"}}>{DAY_LABELS[modal.dia]||modal.dia}</span>
                  <span className="text-sm font-semibold" style={{color:"#33414A",fontFamily:"IBM Plex Mono"}}>{modal.hora}</span>
                </div>
              </div>
              <button onClick={closeModal} style={{background:"none",border:"none",cursor:"pointer",color:"#8A99A3"}}><X size={20}/></button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Profesor/a</label>
                <select value={selProf} onChange={e=>setSelProf(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}>
                  <option value="">— Seleccioná profesor —</option>
                  {profesores.map(p=><option key={p.id} value={p.usuario}>{p.nombre} {p.apellido||""}</option>)}
                </select>
                {profesores.length===0&&<p className="text-xs mt-1" style={{color:"#E8622C",fontFamily:"Inter"}}>⚠ No hay profesores con este deporte.</p>}
              </div>
              {sport?.lugares&&sport.lugares.length>0&&(
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>{activeSport==="natacion"?"Carril":"Lugar"}</label>
                  <select value={lugar} onChange={e=>setLugar(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}>
                    {sport.lugares.map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              )}
              {sport?.categorias&&sport.categorias.length>0&&(
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Categoría</label>
                  <select value={categoria} onChange={e=>setCategoria(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}>
                    <option value="">Sin categoría</option>
                    {sport.categorias.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide" style={{color:"#8A99A3",fontFamily:"Inter"}}>Cupo máximo</label>
                <input type="number" value={cupo} onChange={e=>setCupo(+e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" style={{borderColor:"#E2E8ED",fontFamily:"Inter"}}/>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {modal.type==="new"
                ?<button onClick={saveNew} disabled={saving||!selProf||!lugar} className="flex-1 text-white text-sm font-semibold rounded-lg py-2.5" style={{background:selProf&&lugar?"#0B3D4C":"#8A99A3",border:"none",cursor:selProf&&lugar?"pointer":"not-allowed"}}>{saving?"Guardando...":"Crear clase"}</button>
                :<><button onClick={saveEdit} disabled={saving||!selProf} className="flex-1 text-white text-sm font-semibold rounded-lg py-2.5" style={{background:selProf?"#0B3D4C":"#8A99A3",border:"none",cursor:selProf?"pointer":"not-allowed"}}>{saving?"Guardando...":"Guardar"}</button>
                  <button onClick={()=>deleteClass(modal.clase.id)} className="text-sm font-semibold rounded-lg py-2.5 px-4" style={{background:"#FCE7DC",color:"#B4441C",border:"none",cursor:"pointer"}}>🗑</button>
                </>
              }
              <button onClick={closeModal} className="text-sm font-semibold rounded-lg py-2.5 px-4" style={{background:"#F1F3F4",color:"#33414A",border:"none",cursor:"pointer"}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App(){
  const [profile,setProfile]            = useState(null);
  const [tab,setTab]                    = useState("horarios");
  const [sport,setSport]                = useState("natacion");
  const [schedule,setSchedule]          = useState([]);
  const [requests,setRequests]          = useState([]);
  const [revisiones,setRevisiones]      = useState([]);
  const [comprobantes,setComprobantes]  = useState([]);
  const [inscripciones,setInscripciones]= useState([]);
  const [users,setUsers]                = useState([]);
  const [mensajes,setMensajes]          = useState([]);
  const [dependientes,setDependientes]  = useState([]);
  const [anuncioActivo,setAnuncioActivo]= useState(null);
  const [loading,setLoading]            = useState(false);
  const [showNotif,setShowNotif]        = useState(false);
  const [showCrear,setShowCrear]        = useState(false);
  const [isReset,setIsReset]            = useState(false);
  const [resetError,setResetError]      = useState("");
  const [activeProfile,setActiveProfile]= useState(null);

  useEffect(()=>{
    const hash=window.location.hash;
    if(hash.includes("error=access_denied")||hash.includes("otp_expired")){setResetError("El link expiró o ya fue usado.");window.location.hash="";return;}
    if(hash.includes("type=recovery")){setIsReset(true);return;}
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event)=>{if(event==="PASSWORD_RECOVERY")setIsReset(true);});
    if(hash.includes("access_token")){supabase.auth.getSession().then(({data:{session}})=>{if(session)supabase.auth.setSession(session);});}
    return()=>subscription?.unsubscribe();
  },[]);

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
      supabase.from("mensajes").select("*").order("created_at",{ascending:true}),
      supabase.from("dependientes").select("*"),
      supabase.from("anuncios").select("*").eq("activo",true).order("created_at",{ascending:false}).limit(1),
    ]).then(([cl,so,re,co,us,in_,ms,dep,an])=>{
      setSchedule(cl.data||[]);setRequests(so.data||[]);setRevisiones(re.data||[]);
      setComprobantes(co.data||[]);setUsers(us.data||[]);setInscripciones(in_.data||[]);
      setMensajes(ms.data||[]);
      setDependientes((dep.data||[]).filter(d=>d.tutor_id===profile.id));
      if(an.data&&an.data.length>0){
        const leidos=JSON.parse(sessionStorage.getItem("anuncios_leidos")||"[]");
        const noLeido=an.data.find(a=>!leidos.includes(a.id));
        if(noLeido)setAnuncioActivo(noLeido);
      }
      setLoading(false);
    });
  },[profile]);

  const handleLogout=async()=>{
    await supabase.auth.signOut();
    setProfile(null);setSchedule([]);setRequests([]);setMensajes([]);setShowCrear(false);setActiveProfile(null);
  };

  if(isReset)return<ResetPassword onDone={()=>{setIsReset(false);window.location.hash="";}}/>;
  if(!profile)return<Login onLogin={p=>{setProfile(p);setTab(p.rol==="admin"?"calendario":"horarios");}} resetError={resetError} onClearError={()=>setResetError("")}/>;

  const role=profile.rol;
  const mySports=(activeProfile?.deportes||profile.deportes)?.split(";").map(s=>s.trim()).filter(Boolean)||SPORTS.map(s=>s.id);
  const activeUserId=activeProfile?.usuario||profile.usuario;
  const hasNatacion=mySports.includes("natacion");
  const activeSport=mySports.includes(sport)?sport:(mySports[0]||"natacion");
  const mensajesNuevos=mensajes.filter(m=>m.para===profile.usuario&&!m.leido).length;
  const anunciosLeidos=JSON.parse(typeof sessionStorage!=="undefined"?sessionStorage.getItem("anuncios_leidos")||"[]":"[]");
  const notifications=[
    ...requests.filter(r=>r.estado==="pendiente").map(r=>({...r,type:"solicitud"})),
    ...comprobantes.filter(c=>c.estado==="pendiente").map(c=>({...c,type:"comprobante"})),
    ...mensajes.filter(m=>m.para===profile.usuario&&!m.leido).map(m=>({...m,type:"mensaje"})),
  ];
  const handleNotifResolve=async(n,estado)=>{
    if(n.type==="solicitud"){await supabase.from("solicitudes").update({estado}).eq("id",n.id);setRequests(p=>p.map(r=>r.id===n.id?{...r,estado}:r));}
    else if(n.type==="comprobante"){await supabase.from("comprobantes").update({estado}).eq("id",n.id);setComprobantes(p=>p.map(c=>c.id===n.id?{...c,estado}:c));}
  };

  const tabs=role==="usuario"
    ?[{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Solicitudes",icon:MessageSquare},{id:"pagos",label:"Pagos",icon:CreditCard},...(hasNatacion?[{id:"medica",label:"Médica",icon:Stethoscope}]:[]),...(dependientes.length>0?[{id:"dependientes",label:"Familia",icon:Users}]:[]),{id:"perfil",label:"Perfil",icon:User}]
    :role==="profesor"
    ?[{id:"horarios",label:"Mis clases",icon:CalendarIcon},{id:"solicitudes",label:"Solicitudes",icon:MessageSquare},...(hasNatacion?[{id:"medica",label:"Médica",icon:Stethoscope}]:[]),{id:"perfil",label:"Perfil",icon:User}]
    :role==="staff"
    ?[{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Solicitudes",icon:MessageSquare},{id:"alumnos",label:"Alumnos",icon:Users},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope},{id:"perfil",label:"Perfil",icon:User}]
    :[{id:"calendario",label:"Calendario",icon:CalendarIcon},{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"alumnos",label:"Alumnos",icon:Users},{id:"solicitudes",label:"Solicitudes",icon:MessageSquare},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope}];

  const titles={horarios:role==="profesor"?"Mis clases":"Clases",solicitudes:"Solicitudes",pagos:"Pagos",calendario:"Disponibilidad",medica:"Revisión Médica",alumnos:"Alumnos",perfil:"Mi perfil",dependientes:"Mi familia"};
  const noSportTabs=["calendario","perfil","alumnos","dependientes",...(role==="staff"||role==="admin"?["pagos"]:[])];
  const hasTutor=role==="usuario"&&dependientes.length>0;

  if(showCrear)return(
    <div className="min-h-screen max-w-2xl mx-auto" style={{background:"#F7F5EF"}}>
      <style>{FONT_IMPORT}</style>
      <div className="px-4 pt-5 pb-4 rounded-b-3xl" style={{background:"#0B3D4C"}}>
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider" style={{color:"#9FC4CE",fontFamily:"Inter"}}>Admin</p><h1 className="text-xl" style={{color:"#F7F5EF",fontFamily:"Fraunces",fontWeight:600}}>Crear usuario</h1></div><button onClick={handleLogout} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer"}}><LogOut size={16} color="#F7F5EF"/></button></div>
        <p className="text-sm mt-1" style={{color:"#F2C230",fontFamily:"Inter"}}>{profile.nombre}</p>
      </div>
      <CrearUsuario onBack={()=>setShowCrear(false)}/>
    </div>
  );

  return(
    <div className="min-h-screen max-w-2xl mx-auto" style={{background:"#F7F5EF"}}>
      <style>{FONT_IMPORT}</style>
      {anuncioActivo&&<AnuncioPopup anuncio={anuncioActivo}
        onClose={()=>setAnuncioActivo(null)}
        onMarcarLeido={async()=>{
          // Guardar en sessionStorage el id del anuncio leído
          const leidos=JSON.parse(sessionStorage.getItem("anuncios_leidos")||"[]");
          leidos.push(anuncioActivo.id);
          sessionStorage.setItem("anuncios_leidos",JSON.stringify(leidos));
          setAnuncioActivo(null);
        }}/>}
      <Header profile={profile} title={titles[tab]||tab} onLogout={handleLogout} pendingCount={notifications.length} onBell={()=>setShowNotif(true)} sport={activeSport} activeProfile={activeProfile}/>
      {role==="admin"&&(
        <div className="px-4 pt-3">
          <button onClick={()=>setShowCrear(true)} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl" style={{background:"#0B3D4C",color:"#F2C230",border:"none",cursor:"pointer",fontFamily:"Inter"}}>
            <ShieldCheck size={14}/> Crear usuario
          </button>
        </div>
      )}
      {hasTutor&&!noSportTabs.includes(tab)&&(
        <ProfileSelector profile={profile} dependientes={dependientes} activeProfile={activeProfile} setActiveProfile={setActiveProfile}/>
      )}
      {!noSportTabs.includes(tab)&&tab!=="solicitudes"&&(
        <SportTabs sports={role==="usuario"||role==="profesor"?mySports:null} active={activeSport} onChange={setSport}/>
      )}
      {loading
        ?<div className="flex items-center justify-center py-16 gap-2" style={{color:"#8A99A3"}}><Loader size={20} className="animate-spin"/><span style={{fontFamily:"Inter"}}>Cargando datos...</span></div>
        :<>
          {tab==="horarios"&&<ClasesView schedule={schedule} setSchedule={setSchedule} sport={activeSport} role={role} users={users} userName={profile.usuario} inscripciones={inscripciones} activeUserId={activeUserId}/>}
          {tab==="solicitudes"&&<SolicitudesView requests={requests} setRequests={setRequests} mensajes={mensajes} setMensajes={setMensajes} sport={activeSport} role={role} userName={profile.usuario} schedule={schedule} setSchedule={setSchedule} inscripciones={inscripciones} setInscripciones={setInscripciones} users={users} activeUserId={activeUserId}/>}
          {tab==="pagos"&&<PaymentView sport={activeSport} role={role} comprobantes={comprobantes} setComprobantes={setComprobantes} mySports={mySports} activeUserId={activeUserId} userName={profile.usuario}/>}
          {tab==="calendario"&&<CalendarDashboard schedule={schedule} setSchedule={setSchedule} users={users}/>}
          {tab==="medica"&&<RevisionMedica revisiones={revisiones} setRevisiones={setRevisiones} role={role} userName={profile.usuario} users={users} activeUserId={activeUserId}/>}
          {tab==="alumnos"&&<AlumnosView schedule={schedule} users={users} inscripciones={inscripciones} setInscripciones={setInscripciones} setSchedule={setSchedule} setUsers={setUsers} dependientes={dependientes}/>}
          {tab==="perfil"&&<PerfilView profile={profile} users={users} setUsers={setUsers} role={role}/>}
          {tab==="dependientes"&&<DependientesView profile={profile} dependientes={dependientes} setDependientes={setDependientes} inscripciones={inscripciones} setInscripciones={setInscripciones} schedule={schedule} setSchedule={setSchedule}/>}
        </>
      }
      <BottomNav tabs={tabs} active={tab} onChange={t=>setTab(t)} mensajesNuevos={mensajesNuevos}/>
      {showNotif&&<NotificationsPanel notifications={notifications} onResolve={handleNotifResolve} onClose={()=>setShowNotif(false)}/>}
    </div>
  );
}
