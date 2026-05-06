const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const requestLog = new Map();
const REQUIRED_SMTP_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];

function getMissingMailEnv() {
  return REQUIRED_SMTP_ENV.filter((key) => {
    const value = process.env[key];
    return !value || String(value).includes("PASTE_YOUR_GMAIL_APP_PASSWORD_HERE");
  });
}

function createTransporter() {
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

async function sendAdminEmail(message) {
  const transporter = createTransporter();
  return transporter.sendMail(message);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[+]?[0-9()\-\s]{7,20}$/.test(phone);
}

function isRateLimited(key) {
  const now = Date.now();
  const timestamps = (requestLog.get(key) || []).filter((timestamp) => now - timestamp < REQUEST_WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}

router.post("/api/subscribe", async (req, res) => {
  const {
    name = "",
    email = "",
    phone = "",
    address = "",
    plan = "",
    notes = "",
    company = ""
  } = req.body || {};

  const trimmedPayload = {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    address: String(address).trim(),
    plan: String(plan).trim(),
    notes: String(notes).trim(),
    company: String(company).trim()
  };

  if (trimmedPayload.company) {
    return res.status(400).json({
      message: "Spam check failed."
    });
  }

  if (!trimmedPayload.name || !trimmedPayload.email || !trimmedPayload.phone || !trimmedPayload.address || !trimmedPayload.plan) {
    return res.status(400).json({
      message: "Please provide your full name, phone number, email address, installation address, and selected plan."
    });
  }

  if (!isValidEmail(trimmedPayload.email)) {
    return res.status(400).json({
      message: "Please provide a valid email address."
    });
  }

  if (!isValidPhone(trimmedPayload.phone)) {
    return res.status(400).json({
      message: "Please provide a valid phone number."
    });
  }

  const requestKey = req.ip || req.headers["x-forwarded-for"] || "unknown";
  if (isRateLimited(requestKey)) {
    return res.status(429).json({
      message: "Too many requests from this connection. Please wait a few minutes and try again."
    });
  }

  const adminEmail = process.env.LEAD_NOTIFICATION_EMAIL || "druthdigital@gmail.com";
  const missingMailEnv = getMissingMailEnv();

  if (missingMailEnv.length) {
    return res.status(500).json({
      message: "Email delivery is not configured yet. Please set the SMTP environment variables before sending requests."
    });
  }

  try {
    await sendAdminEmail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: adminEmail,
      replyTo: trimmedPayload.email,
      subject: "New Internet Plan Request",
      text: [
        "A new internet plan request has been submitted.",
        "",
        `Customer Name: ${trimmedPayload.name}`,
        `Phone Number: ${trimmedPayload.phone}`,
        `Email: ${trimmedPayload.email}`,
        `Address: ${trimmedPayload.address}`,
        `Selected Plan: ${trimmedPayload.plan}`,
        `Message: ${trimmedPayload.notes || "None"}`
      ].join("\n")
    });

    return res.status(200).json({
      message: "Your request has been received. We will contact you shortly."
    });
  } catch (error) {
    console.error("Lead capture email failed:", error);
    return res.status(500).json({
      message: "Unable to send your request right now. Please try again shortly."
    });
  }
});

router.post("/api/contact", async (req, res) => {
  const {
    name = "",
    email = "",
    phone = "",
    plan = "",
    location = "",
    message = "",
    company = ""
  } = req.body || {};

  const trimmedPayload = {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    plan: String(plan).trim(),
    location: String(location).trim(),
    message: String(message).trim(),
    company: String(company).trim()
  };

  if (trimmedPayload.company) {
    return res.status(400).json({
      message: "Spam check failed."
    });
  }

  if (!trimmedPayload.name || !trimmedPayload.email || !trimmedPayload.message) {
    return res.status(400).json({
      message: "Please provide your name, email address, and message."
    });
  }

  if (!isValidEmail(trimmedPayload.email)) {
    return res.status(400).json({
      message: "Please provide a valid email address."
    });
  }

  if (trimmedPayload.phone && !isValidPhone(trimmedPayload.phone)) {
    return res.status(400).json({
      message: "Please provide a valid phone number."
    });
  }

  const requestKey = req.ip || req.headers["x-forwarded-for"] || "unknown";
  if (isRateLimited(requestKey)) {
    return res.status(429).json({
      message: "Too many requests from this connection. Please wait a few minutes and try again."
    });
  }

  const adminEmail = process.env.LEAD_NOTIFICATION_EMAIL || "druthdigital@gmail.com";
  const missingMailEnv = getMissingMailEnv();

  if (missingMailEnv.length) {
    return res.status(500).json({
      message: "Email delivery is not configured yet. Please set the SMTP environment variables before sending messages."
    });
  }

  try {
    await sendAdminEmail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: adminEmail,
      replyTo: trimmedPayload.email,
      subject: "New Contact Request from Druth Website",
      text: [
        "A new contact form inquiry has been submitted.",
        "",
        `Customer Name: ${trimmedPayload.name}`,
        `Email: ${trimmedPayload.email}`,
        `Phone Number: ${trimmedPayload.phone || "Not provided"}`,
        `Selected Plan: ${trimmedPayload.plan || "Not selected"}`,
        `Location: ${trimmedPayload.location || "Not provided"}`,
        `Message: ${trimmedPayload.message}`
      ].join("\n")
    });

    return res.status(200).json({
      message: "Your message has been received. We will contact you shortly."
    });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return res.status(500).json({
      message: "Unable to send your message right now. Please try again shortly."
    });
  }
});

module.exports = router;
