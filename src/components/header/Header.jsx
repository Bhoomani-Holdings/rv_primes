import React, {useState} from "react";
import "./Header.css";

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
               <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}> 
                <a href="/">Home</a>
                <a href="/about-us">AboutUs</a>
                <a href="/our-business">Our Business</a>
                <a href="/investment-opportunities">Investment Oppurtunities</a>
                <a href="/investors">Investors</a>
                <a href="/news-and-updates">News & Updates</a>
                <a href="/contact">Contact</a>

                <button className="login-btn mobile-btn">Investor Login</button>
              </nav>
              <button className="login-btn desktop-btn">Investor Login</button>
                {/* Mobile Menu Icon */}
                <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                
            </div>
        </header>
    )
}

export default Header;