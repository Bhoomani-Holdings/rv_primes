import { FiBell, FiMessageCircle, FiX } from "react-icons/fi";
import "./Sidebar.css";

const adminItems = [
  { name: "Dashboard", icon: "⌂" }, { name: "Projects", icon: "▦" },
  { name: "Units", icon: "▣" }, { name: "Pricing Management", icon: "◇" },
  { name: "Users", icon: "♙" }, { name: "Employees", icon: "♙" },
  { name: "Careers", icon: "▤" }, { name: "KYC Approvals", icon: "✓" },
  { name: "Transactions", icon: "◇" }, { name: "Reports", icon: "▥" },
  { name: "Settings", icon: "⚙" }, { name: "Support", icon: <FiMessageCircle aria-hidden="true" /> },
  { name: "Notifications", icon: "♧", notification: 3 }
];

function Sidebar({
  activePage,
  onNavigate,
  onLogout,
  menuItems = adminItems,
  brand = "RV PRIME ASSETS",
  isMobileOpen = false,
  onClose
}) {
  const isDefaultBrand = brand === "RV PRIME ASSETS";
  return (
    <>
      {isMobileOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
        />
      )}
      <aside
        id="primary-sidebar"
        className={`sidebar${isMobileOpen ? " sidebar--mobile-open" : ""}`}
        aria-label="Primary navigation"
      >
        <div className="logo">
          <span className="logo-main">{isDefaultBrand ? "RV" : "BH"}</span>
          <span className="logo-text">{isDefaultBrand ? "PRIME ASSETS" : brand}</span>
          {onClose && (
            <button
              className="sidebar-close"
              type="button"
              aria-label="Close navigation menu"
              onClick={onClose}
            >
              <FiX aria-hidden="true" />
            </button>
          )}
        </div>
        <nav>
          {menuItems.map((item) => (
            <button key={item.name} type="button" className={`menu-item ${activePage === item.name ? "active" : ""}`} onClick={() => onNavigate(item.name)}>
              <span className="menu-icon">
                {item.name === "Notifications" ? <FiBell aria-hidden="true" /> : item.icon}
              </span>
              <span>{item.name}</span>
              {Number(item.notification) > 0 && <span className="notification-count">{item.notification}</span>}
            </button>
          ))}
          <button type="button" className="menu-item logout" onClick={onLogout}>
            <span className="menu-icon">↪</span><span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
