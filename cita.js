const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // SIN destructuring

const Cita = sequelize.define('Cita', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

module.exports = Cita;
