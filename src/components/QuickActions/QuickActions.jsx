import "./QuickActions.css";

function QuickActions() {

  const actions = [
    ["⊞", "Add Project"],
    ["⌂", "Add Unit"],
    ["₹", "Update Price"],
    ["♙", "Add Manager"],
    ["♙", "Create User"],
    ["📢", "Send Notification"],
    ["▥", "Generate Report"]
  ];

  return (
    <div className="dashboard-card quick-actions">

      <h3>Quick Actions</h3>

      <div className="actions-grid">

        {actions.map(([icon, title]) => (
          <button key={title} className="action-item">

            <span className="action-icon">
              {icon}
            </span>

            <span>{title}</span>

          </button>
        ))}

      </div>

    </div>
  );
}

export default QuickActions;