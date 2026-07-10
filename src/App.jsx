import React, { useState } from "react";
import { supabase } from "./lib/supabase";
import AdminPanel from "./AdminPanel";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    // Usamos el sistema oficial de Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError("Credenciales incorrectas o usuario no encontrado");
      return;
    }

    // Una vez logueado, traemos el rol desde la tabla 'usuarios'
    const { data: userData } = await supabase
      .from('usuarios')
      .select('rol, usuario')
      .eq('id', data.user.id)
      .single();
      
    onLogin({ ...data.user, rol: userData?.rol, usuario: userData?.usuario });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h2 className="mb-4 font-bold text-xl">Ingreso al Sistema</h2>
      <input className="border p-2 mb-2 w-full max-w-xs" placeholder="Email (Usuario)" onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 mb-2 w-full max-w-xs" type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-blue-600 text-white p-2 px-4 rounded w-full max-w-xs">Ingresar</button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("home");

  if (!profile) return <Login onLogin={setProfile} />;

  return (
    <div className="max-w-2xl mx-auto">
      <nav className="flex gap-4 p-4 border-b bg-white">
        <button onClick={() => setTab("home")} className="font-bold">Inicio</button>
        {profile.rol === 'admin' && (
          <button onClick={() => setTab("admin")} className="text-red-600 font-bold">Admin</button>
        )}
      </nav>

      <main className="p-4">
        {tab === "admin" ? <AdminPanel /> : <h1>Bienvenido, {profile.usuario}</h1>}
      </main>
    </div>
  );
}
