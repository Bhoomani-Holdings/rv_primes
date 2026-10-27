import "./SalesOverview.css";

function SalesOverview() {
  const chartLevels = ["1.50Cr", "1.25Cr", "1Cr", "75L", "50L", "25L", "0"];

  return (
    <div className="dashboard-card sales-card">

      <div className="card-header">
        <h3>Sales Overview</h3>

        <select defaultValue="year">
          <option value="year">This Year</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="sales-chart">

        <div className="chart-lines">
          {chartLevels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="chart-area">
          <div className="grid-lines">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index}></div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default SalesOverview;