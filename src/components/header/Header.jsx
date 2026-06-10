import React, {useState} from "react";
import "./Header.css";
import Navigation from "../navigation/Navigation.jsx";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className="header">
            <div className="header-container">
                {/* Logo or Brand Name */}
                <div className="logo-wrapper">
                <div className="logo-icon"></div>
                
                <div className="logo-text">
                    <h2 className="logo-title">
                        BHOOMANI HOLDINGS
                    </h2>
                    <p className="logo-subtitle">
                        PRIVATE LIMITED
                    </p>
                </div>
            </div>
                {/* Navigation Links */}
               <Navigation />
              <button className="login-btn desktop-btn">Investor Login</button>
               
                
            </div>
        </header>
    )
}

export default Header;