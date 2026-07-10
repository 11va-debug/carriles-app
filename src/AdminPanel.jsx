import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('12345678');
  const [rol, setRol] = useState('usuario');
  const [deporte, setDeporte] = useState('natación');
  const [mensaje, setMensaje] = useState('');

  async function crearUsuario() {
    setMensaje('Procesando...');

    // 1. Crear en Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      setMensaje('Error en Auth: ' + authError.message);
      return;
    }

    // 2. Insertar en tabla 'usuarios' incluyendo el deporte
    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([
        { 
          id: data.user.id, 
          usuario: email, 
          rol: rol, 
          nombre: email,
          deporte: deporte // Guardamos el deporte seleccionado
        }
      ]);

    if (dbError) {
      setMensaje('Error al guardar datos adicionales: ' + dbError.message);
    } else {
      setMensaje(`¡Éxito! Usuario: ${email} | Rol: ${rol} | Deporte: ${deporte}`);
    }
  }

  return (
    <div className="p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>
      <div className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        <label className="text-sm font-semibold">Rol:</label>
        <select className="border p-2" value={rol} onChange={(e) => { setRol(e.target.value); setDeporte(e.target.value === 'profesor' ? 'natación' : 'natación'); }}>
          <option value="usuario">Alumno</option>
          <option value="profesor">Profesor</option>
          <option value="admin">Admin</option>
        </select>

        <label className="text-sm font-semibold">Deporte / Especialidad:</label>
        <select className="border p-2" value={deporte} onChange={(e) => setDeporte(e.target.value)}>
          <option value="natación">Natación</option>
          <option value="voley">Voley</option>
          <option value="handball">Handball</option>
          <option value="matronatación">Matronatación</option>
        </select>

        <button onClick={crearUsuario} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Guardar Usuario
        </button>
      </div>
      {mensaje && <p className="mt-4 p-2 bg-gray-100 text-sm font-medium">{mensaje}</p>}
    </div>
  );
}
