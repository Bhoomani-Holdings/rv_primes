import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { authApi } from "../../../api/authApi";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [approvalPopup, setApprovalPopup] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setApprovalPopup("");
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      const email = formData.get("email");
      const result = await authApi.login({
        email,
        username: email,
        password: formData.get("password")
      });
      sessionStorage.setItem("investorSession", JSON.stringify(result.user));
      const kycStatus = String(result.user?.kycStatus || "Not Submitted").trim().toLowerCase();
      navigate(kycStatus === "approved" || kycStatus === "accept"
        ? ROUTES.INVESTOR
        : ROUTES.INVESTOR_KYC_APPROVALS);
    } catch (loginError) {
      if (loginError.code === "APPROVAL_PENDING" || loginError.code === "APPLICATION_REJECTED") {
        setApprovalPopup(loginError.message);
      } else {
        setMessage(loginError.message || "Unable to sign in. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupClick = (event) => {
    event.preventDefault();
    navigate(`${ROUTES.HOME}#featured-projects`, { state: { showInvestHint: true } });
    window.setTimeout(() => {
      document.getElementById("featured-projects")?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 250);
  };

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <h1 id="login-title">Investor Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <div className="login-password-field">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
            />
            <button
              className="login-password-toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                {showPassword ? (
                  <>
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.2A11.7 11.7 0 0 1 12 5c5 0 8.5 4.2 9.5 6-.4.7-1.2 1.8-2.4 2.9M6.2 6.2C4.2 7.4 2.9 9.2 2.5 11c.7 1.3 4.1 6 9.5 6 1 0 1.9-.2 2.7-.5" />
                  </>
                ) : (
                  <>
                    <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <button type="submit" disabled={submitting}>{submitting ? "Signing In..." : "Sign In"}</button>
          {message && <p className="login-message" role="status">{message}</p>}
        </form>

        <p className="signup-prompt">
          New user? <a href={`${ROUTES.HOME}#featured-projects`} onClick={handleSignupClick}>Sign up</a>
        </p>
      </section>
      {approvalPopup && (
        <div className="login-popup-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setApprovalPopup("");
        }}>
          <section className="login-popup" role="alertdialog" aria-modal="true" aria-live="assertive">
            <p>{approvalPopup}</p>
            <button type="button" onClick={() => setApprovalPopup("")}>OK</button>
          </section>
        </div>
      )}
    </main>
  );
}
