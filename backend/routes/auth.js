const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    register,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    deleteAccount,
} = require("../controllers/authController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/verifyotp").post(verifyOTP);
router.route("/resetpassword").put(resetPassword);
router.route("/delete").delete(protect, deleteAccount);

module.exports = router;
