import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { BsEye, BsEyeSlash } from "react-icons/bs";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Regex patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; // At least 6 chars, 1 letter, 1 number

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
            setError("Invalid email format");
            return;
        }

        if (!passwordRegex.test(password)) {
            setError(
                "Password must be at least 6 characters long and contain at least one letter and one number"
            );
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/auth/register", {
                name,
                email,
                password,
            });
            localStorage.setItem("token", data.token);
            navigate("/chat");
        } catch (err) {
            setError(
                err.response && err.response.data.error
                    ? err.response.data.error
                    : "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container justify-content-center align-items-center">
            <div className="auth-card">
                <h2 className="text-center auth-title">Create Account</h2>
                <p className="text-center text-muted mb-4">Join AI Fitness Coach today</p>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="auth-input-group">
                        <label className="auth-label">Full Name</label>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Email address</label>
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Password</label>
                        <div className="auth-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Create a strong password"
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

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="mb-0 text-light" style={{ fontSize: "0.9rem" }}>
                        Already have an account?{" "}
                        <Link to="/login" className="auth-link-highlight">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
