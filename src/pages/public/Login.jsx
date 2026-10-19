import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routesPath";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Login authentication is not connected yet.");
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
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />

          <button type="submit">Sign In</button>
          {message && <p className="login-message" role="status">{message}</p>}
        </form>

        <p className="signup-prompt">
          New user? <a href={`${ROUTES.HOME}#featured-projects`} onClick={handleSignupClick}>Sign up</a>
        </p>
      </section>
    </main>
  );
}