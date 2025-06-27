const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos 
app.use(express.static(path.join(__dirname)));

let usingDatabase = false;
let User = null;
let sequelize = null;

// Datos de testeo  en memoria 
let users = [
    {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'juan.perez@email.com',
        telefono: '555-0101',
        edad: 30,
        activo: true,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
    },
    {
        id: 2,
        nombre: 'María García',
        email: 'maria.garcia@email.com',
        telefono: '555-0102',
        edad: 25,
        activo: true,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
    }
];

let nextId = 3;

// Inicializar conexión base de datos
async function initializeDatabase() {
    try {
        sequelize = require('./config/database');
        User = require('./models/User');
        
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa a SQL Server');
        
        await sequelize.sync({ force: false });
        console.log('📊 Base de datos sincronizada');
        
        usingDatabase = true;
        console.log('🎉 Usando SQL Server para almacenamiento');
        
    } catch (error) {
        console.log('⚠️  Usando almacenamiento en memoria como fallback');
        usingDatabase = false;
    }
}
// Importar rutas
const userRoutes = require('./routes/userRoutes');

// Rutas API
app.use('/api/users', userRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta estado
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        database: usingDatabase ? 'SQL Server' : 'Memoria',
        message: usingDatabase ? 'Conectado a SQL Server' : 'Usando datos en memoria'
    });
});

// Inicializar servidor
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`📱 Frontend: http://localhost:${PORT}`);
        console.log(`🔌 API: http://localhost:${PORT}/api`);
    });
});
