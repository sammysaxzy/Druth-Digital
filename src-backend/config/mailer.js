const nodemailer = require("nodemailer");

function getMissingMailEnv() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];

  return required.filter((key) => {
    const value = process.env[key];
    return !value || String(value).includes("your-app-password");
  });
}

function createMailerTransport() {
  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || undefined,
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 15000),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendEmail(message) {
  const missing = getMissingMailEnv();

  if (missing.length) {
    const error = new Error(`Email delivery is not configured yet. Missing: ${missing.join(", ")}`);
    error.statusCode = 500;
    throw error;
  }

  const transporter = createMailerTransport();
  return transporter.sendMail(message);
}

module.exports = {
  getMissingMailEnv,
  sendEmail
};
