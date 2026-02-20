import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../services/api";
import { BsEye, BsEyeSlash } from "react-icons/bs";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const resetSessionToken = location.state?.resetSessionToken; // Get token passed from VerifyOtp

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!resetSessionToken) {
            setError("Session expired. Please start over.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 6 characters long and contain at least one letter and one number");
            return;
        }

        try {
            // Send resetSessionToken in body
            const { data } = await api.put("/auth/resetpassword", {
                resetSessionToken,
                password,
            });
            setMessage(data.data);
            setError("");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(
                err.response && err.response.data.error
                    ? err.response.data.error
                    : "Failed to reset password"
            );
            setMessage("");
        }
    };

    return (
        <div className="chat-container justify-content-center align-items-center">
            <div className="auth-card">
                <h2 className="text-center auth-title">Reset Password</h2>
                <p className="text-center text-muted mb-4">Create a new, strong password</p>

                {error && <div className="alert alert-danger py-2">{error}</div>}
                {message && <div className="alert alert-success py-2">{message}</div>}

                <form onSubmit={handleResetPassword}>
                    <div className="auth-input-group">
                        <label className="auth-label">New Password</label>
                        <div className="auth-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                            </button>
                        </div>
                        <small className="text-muted" style={{ fontSize: "0.8rem", marginTop: "5px", display: "block" }}>
                            Min 6 chars, 1 letter, 1 number
                        </small>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Confirm New Password</label>
                        <div className="auth-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-btn">
                        Save New Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
