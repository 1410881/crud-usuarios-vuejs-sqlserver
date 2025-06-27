# CRUD Básico con Vue.js y SQL Server

Una aplicación web completa que permite realizar operaciones CRUD (Create, Read, Update, Delete) sobre una tabla de usuarios, utilizando Vue.js en el frontend y Node.js con Express y SQL Server en el backend.

## 🚀 Características

- ✅ Frontend moderno con Vue.js 3
- ✅ Backend con Node.js y Express
- ✅ Base de datos SQL Server con Sequelize ORM
- ✅ APIs RESTful
- ✅ Interfaz responsive con Bootstrap 5
- ✅ Validaciones en frontend y backend
- ✅ Manejo de errores
- ✅ Animaciones y efectos visuales

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- SQL Server (Local o remoto)
- npm o yarn

## 🔧 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd vuejs
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la base de datos

1. Asegúrate de que SQL Server esté ejecutándose
2. Crea la base de datos ejecutando el script en `sql/create_database.sql`
3. Configura las variables de entorno en el archivo `.env`:

```env
DB_SERVER=localhost
DB_DATABASE=CrudApp
DB_USERNAME=sa
DB_PASSWORD=tu_password_aqui
DB_PORT=1433
PORT=3000
```

### 4. Ejecutar la aplicación

#### Modo desarrollo (con nodemon):
```bash
npm run dev
```

#### Modo producción:
```bash
npm start
```

### 5. Acceder a la aplicación

Abre tu navegador y ve a: `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
vuejs/
├── config/
│   └── database.js          # Configuración de Sequelize
├── controllers/
│   └── userController.js    # Controladores de usuarios
├── models/
│   └── User.js              # Modelo de usuario
├── routes/
│   └── userRoutes.js        # Rutas de la API
├── sql/
│   └── create_database.sql  # Script de creación de BD
├── .env                     # Variables de entorno
├── index.html               # Frontend con Vue.js
├── package.json             # Dependencias del proyecto
└── server.js                # Servidor principal
```

## 🔌 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Obtener todos los usuarios |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users` | Crear nuevo usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

## 📝 Ejemplo de uso de la API

### Crear un usuario
```javascript
fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nombre: 'Juan Pérez',
        email: 'juan@email.com',
        telefono: '555-1234',
        edad: 30
    })
})
```

### Actualizar un usuario
```javascript
fetch('/api/users/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nombre: 'Juan Carlos Pérez',
        edad: 31
    })
})
```

## 🎨 Tecnologías Utilizadas

### Frontend
- Vue.js 3
- Bootstrap 5
- Font Awesome
- HTML5/CSS3

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MSSQL Driver

### Base de Datos
- Microsoft SQL Server

## 🛠️ Desarrollo

### Comandos disponibles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start
```

### Variables de entorno

Asegúrate de configurar las siguientes variables en tu archivo `.env`:

- `DB_SERVER`: Servidor de SQL Server
- `DB_DATABASE`: Nombre de la base de datos
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña del usuario
- `DB_PORT`: Puerto de SQL Server (por defecto 1433)
- `PORT`: Puerto del servidor Express (por defecto 3000)

## 🐛 Solución de Problemas

### Error de conexión a SQL Server
1. Verifica que SQL Server esté ejecutándose
2. Confirma las credenciales en el archivo `.env`
3. Asegúrate de que el puerto 1433 esté abierto

### Error "Cannot GET /"
- Asegúrate de ejecutar `npm start` desde el directorio del proyecto

### Problemas con dependencias
```bash
# Limpiar caché e instalar dependencias
npm cache clean --force
npm install
```

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

---

**¡Listo para usar!** 🎉
