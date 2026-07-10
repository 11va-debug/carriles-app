import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import AdminPanel from "./AdminPanel";
import { 
  Calendar as CalendarIcon, Check, X, ArrowLeftRight, Upload, LogOut, 
  Plus, Pencil, Copy, ClipboardCheck, Loader, Bell, CreditCard, 
  Stethoscope, Users, FileText, Clock 
} from "lucide-react";

// --- (MANTÉN AQUÍ TUS CONSTANTES ORIGINALES: FONT_IMPORT, URLS, SPORTS, ETC.) ---

export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("horarios");
  const [loading, setLoading] = useState(false);
  
  // ... (Tus otros estados: schedule, requests, etc.)

  // --- LÓGICA DE CARGA ---
  useEffect(() => {
    if (!profile) return;
    // Aquí iría tu lógica de carga de datos original
  }, [profile]);

  // --- LÓGICA DE ROL Y TABS ---
  const role = profile?.rol;
  const isSecretariaOrAdmin = role === "secretaria" || role === "admin";
  
  const tabs = role === "usuario"
    ? [{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Cambios",icon:ArrowLeftRight},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope}]
    : role === "profesor"
    ? [{id:"profesor",label:"Mis clases",icon:CalendarIcon},{id:"medica",label:"Médica",icon:Stethoscope}]
    : role === "secretaria"
    ? [{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Cambios",icon:ArrowLeftRight},{id:"asistencia",label:"Asistencia",icon:ClipboardCheck},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope}]
    : [{id:"calendario",label:"Calendario",icon:CalendarIcon},{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"alumnos",label:"Alumnos",icon:Users},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope},{id:"log",label:"Log",icon:FileText}, {id:"admin_panel", label:"Admin", icon:Users}];

  const titles = { horarios:"Mis clases",solicitudes:"Solicitudes",pagos:"Pagos",asistencia:"Asistencia",calendario:"Disponibilidad",medica:"Revisión Médica",alumnos:"Alumnos",profesor:"Mis clases",log:"Log de actividad", admin_panel: "Administración" };

  if (!profile) return <Login onLogin={p => setProfile(p)} />;

  return (
    <div className="min-h-screen max-w-2xl mx-auto" style={{ background:"#F7F5EF" }}>
      <style>{FONT_IMPORT}</style>
      
      <Header 
        profile={profile} 
        title={titles[tab]} 
        onLogout={() => { setProfile(null); }} 
        notifications={[]} 
        onBell={() => {}} 
      />

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2"><Loader className="animate-spin"/></div>
      ) : (
        <>
          {tab === "admin_panel" && <AdminPanel />}
          {tab !== "admin_panel" && (
             <div>
                {/* Aquí renderizas tus vistas originales como lo hacías antes */}
             </div>
          )}
        </>
      )}

      <BottomNav tabs={tabs} active={tab} onChange={setTab}/>
    </div>
  );
}
