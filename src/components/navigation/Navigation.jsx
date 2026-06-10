import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routesPath';
import styles from "./Navigation.module.css";


export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div>
      <nav className={`${styles['nav-menu']} ${isMenuOpen ? styles.active : ''}`}>
        <Link to={ROUTES.HOME}>Home</Link>
        <Link to={ROUTES.ABOUT_US}>AboutUs</Link>
        <Link to="/our-business">Our Business</Link>
        <Link to="/investment-opportunities">Investment Oppurtunities</Link>
        <Link to="/investors">Investors</Link>
        <Link to="/news-and-updates">News & Updates</Link>
        <Link to={ROUTES.CONTACT}>Contact</Link>

         <button className={`login-btn ${styles['mobile-btn']}`}>Investor Login</button>
      </nav>
       {/* Mobile Menu Icon */}
                <div className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
    </div>
  )
}
