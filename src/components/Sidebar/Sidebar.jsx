import "./Sidebar.css";

function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Projects", icon: "▦" },
    { name: "Units", icon: "▣" },
    { name: "Pricing Management", icon: "▤" },
    { name: "Users", icon: "♙" },
    { name: "Managers", icon: "♙" },
    { name: "KYC Approvals", icon: "✓" },
    { name: "Transactions", icon: "▤" },
    { name: "Reports", icon: "▥" },
    { name: "Settings", icon: "⚙" },
    { name: "Notifications", icon: "♧", notification: 3 }
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        <span className="logo-main">RV</span>
        <span className="logo-text">PRIME ASSETS</span>
      </div>

      <nav>

        {menuItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`menu-item ${activePage === item.name ? "active" : ""}`}
            onClick={() => onNavigate(item.name)}
          >

            <span className="menu-icon">
              {item.icon}
            </span>

            <span>{item.name}</span>

            {item.notification && (
              <span className="notification-count">
                {item.notification}
              </span>
            )}

          </button>
        ))}

        <div className="menu-item logout">
          <span className="menu-icon">↪</span>
          <span>Logout</span>
        </div>

      </nav>

    </aside>
  );
}

export default Sidebar;