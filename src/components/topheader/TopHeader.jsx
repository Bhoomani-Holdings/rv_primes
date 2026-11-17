import { useEffect, useState } from "react";
import { FiBell, FiMenu, FiX } from "react-icons/fi";
import "./TopHeader.css";

function TopHeader({ user, notificationCount = 0, mobileMenuOpen = false, onMenuClick }) {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("adminProfile") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const updateProfile = () => {
      try {
        setProfile(JSON.parse(localStorage.getItem("adminProfile") || "{}"));
      } catch {
        setProfile({});
      }
    };
    window.addEventListener("adminProfileUpdated", updateProfile);
    return () => window.removeEventListener("adminProfileUpdated", updateProfile);
  }, []);

  const name = user?.fullName || user?.name || profile.name || "Admin User";
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "AU";
  const profilePicture = user?.profilePicture;

  return (
    <header className="header">
      <div className="header-brand">
        {onMenuClick && (
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-sidebar"
            onClick={onMenuClick}
          >
            {mobileMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        )}
        <div className="mobile-title">RV Prime Assets</div>
      </div>

      <div className="header-right">
        <span className="welcome">
          Welcome, {name}
        </span>

        <div className="user-avatar">
          {profilePicture ? <img src={`http://localhost:5000${profilePicture}`} alt={`${name}'s profile`} /> : initials}
        </div>

        <span
          className="bell"
          role="img"
          aria-label={notificationCount > 0 ? `Notifications, ${notificationCount} unread` : "Notifications"}
        >
          <FiBell aria-hidden="true" />
          {notificationCount > 0 && <span className="bell-count" aria-hidden="true" />}
        </span>
      </div>
    </header>
  );
}

export default TopHeader;
