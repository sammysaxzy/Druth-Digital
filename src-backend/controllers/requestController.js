const SubscriptionRequest = require("../models/SubscriptionRequest");
const { isDatabaseReady } = require("../config/db");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  persistSubscriptionRequest,
  sendSubscriptionNotifications,
  sendContactNotifications
} = require("../services/subscriptionService");
const { pricingPlans } = require("../constants/pricingPlans");

const submitSubscriptionRequest = asyncHandler(async (req, res) => {
  const payload = req.validatedSubscription;

  const savedRequest = await persistSubscriptionRequest(payload);
  await sendSubscriptionNotifications(savedRequest ? savedRequest.toObject() : payload);

  res.status(201).json({
    message: "Your subscription request has been received. We will contact you shortly.",
    data: {
      requestId: savedRequest?._id || null,
      storedInDatabase: Boolean(savedRequest)
    }
  });
});

const submitContactRequest = asyncHandler(async (req, res) => {
  await sendContactNotifications(req.validatedContact);

  res.status(201).json({
    message: "Your message has been received. We will contact you shortly."
  });
});

const getPricingPlans = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Pricing plans loaded successfully.",
    data: pricingPlans
  });
});

const listSubscriptionRequests = asyncHandler(async (req, res) => {
  if (!isDatabaseReady()) {
    res.status(200).json({
      message: "MongoDB is not configured. Database submissions are unavailable.",
      data: []
    });
    return;
  }

  const requests = await SubscriptionRequest.find()
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    message: "Subscription requests loaded successfully.",
    data: requests
  });
});

const updateSubscriptionStatus = asyncHandler(async (req, res) => {
  if (!isDatabaseReady()) {
    const error = new Error("MongoDB is not configured. Request statuses cannot be updated.");
    error.statusCode = 503;
    throw error;
  }

  const request = await SubscriptionRequest.findByIdAndUpdate(
    req.params.id,
    { requestStatus: req.body.requestStatus },
    { new: true, runValidators: true }
  );

  if (!request) {
    const error = new Error("Subscription request not found.");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    message: "Request status updated successfully.",
    data: request
  });
});

module.exports = {
  submitSubscriptionRequest,
  submitContactRequest,
  getPricingPlans,
  listSubscriptionRequests,
  updateSubscriptionStatus
};
