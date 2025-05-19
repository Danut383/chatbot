# Configuración de Twilio para WhatsApp

### 1️⃣ Crear una cuenta en Twilio
- Regístrate en [Twilio](https://www.twilio.com/).
- Verifica tu número de teléfono.
- Obtén un número de WhatsApp en la sección **Twilio Sandbox for WhatsApp**.

### 2️⃣ Configurar Webhook
- Inicia tu servidor (`node server.js`).
- Usa `ngrok` para exponer localhost: `npx ngrok http 3000`.
- Copia la URL de `ngrok` y pégala en **Twilio Console** → **WhatsApp Sandbox**.
- En el campo de **Webhook URL**, pon:  
