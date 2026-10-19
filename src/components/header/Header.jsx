import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routesPath";
import "./Header.css";
import Navigation from "../navigation/Navigation.jsx";

function Header() {
    const navigate = useNavigate();
    return (
        <header className="site-header">
            <div className="header-container">
                <div className="logo-wrapper">
                    <div className="logo-icon"></div>
                    <div className="logo-text">
                        <h2 className="logo-title">BHOOMANI HOLDINGS</h2>
                        <p className="logo-subtitle">PRIVATE LIMITED</p>
                    </div>
                </div>
                <Navigation />
                <button
                    className="login-btn desktop-btn"
                    type="button"
                    onClick={() => navigate(ROUTES.LOGIN)}
                >
                    Investor Login
                </button>
            </div>
        </header>
    )
}

export default Header;