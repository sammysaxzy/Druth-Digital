const mongoose = require("mongoose");

const subscriptionRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  homeAddress: {
    type: String,
    required: true,
    trim: true
  },
  selectedPlan: {
    planName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Residential", "SME"]
    },
    monthlySubscription: {
      type: Number,
      required: true
    },
    installationFee: {
      type: Number,
      required: true
    },
    promoInstallationFee: {
      type: Number,
      default: null
    },
    speed: {
      type: String,
      required: true
    }
  },
  preferredInstallationDate: {
    type: Date,
    default: null
  },
  additionalMessage: {
    type: String,
    trim: true,
    default: ""
  },
  requestStatus: {
    type: String,
    enum: ["pending", "contacted", "scheduled", "completed", "cancelled"],
    default: "pending"
  },
  source: {
    type: String,
    default: "website"
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.SubscriptionRequest || mongoose.model("SubscriptionRequest", subscriptionRequestSchema);
