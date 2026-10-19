import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routesPath";
import "./InvestorLoginModal.css";

function InvestorLoginModal({ onClose }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Investor sign-in is not available yet.");
  };

  return (
    <div
      className="investor-login-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="investor-login-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="investor-login-title"
      >
        <button
          className="investor-login-close"
          type="button"
          aria-label="Close investor login"
          onClick={onClose}
        >
          ×
        </button>

        <p className="investor-login-eyebrow">Bhoomani Holdings</p>
        <h2 id="investor-login-title">Investor Login</h2>

        <form className="investor-login-form" onSubmit={handleSubmit}>
          <label htmlFor="investor-username">Username</label>
          <input
            id="investor-username"
            name="username"
            type="text"
            autoComplete="username"
            required
            autoFocus
          />

          <label htmlFor="investor-password">Password</label>
          <input
            id="investor-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />

          <button className="investor-login-submit" type="submit">
            Sign In
          </button>
        </form>

        <p className="investor-login-signup">
          New user? <Link to={ROUTES.BASIC_INFO} onClick={onClose}>Sign up</Link>
        </p>
        {message && <p className="investor-login-message" role="status">{message}</p>}
      </section>
    </div>
  );
}

export default InvestorLoginModal;