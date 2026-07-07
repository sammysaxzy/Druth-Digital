const { asyncHandler } = require("../utils/asyncHandler");
const {
  buildAutoReply,
  getWhatsAppConfig,
  isWhatsAppConfigured,
  parseWebhookMessages,
  sendWhatsAppMessage
} = require("../services/whatsappService");

const verifyWhatsAppWebhook = asyncHandler(async (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const { verifyToken } = getWhatsAppConfig();

  if (mode === "subscribe" && token && token === verifyToken) {
    res.status(200).send(challenge);
    return;
  }

  res.status(403).json({
    message: "WhatsApp webhook verification failed."
  });
});

const receiveWhatsAppWebhook = asyncHandler(async (req, res) => {
  if (!isWhatsAppConfigured()) {
    res.status(503).json({
      message: "WhatsApp Cloud API is not configured."
    });
    return;
  }

  const inboundMessages = parseWebhookMessages(req.body);

  await Promise.all(inboundMessages.map((message) => {
    const autoReply = buildAutoReply(message.messageText);

    return sendWhatsAppMessage({
      to: message.from,
      body: autoReply
    });
  }));

  res.status(200).json({
    message: "WhatsApp webhook processed successfully.",
    repliesSent: inboundMessages.length
  });
});

module.exports = {
  receiveWhatsAppWebhook,
  verifyWhatsAppWebhook
};
