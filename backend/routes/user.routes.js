const express = require("express");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            company: req.user.company,
            role: req.user.role,
            platformConnections: req.user.platformConnections,
        },
    });
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
    try {
        const { name, email, company } = req.body;

        const user = await req.user.model("User").findById(req.user._id);

        if (name) user.name = name;
        if (email) user.email = email;
        if (company) user.company = company;

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                company: user.company,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

module.exports = router;
