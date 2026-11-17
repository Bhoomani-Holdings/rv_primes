import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routesPath";
import { loginEmployee } from "../../services/employeeService";
import { loginAdmin } from "../../services/staffSupportService";
import PasswordVisibilityToggle from "../../components/PasswordVisibilityToggle";
import "../public/login/login.css";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      let staffSession;
      try {
        staffSession = await loginEmployee(email, password);
      } catch (employeeError) {
        if (employeeError.status !== 401) throw employeeError;
        try {
          const result = await loginAdmin(email, password);
          staffSession = {
            ...result.admin,
            accessToken: result.accessToken,
            accessTokenExpiresAt: result.expiresAt
          };
        } catch (adminError) {
          if (adminError.status === 401) throw new Error("Invalid email or password.");
          throw adminError;
        }
      }

      if (staffSession.userRole === "admin") {
        sessionStorage.removeItem("employeeSession");
        sessionStorage.setItem("adminSession", JSON.stringify(staffSession));
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        sessionStorage.removeItem("adminSession");
        sessionStorage.setItem("employeeSession", JSON.stringify(staffSession));
        navigate(staffSession.userRole === "manager" ? ROUTES.MANAGER : ROUTES.EMPLOYEE_DASHBOARD);
      }
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="employee-login-title">
        <h1 id="employee-login-title">Staff Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="employee-email">Email</label>
          <input id="employee-email" name="email" type="email" autoComplete="username" required />
          <label htmlFor="employee-password">Password</label>
          <div className="login-password-field">
            <input id="employee-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required />
            <PasswordVisibilityToggle visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} />
          </div>
          <button type="submit" disabled={submitting}>{submitting ? "Signing In..." : "Sign In"}</button>
          {error && <p className="login-message" role="alert">{error}</p>}
        </form>
        <p className="employee-login-prompt"><Link to={ROUTES.LOGIN}>Back to Investor Login</Link></p>
      </section>
    </main>
  );
}
