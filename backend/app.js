const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const requestLogger = require("./middleWare/requestLogger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const primaryEnvPath = path.join(__dirname, "config", "config.env");
const fallbackEnvPath = path.join(__dirname, "config", "config.env.example");

require("dotenv").config({ path: fs.existsSync(primaryEnvPath) ? primaryEnvPath : fallbackEnvPath });

// CORS configuration for Cloudflare Pages frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin === allowed || origin.endsWith('.pages.dev'))) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));

// routes

const user = require("./route/userRoute");
const order = require("./route/orderRoute");
const product = require("./route/productRoute")
const payment = require("./route/paymentRoute");
const health = require("./route/healthRoute");
const banner = require("./route/bannerRoute");

// Add request logging middleware (only in development or when LOG_REQUESTS is true)
if (process.env.NODE_ENV === 'development' || process.env.LOG_REQUESTS === 'true') {
    app.use(requestLogger);
}

// for req.cookie to get token while authentication
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", health);
app.use("/api/v1", banner);

// Error middleware must come after all routes
app.use(errorMiddleware);

module.exports = app;

