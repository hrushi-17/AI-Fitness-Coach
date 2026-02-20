const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
        });

        sendToken(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: "Please provide email and password" });
    }

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    console.log("ForgotPassword called for:", email);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "Email could not be sent" });
        }

        const resetToken = user.getResetPasswordToken(); // Get 6-digit OTP

        await user.save();

        // Log OTP to console for debugging/mock mode
        console.log("--------------------------------");
        console.log("Generated OTP:", resetToken);
        console.log("--------------------------------");

        const message = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #e50914;
                    color: #ffffff;
                    text-align: center;
                    padding: 24px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    letter-spacing: 1px;
                }
                .content {
                    padding: 32px 24px;
                    color: #333333;
                    line-height: 1.6;
                }
                .content p {
                    margin-bottom: 16px;
                }
                .otp-box {
                    background-color: #f9f9f9;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 16px;
                    text-align: center;
                    margin: 24px 0;
                }
                .otp-box h2 {
                    margin: 0;
                    font-size: 32px;
                    color: #e50914;
                    letter-spacing: 4px;
                }
                .footer {
                    background-color: #f9f9f9;
                    color: #777777;
                    text-align: center;
                    padding: 16px;
                    font-size: 12px;
                    border-top: 1px solid #eeeeee;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>AI Fitness Coach</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>We received a request to reset the password for your AI Fitness Coach account. Use the One-Time Password (OTP) below to proceed with resetting your password.</p>
                    
                    <div class="otp-box">
                        <h2>${resetToken}</h2>
                    </div>
                    
                    <p><strong>This OTP is valid for 1 minute.</strong> Please do not share this code with anyone.</p>
                    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                    
                    <p>Best regards,<br>The AI Fitness Coach Team</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} AI Fitness Coach. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset OTP",
                text: message,
            });

            res.status(200).json({ success: true, data: "OTP Sent to Email" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            console.error("Email send error:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    } catch (error) {
        next(error);
    }
};

// Verify OTP Endpoint
exports.verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid or Expired OTP" });
        }

        // OTP is valid. Generate a temporary "Reset Token" that allows password change.
        // This prevents keeping the OTP valid if we used it once, or having to send OTP again.
        // We can sign a JWT with a special purpose.
        const resetSessionToken = jwt.sign(
            { id: user._id, type: "password_reset" },
            process.env.JWT_SECRET,
            { expiresIn: "10m" } // Short lived
        );

        res.status(200).json({
            success: true,
            data: "OTP Verified",
            resetSessionToken,
        });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    // Expecting resetSessionToken in params or body. Let's use body or auth header?
    // User asked for "redirect to reset password... by putting this new password will be that user password validation"
    // We can pass the `resetSessionToken` from the frontend to this endpoint.

    const { resetSessionToken, password } = req.body;

    if (!resetSessionToken) {
        return res.status(400).json({ success: false, error: "Missing Reset Token" });
    }

    try {
        const decoded = jwt.verify(resetSessionToken, process.env.JWT_SECRET);

        if (decoded.type !== "password_reset") {
            return res.status(400).json({ success: false, error: "Invalid Token Type" });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Password Reset Success",
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: "Invalid or Expired Token" });
    }
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({ success: true, token });
};
