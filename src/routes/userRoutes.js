// POST / api / users

// GET / api / users /: clerkId

// PATCH / api / users /: id
const express = require("express");

const router = express.Router();

const { requireAuth } = require("@clerk/express");

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    syncUser
} = require("../controllers/userController");

// Clerk User Sync
router.post(
    "/sync",
    requireAuth(),
    syncUser
);

// Development Routes
router.post("/", createUser);

router.get("/", getUsers);

router.get("/:id", getUserById);

router.patch("/:id", updateUser);

module.exports = router;