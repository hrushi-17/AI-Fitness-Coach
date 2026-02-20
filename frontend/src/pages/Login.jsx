import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { BsEye, BsEyeSlash } from "react-icons/bs";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const { data } = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (err) {
            setError(
                err.response && err.response.data.error
                    ? err.response.data.error
                    : "Login failed"
            );
        }
    };

    return (
        <div className="chat-container justify-content-center align-items-center">
            <div className="auth-card">
                <h2 className="text-center auth-title">Login</h2>
                <p className="text-center text-muted mb-4">Welcome back to AI Fitness Coach</p>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleLogin}>
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
                                placeholder="Enter your password"
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
                    </div>

                    <button type="submit" className="auth-btn">
                        Sign In
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="mb-2 text-light" style={{ fontSize: "0.9rem" }}>
                        Don't have an account?{" "}
                        <Link to="/register" className="auth-link-highlight">
                            Register here
                        </Link>
                    </p>
                    <p className="mb-0">
                        <Link to="/forgotpassword" className="auth-link">
                            Forgot Password?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
