const express = require("express");
const { requireAuth } = require("@clerk/express");

const router = express.Router();

router.get(
    "/me",
    requireAuth(),
    async (req, res) => {

        res.status(200).json({
            success: true,
            clerkId: req.auth.userId
        });

    }
);

module.exports = router;