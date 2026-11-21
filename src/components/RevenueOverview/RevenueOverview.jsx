import "./RevenueOverview.css";

function RevenueOverview({ data = {} }) {
  const completedEarnings = Number(data.totalRevenue) || 0;
  const pendingEarnings = Number(data.pendingRevenue) || 0;
  const totalEarnings = completedEarnings + pendingEarnings;
  const completedPercent = totalEarnings ? (completedEarnings / totalEarnings) * 100 : 0;

  return (
    <div className="dashboard-card revenue-card">
      <h3>Revenue Overview</h3>

      <div
        className="donut revenue-donut"
        style={{
          background: totalEarnings
            ? `conic-gradient(#2878e8 0 ${completedPercent}%, #f39b18 ${completedPercent}% 100%)`
            : "conic-gradient(#eef2f6 0 100%)"
        }}
      >
        <div className="donut-center">
          ₹{(totalEarnings / 10000000).toFixed(1)}Cr
        </div>
      </div>

      <div className="revenue-legend">
        <p>
          <span className="blue-dot"></span>
          Completed Earnings
          <strong>₹ {completedEarnings.toLocaleString("en-IN")}</strong>
        </p>
        <p>
          <span className="orange-dot"></span>
          Pending Earnings
          <strong>₹ {pendingEarnings.toLocaleString("en-IN")}</strong>
        </p>
      </div>

      <button className="view-link">
        View Full Report
      </button>
    </div>
  );
}

export default RevenueOverview;
