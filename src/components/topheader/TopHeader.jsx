import { useEffect, useState } from "react";
import "./TopHeader.css";

function TopHeader() {
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

  const name = profile.name || "Admin User";
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "AU";

  return (
    <header className="header">

      <div className="mobile-title">
        RV Prime Assets
      </div>

      <div className="header-right">

        <span className="welcome">
          Welcome, {name}
        </span>

        <div className="user-avatar">
          {initials}
        </div>

        <span className="bell">♧</span>

      </div>

    </header>
  );
}

export default TopHeader;
