const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const twilio = require('twilio');
const mongoose = require('./database');
const { procesarMensaje } = require('./messages');

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// 🔹 **Ruta Webhook de WhatsApp**
app.post('/whatsapp', async (req, res) => {
    console.log("📩 Mensaje recibido de WhatsApp:", req.body);

    const message = req.body.Body ? req.body.Body.trim() : '';
    const sender = req.body.From;

    if (!message || !sender) {
        return res.status(400).send('Solicitud inválida');
    }

    await procesarMensaje(message, sender);
    res.sendStatus(200);
});

// 🔹 Iniciar servidor
app.listen(PORT, () => console.log(`🔥 Chatbot activo en http://localhost:${PORT}`));
const { sequelize } = require('./database');
const Cita = require('./models/Cita');

sequelize.sync(); // ¡Esto crea la tabla si no existe!
