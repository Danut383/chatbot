// messages.js
const twilio = require('twilio');
const Cita = require('./models/Cita');
require('dotenv').config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioNumber = `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;

const estadosUsuario = {}; // Guardamos el estado de cada usuario por teléfono

// ✅ Enviar mensaje por WhatsApp
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

// ✅ Procesar mensajes entrantes
const procesarMensaje = async (message, sender) => {
    console.log(`📩 Mensaje de ${sender}: ${message}`);

    // Si no hay estado, iniciamos el proceso
    if (!estadosUsuario[sender]) {
        estadosUsuario[sender] = { paso: 1, datos: {} };
        return await enviarMensaje(sender, "👋 Hola, vamos a agendar tu cita.\n¿Cuál es tu *nombre*?");
    }

    const estado = estadosUsuario[sender];

    switch (estado.paso) {
        case 1:
            estado.datos.nombre = message.trim();
            estado.paso++;
            return await enviarMensaje(sender, "¿Cuál es tu *apellido*?");
        
        case 2:
            estado.datos.apellido = message.trim();
            estado.paso++;
            return await enviarMensaje(sender, "¿En qué *año* quieres la cita? (Ej: 2025)");

        case 3:
            estado.datos.anio = message.trim();
            estado.paso++;
            return await enviarMensaje(sender, "¿En qué *mes*? (Ej: 06 para junio)");

        case 4:
            estado.datos.mes = message.trim();
            estado.paso++;
            return await enviarMensaje(sender, "¿Qué *día*?");

        case 5:
            estado.datos.dia = message.trim();
            estado.paso++;
            return await enviarMensaje(sender, "¿A qué *hora*? (Ej: 15:00)");

        case 6:
            estado.datos.hora = message.trim();

            // Armamos la cita
            const fecha = `${estado.datos.anio}-${estado.datos.mes}-${estado.datos.dia}`;
            const nombreCompleto = `${estado.datos.nombre} ${estado.datos.apellido}`;

            try {
                await Cita.create({
                    nombre: nombreCompleto,
                    fecha,
                    hora: estado.datos.hora,
                    telefono: sender
                });

                await enviarMensaje(sender, `✅ *Cita confirmada:*\n👤 ${nombreCompleto}\n📅 ${fecha}\n⏰ ${estado.datos.hora}`);
            } catch (err) {
                await enviarMensaje(sender, "❌ Hubo un error guardando tu cita. Inténtalo de nuevo.");
                console.error(err);
            }

            delete estadosUsuario[sender]; // Limpiamos estado del usuario
            break;

        default:
            delete estadosUsuario[sender];
            return await enviarMensaje(sender, "⚠️ Algo salió mal. Empezaremos de nuevo. Escribe cualquier mensaje.");
    }
};

module.exports = { procesarMensaje, enviarMensaje };
