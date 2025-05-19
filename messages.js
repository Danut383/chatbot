const twilio = require('twilio');
const Cita = require('./models/Cita');
require('dotenv').config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioNumber = `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;

// ✅ Función para enviar mensajes por WhatsApp
const enviarMensaje = async (to, body) => {
    try {
        await twilioClient.messages.create({
            from: twilioNumber,
            to: `whatsapp:${to.replace("whatsapp:", "")}`,
            body: body
        });
        console.log(`✅ Mensaje enviado a ${to}: ${body}`);
    } catch (error) {
        console.error(`❌ Error enviando mensaje: ${error.message}`);
    }
};

// ✅ Función para procesar los mensajes entrantes
const procesarMensaje = async (message, sender) => {
    console.log(`📩 Procesando mensaje de ${sender}: ${message}`);

    if (message.toLowerCase().includes('cita')) {
        await enviarMensaje(sender, 'Para agendar una cita, envía: "Nombre, YYYY-MM-DD, HH:MM".');
    } else if (message.includes(',')) {
        const [nombre, fecha, hora] = message.split(',').map(x => x.trim());

        if (!fecha || !hora) {
            await enviarMensaje(sender, '⚠️ Formato incorrecto. Usa: "Nombre, YYYY-MM-DD, HH:MM".');
        } else {
            await Cita.create({ nombre, fecha, hora, telefono: sender });
            await enviarMensaje(sender, `✅ Cita confirmada: ${nombre}, 📅 ${fecha} ⏰ ${hora}.`);
        }
    } else {
        await enviarMensaje(sender, 'No entendí. Usa: "cita" o "Nombre, YYYY-MM-DD, HH:MM".');
    }
};

module.exports = { procesarMensaje, enviarMensaje };
