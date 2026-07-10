import React, { useState } from "react";
import { supabase } from "./lib/supabase";
import AdminPanel from "./AdminPanel";

// --- COMPONENTE LOGIN MINIMALISTA ---
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  return (
    <div style={{ padding: '20px' }}>
      <input 
        placeholder="Usuario" 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <button onClick={() => onLogin({ usuario: username, rol: 'admin' })}>
        Ingresar
      </button>
    </div>
  );
}

// --- APP PRINCIPAL ---
export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("home");

  if (!profile) {
    return <Login onLogin={setProfile} />;
  }

  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setTab("home")}>Home</button>
        {profile.rol === 'admin' && (
          <button onClick={() => setTab("admin")}>Admin</button>
        )}
      </nav>

      <main style={{ padding: '20px' }}>
        {tab === "admin" ? <AdminPanel /> : <h1>Bienvenido</h1>}
      </main>
    </div>
  );
}
