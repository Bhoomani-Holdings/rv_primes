import React,{useState} from "react";
import { Link } from "react-router-dom";
import bhoomaniLogo from "../../assets/bhoomani-logo.png";
import { ROUTES } from "../../routes/routesPath";
import "./Footer.css";

function Footer() {

        return (
            <footer className="footer">
                <div className="footer-container">
                    {/* Left Section */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img className="footer-icon" src={bhoomaniLogo} alt="Bhoomani Holdings logo" />
                            <h2>Bhoomani Holdings</h2>
                        </div>

                        <p className="footer-desc">
                            Building sustainable assets and creating
                            lasting value through smart investments and 
                            ethical business practices.
                        </p>

                        <div className="social-icons">
                            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z"/></svg></a>
                            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.4 9h2.9v9.6H5.4V9zm1.4-4.6a1.7 1.7 0 110 3.4 1.7 1.7 0 010-3.4zM10 9h2.8v1.3c.4-.8 1.4-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5v5.3h-2.9v-4.7c0-1.1 0-2.6-1.6-2.6s-1.8 1.2-1.8 2.5v4.8H10V9z"/></svg></a>
                            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" title="Twitter"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
                            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg></a>
                        </div>
                    </div>
                    
                    {/* Company Info */}

                    <div className="footer-column">
                        <h3>COMPANY</h3>
                        
                        <Link to={ROUTES.ABOUT_US}>About Us</Link>
                        <Link to={ROUTES.OUR_BUSINESS}>Our Business</Link>
                        <Link to={ROUTES.OUR_TEAM}>Our Team</Link>
                        <Link to={ROUTES.NEWS_AND_UPDATES}>News &amp; Updates</Link>
                        <Link to={ROUTES.CAREERS}>Careers</Link>
                        <Link to={ROUTES.CONTACT}>Contact</Link>
                    </div>

                    {/* Investors */}
                    <div className="footer-column">
                        <h3>INVESTORS</h3>
                        <Link to={ROUTES.INVESTOR_OPPORTUNITIES}>Investor Opportunities</Link>
                        <Link to={ROUTES.HOW_IT_WORKS}>How It Works</Link>
                        <Link to={ROUTES.LOGIN}>Investor Login</Link>
                        <Link to={ROUTES.REFUND_POLICY}>Refund Policy</Link>
                        <Link to={ROUTES.FAQS}>FAQs</Link>
                        <Link to={ROUTES.DOCUMENTS}>Documents</Link>
                    </div>

                    {/* Legal */}
                    <div className="footer-column">
                        <h3>LEGAL</h3>
                        <Link to={ROUTES.PRIVACY_POLICY}>Privacy Policy</Link>
                        <Link to={ROUTES.KYC_POLICY}>KYC Policy</Link>
                        <Link to={ROUTES.DISCLAIMER}>Disclaimer</Link>
                        <Link to={ROUTES.TERMS_AND_CONDITIONS}>Terms and Conditions</Link>
                        <Link to={ROUTES.SITEMAP}>Sitemap</Link>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-column">
                        <h3>CONTACT US</h3>
                        <div className="contact-item">
                            📞 +91 70362 80364
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
                        <Link to={ROUTES.PRIVACY_POLICY}>Privacy Policy</Link>
                        <Link to={ROUTES.TERMS_OF_USE}>Terms of Use</Link>
                        <Link to={ROUTES.DISCLAIMER}>Disclaimer</Link>
                    </div>
                </div>

            </footer>
        );
}

export default Footer;
