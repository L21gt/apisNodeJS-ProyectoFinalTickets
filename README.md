Luis Ruben Velasquez Garcia  
Carnet 24011341  
Universidad Galileo - Tecnico desarrollo fullstack  
Proyecto final 4to semestre  
Cursos Node JS avanzado, Proyecto de aplicacion JavaScript y Testing en el desarrollo

# EVENTS4U - Plataforma de Gestión de Eventos y Boletos 🎟️

Proyecto final para el curso de Técnico en Desarrollo Fullstack y Testing.
Una aplicación web completa para la gestión, venta y administración de eventos, implementando prácticas de seguridad, integración continua y pruebas automatizadas.

---

## 🚀 Tecnologías Utilizadas

### Backend

- **Node.js & Express**: Servidor RESTful API.
- **PostgreSQL & Sequelize**: Base de datos relacional y ORM.
- **JWT & Bcrypt**: Autenticación segura y hash de contraseñas.
- **Cloudinary**: Almacenamiento y optimización de imágenes en la nube.
- **Jest & Supertest**: Framework de pruebas unitarias y de integración.

### Frontend

- **React + Vite**: Biblioteca de interfaz de usuario rápida y moderna.
- **Bootstrap 5 (Custom)**: Estilos responsivos con paleta de colores personalizada.
- **Context API**: Gestión de estado global (Autenticación y Usuario).
- **Axios**: Cliente HTTP para comunicación con la API.
- **Chart.js**: Visualización de datos y reportes gráficos.

---

## 🛠️ Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (Local o vía Docker)
- Cuenta de Cloudinary (para subida de imágenes)
- Git

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura de monorepositorio con separación clara de responsabilidades:

```text
events4U/
├── .github/workflows/   # Configuración de CI/CD (GitHub Actions)
├── backend/             # API REST, Lógica de Negocio y Tests
│   ├── src/
│   │   ├── controllers/ # Lógica de respuesta
│   │   ├── models/      # Definición de tablas (Sequelize)
│   │   ├── routes/      # Endpoints de la API
│   │   └── services/    # Lógica auxiliar
│   └── tests/           # Pruebas Unitarias e Integración
└── frontend/            # Cliente React
    ├── src/
    │   ├── components/  # Componentes reutilizables (Admin/Public)
    │   ├── context/     # Estado Global (AuthContext)
    │   └── pages/       # Vistas principales
```

# ⚙️ Instalación y Configuración

1. Clonar el repositorio

```Bash
git clone <tu-repo-url>
cd events4U
```

2. Configurar el Backend

```Bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend` basado en `.env.example` y configura tus variables.  
Importante: Asegúrate de definir una contraseña segura para el administrador inicial.

```Ini, TOML
PORT=3000
DATABASE_URL=postgres://usuario:password@localhost:5432/events4u
JWT_SECRET=escribe_aqui_un_secreto_seguro_y_largo
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Credenciales para el Seeder (Admin Inicial)
ADMIN_EMAIL=admin@events4u.com
ADMIN_PASSWORD=cambiar_por_contraseña_segura
```

3. Inicializar Base de Datos  
   Asegúrate de que tu servicio de PostgreSQL esté corriendo (o tu contenedor Docker).

```Bash# Sincronizar modelos y crear el usuario administrador inicial
node src/seeders/adminSeeder.js
```

4. Configurar el Frontend  
   En una nueva terminal:

```Bash
cd frontend
npm install
```

---

### ▶️ Ejecución

#### Modo Desarrollo

Necesitarás dos terminales abiertas simultáneamente:

#### Terminal 1 (Backend):

```Bash
cd backend
npm run dev
# Servidor corriendo en http://localhost:3000
```

#### Terminal 2 (Frontend):

```Bash
cd frontend
npm run dev
# Cliente corriendo en http://localhost:5173
```

---

### 🧪 Testing y Calidad de Código

Este proyecto cumple con un 80%+ de cobertura de código, validando tanto la lógica unitaria como los flujos de integración críticos.

#### Ejecutar Pruebas (Backend)

```Bash
cd backend
npm test
```

#### Generar Reporte de Cobertura

Para ver el desglose detallado de cobertura por archivo:

```Bash
npm run test:coverage
```

#### Estrategia de Pruebas

1. Unitarias: Aislamiento de lógica de negocio (ej. `authController`) usando Mocks.
2. Integración: Pruebas de endpoints completos (`supertest`) interactuando con una base de datos de prueba real (`events4u_test`), asegurando la integridad de datos y relaciones.

---

### 🔄 CI/CD (Integración Continua)

El proyecto incluye un pipeline automatizado con GitHub Actions. Cada vez que se realiza un `push` o `pull_request` a la rama principal:

1. GitHub levanta un entorno virtual (Ubuntu).
2. Inicia un servicio de PostgreSQL.
3. Instala dependencias y ejecuta la suite completa de pruebas.
4. Verifica que no existan regresiones en el código.
   Configuración disponible en: `.github/workflows/test.yml`

---

## 📡 API Endpoints Principales

| Método   | Endpoint                | Descripción                    | Acceso  |
| :------- | :---------------------- | :----------------------------- | :------ |
| **POST** | `/api/auth/login`       | Iniciar sesión y obtener Token | Público |
| **GET**  | `/api/events`           | Listar eventos activos         | Público |
| **POST** | `/api/events`           | Crear evento (con imagen)      | Admin   |
| **POST** | `/api/tickets/purchase` | Comprar boletos (Transacción)  | Usuario |
| **GET**  | `/api/reports/stats`    | Estadísticas del Dashboard     | Admin   |

---

### 👤 Credenciales de Acceso (Demo)

#### Administrador:

- Email: `admin@events4u.com`
- Password: (La que hayas configurado en tu .env)

#### Usuario Regular:

- Puedes registrar un nuevo usuario libremente desde la página de `/register`.

---

### 📋 Funcionalidades Completadas

1. Gestión de Eventos (CRUD): Crear, leer, editar y eliminar eventos con subida de imágenes a Cloudinary.
2. Sistema de Roles: Rutas y componentes protegidos (Admin vs User).
3. Compra de Boletos: Simulación de pago, generación de tickets y control de inventario mediante transacciones ACID.
4. Panel de Usuario: Historial de "Mis Tickets" y edición de perfil.
5. Panel Admin: Dashboard con métricas gráficas, reportes de ventas filtrables y gestión de usuarios (Bloqueo/Roles).
6. Contacto: Formulario público y bandeja de entrada para el administrador.
