const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");

const requestRoutes = require("./routes/requestRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorHandler");

function createApp({ staticDir, subscribePage }) {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(helmet({
    crossOriginResourcePolicy: false
  }));
  app.use(cors({
    origin(origin, callback) {
      if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_MAX || 40),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: "Too many requests from this connection. Please wait a few minutes and try again."
    }
  }));

  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      service: "druth-api",
      time: new Date().toISOString()
    });
  });

  app.use("/api", requestRoutes);
  app.use("/api/whatsapp", whatsappRoutes);

  if (staticDir) {
    app.use(express.static(staticDir));
  }

  if (subscribePage) {
    app.get("/subscribe", (req, res) => {
      res.sendFile(path.resolve(subscribePage));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp
};
