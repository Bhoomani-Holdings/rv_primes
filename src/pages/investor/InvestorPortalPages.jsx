import { useEffect, useMemo, useState } from "react";
import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDownload,
  FiFileText,
  FiHelpCircle,
  FiRefreshCw,
  FiSend
} from "react-icons/fi";
import { RiWallet3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routesPath";
import {
  createInvestorSupportTicket,
  getInvestorDocuments,
  getInvestorEarnings,
  getInvestorNotifications,
  getInvestorSupportTickets,
  getInvestorTransactions,
  getInvestorWallet,
  getInvestorWithdrawals,
  investorDocumentUrl,
  markInvestorNotificationsRead
} from "../../services/investorService";
import "./InvestorPortalPages.css";

const pageDetails = {
  wallet: {
    title: "Wallet",
    description: "See your available balance and recent wallet activity.",
    eyebrow: "Your funds",
    icon: RiWallet3Line
  },
  earnings: {
    title: "Earnings",
    description: "Review earnings recorded to your investor account.",
    icon: FiArrowUpCircle
  },
  withdrawals: {
    title: "Withdrawals",
    description: "View withdrawal requests associated with your account.",
    icon: FiArrowDownCircle
  },
  transactions: {
    title: "Transactions",
    description: "Review activity recorded on your investor ledger.",
    icon: FiRefreshCw
  },
  documents: {
    title: "Documents",
    description: "Access KYC files saved to your investor profile.",
    icon: FiFileText
  },
  notifications: {
    title: "Notifications",
    description: "Updates associated with your investor account.",
    icon: FiBell
  },
  support: {
    title: "Support",
    description: "Contact the support team and review your requests.",
    icon: FiHelpCircle
  }
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});
const formatCurrency = (amount) => currency.format(Number(amount) || 0);
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
};

const loadPageData = async (page) => {
  switch (page) {
    case "wallet": {
      const [wallet, transactions] = await Promise.all([
        getInvestorWallet(),
        getInvestorTransactions()
      ]);
      return { ...wallet, entries: transactions.entries };
    }
    case "earnings":
      return getInvestorEarnings();
    case "withdrawals":
      return getInvestorWithdrawals();
    case "transactions":
      return getInvestorTransactions();
    case "documents":
      return getInvestorDocuments();
    case "notifications":
      return getInvestorNotifications();
    case "support":
      return getInvestorSupportTickets();
    default:
      throw new Error("Unknown investor page.");
  }
};

function PageTable({ columns, rows, emptyMessage, emptyAsRow = false }) {
  if (rows.length === 0 && !emptyAsRow) {
    return <div className="investor-portal__empty">{emptyMessage}</div>;
  }

  return (
    <div className="investor-portal__table-wrap">
      <table className="investor-portal__table">
        <thead>
          <tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr className="investor-portal__table-empty"><td colSpan={columns.length}>{emptyMessage}</td></tr>
            : rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.key === "status"
                    ? <span className={`investor-portal__status investor-portal__status--${String(row.status).toLowerCase().replace(/\s+/g, "-")}`}>{row.status}</span>
                    : row[column.key] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SummaryCard({ label, value, note, icon: Icon }) {
  return (
    <article className="investor-portal__summary-card">
      <div className="investor-portal__summary-heading">
        <span>{label}</span>
        <Icon aria-hidden="true" />
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function InvestorPortalPage({ page }) {
  const details = pageDetails[page];
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [supportForm, setSupportForm] = useState({ subject: "", category: "Other", message: "" });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    loadPageData(page)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Unable to load this page.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [page, reloadKey]);

  const entries = Array.isArray(data?.entries) ? data.entries : [];
  const filteredEntries = useMemo(() => entries.filter((entry) => {
    const filterMatches = filter === "All" ||
      (filter === "Received" && entry.status === "Completed") ||
      (filter === "Pending" && entry.status === "Pending") ||
      entry.type === filter;
    const searchText = `${entry.description || ""} ${entry.projectName || ""} ${entry.reference || ""} ${entry.type || ""}`.toLowerCase();
    return filterMatches && searchText.includes(search.trim().toLowerCase());
  }), [entries, filter, search]);

  const transactionRows = (items) => items.map((entry) => ({
    id: entry._id || entry.reference,
    date: formatDate(entry.createdAt),
    description: entry.description,
    type: entry.type,
    project: entry.projectName,
    reference: entry.reference,
    amount: `${["Investment", "Withdrawal"].includes(entry.type) ? "−" : ""}${formatCurrency(entry.amount)}`,
    status: entry.status
  }));

  const handleMarkRead = async () => {
    setBusy(true);
    setActionError("");
    try {
      await markInvestorNotificationsRead();
      window.dispatchEvent(new Event("investor-notifications-updated"));
      setReloadKey((key) => key + 1);
    } catch (actionFailure) {
      setActionError(actionFailure.message || "Unable to update notifications.");
    } finally {
      setBusy(false);
    }
  };

  const handleSupportSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setActionError("");
    try {
      await createInvestorSupportTicket(supportForm);
      setSupportForm({ subject: "", category: "Other", message: "" });
      setReloadKey((key) => key + 1);
    } catch (actionFailure) {
      setActionError(actionFailure.message || "Unable to submit support request.");
    } finally {
      setBusy(false);
    }
  };

  if (!details) return null;
  const PageIcon = details.icon;

  return (
    <main className={`investor-portal investor-portal--${page}`}>
      <div className="investor-portal__heading">
        <div>
          <span className="investor-portal__eyebrow">{details.eyebrow || "Investor account"}</span>
          <h1><PageIcon aria-hidden="true" />{details.title}</h1>
          <p>{details.description}</p>
        </div>
        {page === "notifications" && (data?.unreadCount || 0) > 0 && (
          <button className="investor-portal__button" type="button" onClick={handleMarkRead} disabled={busy}>
            {busy ? "Updating…" : "Mark all as read"}
          </button>
        )}
      </div>

      {error && (
        <div className="investor-portal__error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>
        </div>
      )}
      {actionError && <p className="investor-portal__form-error" role="alert">{actionError}</p>}
      {loading && <div className="investor-portal__loading" role="status">Loading {details.title.toLowerCase()}…</div>}

      {!loading && !error && page === "wallet" && (
        <>
          <section className="investor-wallet__balance">
            <div>
              <span>Available wallet balance</span>
              <strong>{formatCurrency(data?.summary?.availableBalance)}</strong>
              <p>Based on completed ledger entries</p>
            </div>
            <span className="investor-wallet__balance-icon"><RiWallet3Line aria-hidden="true" /></span>
          </section>
          <section className="investor-wallet__metrics">
            <SummaryCard label="Earnings received" value={formatCurrency(data?.summary?.earningsReceived)} note="Completed earnings entries" icon={FiArrowUpCircle} />
            <SummaryCard label="Pending earnings" value={formatCurrency(data?.summary?.pendingEarnings)} note="Pending ledger entries" icon={FiClock} />
            <SummaryCard label="Total withdrawn" value={formatCurrency(data?.summary?.totalWithdrawn)} note="Completed withdrawals" icon={FiArrowDownCircle} />
          </section>
          <section className="investor-portal__panel investor-wallet__controls">
            <div className="investor-portal__panel-heading">
              <div><h2>Wallet controls</h2><p>Add money or move funds to your bank</p></div>
            </div>
            <div className="investor-wallet__actions">
              <button className="investor-portal__button" type="button" disabled title="Unavailable until a secure payment provider is configured">
                <span aria-hidden="true">+</span> Add money
              </button>
              <button className="investor-portal__button" type="button" disabled title="Unavailable until a secure payment provider is configured">
                <FiCreditCard aria-hidden="true" /> Request withdrawal
              </button>
              <button className="investor-wallet__transactions-link" type="button" onClick={() => navigate(ROUTES.INVESTOR_TRANSACTIONS)}>
                View all transactions <span aria-hidden="true">→</span>
              </button>
            </div>
            <p className="investor-wallet__action-note">Adding funds and withdrawals are unavailable until a secure payment provider and ledger workflow are configured.</p>
          </section>
          <section className="investor-portal__panel investor-wallet__activity">
            <div className="investor-portal__panel-heading">
              <div><h2>Recent wallet activity</h2><p>Your latest credits and debits</p></div>
            </div>
            <PageTable
              columns={[{ key: "reference", label: "Reference" }, { key: "description", label: "Description" }, { key: "date", label: "Date" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }]}
              rows={transactionRows(entries.slice(0, 5))}
              emptyMessage="No records yet."
              emptyAsRow
            />
          </section>
        </>
      )}

      {!loading && !error && page === "earnings" && (
        <>
          <section className="investor-portal__summary-grid investor-portal__summary-grid--three">
            <SummaryCard label="Earnings Received" value={formatCurrency(data?.summary?.received)} note="Completed earnings" icon={FiCheckCircle} />
            <SummaryCard label="Pending Earnings" value={formatCurrency(data?.summary?.pending)} note="Awaiting completion" icon={FiClock} />
            <SummaryCard label="Earning Entries" value={data?.summary?.total || 0} note="Recorded ledger entries" icon={FiCalendar} />
          </section>
          <section className="investor-portal__panel">
            <div className="investor-portal__panel-heading investor-portal__panel-heading--filters">
              <div><h2>Earning history</h2><p>Amounts and statuses come from your investor ledger</p></div>
              <select aria-label="Filter earnings" value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option>All</option><option>Received</option><option>Pending</option>
              </select>
            </div>
            <PageTable
              columns={[{ key: "date", label: "Date" }, { key: "description", label: "Description" }, { key: "project", label: "Project" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }]}
              rows={transactionRows(filteredEntries)}
              emptyMessage="No earnings match this view."
            />
          </section>
        </>
      )}

      {!loading && !error && page === "withdrawals" && (
        <>
          <section className="investor-portal__summary-grid investor-portal__summary-grid--three">
            <SummaryCard label="Available Balance" value={formatCurrency(data?.availableBalance)} note="Calculated from completed ledger entries" icon={FiCreditCard} />
            <SummaryCard label="Withdrawal Requests" value={data?.withdrawals?.length || 0} note="Requests associated with your account" icon={FiArrowDownCircle} />
            <SummaryCard label="Payment Actions" value="Unavailable" note="No payment provider is configured" icon={FiHelpCircle} />
          </section>
          <section className="investor-portal__panel">
            <div className="investor-portal__panel-heading"><div><h2>Withdrawal history</h2><p>Only saved withdrawal requests are shown</p></div></div>
            <PageTable
              columns={[{ key: "date", label: "Requested" }, { key: "reference", label: "Reference" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }]}
              rows={(data?.withdrawals || []).map((item) => ({
                id: item._id || item.reference,
                date: formatDate(item.requestedAt),
                reference: item.reference,
                amount: formatCurrency(item.amount),
                status: item.status
              }))}
              emptyMessage="No withdrawal requests have been recorded."
            />
          </section>
          <p className="investor-portal__notice"><FiHelpCircle aria-hidden="true" /> Withdrawal requests are unavailable until a secure payment provider and ledger workflow are configured.</p>
        </>
      )}

      {!loading && !error && page === "transactions" && (
        <section className="investor-portal__panel">
          <div className="investor-portal__panel-heading investor-portal__panel-heading--filters">
            <div><h2>Transaction history</h2><p>Investor-specific ledger records only</p></div>
            <div className="investor-portal__filters">
              <input aria-label="Search transactions" placeholder="Search transactions" value={search} onChange={(event) => setSearch(event.target.value)} />
              <select aria-label="Filter transaction type" value={filter} onChange={(event) => setFilter(event.target.value)}>
                {["All", "Investment", "Earning", "Deposit", "Withdrawal"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>
          <PageTable
            columns={[{ key: "date", label: "Date" }, { key: "description", label: "Description" }, { key: "type", label: "Type" }, { key: "project", label: "Project" }, { key: "reference", label: "Reference" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }]}
            rows={transactionRows(filteredEntries)}
            emptyMessage="No transactions match this view."
          />
        </section>
      )}

      {!loading && !error && page === "documents" && (
        <section className="investor-portal__document-grid">
          {(data?.documents || []).length === 0
            ? <div className="investor-portal__empty investor-portal__empty--wide">No KYC documents are available in your account.</div>
            : data.documents.map((document) => (
              <article className="investor-portal__document-card" key={`${document.name}-${document.url}`}>
                <span className="investor-portal__document-icon"><FiFileText aria-hidden="true" /></span>
                <div><h2>{document.name}</h2><p>KYC document</p></div>
                <a href={investorDocumentUrl(document.url)} target="_blank" rel="noopener noreferrer" aria-label={`Open ${document.name}`}>
                  <FiDownload aria-hidden="true" />
                </a>
              </article>
            ))}
        </section>
      )}

      {!loading && !error && page === "notifications" && (
        <section className="investor-portal__panel">
          {(data?.notifications || []).length === 0
            ? <div className="investor-portal__empty">You have no notifications.</div>
            : <div className="investor-portal__notification-list">
              {data.notifications.map((notification) => (
                <article className={`investor-portal__notification ${notification.readAt ? "" : "is-unread"}`} key={notification._id}>
                  <span><FiBell aria-hidden="true" /></span>
                  <div><h2>{notification.title}</h2><p>{notification.message}</p><small>{formatDate(notification.createdAt)}</small></div>
                  {!notification.readAt && <b>New</b>}
                </article>
              ))}
            </div>}
        </section>
      )}

      {!loading && !error && page === "support" && (
        <div className="investor-portal__support-grid">
          <section className="investor-portal__panel">
            <div className="investor-portal__panel-heading"><div><h2>Submit a request</h2><p>Your request will be linked to your account</p></div></div>
            <form className="investor-portal__support-form" onSubmit={handleSupportSubmit}>
              <label>Subject<input required minLength={3} maxLength={120} value={supportForm.subject} onChange={(event) => setSupportForm({ ...supportForm, subject: event.target.value })} /></label>
              <label>Category<select value={supportForm.category} onChange={(event) => setSupportForm({ ...supportForm, category: event.target.value })}>
                {["Account", "Documents", "Investments", "Payments", "Other"].map((category) => <option key={category}>{category}</option>)}
              </select></label>
              <label>Message<textarea required minLength={5} maxLength={2000} rows={5} value={supportForm.message} onChange={(event) => setSupportForm({ ...supportForm, message: event.target.value })} /></label>
              <button className="investor-portal__button" type="submit" disabled={busy}><FiSend aria-hidden="true" />{busy ? "Submitting…" : "Submit request"}</button>
            </form>
          </section>
          <section className="investor-portal__panel">
            <div className="investor-portal__panel-heading"><div><h2>Your requests</h2><p>Support tickets submitted from this account</p></div></div>
            {(data?.tickets || []).length === 0
              ? <div className="investor-portal__empty">You have not submitted any support requests.</div>
              : <div className="investor-portal__ticket-list">
                {data.tickets.map((ticket) => (
                  <article className="investor-portal__ticket" key={ticket._id}>
                    <div><span>{ticket.category}</span><span className={`investor-portal__status investor-portal__status--${String(ticket.status).toLowerCase().replace(/\s+/g, "-")}`}>{ticket.status}</span></div>
                    <h3>{ticket.subject}</h3><p>{ticket.message}</p><small>{formatDate(ticket.createdAt)}</small>
                  </article>
                ))}
              </div>}
          </section>
        </div>
      )}
    </main>
  );
}

export default InvestorPortalPage;

export const InvestorWalletPage = () => <InvestorPortalPage page="wallet" />;
export const InvestorEarningsPage = () => <InvestorPortalPage page="earnings" />;
export const InvestorWithdrawalsPage = () => <InvestorPortalPage page="withdrawals" />;
export const InvestorTransactionsPage = () => <InvestorPortalPage page="transactions" />;
export const InvestorDocumentsPage = () => <InvestorPortalPage page="documents" />;
export const InvestorNotificationsPage = () => <InvestorPortalPage page="notifications" />;
export const InvestorSupportPage = () => <InvestorPortalPage page="support" />;
