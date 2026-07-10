import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import AdminPanel from "./AdminPanel";
import { 
  Calendar as CalendarIcon, Check, X, ArrowLeftRight, Upload, LogOut, 
  Plus, Pencil, Copy, ClipboardCheck, Loader, Bell, CreditCard, 
  Stethoscope, Users, FileText, Clock 
} from "lucide-react";

// --- (MANTÉN TODO TU CÓDIGO ORIGINAL AQUÍ: CONSTANTES, FONT_IMPORT, ETC.) ---
// --- He abreviado el bloque de arriba para que sea legible, pega el tuyo original ---

export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("horarios");
  const [loading, setLoading] = useState(false);
  
  // ... (Tus otros estados: schedule, requests, etc.)

  // --- REEMPLAZO DE FETCH POR SUPABASE ---
  useEffect(() => {
    if (!profile) return;
    
    async function fetchData() {
      setLoading(true);
      const { data: cls } = await supabase.from('clases').select('*');
      const { data: reqs } = await supabase.from('solicitudes').select('*');
      // ... (Agrega aquí el resto de tus cargas de datos usando await supabase.from('...').select('*'))
      
      setLoading(false);
    }
    fetchData();
  }, [profile]);

  // --- LÓGICA DE TABS ---
  const role = profile?.rol;
  
  // Agregamos el tab de Admin dinámicamente si el usuario es admin
  const baseTabs = role === "usuario"
    ? [{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Cambios",icon:ArrowLeftRight},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope}]
    : role === "profesor"
    ? [{id:"profesor",label:"Mis clases",icon:CalendarIcon},{id:"medica",label:"Médica",icon:Stethoscope}]
    : role === "secretaria"
    ? [{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"solicitudes",label:"Cambios",icon:ArrowLeftRight},{id:"asistencia",label:"Asistencia",icon:ClipboardCheck},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope}]
    : [{id:"calendario",label:"Calendario",icon:CalendarIcon},{id:"horarios",label:"Clases",icon:CalendarIcon},{id:"alumnos",label:"Alumnos",icon:Users},{id:"pagos",label:"Pagos",icon:CreditCard},{id:"medica",label:"Médica",icon:Stethoscope},{id:"log",label:"Log",icon:FileText}, {id:"admin_panel", label:"Admin", icon:Users}];

  return (
    <div className="min-h-screen max-w-2xl mx-auto" style={{ background:"#F7F5EF" }}>
      <style>{FONT_IMPORT}</style>
      
      {/* HEADER y resto de lógica original */}
      <Header profile={profile} ... />

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2"><Loader className="animate-spin"/></div>
      ) : (
        <>
          {tab === "admin_panel" && <AdminPanel />}
          {tab !== "admin_panel" && (
             <>
               {/* Aquí van todas tus llamadas originales a ScheduleView, RequestsView, etc. */}
             </>
          )}
        </>
      )}

      <BottomNav tabs={baseTabs} active={tab} onChange={setTab}/>
    </div>
  );
}
