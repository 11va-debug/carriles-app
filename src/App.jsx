import React, { useState } from "react";
import { supabase } from "./lib/supabase";
import AdminPanel from "./AdminPanel";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Consultamos el rol en la tabla usuarios
      const { data: userData } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', data.user.id)
        .single();
      
      onLogin({ ...data.user, rol: userData?.rol || 'usuario' });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <input className="border p-2 mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 mb-2" type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-blue-600 text-white p-2 px-4 rounded">Ingresar</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("home");

  if (!profile) return <Login onLogin={setProfile} />;

  return (
    <div className="max-w-2xl mx-auto">
      <nav className="flex gap-4 p-4 border-b">
        <button onClick={() => setTab("home")}>Home</button>
        {profile.rol === 'admin' && (
          <button onClick={() => setTab("admin")}>Admin</button>
        )}
      </nav>

      <main className="p-4">
        {tab === "admin" ? <AdminPanel /> : <h1>Bienvenido {profile.email}</h1>}
      </main>
    </div>
  );
}
