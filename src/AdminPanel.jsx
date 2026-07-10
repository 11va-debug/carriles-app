async function crearUsuario() {
    setMensaje('Creando usuario...');
    
    // 1. Crear el usuario en Auth (esto sigue igual)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      setMensaje('Error en Auth: ' + authError.message);
      return;
    }

    // 2. CORRECCIÓN: Aquí es donde fallaba. 
    // Cambiamos 'email' por 'usuario' (o el nombre exacto de tu columna)
    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([
        { id: authData.user.id, usuario: email, rol: rol, nombre: email }
      ]);

    if (dbError) {
      setMensaje('Error al asignar rol: ' + dbError.message);
    } else {
      setMensaje(`Éxito: ${email} creado como ${rol}`);
      setEmail('');
    }
  }
