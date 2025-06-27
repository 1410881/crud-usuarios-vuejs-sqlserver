// Datos para testeo
let memoryUsers = [
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

// Función verifica base de datos
function isDatabaseAvailable() {
    try {
        const User = require('../models/User');
        return true;
    } catch (error) {
        return false;
    }
}

const userController = {
    // Obtener todos los usuarios
    getAllUsers: async (req, res) => {
        try {
            if (isDatabaseAvailable()) {
                const User = require('../models/User');
                const users = await User.findAll({
                    order: [['fechaCreacion', 'DESC']]
                });
                res.json({
                    success: true,
                    data: users,
                    message: 'Usuarios obtenidos exitosamente (SQL Server)'
                });
            } else {
                res.json({
                    success: true,
                    data: memoryUsers,
                    message: 'Usuarios obtenidos exitosamente (Memoria)'
                });
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
    
            res.json({
                success: true,
                data: memoryUsers,
                message: 'Usuarios obtenidos desde memoria (fallback)'
            });
        }
    },

    // Obtener usuario por ID
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (isDatabaseAvailable()) {
                const User = require('../models/User');
                const user = await User.findByPk(id);
                
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                }

                res.json({
                    success: true,
                    data: user,
                    message: 'Usuario encontrado (SQL Server)'
                });
            } else {
                const user = memoryUsers.find(u => u.id === parseInt(id));
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                }
                res.json({
                    success: true,
                    data: user,
                    message: 'Usuario encontrado (Memoria)'
                });
            }
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Crear nuevo usuario
    createUser: async (req, res) => {
        try {
            const { nombre, email, telefono, edad } = req.body;

            // Validaciones básicas
            if (!nombre || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre y email son requeridos'
                });
            }

            if (isDatabaseAvailable()) {
                const User = require('../models/User');
                const newUser = await User.create({
                    nombre,
                    email,
                    telefono,
                    edad
                });

                res.status(201).json({
                    success: true,
                    data: newUser,
                    message: 'Usuario creado exitosamente (SQL Server)'
                });
            } else {
                // Verificar email duplicado en memoria
                if (memoryUsers.find(u => u.email === email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'El email ya está en uso'
                    });
                }

                const newUser = {
                    id: nextId++,
                    nombre,
                    email,
                    telefono: telefono || null,
                    edad: edad || null,
                    activo: true,
                    fechaCreacion: new Date().toISOString(),
                    fechaActualizacion: new Date().toISOString()
                };

                memoryUsers.push(newUser);

                res.status(201).json({
                    success: true,
                    data: newUser,
                    message: 'Usuario creado exitosamente (Memoria)'
                });
            }
        } catch (error) {
            console.error('Error al crear usuario:', error);
            
            // Manejar errores de validación de Sequelize
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: error.errors.map(err => err.message)
                });
            }
            
            // Manejar error de email duplicado
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está en uso'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Actualizar usuario
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, email, telefono, edad, activo } = req.body;

            if (isDatabaseAvailable()) {
                const User = require('../models/User');
                const user = await User.findByPk(id);
                
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                }

                await user.update({
                    nombre: nombre || user.nombre,
                    email: email || user.email,
                    telefono: telefono !== undefined ? telefono : user.telefono,
                    edad: edad !== undefined ? edad : user.edad,
                    activo: activo !== undefined ? activo : user.activo
                });

                res.json({
                    success: true,
                    data: user,
                    message: 'Usuario actualizado exitosamente (SQL Server)'
                });
            } else {
                const user = memoryUsers.find(u => u.id === parseInt(id));
                
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                }

                // Verificar email duplicado (excluyendo el usuario actual)
                if (email && email !== user.email && memoryUsers.find(u => u.email === email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'El email ya está en uso'
                    });
                }

                user.nombre = nombre || user.nombre;
                user.email = email || user.email;
                user.telefono = telefono !== undefined ? telefono : user.telefono;
                user.edad = edad !== undefined ? edad : user.edad;
                user.activo = activo !== undefined ? activo : user.activo;
                user.fechaActualizacion = new Date().toISOString();

                res.json({
                    success: true,
                    data: user,
                    message: 'Usuario actualizado exitosamente (Memoria)'
                });
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: error.errors.map(err => err.message)
                });
            }
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está en uso'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Eliminar usuario
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (isDatabaseAvailable()) {
                const User = require('../models/User');
                const user = await User.findByPk(id);
                
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                }

                await user.destroy();

                res.json({
                    success: true,
                    message: 'Usuario eliminado exitosamente (SQL Server)'
                });
            } else {
                const userIndex = memoryUsers.findIndex(u => u.id === parseInt(id));
                
                if (userIndex === -1) {
                    return res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                }

                memoryUsers.splice(userIndex, 1);

                res.json({
                    success: true,
                    message: 'Usuario eliminado exitosamente (Memoria)'
                });
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = userController;
