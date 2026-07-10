import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('usuario');
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    const { data } = await supabase.from('usuarios').select('*');
    setUsuarios(data || []);
  }

  async function crearUsuario() {
    const { error } = await supabase
      .from('usuarios')
      .insert([{ usuario: email, rol: rol, nombre: email }]);

    if (error) {
      setMensaje('Error: ' + error.message);
    } else {
      setMensaje('Usuario creado correctamente');
      setEmail('');
      cargarUsuarios();
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Panel de Administración</h2>
      
      <div className="flex flex-col gap-3 bg-white p-4 rounded-lg border">
        <input 
          className="border p-2 rounded" 
          placeholder="Nombre de usuario" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <select 
          className="border p-2 rounded" 
          value={rol} 
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="usuario">Alumno</option>
          <option value="profesor">Profesor</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={crearUsuario} className="bg-blue-600 text-white p-2 rounded">
          Crear Usuario
        </button>
      </div>

      {mensaje && <p className="mt-2 text-sm font-semibold">{mensaje}</p>}

      <div className="mt-6">
        <h3 className="font-bold">Usuarios actuales:</h3>
        <ul>
          {usuarios.map(u => (
            <li key={u.id} className="border-b py-2">
              {u.usuario} - <span className="font-bold">{u.rol}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
