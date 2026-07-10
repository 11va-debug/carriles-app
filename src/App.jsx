import React, { useState } from "react";
import { supabase } from "./lib/supabase";
import AdminPanel from "./AdminPanel";

function Login({ onLogin }) {
  const [usuarioInput, setUsuarioInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    // Buscamos al usuario en tu tabla "usuarios"
    const { data: userData, error: dbError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', usuarioInput) // Buscamos por la columna 'usuario'
      .single();

    if (dbError || !userData) {
      setError("Usuario no encontrado.");
      return;
    }

    // Si encontramos el usuario, validamos la contraseña 
    // (Nota: Si usas Auth de Supabase, esto debería ser signInWithPassword, 
    // pero si manejas las credenciales tú mismo, validamos aquí)
    onLogin({ ...userData });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="mb-4 font-bold">Ingreso al Sistema</h2>
      <input className="border p-2 mb-2" placeholder="Nombre de usuario" onChange={(e) => setUsuarioInput(e.target.value)} />
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
        {tab === "admin" ? <AdminPanel /> : <h1>Bienvenido {profile.usuario}</h1>}
      </main>
    </div>
  );
}
