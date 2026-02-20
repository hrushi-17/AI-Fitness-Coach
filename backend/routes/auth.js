const express = require("express");
const router = express.Router();

const {
    register,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
} = require("../controllers/authController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/verifyotp").post(verifyOTP);
router.route("/resetpassword").put(resetPassword);

module.exports = router;
