Luis Ruben Velasquez Garcia  
Carnet 24011341  
Universidad Galileo - Tecnico desarrollo fullstack  
Proyecto final 4to semestre  
Cursos Node JS avanzado, Proyecto de aplicacion JavaScript y Testing en el desarrollo

# EVENTS4U - Plataforma de Gestión de Eventos y Boletos 🎟️

Proyecto final para el curso de Técnico en Desarrollo Fullstack y Testing.
Una aplicación web completa para la gestión, venta y administración de eventos, implementando prácticas de seguridad, integración continua y pruebas automatizadas.

## 🚀 Tecnologías Utilizadas

### Backend

- **Node.js & Express**: Servidor RESTful API.
- **PostgreSQL & Sequelize**: Base de datos relacional y ORM.
- **JWT & Bcrypt**: Autenticación segura y hash de contraseñas.
- **Cloudinary**: Almacenamiento de imágenes en la nube.
- **Jest & Supertest**: Pruebas unitarias y de integración.

### Frontend

- **React + Vite**: Biblioteca de interfaz de usuario rápida.
- **Bootstrap 5**: Estilos y componentes responsivos (Personalizados).
- **Context API**: Gestión de estado global (Auth).
- **Axios**: Comunicación con la API.

---

## 🛠️ Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (Local o Docker)
- Cuenta de Cloudinary (para imágenes)

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd events4U
```

### 2. Configurar el Backend

```bash

cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend` basado en `.env.example` y configura tus variables:

**Importante:** Asegúrate de definir una contraseña segura para el administrador inicial.

```ini
PORT=3000
DATABASE_URL=postgres://usuario:password@localhost:5432/events4u
JWT_SECRET=escribe_aqui_un_secreto_seguro
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Credenciales para el Seeder (Admin Inicial)
ADMIN_EMAIL=admin@events4u.com
ADMIN_PASSWORD=cambiar_por_contraseña_segura
```

### 3. Inicializar Base de Datos

Asegúrate de que tu servicio de PostgreSQL esté corriendo.

```bash
# Crear el usuario administrador inicial
node src/seeders/adminSeeder.js
```

### 4. Configurar el Frontend

En una nueva terminal:

```bash

cd frontend
npm install
```

▶️ Ejecución  
Modo Desarrollo  
Necesitarás dos terminales abiertas:

Terminal 1 (Backend):

```bash

cd backend
npm run dev
# Servidor corriendo en http://localhost:3000
```

Terminal 2 (Frontend):

```bash

cd frontend
npm run dev
# Cliente corriendo en http://localhost:5173
```

🧪 Pruebas (Testing)  
El proyecto cuenta con una suite de pruebas automatizadas que cubren autenticación, gestión de eventos y flujo de compra.

Para ejecutar las pruebas (Backend):

```bash

cd backend
npm test
```

Esto ejecutará Jest con cobertura de código, utilizando una base de datos de prueba temporal (events4u_test).

👤 Credenciales de Acceso (Demo)
Administrador:

- Email: admin@events4u.com
- Password: (La que hayas configurado en tu .env)

Usuario Regular:

- Puedes registrar un nuevo usuario desde la página de /register.

---

📋 Funcionalidades Principales

1. Gestión de Eventos (CRUD): Crear, leer y eliminar eventos con subida de imágenes.

2. Sistema de Roles: Rutas protegidas para Administradores y Usuarios.

3. Compra de Boletos: Simulación de pago y generación de tickets con control de inventario (Transacciones DB).

4. Mis Tickets: Historial de compras del usuario.

5. Panel Admin: Dashboard con métricas y gestión de usuarios (Bloqueo/Ascenso).
