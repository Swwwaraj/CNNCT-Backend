const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require("./routes/auth");
const users = require("./routes/users");
const events = require("./routes/events");
const availability = require("./routes/availability");
const bookings = require("./routes/bookings");

const app = express();

// Body parser
app.use(express.json());

// ✅ Enable CORS
const allowedOrigins = [
  "http://localhost:3000", 
  "https://cnnct-git-main-swarajs-projects-4b6703ae.vercel.app"
];

const cors = require("cors");

const cors = require("cors");

app.use(
  cors({
    origin: "https://cnnct-git-main-swarajs-projects-4b6703ae.vercel.app",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);



// ✅ Handle Preflight Requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Mount routers
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/events", events);
app.use("/api/availability", availability);
app.use("/api/bookings", bookings);

// ✅ Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

// ✅ Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(` Error: ${err.message}`);
  server.close(() => process.exit(1));
});
