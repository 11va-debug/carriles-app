import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function AdminPanel() {
  const [usuario, setUsuario] = useState('');
  const [rol, setRol] = useState('usuario');
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => { cargarUsuarios(); }, []);

  async function cargarUsuarios() {
    const { data } = await supabase.from('usuarios').select('*');
    setUsuarios(data || []);
  }

  async function crearUsuario() {
    const { error } = await supabase
      .from('usuarios')
      .insert([{ usuario: usuario, rol: rol, nombre: usuario }]);

    if (error) setMensaje('Error: ' + error.message);
    else {
      setMensaje('Usuario creado correctamente');
      setUsuario('');
      cargarUsuarios();
    }
  }

  return (
    <div className="p-4 pb-24">
      <h2 className="text-xl font-bold mb-4">Panel de Administración</h2>
      <div className="flex flex-col gap-3 bg-white p-4 rounded-lg border mb-6">
        <input className="border p-2 rounded" placeholder="Nombre de usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        <select className="border p-2 rounded" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="usuario">Alumno</option>
          <option value="profesor">Profesor</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={crearUsuario} className="bg-blue-600 text-white p-2 rounded">Crear Usuario</button>
      </div>
      {mensaje && <p className="mb-4 text-sm font-semibold">{mensaje}</p>}
      <ul>
        {usuarios.map(u => <li key={u.id} className="border-b py-2">{u.usuario} - <b>{u.rol}</b></li>)}
      </ul>
    </div>
  );
}
