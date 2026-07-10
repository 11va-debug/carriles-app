import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import AdminPanel from "./AdminPanel";
import { Calendar as CalendarIcon, Users, CreditCard, Stethoscope, FileText, Loader } from "lucide-react";

// 1. COMPONENTE LOGIN (Definido aquí para que no de error de "not defined")
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <input className="border p-2 mb-2" placeholder="Usuario" onChange={(e) => setUsername(e.target.value)} />
      <button onClick={() => onLogin({ usuario: username, rol: 'admin' })} className="bg-blue-600 text-white p-2 px-4 rounded">Ingresar</button>
    </div>
  );
}

// 2. COMPONENTE APP PRINCIPAL
export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("horarios");

  if (!profile) return <Login onLogin={setProfile} />;

  return (
    <div className="min-h-screen max-w-2xl mx-auto bg-gray-50">
      {tab === "admin_panel" ? (
        <AdminPanel />
      ) : (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold">Bienvenido</h1>
            <p>Selecciona una opción abajo</p>
        </div>
      )}

      {/* NAVEGACIÓN */}
      <div className="fixed bottom-0 w-full flex justify-around p-4 bg-white border-t">
        <button onClick={() => setTab("horarios")}>Clases</button>
        {profile.rol === 'admin' && <button onClick={() => setTab("admin_panel")}>Admin</button>}
      </div>
    </div>
  );
}
