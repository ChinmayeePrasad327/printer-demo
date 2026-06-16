const User = require("../models/User");

const allowRoles = (...roles) => {

    return async (req, res, next) => {

        try {

            const clerkId = req.auth.userId;

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

            if (!roles.includes(user.role)) {

                return res.status(403).json({
                    success: false,
                    message: "Access denied"
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

};

module.exports = allowRoles;