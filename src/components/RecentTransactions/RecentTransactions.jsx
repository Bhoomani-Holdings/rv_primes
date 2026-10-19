import "./RecentTransactions.css";

function RecentTransactions({ transactions }) {
  return (
    <div className="dashboard-card transactions-card">

      <h3>Recent Transactions</h3>

      <div className="table-wrapper">

        <table>

          <thead>
            <tr>
              <th>Investor</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {transactions.map((transaction) => (
              <tr key={transaction.id}>

                <td>{transaction.investor}</td>

                <td>{transaction.project}</td>

                <td>
                  ₹ {transaction.amount.toLocaleString("en-IN")}
                </td>

                <td>
                  <span
                    className={
                      transaction.paymentStatus === "Success"
                        ? "payment-success"
                        : "payment-pending"
                    }
                  >
                    {transaction.paymentStatus}
                  </span>
                </td>

                <td>{transaction.date}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <button className="view-link">
        View All Transactions
      </button>

    </div>
  );
}

export default RecentTransactions;