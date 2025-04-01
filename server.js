const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import route files
const auth = require("./routes/auth");
const users = require("./routes/users");
const events = require("./routes/events");
const availability = require("./routes/availability");
const bookings = require("./routes/bookings");

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Enable CORS with proper configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cnnct-sigma.vercel.app"], // Ensure this matches your Vercel frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight (OPTIONS) requests globally
app.options("*", cors());

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Prevents conflicts with CORS
  })
);
app.use(mongoSanitize());
app.use(compression());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

// Mount API routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/events", events);
app.use("/api/availability", availability);
app.use("/api/bookings", bookings);

// Global error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
