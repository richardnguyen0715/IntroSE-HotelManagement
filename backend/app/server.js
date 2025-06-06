const express = require("express");
const config = require("./config/config");
const connectDB = require("./config/database");

// Import routes
const systemRoutes = require("./routes/systemRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const roomTypeRoutes = require("./routes/roomTypeRoutes");
const authRoutes = require("./routes/authRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const hotelPolicyRoutes = require("./routes/hotelPolicyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const mapperRoutes = require("./routes/mapperRoutes");
// Khởi tạo Express app
const app = express();

// Secure middleware
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Database connection
connectDB();

// Setting cors request to frontend (example: http://localhost:3000)
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));

// Use helmet for security
app.use(helmet());

// Set security rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
//app.use(limiter);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes cho authentication
app.use("/api/auth", authRoutes);

// routes
app.use("/api/system", systemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/roomtypes", roomTypeRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/policy", hotelPolicyRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/mapper", mapperRoutes);
// Simple test route
app.get("/", (_, res) => {
  res.send("Hotel Management API is running");
});

// start server
app.listen(config.PORT, () => {
  console.log(
    `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`
  );
});