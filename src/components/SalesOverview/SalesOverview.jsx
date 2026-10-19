import "./SalesOverview.css";

function SalesOverview({ sales }) {
  const maxSales = Math.max(
    ...sales.map((item) => item.sales)
  );

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
          <span>1.50Cr</span>
          <span>1.25Cr</span>
          <span>1Cr</span>
          <span>75L</span>
          <span>50L</span>
          <span>25L</span>
          <span>0</span>
        </div>

        <div className="chart-area">

          <div className="grid-lines">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index}></div>
            ))}
          </div>

          <div className="bar-container">

            {sales.map((item) => {

              const height =
                (item.sales / maxSales) * 100;

              return (
                <div className="chart-column" key={item.month}>

                  <div
                    className="chart-bar"
                    style={{
                      height: `${height}%`
                    }}
                  >
                    <span className="chart-dot"></span>
                  </div>

                  <span className="month">
                    {item.month}
                  </span>

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
}

export default SalesOverview;