const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ✅ CORS (important for frontend connection)
app.use(cors({
  origin: "*", // you can restrict later
}));

app.use(express.json());

// ✅ Routes
app.use("/", transactionRoutes);

// ✅ MongoDB Connection (PRODUCTION SAFE)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log("MongoDB connected 🚀");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});