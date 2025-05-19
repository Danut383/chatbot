const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL no está definida. Agrégala a las variables de entorno en Render.');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

module.exports = sequelize;
