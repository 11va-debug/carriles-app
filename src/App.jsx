import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import AdminPanel from "./AdminPanel";
import { 
  Calendar as CalendarIcon, Check, X, ArrowLeftRight, Upload, LogOut, 
  Plus, Pencil, Copy, ClipboardCheck, Loader, Bell, CreditCard, 
  Stethoscope, Users, FileText, Clock 
} from "lucide-react";

// --- TUS CONSTANTES Y FUNCIONES ORIGINALES ---
const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');";
// ... (Asegúrate de tener aquí el resto de tus constantes URL_USUARIOS, etc.)

// --- COMPONENTE LOGIN ORIGINAL ---
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // ... (Tu lógica original de Login)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <input placeholder="Usuario" onChange={(e)=>setUsername(e.target.value)} className="text-black p-2"/>
      <button onClick={() => onLogin({ usuario: username, rol: 'admin' })} className="ml-2 bg-blue-500 p-2">Ingresar</button>
    </div>
  );
}

// --- APP COMPONENT ---
export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("horarios");
  const [loading, setLoading] = useState(false);

  if (!profile) return <Login onLogin={setProfile} />;

  const role = profile?.rol;
  
  // Tabs incluyendo AdminPanel solo si es admin
  const tabs = role === "admin"
    ? [{id:"admin_panel", label:"Admin", icon:Users}, {id:"horarios",label:"Clases",icon:CalendarIcon}]
    : [{id:"horarios",label:"Clases",icon:CalendarIcon}];

  return (
    <div className="min-h-screen max-w-2xl mx-auto bg-gray-50">
      {tab === "admin_panel" ? <AdminPanel /> : <div className="p-4">Bienvenido al sistema</div>}
      
      {/* Botón de navegación simple */}
      <div className="fixed bottom-0 w-full flex justify-around p-4 bg-white border-t">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex flex-col items-center">
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
