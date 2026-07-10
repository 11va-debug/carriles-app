import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { supabase } from './lib/supabase'

// Procesar el hash de Supabase antes de renderizar
// Esto maneja los tokens de recovery, signup, etc.
supabase.auth.getSession()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
