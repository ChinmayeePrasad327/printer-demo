const User = require("../models/User");
const isAllowedEmail =
    require("../utils/domainValidator");
// Create User
const createUser = async (req, res) => {
    try {

        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Users
const getUsers = async (req, res) => {
    try {

        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get User By ID
const getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update User
const updateUser = async (req, res) => {
    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Clerk User Sync
const syncUser = async (req, res) => {
    try {

        const clerkId = req.auth.userId;

        const {
            email,
            name,
            role,
            rollNo,
            department
        } = req.body;
        if (!isAllowedEmail(email)) {

            return res.status(403).json({
                success: false,
                message:
                    "Only PVPSIT email addresses are allowed"
            });

        }

        let user = await User.findOne({
            clerkId
        });

        if (!user) {

            user = await User.create({
                clerkId,
                email,
                name,
                role,
                rollNo,
                department
            });

        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    syncUser
};