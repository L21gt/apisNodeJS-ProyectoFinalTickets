/**
 * Script para crear el usuario Administrador inicial.
 * Se ejecuta manualmente: node src/seeders/adminSeeder.js
 */
require('dotenv').config();
const db = require('../models');

async function seedAdmin() {
  try {
    // 1. Conectar a la base de datos
    await db.sequelize.sync();

    // 2. Verificar si ya existe un admin
    const existingAdmin = await db.User.findOne({ where: { email: 'admin@events4u.com' } });
    
    if (existingAdmin) {
      console.log('⚠️  El usuario Admin ya existe. No se realizaron cambios.');
      process.exit(0);
    }

    // 3. Crear el Admin
    await db.User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: process.env.ADMIN_EMAIL,       // LEER DESDE .ENV
      password: process.env.ADMIN_PASSWORD, // LEER DESDE .ENV
      role: 'admin',
      status: 'active'
    });

    console.log('✅ Usuario Administrador creado exitosamente.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al crear el seed:', error);
    process.exit(1);
  }
}

seedAdmin();