const cron = require('node-cron');
const Cita = require('./models/Cita');
const { enviarMensaje } = require('./messages');

// ⏰ Enviar recordatorio a las 9 AM todos los días
cron.schedule('0 9 * * *', async () => {
    const hoy = new Date().toISOString().split('T')[0];

    try {
        const citasHoy = await Cita.findAll({ where: { fecha: hoy } });

        for (const cita of citasHoy) {
            await enviarMensaje(cita.telefono, `📢 ¡Hola ${cita.nombre}! Te recordamos tu cita hoy a las ${cita.hora}.`);
        }
    } catch (error) {
        console.error('❌ Error al enviar recordatorios:', error.message);
    }
});

console.log('⏳ Recordatorios de citas activados.');
