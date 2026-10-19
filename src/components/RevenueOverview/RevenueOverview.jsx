import "./RevenueOverview.css";

function RevenueOverview({ data }) {

  const total =
    data.totalRevenue +
    data.profitShare +
    data.otherIncome;

  const revenuePercent =
    (data.totalRevenue / total) * 100;

  const profitPercent =
    (data.profitShare / total) * 100;

  return (
    <div className="dashboard-card revenue-card">

      <h3>Revenue Overview</h3>

      <div
        className="donut revenue-donut"
        style={{
          background: `conic-gradient(
            #2878e8 0 ${revenuePercent}%,
            #3db88a ${revenuePercent}% ${revenuePercent + profitPercent}%,
            #f39b18 ${revenuePercent + profitPercent}% 100%
          )`
        }}
      >
        <div className="donut-center">
          ₹{(total / 10000000).toFixed(1)}Cr
        </div>
      </div>

      <div className="revenue-legend">

        <p>
          <span className="blue-dot"></span>
          Total Revenue
          <strong>
            ₹ {data.totalRevenue.toLocaleString("en-IN")}
          </strong>
        </p>

        <p>
          <span className="green-dot"></span>
          Profit Share
          <strong>
            ₹ {data.profitShare.toLocaleString("en-IN")}
          </strong>
        </p>

        <p>
          <span className="orange-dot"></span>
          Other Income
          <strong>
            ₹ {data.otherIncome.toLocaleString("en-IN")}
          </strong>
        </p>

      </div>

      <button className="view-link">
        View Full Report
      </button>

    </div>
  );
}

export default RevenueOverview;