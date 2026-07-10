import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('12345678'); // Contraseña predeterminada
  const [rol, setRol] = useState('usuario');
  const [mensaje, setMensaje] = useState('');

  async function crearUsuario() {
    setMensaje('Procesando...');

    // 1. Intentar registrar en Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      setMensaje('Error en Auth: ' + authError.message);
      return;
    }

    // 2. Si Auth fue exitoso, insertar en tabla 'usuarios'
    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([
        { 
          id: data.user.id, 
          usuario: email, 
          rol: rol, 
          nombre: email 
        }
      ]);

    if (dbError) {
      setMensaje('Usuario creado en Auth, pero falló la DB: ' + dbError.message);
    } else {
      setMensaje(`¡Éxito! Usuario: ${email} | Contraseña: ${password}`);
    }
  }

  return (
    <div className="p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>
      <div className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Email (ej: usuario@mail.com)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select className="border p-2" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="usuario">Alumno</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={crearUsuario} className="bg-blue-600 text-white p-2">Guardar Usuario</button>
      </div>
      {mensaje && <p className="mt-4 p-2 bg-gray-100 text-sm">{mensaje}</p>}
    </div>
  );
}
