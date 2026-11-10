import React from 'react'
import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer className="bg-dark text-light mt-5 pt-5">
            <div className="container">
                <div className="row gy-4">

                    {/* Brand + newsletter */}
                    <div className="col-md-3">
                        <h5 className="fw-bold mb-3">SHOPLANE</h5>
                        <p className="text-secondary small">
                            Your one-stop shop for the latest tech and accessories.
                        </p>

                        <p className="small mb-2">Subscribe for deals & updates</p>
                    </div>

                    {/* Online Store */}
                    <div className="col-md-3">
                        <h5 className="mb-3">Online Store</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/clothing" className="text-secondary text-decoration-none">
                                    Computer
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/accessories" className="text-secondary text-decoration-none">
                                    Accessories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div className="col-md-3">
                        <h5 className="mb-3">Help</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/contact" className="text-secondary text-decoration-none">
                                    Contact
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/about" className="text-secondary text-decoration-none">
                                    About
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/faq" className="text-secondary text-decoration-none">
                                    FAQ
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/shipping" className="text-secondary text-decoration-none">
                                    Shipping & Returns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Address + social */}
                    <div className="col-md-3">
                        <h5 className="mb-3">Address</h5>
                        <p className="text-secondary small mb-1">Phnom Penh, Cambodia</p>
                        <p className="text-secondary small mb-3">support@shoplane.com</p>

                        <div className="d-flex gap-3 fs-5">
                            <a href="#" className="text-light"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-light"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="text-light"><i className="bi bi-telegram"></i></a>
                        </div>
                    </div>

                </div>
            </div>

            {/* bottom bar */}
            <div className="border-top border-secondary mt-4 py-3">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
                    <span>&copy; {new Date().getFullYear()} SHOPLANE. All rights reserved.</span>
                    <span>Made with care in Cambodia</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer