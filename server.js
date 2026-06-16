require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const printerRoutes = require("./src/routes/printerRoutes");
const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/printers", printerRoutes);

app.get("/", (req, res) => {
    res.send("PrintFlow Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});