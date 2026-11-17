import { useEffect, useState } from "react";
import { FiBriefcase, FiPlus } from "react-icons/fi";
import { getInvestorInvestments } from "../../services/investorService";
import "./InvestorInvestments.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
const formatCurrency = (amount) => currency.format(Number(amount) || 0);
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
};

function InvestmentMetric({ label, value, note, tone }) {
  return (
    <article className={`investor-investments__metric investor-investments__metric--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

export default function InvestorInvestments() {
  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getInvestorInvestments()
      .then((response) => {
        if (!response?.summary || !Array.isArray(response.holdings)) {
          throw new Error("The server returned an invalid investments response.");
        }
        if (!active) return;
        setSummary(response.summary);
        setHoldings(response.holdings);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Unable to load your investments.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [reloadKey]);

  const totalInvested = Number(summary?.totalInvested) || 0;
  const appreciationProfit = Number(summary?.appreciationProfit) || 0;
  const summaryReady = Boolean(summary) && !error;
  const appreciationRate = summaryReady && totalInvested
    ? (appreciationProfit / totalInvested) * 100
    : 0;

  return (
    <main className="investor-investments">
      <header className="investor-investments__header">
        <div>
          <span className="investor-investments__eyebrow">Your portfolio</span>
          <h1>My Investments</h1>
          <p>A transparent view of your recorded investments, owned units and portfolio appreciation.</p>
        </div>
        <div className="investor-investments__actions">
          <button
            className="investor-investments__add-button"
            type="button"
            disabled
            title="Investment actions are unavailable until secure onboarding is configured."
          >
            <FiPlus aria-hidden="true" />
            Add investment
          </button>
          <small>Investment actions are not configured yet.</small>
        </div>
      </header>

      <section className="investor-investments__metrics" aria-label="Investment summary">
        <InvestmentMetric
          label="Total Investment"
          value={summaryReady ? formatCurrency(summary?.totalInvested) : "—"}
          note="Original invested capital"
          tone="blue"
        />
        <InvestmentMetric
          label="Total Units Owned"
          value={summaryReady ? Number(summary?.totalUnits) || 0 : "—"}
          note={summaryReady ? `Across ${Number(summary?.holdingsCount) || 0} holdings` : "Holdings unavailable"}
          tone="green"
        />
        <InvestmentMetric
          label="Current Portfolio Value"
          value={summaryReady ? formatCurrency(summary?.currentPortfolioValue) : "—"}
          note="Current valuation from recorded holdings"
          tone="purple"
        />
        <InvestmentMetric
          label="Appreciation Profit"
          value={summaryReady ? formatCurrency(summary?.appreciationProfit) : "—"}
          note={summaryReady ? `${appreciationRate.toFixed(1)}% portfolio appreciation` : "Holdings unavailable"}
          tone="orange"
        />
      </section>

      <section className="investor-investments__panel">
        <div className="investor-investments__panel-header">
          <div>
            <h2><FiBriefcase aria-hidden="true" />Investment breakdown</h2>
            <p>Your units, purchase details and valuations recorded for this account.</p>
          </div>
          <span className="investor-investments__count">
            {summaryReady ? `${Number(summary?.holdingsCount) || 0} holdings` : "— holdings"}
          </span>
        </div>

        {loading ? (
          <div className="investor-investments__state" role="status">Loading investments…</div>
        ) : error ? (
          <div className="investor-investments__state investor-investments__state--error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>
          </div>
        ) : (
          <div className="investor-investments__table-wrap">
            <table className="investor-investments__table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Unit</th>
                  <th>Purchased</th>
                  <th>Units</th>
                  <th>Investment</th>
                  <th>Current value</th>
                  <th>Appreciation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {holdings.length === 0 ? (
                  <tr>
                    <td className="investor-investments__empty-row" colSpan={8}>
                      No investments have been recorded for your account.
                    </td>
                  </tr>
                ) : holdings.map((holding) => {
                    const appreciation = Number(holding.currentValue || 0) - Number(holding.investedAmount || 0);
                    return (
                      <tr key={holding._id}>
                        <td>
                          <strong>{holding.projectName}</strong>
                          {holding.location && <small>{holding.location}</small>}
                        </td>
                        <td>{holding.unit || "—"}</td>
                        <td>{formatDate(holding.purchasedAt)}</td>
                        <td>{holding.units}</td>
                        <td>{formatCurrency(holding.investedAmount)}</td>
                        <td>{formatCurrency(holding.currentValue)}</td>
                        <td className={appreciation >= 0 ? "is-positive" : "is-negative"}>
                          {appreciation >= 0 ? "+" : "−"}{formatCurrency(Math.abs(appreciation))}
                        </td>
                        <td>
                          <span className={`investor-investments__status investor-investments__status--${String(holding.status).toLowerCase()}`}>
                            {holding.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="investor-investments__notice">Financial totals reflect holdings recorded for your signed-in account. No sample holdings are shown.</p>
    </main>
  );
}
