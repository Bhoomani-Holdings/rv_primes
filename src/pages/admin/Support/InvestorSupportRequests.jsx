import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FiClock, FiMail, FiRefreshCw } from "react-icons/fi";
import { ROUTES } from "../../../routes/routesPath";
import { getStaffSupportRequests } from "../../../services/staffSupportService";
import "./InvestorSupportRequests.css";

const readStoredSession = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};

const formatDate = (value) => {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date)
    : "—";
};

export default function InvestorSupportRequests({ staffRole }) {
  const isAdmin = staffRole === "admin";
  const sessionKey = isAdmin ? "adminSession" : "employeeSession";
  const [session, setSession] = useState(() => readStoredSession(sessionKey));
  const [requests, setRequests] = useState(() => session?.accessToken ? null : []);
  const loading = Boolean(session?.accessToken && requests === null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!session?.accessToken) return undefined;

    let active = true;
    getStaffSupportRequests(session.accessToken)
      .then((result) => {
        if (!Array.isArray(result.requests)) {
          throw new Error("The server returned an invalid support request list.");
        }
        if (active) setRequests(result.requests);
      })
      .catch((loadError) => {
        if (!active) return;
        if (loadError.status === 401) {
          sessionStorage.removeItem(sessionKey);
          setSession(null);
        }
        setRequests([]);
        setError(loadError.message || "Unable to load investor support requests.");
      });

    return () => { active = false; };
  }, [session, sessionKey, reloadKey]);

  if (!session?.accessToken) return <Navigate to={ROUTES.EMPLOYEE_LOGIN} replace />;

  return (
    <main className={`staff-support${isAdmin ? " staff-support--admin" : staffRole === "employee" ? " staff-support--employee" : " staff-support--manager"}`}>
      <header className="staff-support__heading">
        <div>
          <span className="staff-support__eyebrow">Investor support</span>
          <h1>Support requests</h1>
          <p>All requests submitted by investors.</p>
        </div>
        <div className="staff-support__actions">
          <button
            className="staff-support__refresh"
            type="button"
            onClick={() => {
              setRequests(null);
              setError("");
              setReloadKey((key) => key + 1);
            }}
            disabled={loading}
          >
            <FiRefreshCw aria-hidden="true" />
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="staff-support__error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => {
            setRequests(null);
            setError("");
            setReloadKey((key) => key + 1);
          }}>Try again</button>
        </div>
      )}
      {loading ? (
        <div className="staff-support__state" role="status">Loading investor support requests…</div>
      ) : requests.length === 0 ? (
        <div className="staff-support__state">No investor support requests have been submitted yet.</div>
      ) : (
        <div className="staff-support__list">
          {requests.map((request) => (
            <article className="staff-support__request" key={request.id}>
              <div className="staff-support__request-heading">
                <div>
                  <span className="staff-support__category">{request.category}</span>
                  <h2>{request.subject}</h2>
                </div>
                <span className={`staff-support__status staff-support__status--${String(request.status).toLowerCase().replace(/\s+/g, "-")}`}>
                  {request.status}
                </span>
              </div>
              <p className="staff-support__message">{request.message}</p>
              <footer className="staff-support__request-footer">
                <div>
                  <strong>{request.investor?.fullName || "Investor"}</strong>
                  {request.investor?.investorId && <span>{request.investor.investorId}</span>}
                </div>
                {request.investor?.email ? (
                  <a href={`mailto:${request.investor.email}`} aria-label={`Email ${request.investor.fullName || "investor"}`}>
                    <FiMail aria-hidden="true" />
                    {request.investor.email}
                  </a>
                ) : (
                  <span><FiMail aria-hidden="true" />Email unavailable</span>
                )}
                <span><FiClock aria-hidden="true" />{formatDate(request.submittedAt)}</span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
