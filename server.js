const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const compression = require("compression")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const rateLimit = require("express-rate-limit")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/error")

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Route files
const auth = require("./routes/auth")
const users = require("./routes/users")
const events = require("./routes/events")
const availability = require("./routes/availability")
const bookings = require("./routes/bookings")

const app = express()

// Body parser
app.use(express.json())

// Enable CORS - Updated to include Vercel deployment URL
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cnnct-git-main-swarajs-projects-4b6703ae.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Security middleware
app.use(helmet())
app.use(mongoSanitize())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
})
app.use("/api/", limiter)

// Mount routers
app.use("/api/auth", auth)
app.use("/api/users", users)
app.use("/api/events", events)
app.use("/api/availability", availability)
app.use("/api/bookings", bookings)

// Error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})

