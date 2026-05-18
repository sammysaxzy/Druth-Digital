const express = require("express");

const {
  submitSubscriptionRequest,
  submitContactRequest,
  getPricingPlans,
  listSubscriptionRequests,
  updateSubscriptionStatus
} = require("../controllers/requestController");
const { validateSubscriptionRequest } = require("../middlewares/validateRequest");
const { validateContactRequest } = require("../middlewares/validateContactRequest");

const router = express.Router();

router.get("/plans", getPricingPlans);
router.post("/subscription-requests", validateSubscriptionRequest, submitSubscriptionRequest);
router.post("/subscribe", validateSubscriptionRequest, submitSubscriptionRequest);
router.post("/contact", validateContactRequest, submitContactRequest);
router.get("/subscription-requests", listSubscriptionRequests);
router.patch("/subscription-requests/:id/status", updateSubscriptionStatus);

module.exports = router;
