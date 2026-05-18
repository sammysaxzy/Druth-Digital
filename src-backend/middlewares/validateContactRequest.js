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

function validateContactRequest(req, res, next) {
  try {
    const name = normalizeString(req.body.name);
    const email = normalizeString(req.body.email).toLowerCase();
    const phone = normalizeString(req.body.phone);
    const plan = normalizeString(req.body.plan);
    const location = normalizeString(req.body.location);
    const message = normalizeString(req.body.message);
    const company = normalizeString(req.body.company || req.body._honey);

    if (company) {
      throw createError("Spam check failed.");
    }

    if (!name || !email || !message) {
      throw createError("Please provide your name, email address, and message.");
    }

    if (!isValidEmail(email)) {
      throw createError("Please provide a valid email address.");
    }

    if (phone && !isValidPhone(phone)) {
      throw createError("Please provide a valid phone number.");
    }

    req.validatedContact = {
      name,
      email,
      phone,
      plan,
      location,
      message
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateContactRequest
};
