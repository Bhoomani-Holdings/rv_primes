import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routesPath';
import styles from "./Navigation.module.css";


export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <nav
        id="site-navigation"
        className={`${styles['nav-menu']} ${isMenuOpen ? styles.active : ''}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <Link to={ROUTES.HOME}>Home</Link>
        <Link to={ROUTES.ABOUT_US}>AboutUs</Link>
        <Link to="/our-business">Our Business</Link>
        <Link to="/investment-opportunities">Investment Oppurtunities</Link>
        <Link to="/investors">Investors</Link>
        <Link to="/news-and-updates">News & Updates</Link>
        <Link to={ROUTES.CONTACT}>Contact</Link>

         <button
          className={`login-btn ${styles['mobile-btn']}`}
          type="button"
          onClick={() => navigate(ROUTES.LOGIN)}
          aria-haspopup="dialog"
        >
          Investor Login
        </button>
      </nav>
      <button
        type="button"
        className={styles.hamburger}
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls="site-navigation"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </div>
  )
}
