// POST / api / printers

// GET / api / printers

// PATCH / api / printers /: id

// DELETE / api / printers /: id
const express = require("express");

const router = express.Router();

const {
    createPrinter,
    getPrinters,
    getPrinterById,
    updatePrinter,
    deletePrinter,
    getRecommendations
} = require("../controllers/printerController");

router.post("/", createPrinter);

// IMPORTANT
router.get(
    "/recommendations",
    getRecommendations
);

router.get("/", getPrinters);

router.get("/:id", getPrinterById);

router.patch("/:id", updatePrinter);

router.delete("/:id", deletePrinter);

module.exports = router;