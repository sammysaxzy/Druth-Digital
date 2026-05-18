const SubscriptionRequest = require("../models/SubscriptionRequest");
const { isDatabaseReady } = require("../config/db");
const { sendEmail } = require("../config/mailer");
const { buildAdminEmailTemplate, buildCustomerEmailTemplate } = require("../utils/emailTemplates");

async function persistSubscriptionRequest(payload) {
  if (!isDatabaseReady()) {
    return null;
  }

  return SubscriptionRequest.create(payload);
}

async function sendSubscriptionNotifications(payload) {
  const adminEmail = process.env.LEAD_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  await Promise.all([
    sendEmail({
      from,
      to: adminEmail,
      replyTo: payload.emailAddress,
      subject: `New Internet Subscription Request - ${payload.selectedPlan.category} / ${payload.selectedPlan.planName}`,
      html: buildAdminEmailTemplate(payload),
      text: `New request from ${payload.fullName} for ${payload.selectedPlan.category} - ${payload.selectedPlan.planName}.`
    }),
    sendEmail({
      from,
      to: payload.emailAddress,
      subject: "Druth Digital Subscription Request Received",
      html: buildCustomerEmailTemplate(payload),
      text: `Hi ${payload.fullName}, your request for ${payload.selectedPlan.category} - ${payload.selectedPlan.planName} has been received.`
    })
  ]);
}

async function sendContactNotifications(payload) {
  const adminEmail = process.env.LEAD_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  await Promise.all([
    sendEmail({
      from,
      to: adminEmail,
      replyTo: payload.email,
      subject: `New Contact Request from Druth Website${payload.plan ? ` - ${payload.plan}` : ""}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#10233f;line-height:1.7;">
          <h2>New Contact Request</h2>
          <p>A new website contact request has been submitted.</p>
          <ul>
            <li><strong>Name:</strong> ${payload.name}</li>
            <li><strong>Email:</strong> ${payload.email}</li>
            <li><strong>Phone:</strong> ${payload.phone || "Not provided"}</li>
            <li><strong>Plan:</strong> ${payload.plan || "Not selected"}</li>
            <li><strong>Location:</strong> ${payload.location || "Not provided"}</li>
            <li><strong>Message:</strong> ${payload.message}</li>
          </ul>
        </div>
      `,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "Not provided"}\nPlan: ${payload.plan || "Not selected"}\nLocation: ${payload.location || "Not provided"}\nMessage: ${payload.message}`
    }),
    sendEmail({
      from,
      to: payload.email,
      subject: "Druth Digital Contact Request Received",
      html: `
        <div style="font-family:Arial,sans-serif;color:#10233f;line-height:1.7;">
          <h2>Your Message Has Been Received</h2>
          <p>Hi ${payload.name}, thank you for contacting Druth Digital.</p>
          <p>We have received your message and our team will respond shortly.</p>
        </div>
      `,
      text: `Hi ${payload.name}, we have received your message and our team will respond shortly.`
    })
  ]);
}

module.exports = {
  persistSubscriptionRequest,
  sendSubscriptionNotifications,
  sendContactNotifications
};
