import { useState } from "react";
import "./AdminSettings.css";

const PROFILE_STORAGE_KEY = "adminProfile";

const loadProfile = () => {
  try {
    const savedProfile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || "{}");
    return {
      name: savedProfile.name || "Admin User",
      email: savedProfile.email || "",
      phone: savedProfile.phone || ""
    };
  } catch {
    return { name: "Admin User", email: "", phone: "" };
  }
};

export default function AdminSettings() {
  const [profile, setProfile] = useState(loadProfile);
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedProfile = {
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim()
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    window.dispatchEvent(new Event("adminProfileUpdated"));
    setProfile(updatedProfile);
    setSaved(true);
  };

  return (
    <section className="admin-settings-page">
      <div className="admin-settings-card">
        <div className="admin-settings-heading">
          <p>ADMIN ACCOUNT</p>
          <h1>Profile Settings</h1>
          <span>Update the profile information shown in the admin header.</span>
        </div>

        <form className="admin-settings-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-profile-name">Full name</label>
          <input
            id="admin-profile-name"
            name="name"
            type="text"
            value={profile.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />

          <label htmlFor="admin-profile-email">Email address</label>
          <input
            id="admin-profile-email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="admin-profile-phone">Phone number</label>
          <input
            id="admin-profile-phone"
            name="phone"
            type="tel"
            value={profile.phone}
            onChange={handleChange}
            autoComplete="tel"
          />

          <label htmlFor="admin-profile-role">Role</label>
          <input id="admin-profile-role" type="text" value="Administrator" readOnly />

          <div className="admin-settings-actions">
            <button type="submit">Save Profile</button>
            {saved && <span role="status">Profile updated.</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
