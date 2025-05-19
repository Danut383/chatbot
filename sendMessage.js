require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages
    .create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: 'whatsapp:+521XXXXXXXXXX', // Cambia por tu número de WhatsApp verificado
        body: '¡Hola! Este es un mensaje de prueba desde Twilio 🚀'
    })
    .then(message => console.log(`Mensaje enviado con SID: ${message.sid}`))
    .catch(error => console.error(`Error enviando mensaje: ${error.message}`));
