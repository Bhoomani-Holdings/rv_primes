import React,{useState} from "react";
import "./Footer.css";

function Footer() {

        return (
            <footer className="footer">
                <div className="footer-container">
                    {/* Left Section */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="footer-icon"></div>
                            <h2>Bhoomani Holdings</h2>
                        </div>

                        <p className="footer-desc">
                            Building sustainable assets and creating
                            lasting value through smart investments and 
                            ethical business practices.
                        </p>

                        <div className="social-icons">
                            <div>f</div>
                            <div>in</div>
                            <div>tw</div>
                            <div>yt</div>
                        </div>
                    </div>
                    
                    {/* Company Info */}

                    <div className="footer-column">
                        <h3>COMPANY</h3>
                        
                        <a href="/about-us">About Us</a>
                        <a href="/our-business">Our Business</a>
                        <a href="/our-team">Our Team</a>
                        <a href="/news-and-updates">News & Updates</a>
                        <a href="/careers">Careers</a>
                        <a href="/contact">Contact</a>
                    </div>

                    {/* Investors */}
                    <div className="footer-column">
                        <h3>INVESTORS</h3>
                        <a href="/investor-opportunities">Investor Opportunities</a>
                        <a href="/how-it-works">How It Works</a>
                        <a href="/investor-login">Investor Login</a>
                        <a href="/refund-policy">Refund Policy</a>
                        <a href="/faqs">FAQs</a>
                        <a href="/documents">Documents</a>
                    </div>

                    {/* Legal */}
                    <div className="footer-column">
                        <h3>LEGAL</h3>
                        <a href="/privacy-policy">Privacy Policy</a>
                        <a href="/kyc-policy">KYC Policy</a>
                        <a href="/disclaimer">Disclaimer</a>
                        <a href="/terms-and-conditions">Terms and Conditions</a>
                        <a href="/sitemap">Sitemap</a>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-column">
                        <h3>CONTACT US</h3>
                        <div className="contact-item">
                            📞 +91 98765 43210 
                        </div>
                        <div className="contact-item">
                            ✉️info@bhoomaniholdings.com 
                        </div>
                        <div className="contact-item">
                            📍 Hyderabad, Telangana, India
                        </div>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Bhoomani Holdings Private Limited.
                         All rights reserved.</p>

                    <div className="footer-links">
                        <a href="/privacy-policy">Privacy Policy</a>
                        <a href="/terms-of-use">Terms of Use</a>
                        <a href="/disclaimer">Disclaimer</a>
                    </div>
                </div>

            </footer>
        );
}

export default Footer;