const { pricingPlans } = require("../constants/pricingPlans");

function createError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[+]?[0-9()\-\s]{7,20}$/.test(phone);
}

function normalizeString(value) {
  return String(value || "").trim();
}

function parseLegacyPlanString(planValue) {
  const rawValue = normalizeString(planValue);

  if (!rawValue) {
    return {
      planName: "",
      category: ""
    };
  }

  const withoutDetails = rawValue.split("(")[0].trim();
  const [rawCategory = "", rawPlanName = ""] = withoutDetails.split(" - ");

  return {
    category: rawCategory,
    planName: rawPlanName
  };
}

function getPlanByName(category, planName) {
  const categoryKey = String(category || "").toLowerCase() === "sme" ? "sme" : "residential";
  const plan = pricingPlans[categoryKey].find((item) => item.name.toLowerCase() === String(planName || "").toLowerCase());

  if (!plan) {
    throw createError("Selected plan is invalid.");
  }

  return {
    category: categoryKey === "sme" ? "SME" : "Residential",
    ...plan
  };
}

function validateSubscriptionRequest(req, res, next) {
  try {
    const fullName = normalizeString(req.body.fullName);
    const phoneNumber = normalizeString(req.body.phoneNumber);
    const emailAddress = normalizeString(req.body.emailAddress).toLowerCase();
    const homeAddress = normalizeString(req.body.homeAddress);
    const legacyPlan = parseLegacyPlanString(req.body.plan);
    const planName = normalizeString(req.body.selectedPlan?.planName || req.body.planName || legacyPlan.planName);
    const category = normalizeString(req.body.selectedPlan?.category || req.body.category || legacyPlan.category);
    const preferredInstallationDate = normalizeString(req.body.preferredInstallationDate);
    const additionalMessage = normalizeString(req.body.additionalMessage || req.body.notes || req.body.message);
    const company = normalizeString(req.body.company || req.body._honey);

    if (company) {
      throw createError("Spam check failed.");
    }

    if (!fullName || !phoneNumber || !emailAddress || !homeAddress || !planName || !category) {
      throw createError("Full name, phone number, email address, home address, and selected plan are required.");
    }

    if (!isValidEmail(emailAddress)) {
      throw createError("Please provide a valid email address.");
    }

    if (!isValidPhone(phoneNumber)) {
      throw createError("Please provide a valid phone number.");
    }

    const plan = getPlanByName(category, planName);

    req.validatedSubscription = {
      fullName,
      phoneNumber,
      emailAddress,
      homeAddress,
      selectedPlan: {
        planName: plan.name,
        category: plan.category,
        monthlySubscription: plan.monthlySubscription,
        installationFee: plan.installationFee,
        promoInstallationFee: plan.promoInstallationFee || null,
        speed: plan.speed
      },
      preferredInstallationDate: preferredInstallationDate ? new Date(preferredInstallationDate) : null,
      additionalMessage,
      source: normalizeString(req.body.source) || "website"
    };

    if (req.validatedSubscription.preferredInstallationDate && Number.isNaN(req.validatedSubscription.preferredInstallationDate.getTime())) {
      throw createError("Preferred installation date is invalid.");
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateSubscriptionRequest
};
