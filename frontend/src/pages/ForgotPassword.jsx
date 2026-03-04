import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/auth/forgotpassword", { email });
            setMessage(data.data); // "OTP Sent to Email"
            setError("");

            navigate("/verifyotp", { state: { email } });

        } catch (err) {
            setError(
                err.response && err.response.data.error
                    ? err.response.data.error
                    : "Failed to send email"
            );
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container justify-content-center align-items-center">
            <div className="auth-card">
                <h2 className="text-center auth-title">Forgot Password</h2>
                <p className="text-center text-muted mb-4">We'll send you a 6-digit OTP to reset it.</p>

                {error && <div className="alert alert-danger py-2">{error}</div>}
                {message && <div className="alert alert-success py-2">{message}</div>}

                <form onSubmit={handleForgotPassword}>
                    <div className="auth-input-group">
                        <label className="auth-label">Email address</label>
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="mb-0">
                        <Link to="/login" className="auth-link">
                            &larr; Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
