const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database'); // ✅ Importación correcta
const { procesarMensaje } = require('./messages');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta para recibir mensajes de Twilio
app.post('/webhook', async (req, res) => {
    const mensaje = req.body.Body;
    const remitente = req.body.From;
    await procesarMensaje(mensaje, remitente);
    res.sendStatus(200);
});

// Sincroniza base de datos y lanza el servidor
sequelize.sync() // ✅ Esto funciona ahora que sequelize está bien importado
    .then(() => {
        console.log('🟢 Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Error al sincronizar la base de datos:', error);
    });
