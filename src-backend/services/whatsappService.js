const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v20.0";
const DEFAULT_REPLY = "Hello, welcome to Druth Digital Support. Thank you for contacting us. Kindly provide your full name, location, and tell us if you are an existing customer or a new customer. Please also describe your complaint or request. Our support agent will attend to you shortly.";
const DEFAULT_ESCALATION_REPLY = " If this is a serious complaint, your issue will be escalated to management.";
const DEFAULT_ESCALATION_KEYWORDS = [
  "serious complaint",
  "urgent",
  "outage",
  "down",
  "fraud",
  "threat",
  "legal",
  "manager",
  "management",
  "escalate",
  "complaint"
];

function getWhatsAppConfig() {
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
    autoReply: process.env.WHATSAPP_AUTO_REPLY || DEFAULT_REPLY,
    escalationReply: process.env.WHATSAPP_ESCALATION_REPLY || DEFAULT_ESCALATION_REPLY,
    escalationKeywords: (process.env.WHATSAPP_ESCALATION_KEYWORDS || DEFAULT_ESCALATION_KEYWORDS.join(","))
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  };
}

function isWhatsAppConfigured() {
  const { accessToken, phoneNumberId, verifyToken } = getWhatsAppConfig();
  return Boolean(accessToken && phoneNumberId && verifyToken);
}

function getMessageText(message = {}) {
  return (
    message.text?.body ||
    message.button?.text ||
    message.interactive?.button_reply?.title ||
    message.interactive?.list_reply?.title ||
    message.caption ||
    ""
  ).trim();
}

function isSeriousComplaint(messageText, escalationKeywords) {
  const normalizedText = String(messageText || "").toLowerCase();
  return escalationKeywords.some((keyword) => normalizedText.includes(keyword));
}

function buildAutoReply(messageText) {
  const { autoReply, escalationReply, escalationKeywords } = getWhatsAppConfig();
  const shouldEscalate = isSeriousComplaint(messageText, escalationKeywords);
  return `${autoReply}${shouldEscalate ? escalationReply : ""}`;
}

function parseWebhookMessages(payload = {}) {
  const changes = payload.entry?.flatMap((entry) => entry.changes || []) || [];

  return changes.flatMap((change) => {
    const value = change.value || {};
    const contact = value.contacts?.[0] || {};
    const messages = value.messages || [];

    return messages
      .filter((message) => message.from)
      .map((message) => ({
        from: message.from,
        profileName: contact.profile?.name || "",
        messageText: getMessageText(message),
        messageType: message.type || "unknown"
      }));
  });
}

async function sendWhatsAppMessage({ to, body }) {
  const { accessToken, phoneNumberId } = getWhatsAppConfig();

  if (!accessToken || !phoneNumberId) {
    const error = new Error("WhatsApp Cloud API credentials are missing.");
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch(`https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: {
        preview_url: false,
        body
      }
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error?.message || "Unable to send WhatsApp auto-reply.");
    error.statusCode = response.status;
    throw error;
  }

  return data;
}

module.exports = {
  buildAutoReply,
  getWhatsAppConfig,
  isWhatsAppConfigured,
  parseWebhookMessages,
  sendWhatsAppMessage
};
