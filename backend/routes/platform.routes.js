const express = require("express");
const {
    connectFacebook,
    connectGoogle,
    connectLinkedIn,
    getPlatformConnections,
    disconnectPlatform,
} = require("../controllers/platform.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/connections").get(protect, getPlatformConnections);

router.route("/facebook/connect").post(protect, connectFacebook);

router.route("/google/connect").post(protect, connectGoogle);

router.route("/linkedin/connect").post(protect, connectLinkedIn);

router.route("/:platform/disconnect").delete(protect, disconnectPlatform);

module.exports = router;
