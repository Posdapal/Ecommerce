import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"
import AuthModal from '../../Authentication/AuthModal'

const API_BASE =  process.env.REACT_APP_API_URL;

function Header() {
    // check if user is logged in
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cartCount, setCartCount] = useState(0);    // 👈 replaces "const cartCount = 0"

    const handleLogout = () => {
        localStorage.removeItem("token"); // delete token
        localStorage.removeItem("username");   // 👈 remove username too
        setShowDropdown(false);
        window.location.href = "/"; // go to login page
    }

    const handleLoginSuccess = () => {
        setShowModal(false);
        setToken(localStorage.getItem("token"));
        setUsername(localStorage.getItem("username"));
        window.location.reload(); // refresh so icon swiches state
    }

    // New: get cart from backend
    const loadCartCount = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_BASE}/api/cart/view`, {
                headers: { Authorization: token },
            });
            setCartCount(res.data.items.length); // number of differen products
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadCartCount(); // load when pag opens
        window.addEventListener("cartUpdated", loadCartCount); // reload when cart change
        return () => window.removeEventListener("cartUpdated", loadCartCount);
    });
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow fixed-top">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    SHOPLANE
                </Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#computers">Computer</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#computers">Accessories</a>
                        </li>
                    </ul>
                </div>

                <div className="d-flex align-items-center">

                    {/* ACCOUNT AREA */}
                    <div className="position-relative me-3">

                        {token ? (
                            /* ===== LOGGED IN: avatar + name ===== */
                            <button
                                className="btn btn-light border rounded-pill d-flex align-items-center gap-2 py-1 ps-1 pe-3"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {/* circle with first letter */}
                                <span
                                    className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                    style={{ width: "32px", height: "32px" }}
                                >
                                    {username ? username.charAt(0).toUpperCase() : "U"}
                                </span>

                                {/* small "Hello" + username (hidden on phone) */}
                                <span className="text-start lh-1 d-none d-md-block">
                                    {/* <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                                        Hello,
                                    </small> */}
                                    <span className="fw-semibold small">{username}</span>
                                </span>
                            </button>
                        ) : (
                            /* ===== NOT LOGGED IN: Login button ===== */
                            <button
                                className="btn btn-dark rounded-pill px-3"
                                onClick={() => setShowModal(true)}
                            >
                                Login
                            </button>
                        )}

                        {/* DROPDOWN MENU */}
                        {showDropdown && token && (
                            <div
                                className="position-absolute end-0 bg-white shadow rounded-3 mt-2"
                                style={{ top: "100%", minWidth: "200px", zIndex: 1050 }}
                            >
                                <div className="px-3 py-2 border-bottom">
                                    <small className="text-muted">Signed In As User</small>
                                </div>

                                <button
                                    className="btn btn-link text-danger text-decoration-none w-100 text-start px-3 py-2"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* CART ICON */}
                    <Link
                        to="/cart"
                        className="btn btn-light rounded-circle p-2 border position-relative"
                        style={{ width: "40px", height: "40px" }}
                    >
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.49.402H4a.5.5 0 0 1-.49-.402L2.01 2.5H.5a.5.5 0 0 1-.5-.5Zm3.14 3 .84 4h7.11l.8-4H3.14ZM4 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-7-1a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
                        </svg>

                        {cartCount > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: "10px" }}
                            >
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            <AuthModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </nav>
    )
}

export default Header