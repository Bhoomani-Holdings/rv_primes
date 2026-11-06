import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { createEmployee, getEmployees } from "../../../services/employeeService";
import "./employees.css";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  userRole: "employee",
  department: "",
  designation: "",
  joiningDate: "",
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  bankBranch: ""
};

export default function Employees({ mode = "list" }) {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "create") {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    getEmployees()
      .then((data) => { if (!cancelled) setEmployees(data); })
      .catch((loadError) => { if (!cancelled) setError(loadError.message || "Unable to load employees"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [mode]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitEmployee = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const employee = await createEmployee(form);
      if (mode === "list") setEmployees((current) => [employee, ...current]);
      setForm(emptyForm);
      navigate(ROUTES.ADMIN_EMPLOYEES);
    } catch (saveError) {
      setError(saveError.message || "Unable to add employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`employees-content${mode === "create" ? " employees-create-content" : ""}`}>
      <div className="dashboard-card employees-card">
        <header className="employees-heading">
          {mode === "create" ? (
            <>
              <button className="employee-back-button" type="button" onClick={() => navigate(ROUTES.ADMIN_EMPLOYEES)}>Back to Employees</button>
              <h1>Add Employee</h1>
            </>
          ) : (
            <>
              <h1>Employees</h1>
              <button className="employee-add-button" type="button" onClick={() => navigate(`${ROUTES.ADMIN_EMPLOYEES}/new`)}>
                + Add Employee
              </button>
            </>
          )}
        </header>

        {error && <p className="employee-error" role="alert">{error}</p>}

        {mode === "create" && (
          <form className="employee-form" onSubmit={submitEmployee}>
            <label>Full Name<input name="fullName" value={form.fullName} onChange={updateField} required /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required /></label>
            <label>Password<input name="password" type="password" autoComplete="new-password" value={form.password} onChange={updateField} minLength="8" required /></label>
            <label>Phone<input name="phone" type="tel" value={form.phone} onChange={updateField} required /></label>
            <label>User Role<select name="userRole" value={form.userRole} onChange={updateField} required><option value="manager">Manager</option><option value="employee">Employee</option></select></label>
            <label>Department<input name="department" value={form.department} onChange={updateField} required /></label>
            <label>Designation<input name="designation" value={form.designation} onChange={updateField} required /></label>
            <label>Joining Date<input name="joiningDate" type="date" value={form.joiningDate} onChange={updateField} required /></label>
            <h2 className="employee-payroll-heading">Salary Payment Bank Details</h2>
            <label>Bank Name<input name="bankName" value={form.bankName} onChange={updateField} required /></label>
            <label>Account Holder Name<input name="accountHolderName" value={form.accountHolderName} onChange={updateField} required /></label>
            <label>Account Number<input name="accountNumber" inputMode="numeric" value={form.accountNumber} onChange={updateField} required /></label>
            <label>IFSC Code<input name="ifscCode" value={form.ifscCode} onChange={updateField} required /></label>
            <label>Branch<input name="bankBranch" value={form.bankBranch} onChange={updateField} required /></label>
            <div className="employee-form-actions">
              <button className="employee-cancel-button" type="button" onClick={() => navigate(ROUTES.ADMIN_EMPLOYEES)}>Cancel</button>
              <button className="employee-add-button" type="submit" disabled={saving}>{saving ? "Adding..." : "Save Employee"}</button>
            </div>
          </form>
        )}

        {mode === "list" && (loading ? <p role="status">Loading employees...</p> : (
          <div className="table-wrapper employees-table-wrap">
            <table>
              <thead><tr><th>Employee ID</th><th>Name</th><th>Email</th><th>Password</th><th>Phone</th><th>User Role</th><th>Department</th><th>Designation</th><th>Joining Date</th><th>Bank Name</th><th>Account Holder</th><th>Account Number</th><th>IFSC Code</th><th>Branch</th><th>Status</th></tr></thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td className="employees-empty" colSpan="15">No employees have been added yet.</td></tr>
                ) : employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>EMP{String(employee.id).padStart(4, "0")}</td>
                    <td><strong>{employee.fullName}</strong></td>
                    <td><a href={`mailto:${employee.email}`}>{employee.email}</a></td>
                    <td>{employee.hasPassword ? "••••••••" : "Not set"}</td>
                    <td>{employee.phone}</td>
                    <td>{(employee.userRole || "employee") === "manager" ? "Manager" : "Employee"}</td>
                    <td>{employee.department}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.joiningDate}</td>
                    <td>{employee.bankName || "—"}</td>
                    <td>{employee.accountHolderName || "—"}</td>
                    <td>{employee.accountNumber || "—"}</td>
                    <td>{employee.ifscCode || "—"}</td>
                    <td>{employee.bankBranch || "—"}</td>
                    <td><span className="employee-status">{employee.status || "Active"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}
