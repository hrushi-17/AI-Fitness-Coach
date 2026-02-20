import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function VerifyOtp() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute timer
    const [canResend, setCanResend] = useState(false);

    // Create refs for the input fields
    const inputRefs = useRef([]);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    // Initial mount logic
    useEffect(() => {
        if (!email) {
            setError("Email not found. Please try forgot password again.");
            return;
        }

        // Focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [email]);

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (!/^[0-9]*$/.test(val)) return;

        const char = val.substring(val.length - 1);

        setOtp((prevOtp) => {
            const newOtp = [...prevOtp];
            // Allow only the last entered character to populate the box (handles edge cases where maxLength fails)
            newOtp[index] = char;
            return newOtp;
        });

        // Advance focus if a number was entered
        if (char && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            // If the box is empty, move focus to previous box
            if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        const focusIndex = Math.min(pastedData.length, 5);
        if (inputRefs.current[focusIndex]) {
            inputRefs.current[focusIndex].focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Email not found. Please try forgot password again.");
            return;
        }

        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/auth/verifyotp", { email, otp: otpValue });
            navigate("/resetpassword", { state: { resetSessionToken: data.resetSessionToken } });
        } catch (err) {
            setError(
                err.response && err.response.data.error
                    ? err.response.data.error
                    : "Invalid OTP"
            );
            // Clear inputs on error to let them try again easily
            setOtp(new Array(6).fill(""));
            if (inputRefs.current[0]) inputRefs.current[0].focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        setOtp(new Array(6).fill("")); // Clear old OTP from view
        if (inputRefs.current[0]) inputRefs.current[0].focus();

        try {
            await api.post("/auth/forgotpassword", { email });
            setSuccess("New OTP sent! Check your email.");
            setTimeLeft(60); // Reset timer
            setCanResend(false);
        } catch (err) {
            setError("Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <div className="chat-container justify-content-center align-items-center">
            <div className="auth-card">
                <h2 className="text-center auth-title">Verify OTP</h2>
                <p className="text-center text-muted mb-4">Enter the 6-digit code sent to <br /><strong className="text-light">{email}</strong></p>

                {error && <div className="alert alert-danger py-2">{error}</div>}
                {success && <div className="alert alert-success py-2">{success}</div>}

                <form onSubmit={handleVerify}>
                    <div className="otp-container">
                        {otp.map((data, index) => {
                            return (
                                <input
                                    className="otp-box"
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    key={index}
                                    value={data}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onFocus={(e) => e.target.select()}
                                    onPaste={handlePaste}
                                />
                            );
                        })}
                    </div>

                    <button
                        type="submit"
                        className="auth-btn mb-4"
                        disabled={loading || otp.join("").length !== 6}
                    >
                        {loading && !canResend ? "Verifying..." : "Verify & Proceed"}
                    </button>
                </form>

                <div className="text-center">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="btn btn-link p-0"
                            style={{ color: "#e50914", textDecoration: "none", fontWeight: "bold" }}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Resend OTP"}
                        </button>
                    ) : (
                        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                            Resend OTP in <span style={{ color: "white", fontWeight: "bold" }}>{formatTime(timeLeft)}</span>
                        </p>
                    )}

                    <div className="mt-4 pt-3" style={{ borderTop: "1px solid #333" }}>
                        <Link to="/forgotpassword" style={{ color: "#bbb", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.2s" }} className="hover-white">
                            Wrong Email? Start over
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyOtp;
