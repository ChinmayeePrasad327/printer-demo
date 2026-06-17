const express =
    require("express");

const router =
    express.Router();

const {
    requireAuth
} = require("@clerk/express");

const loadUser =
    require("../middleware/loadUser");

const {
    getMyStats,
    getMyHistory,
    getFavoritePrinter
} = require(
    "../controllers/analyticsController"
);

router.get(
    "/my-stats",
    requireAuth(),
    loadUser,
    getMyStats
);

router.get(
    "/history",
    requireAuth(),
    loadUser,
    getMyHistory
);

router.get(
    "/favorite-printer",
    requireAuth(),
    loadUser,
    getFavoritePrinter
);

module.exports = router;