import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('12345678'); // Contraseña temporal
  const [rol, setRol] = useState('usuario');
  const [mensaje, setMensaje] = useState('');

  async function crearUsuario() {
    setMensaje('Creando usuario...');
    
    // 1. Crear el usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      setMensaje('Error en Auth: ' + authError.message);
      return;
    }

    // 2. Insertar el rol en la tabla 'usuarios' usando el ID generado
    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([
        { id: authData.user.id, email: email, rol: rol, nombre: email }
      ]);

    if (dbError) {
      setMensaje('Error al asignar rol: ' + dbError.message);
    } else {
      setMensaje(`Éxito: ${email} creado como ${rol}`);
      setEmail('');
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>
      <div className="flex flex-col gap-3">
        <input className="border p-2 rounded" placeholder="Email del usuario" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className="border p-2 rounded" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="usuario">Alumno</option>
          <option value="profesor">Profesor</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={crearUsuario} className="bg-green-600 text-white p-2 rounded">Guardar Usuario</button>
      </div>
      {mensaje && <p className="mt-4 text-sm font-medium text-gray-700">{mensaje}</p>}
    </div>
  );
}
