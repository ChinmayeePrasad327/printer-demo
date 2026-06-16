require("dotenv").config();
const { clerkMiddleware } = require("@clerk/express");

const express = require("express");
const cors = require("cors");

const app = express();

const connectDB = require("./src/config/db");
const printerRoutes = require("./src/routes/printerRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
// Connect Database
connectDB();

app.use(cors());

app.use(express.json());

app.use(clerkMiddleware());

app.use("/api/printers", printerRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => { res.send("PrintFlow Backend Running 🚀"); });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});