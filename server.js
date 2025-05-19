const express = require('express');
const bodyParser = require('body-parser');
const { procesarMensaje } = require('./messages');
const sequelize = require('./database');
const Cita = require('./models/Cita');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoint principal para Twilio
app.post('/', async (req, res) => {
  const mensaje = req.body.Body;
  const remitente = req.body.From;

  if (mensaje && remitente) {
    await procesarMensaje(mensaje, remitente);
  }

  res.sendStatus(200);
});

// Endpoint para ver todas las citas
app.get('/citas', async (req, res) => {
  try {
    const citas = await Cita.findAll();
    res.json(citas);
  } catch (error) {
    console.error('❌ Error al obtener citas:', error.message);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

// Sincronizar base de datos y levantar servidor
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Error al conectar con la base de datos:', err.message);
});
