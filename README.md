# 🏊 Carriles — Sistema de Gestión para Escuelas de Deportes

> Trabajo Final Integrador · Diplomatura en IA Aplicada a Entornos Digitales de Gestión · FCE-UBA · Cohorte 2026

**Autor:** Claudio Vadala  
**Deploy:** [https://carriles-app.vercel.app](https://carriles-app.vercel.app)  
**Versión actual:** v8.7

---

## ¿Qué es Carriles?

Carriles es una aplicación web para gestionar escuelas de deportes. Centraliza en un solo lugar lo que hoy se maneja con papel, WhatsApp y planillas: inscripciones, clases, horarios, pagos, revisiones médicas y comunicaciones entre la institución, los docentes y las familias.

El proyecto nació de una experiencia personal: como padre de un alumno de una escuela de deportes, observé de primera mano las ineficiencias de un sistema de gestión rudimentario. Con la IA como copiloto de desarrollo, fue posible construir una solución funcional y desplegada en producción sin formación técnica previa en programación.

---

## ¿Para qué sirve?

| Problema real | Solución en Carriles |
|---|---|
| Inscripciones por WhatsApp o papel | Panel de admin con asignación de alumnos a clases |
| Sin registro de cambios de horario | Solicitudes de cambio con aprobación y cupos automáticos |
| Revisión médica en papel | Módulo digital con lógica de fechas y estados por alumno |
| Pagos sin seguimiento | Alias por deporte, subida de comprobante y revisión |
| Comunicación dispersa | Mensajería privada y anuncios generales |
| Hijos menores sin cuenta propia | Sistema de dependientes/tutelados sin login separado |

---

## ¿Cómo se usa?

### Acceso
Ingresá en [https://carriles-app.vercel.app](https://carriles-app.vercel.app) con tu email y contraseña.

Si olvidaste tu contraseña, podés recuperarla directamente desde la pantalla de login sin necesidad de contactar al administrador.

### Roles disponibles

| Rol | Acceso |
|---|---|
| **Admin** | Todo: crear usuarios, gestionar clases, aprobar solicitudes, ver reportes |
| **Staff** | Todo excepto crear usuarios. Gestiona el día a día operativo |
| **Profesor** | Sus clases asignadas y mensajería con alumnos |
| **Alumno** | Sus clases, solicitudes de cambio, pagos y revisión médica (si hace Natación) |

### Deportes disponibles
- 🏊 **Natación** — 6 carriles, categorías: Infantil / Juvenil / Adulto Inicial / Adulto Intermedio / Adulto Avanzado
- 🏐 **Vóley** — 2 canchas, categorías: Iniciación / Intermedio / Avanzado / Competitivo
- 🌊 **Matronatación** — pileta, sin categorías
- 🤾 **Handball** — 2 canchas, categorías: Iniciación / Intermedio / Avanzado / Competitivo

---

## Funcionalidades principales

### Clases
- Vista por día con flechitas para navegar
- Vista mensual como alternativa
- Creación con rango horario (hora inicio – hora fin), carril/lugar, categoría y profesor
- Crear la misma clase en varios días a la vez
- Ver alumnos inscriptos por clase

### Inscripciones
- Asignación de alumnos a clases desde el panel de Alumnos
- Filtro automático por categoría según edad y nivel del alumno
- Detección de conflicto: un alumno no puede tener dos clases del mismo deporte el mismo día

### Solicitudes
- **Cambios de horario:** el alumno solicita, el staff aprueba o rechaza. Al aprobar, los cupos se actualizan automáticamente
- **Mensajería privada:** los alumnos y profesores pueden escribir al staff o a sus profesores asignados

### Anuncios
- El staff puede publicar anuncios generales que aparecen como popup al iniciar sesión
- Los usuarios pueden marcarlos como leídos para que no vuelvan a aparecer

### Dependientes / Tutelados
- Un adulto puede agregar menores a su cuenta sin que tengan login propio
- El tutor gestiona clases, pagos y revisión médica de sus dependientes desde un selector de perfil
- Proceso de emancipación cuando el menor crece

### Pagos
- Alias de transferencia por deporte
- Subida de comprobante con seguimiento de estado
- Panel de revisión para admin/staff

### Revisión Médica
- Solo para Natación
- Primera revisión: disponible todo el mes
- Segunda revisión: se habilita a partir del día 18 del mes
- Estado rápido (Apto / No apto) con botón de confirmación rápida

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| React + Vite | Frontend |
| Tailwind CSS | Estilos |
| Supabase | Base de datos (PostgreSQL) + Autenticación |
| Vercel | Hosting y despliegue continuo |
| GitHub | Control de versiones |
| Claude (Anthropic) | Copiloto de desarrollo (Vibe Coding) |

---

## Estructura del proyecto

```
carriles-app/
├── src/
│   ├── App.jsx          # Componente principal (toda la app)
│   ├── main.jsx         # Entry point
│   ├── index.css        # Estilos globales (Tailwind)
│   └── lib/
│       └── supabase.js  # Cliente de Supabase
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Cómo correrlo localmente

```bash
# Clonar el repositorio
git clone https://github.com/11va-debug/carriles-app.git
cd carriles-app

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
# Completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

# Iniciar servidor de desarrollo
npm run dev
```

---

## Sobre el proceso de desarrollo

Este proyecto fue construido íntegramente mediante **Vibe Coding** con Claude (Anthropic) como herramienta principal. Todo el código fue generado, depurado y refinado a través de conversación en lenguaje natural, sin conocimientos previos de React ni JavaScript avanzado.

El proceso fue iterativo: cada funcionalidad se describió, se generó, se probó en producción, y se ajustó. La versión final (v8.7) es el resultado de más de 8 iteraciones mayores y decenas de ajustes menores documentados en el historial de commits del repositorio.

---

## Licencia

Proyecto académico — FCE-UBA 2026. Uso libre para fines educativos.

---

## Usuarios de prueba

Para explorar la aplicación sin necesidad de crear una cuenta:

| Rol | Email | Contraseña |
|---|---|---|
| **Admin** | admin@carriles.com | admin123 |
| **Alumno** | test@test.com | 12345678 |
| **Profesor (Natación)** | marina@carriles.com | marina123 |
| **Profesor (Vóley)** | lucia@carriles.com | lucia123 |
| **Profesor (Handball)** | tomas@carriles.com | tomas123 |

> ⚠️ Son cuentas de demostración. No subir información real.
