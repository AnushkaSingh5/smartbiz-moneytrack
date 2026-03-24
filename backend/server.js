const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for detailed request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/", transactionRoutes); // Map routes to root since frontend expects /all and /add

// Database Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/moneytrack", {
    serverSelectionTimeoutMS: 5000 // If it can't connect in 5s, it will tell us why!
})
.then(() => {
    console.log("MongoDB is now connected! 🚀");
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running at: http://127.0.0.1:${PORT}`);
    });
})
.catch((err) => {
    console.error("CRITICAL: MongoDB connection failed:", err.message);
});
