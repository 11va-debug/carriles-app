import { useState } from 'react';
import { supabase } from './lib/supabase';
import { Eye, EyeOff } from 'lucide-react'; // Necesitas instalar lucide-react

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [rol, setRol] = useState('usuario');
  const [deportes, setDeportes] = useState([]); // Array para selección múltiple
  const [mensaje, setMensaje] = useState('');

  const opcionesDeporte = ['natación', 'voley', 'handball', 'matronatación'];

  const toggleDeporte = (deporte) => {
    setDeportes(prev => 
      prev.includes(deporte) ? prev.filter(d => d !== deporte) : [...prev, deporte]
    );
  };

  async function crearUsuario() {
    setMensaje('Procesando...');

    const { data, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      setMensaje('Error en Auth: ' + authError.message);
      return;
    }

    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([{ 
        id: data.user.id, 
        usuario: email, 
        rol: rol, 
        nombre: email,
        deporte: deportes.join(', ') // Guardamos como string separado por comas
      }]);

    if (dbError) {
      setMensaje('Error en DB: ' + dbError.message);
    } else {
      setMensaje(`¡Éxito! Usuario creado con deportes: ${deportes.join(', ')}`);
    }
  }

  return (
    <div className="p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>
      <div className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        
        <div className="relative">
          <input className="border p-2 w-full" type={showPassword ? "text" : "password"} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="absolute right-2 top-2" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <select className="border p-2" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="usuario">Alumno</option>
          <option value="profesor">Profesor</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <label className="text-sm font-semibold">Deportes / Especialidades:</label>
        <div className="grid grid-cols-2 gap-2">
          {opcionesDeporte.map(d => (
            <button key={d} type="button" onClick={() => toggleDeporte(d)}
              className={`p-2 border rounded text-sm ${deportes.includes(d) ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              {d}
            </button>
          ))}
        </div>

        <button onClick={crearUsuario} className="bg-blue-600 text-white p-2 rounded">Guardar Usuario</button>
      </div>
      {mensaje && <p className="mt-4 p-2 text-sm bg-gray-100">{mensaje}</p>}
    </div>
  );
}
