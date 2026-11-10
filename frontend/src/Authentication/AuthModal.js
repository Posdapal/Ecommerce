import React, { useState } from 'react'
import axios from 'axios'

const API_BASE = "http://localhost:8081";

function AuthModal({ show, onClose, onLoginSuccess }) {
    const [activeTab, setActiveTab] = useState("login"); // "login" or "register"
    const [message, setMessage] = useState("");

    // shared form fields
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({});
    const isLogin = activeTab === "login";

    if (!show) return null;

    const resetFields = () => {
        setUsername("");
        setEmail("");
        setPassword("");
        setPhone("");
        setMessage("");
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        resetFields();
        setErrors({});
    };

    const validate = () => {
        const newErrors = {};

        if (!isLogin && username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (!isLogin && password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!isLogin) {
            if (!phone) {
                newErrors.phone = "Phone is required";
            } else if (!/^[0-9]{8,12}$/.test(phone)) {
                newErrors.phone = "Phone must be 8-12 digits";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // true = no errors
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const res = await axios.post(`${API_BASE}/api/user/login`, {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username); // 👈 add this
            onLoginSuccess();
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            await axios.post(`${API_BASE}/api/user/register`, {
                username,
                email,
                password,
                phone
            });

            alert("Register Success, please login");
            switchTab("login");
        } catch (error) {
            setMessage(error.response?.data?.message || "Register failed");
        }
    };

    return (
        <>
            {/* dark background overlay */}
            <div className="modal-backdrop show" onClick={onClose}></div>

            {/* modal box */}
            <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">

                        {/* close button */}
                        <button
                            type="button"
                            className="btn-close position-absolute top-0 end-0 m-3"
                            onClick={onClose}
                        ></button>

                        <div className="p-4 p-md-5">

                            {/* brand */}
                            <h4 className="text-center fw-bold mb-1 letter-spacing">SHOPLANE</h4>
                            <p className="text-center text-muted small mb-4">
                                {activeTab === "login" ? "Welcome back, please login" : "Create your account"}
                            </p>

                            {/* pill tabs */}
                            <div className="d-flex bg-light rounded-pill p-1 mb-4">
                                <button
                                    className={`btn flex-fill rounded-pill py-2 ${activeTab === "login" ? "btn-dark" : "btn-light text-muted"}`}
                                    onClick={() => switchTab("login")}
                                >
                                    Login
                                </button>
                                <button
                                    className={`btn flex-fill rounded-pill py-2 ${activeTab === "register" ? "btn-dark" : "btn-light text-muted"}`}
                                    onClick={() => switchTab("register")}
                                >
                                    Register
                                </button>
                            </div>

                            {message && (
                                <div className="alert alert-danger py-2 small">{message}</div>
                            )}

                            {activeTab === "login" ? (
                                <form onSubmit={handleLogin} noValidate>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            id="loginEmail"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label htmlFor="loginEmail">Email address</label>
                                        <div className="invalid-feedback">{errors.email}</div>
                                    </div>

                                    <div className="form-floating mb-2">
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                            id="loginPassword"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <label htmlFor="loginPassword">Password</label>
                                        <div className="invalid-feedback">{errors.password}</div>
                                    </div>

                                    <button className="btn btn-dark w-100 py-2 rounded-3 fw-semibold">
                                        Login
                                    </button>

                                    <p className="text-center text-muted small mt-3 mb-0">
                                        Don't have an account?{" "}
                                        <span
                                            role="button"
                                            className="text-dark fw-semibold text-decoration-underline"
                                            onClick={() => switchTab("register")}
                                        >
                                            Register
                                        </span>
                                    </p>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} noValidate>
                                    <div className="form-floating mb-3">
                                        <input
                                            className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                            id="regUsername"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <label htmlFor="regUsername">Username</label>
                                        <div className="invalid-feedback">{errors.username}</div>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            id="regEmail"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label htmlFor="regEmail">Email address</label>
                                        <div className="invalid-feedback">{errors.email}</div>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                            id="regPassword"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <label htmlFor="regPassword">Password</label>
                                        <div className="invalid-feedback">{errors.password}</div>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                            id="regPhone"
                                            placeholder="Phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                        <label htmlFor="regPhone">Phone number</label>
                                        <div className="invalid-feedback">{errors.phone}</div>
                                    </div>

                                    <button className="btn btn-dark w-100 py-2 rounded-3 fw-semibold">
                                        Create account
                                    </button>

                                    <p className="text-center text-muted small mt-3 mb-0">
                                        Already have an account?{" "}
                                        <span
                                            role="button"
                                            className="text-dark fw-semibold text-decoration-underline"
                                            onClick={() => switchTab("login")}
                                        >
                                            Login
                                        </span>
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthModal;