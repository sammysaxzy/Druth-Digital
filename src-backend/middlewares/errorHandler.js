function notAllowedMessage(error) {
  if (error.message === "Origin not allowed by CORS") {
    return {
      statusCode: 403,
      message: error.message
    };
  }

  return null;
}

function errorHandler(error, req, res, next) {
  const corsError = notAllowedMessage(error);

  if (corsError) {
    return res.status(corsError.statusCode).json({
      message: corsError.message
    });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong.";

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  return res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
}

module.exports = {
  errorHandler
};
