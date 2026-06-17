const User = require("../models/User");

const loadUser = async (req, res, next) => {

    try {

        const clerkId =
            req.auth.userId;

        const user =
            await User.findOne({
                clerkId
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = loadUser;