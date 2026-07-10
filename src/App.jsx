import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import AdminPanel from "./AdminPanel";
import { 
  Calendar as CalendarIcon, Check, X, ArrowLeftRight, Upload, LogOut, 
  Plus, Pencil, Copy, ClipboardCheck, Loader, Bell, CreditCard, 
  Stethoscope, Users, FileText, Clock 
} from "lucide-react";

// --- TUS CONSTANTES ORIGINALES ---
const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');";
const SHEET_BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTA-OFF1wrHuj9AiCTEKZiTeAwOFZvPDsQINttJFRMvXhShcFRTPNmrTAo3lhKtOXWYpFC1Rjr1HcmV/pub";
const URL_USUARIOS = `${SHEET_BASE}?gid=0&single=true&output=csv`;
const URL_CLASES = `${SHEET_BASE}?gid=725628139&single=true&output=csv`;
const URL_SOLICITUDES = `${SHEET_BASE}?gid=2029079044&single=true&output=csv`;
const URL_REVISIONES = `${SHEET_BASE}?gid=1817774281&single=true&output=csv`;
const URL_COMPROBANTES = `${SHEET_BASE}?gid=324277509&single=true&output=csv`;
const URL_INSCRIPCIONES = `${SHEET_BASE}?gid=491872981&single=true&output=csv`;

// ... (Aquí mantén tus constantes SPORTS, DAYS, HOURS, etc. que ya tenías)

export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("horarios");
  const [loading, setLoading] = useState(false);
  
  // ... (Tus otros estados originales: schedule, requests, etc.)

  // --- LÓGICA DE CARGA ORIGINAL ---
  useEffect(() => {
    if (!profile) return;
    // Aquí puedes mantener tu fetchCSV original si aún dependes de Drive
  }, [profile]);

  if (!profile) return <Login onLogin={setProfile} />;

  const role = profile?.rol;

  // --- NAVEGACIÓN ACTUALIZADA ---
  // Si el usuario es admin, incluimos "Admin" en las pestañas
  const tabs = role === "admin"
    ? [
        {id:"calendario",label:"Calendario",icon:CalendarIcon},
        {id:"horarios",label:"Clases",icon:CalendarIcon},
        {id:"alumnos",label:"Alumnos",icon:Users},
        {id:"pagos",label:"Pagos",icon:CreditCard},
        {id:"medica",label:"Médica",icon:Stethoscope},
        {id:"log",label:"Log",icon:FileText},
        {id:"admin_panel", label:"Admin", icon:Users}
      ]
    : [/* Tus tabs originales para otros roles */];

  return (
    <div className="min-h-screen max-w-2xl mx-auto" style={{ background:"#F7F5EF" }}>
      <style>{FONT_IMPORT}</style>
      
      <Header 
        profile={profile} 
        title="Carriles" 
        onLogout={() => setProfile(null)} 
        notifications={[]} 
        onBell={() => {}} 
      />

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader className="animate-spin"/></div>
      ) : (
        <>
          {/* AQUÍ ESTÁ LA INTEGRACIÓN DEL PANEL */}
          {tab === "admin_panel" ? (
            <AdminPanel />
          ) : (
            <div>
               {/* Aquí renderiza tus vistas originales: ScheduleView, RequestsView, etc. */}
            </div>
          )}
        </>
      )}

      <BottomNav tabs={tabs} active={tab} onChange={setTab}/>
    </div>
  );
}
