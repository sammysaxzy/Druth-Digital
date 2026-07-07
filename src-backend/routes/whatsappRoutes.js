const express = require("express");

const {
  receiveWhatsAppWebhook,
  verifyWhatsAppWebhook
} = require("../controllers/whatsappController");

const router = express.Router();

router.get("/webhook", verifyWhatsAppWebhook);
router.post("/webhook", receiveWhatsAppWebhook);

module.exports = router;
