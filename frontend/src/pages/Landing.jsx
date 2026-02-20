import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function Landing() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // If already logged in, maybe redirect to chat, or just let them click a button

    return (
        <div
            className="landing-container d-flex flex-column justify-content-center align-items-center text-center text-white"
            style={{
                minHeight: '100vh',
                background: 'radial-gradient(circle at center top, #2e0e12 0%, #111111 70%)',
                padding: '20px'
            }}
        >
            <h1 style={{
                fontWeight: 800,
                fontSize: '3.5rem',
                color: '#e50914',
                textShadow: '0 4px 10px rgba(0,0,0,0.6)',
                marginBottom: '20px',
                letterSpacing: '1px'
            }}>
                AI Fitness Coach
            </h1>
            <p style={{
                fontSize: '1.25rem',
                maxWidth: '600px',
                marginBottom: '40px',
                color: '#e0e0e0',
                lineHeight: '1.6'
            }}>
                Your personal trainer and nutritionist, always right in your pocket.
                Get personalized custom workouts and diet plans powered by AI.
            </p>

            <div className="d-flex gap-3 flex-wrap justify-content-center">
                {token ? (
                    <Link to="/chat" className="btn btn-netflix px-5 py-3" style={{ fontSize: '1.1rem', borderRadius: '8px', fontWeight: 'bold' }}>
                        Go to Dashboard
                    </Link>
                ) : (
                    <>
                        <Link to="/register" className="btn btn-netflix px-5 py-3" style={{ fontSize: '1.1rem', borderRadius: '8px', fontWeight: 'bold' }}>
                            Start Journey
                        </Link>
                        <Link to="/login" className="btn px-5 py-3" style={{
                            fontSize: '1.1rem',
                            borderRadius: '8px',
                            border: '2px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseOver={(e) => {
                                e.target.style.borderColor = '#fff';
                                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                e.target.style.backgroundColor = 'transparent';
                            }}>
                            Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Landing;
