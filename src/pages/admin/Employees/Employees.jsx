import { createElement, lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { createEmployee, getEmployees, updateEmployee } from "../../../services/employeeService";
import PasswordVisibilityToggle from "../../../components/PasswordVisibilityToggle";
import ProfilePictureUpload from "../../../components/ProfilePictureUpload";
import "./employees.css";

const EmployeeSpreadsheetImport = lazy(() => import("./EmployeeSpreadsheetImport"));

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  userRole: "employee",
  department: "",
  designation: "",
  educationalQualifications: "",
  passportNumber: "",
  joiningDate: "",
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  bankBranch: "",
  aadhaarNumber: "",
  panNumber: ""
};

export default function Employees({ mode = "list", basePath = ROUTES.ADMIN_EMPLOYEES, employeeId, readOnly = false }) {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(mode !== "create");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSpreadsheetImport, setShowSpreadsheetImport] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [documentFiles, setDocumentFiles] = useState({
    aadhaarFrontImage: null,
    aadhaarBackImage: null,
    panImage: null,
    blankChequeImage: null
  });
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [detailsForm, setDetailsForm] = useState({});

  useEffect(() => {
    if (!profilePicturePreview) return undefined;
    return () => URL.revokeObjectURL(profilePicturePreview);
  }, [profilePicturePreview]);

  useEffect(() => {
    if (mode === "create") return undefined;
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
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const submitEmployee = async (event) => {
    event.preventDefault();
    const errors = {};
    const requiredFields = [
      "firstName", "lastName", "email", "password", "phone", "department",
      "designation", "educationalQualifications", "joiningDate", "aadhaarNumber",
      "panNumber", "bankName", "accountHolderName", "accountNumber", "ifscCode", "bankBranch"
    ];
    requiredFields.forEach((field) => {
      if (!form[field].trim()) errors[field] = "This field is required.";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (form.password && form.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    if (form.phone && !/^[0-9+() .-]{7,24}$/.test(form.phone.trim())) {
      errors.phone = "Enter a valid phone number.";
    }
    if (form.aadhaarNumber && !/^\d{12}$/.test(form.aadhaarNumber.trim())) {
      errors.aadhaarNumber = "Enter a 12-digit Aadhaar number.";
    }
    if (form.panNumber && !/^[A-Z]{5}\d{4}[A-Z]$/i.test(form.panNumber.trim())) {
      errors.panNumber = "Enter a valid PAN number (for example, ABCDE1234F).";
    }
    ["aadhaarFrontImage", "aadhaarBackImage", "panImage", "blankChequeImage"].forEach((field) => {
      if (!documentFiles[field]) errors[field] = "This image is required.";
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const employee = await createEmployee(form, { profilePicture: profilePictureFile, ...documentFiles });
      if (mode === "list") setEmployees((current) => [employee, ...current]);
      setForm(emptyForm);
      setProfilePictureFile(null);
      setProfilePicturePreview("");
      setDocumentFiles({ aadhaarFrontImage: null, aadhaarBackImage: null, panImage: null, blankChequeImage: null });
      setFieldErrors({});
      navigate(basePath);
    } catch (saveError) {
      if (saveError.message === "An employee with this email already exists.") {
        setFieldErrors((current) => ({ ...current, email: saveError.message }));
      } else {
        setError(saveError.message || "Unable to add employee");
      }
    } finally {
      setSaving(false);
    }
  };

  const addEmployeeFromSpreadsheet = (row) => {
    const employeeValues = { ...emptyForm, ...row.employee };
    const files = row.files || {};
    const profilePicture = files.profilePictureImage || null;
    setForm({ ...employeeValues, userRole: employeeValues.userRole || emptyForm.userRole });
    setDocumentFiles({
      aadhaarFrontImage: files.aadhaarFrontImage || null,
      aadhaarBackImage: files.aadhaarBackImage || null,
      panImage: files.panImage || null,
      blankChequeImage: files.blankChequeImage || null
    });
    setProfilePictureFile(profilePicture);
    setProfilePicturePreview(profilePicture ? URL.createObjectURL(profilePicture) : "");
    setFieldErrors({});
    setError("");
    setShowSpreadsheetImport(false);
  };

  const updateDocumentFile = (event) => {
    const { name, files } = event.target;
    const file = files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFieldErrors((current) => ({ ...current, [name]: "Choose a JPG, PNG, or WEBP image." }));
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((current) => ({ ...current, [name]: "Image must be 5 MB or smaller." }));
      event.target.value = "";
      return;
    }
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setDocumentFiles((current) => ({ ...current, [name]: file }));
  };

  const fieldError = (name) => fieldErrors[name] && (
    <small className="employee-field-error" role="alert">{fieldErrors[name]}</small>
  );
  const passwordVisibilityToggle = () => createElement(PasswordVisibilityToggle, {
    visible: showPassword,
    onToggle: () => setShowPassword((visible) => !visible)
  });

  const selectedEmployee = employees.find((employee) => String(employee.id) === String(employeeId));
  const detailFields = [
    ["Employee ID", "employeeId", "text"],
    ["First Name", "firstName", "text"],
    ["Last Name", "lastName", "text"],
    ["Email", "email", "email"],
    ["Phone", "phone", "tel"],
    ["User Role", "userRole", "select"],
    ["Department", "department", "text"],
    ["Designation", "designation", "text"],
    ["Education", "educationalQualifications", "text"],
    ["Passport", "passportNumber", "text"],
    ["Joining Date", "joiningDate", "date"],
    ["Bank Name", "bankName", "text"],
    ["Account Holder Name", "accountHolderName", "text"],
    ["Account Number", "accountNumber", "text"],
    ["IFSC Code", "ifscCode", "text"],
    ["Branch", "bankBranch", "text"],
    ["Status", "status", "status"],
    ["New Password", "password", "password"]
  ];

  const startEditingDetails = () => {
    setDetailsForm({
      firstName: selectedEmployee.firstName || selectedEmployee.fullName?.trim().split(/\s+/)[0] || "",
      lastName: selectedEmployee.lastName || selectedEmployee.fullName?.trim().split(/\s+/).slice(1).join(" ") || "",
      email: selectedEmployee.email || "",
      phone: selectedEmployee.phone || "",
      userRole: selectedEmployee.userRole || "employee",
      department: selectedEmployee.department || "",
      designation: selectedEmployee.designation || "",
      educationalQualifications: selectedEmployee.educationalQualifications || "",
      passportNumber: selectedEmployee.passportNumber || "",
      joiningDate: selectedEmployee.joiningDate || "",
      bankName: selectedEmployee.bankName || "",
      accountHolderName: selectedEmployee.accountHolderName || "",
      accountNumber: selectedEmployee.accountNumber || "",
      ifscCode: selectedEmployee.ifscCode || "",
      bankBranch: selectedEmployee.bankBranch || "",
      status: selectedEmployee.status || "Active",
      password: ""
    });
    setIsEditingDetails(true);
    setError("");
  };

  const updateDetailsField = (event) => {
    const { name, value } = event.target;
    setDetailsForm((current) => ({ ...current, [name]: value }));
  };

  const saveEmployeeDetails = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updates = { ...detailsForm };
      if (!updates.password) delete updates.password;
      const updatedEmployee = await updateEmployee(selectedEmployee.id, updates);
      setEmployees((current) => current.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      ));
      setIsEditingDetails(false);
    } catch (saveError) {
      setError(saveError.message || "Unable to update employee");
    } finally {
      setSaving(false);
    }
  };

  if (mode === "detail") {
    if (loading) return <section className="employees-content"><p role="status">Loading employee details...</p></section>;
    if (error && !selectedEmployee) return <section className="employees-content"><p className="employee-error" role="alert">{error}</p></section>;
    if (!selectedEmployee) return <section className="employees-content"><p className="employee-error" role="alert">Employee not found.</p></section>;

    return (
      <section className="employees-content">
        <div className="dashboard-card employees-card employee-details-card">
          <button className="employee-back-button" type="button" onClick={() => navigate(basePath)}>Back to Employees</button>
          <header className="employees-heading employee-details-heading">
            <h1>{selectedEmployee.fullName || `${selectedEmployee.firstName || ""} ${selectedEmployee.lastName || ""}`.trim()}</h1>
            {!isEditingDetails && (
              <button className="employee-add-button" type="button" onClick={startEditingDetails}>Edit</button>
            )}
          </header>
          {createElement(ProfilePictureUpload, {
            employee: selectedEmployee,
            onUploaded: (profilePicture) => setEmployees((current) => current.map((employee) =>
              employee.id === selectedEmployee.id ? { ...employee, profilePicture } : employee
            ))
          })}
          {error && <p className="employee-error" role="alert">{error}</p>}
          {isEditingDetails ? (
            <form className="employee-details-grid" onSubmit={saveEmployeeDetails}>
              {detailFields.slice(1).map(([label, field, type]) => (
                <label key={field}>
                  {label}
                  {type === "select" ? (
                    <select name={field} value={detailsForm[field]} onChange={updateDetailsField} required>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  ) : type === "status" ? (
                    <select name={field} value={detailsForm[field]} onChange={updateDetailsField} required>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : field === "password" ? (
                    <div className="employee-password-field"><input name={field} type={showPassword ? "text" : "password"} autoComplete="new-password" value={detailsForm[field]} onChange={updateDetailsField} minLength="8" placeholder="Leave blank to keep current password" />{passwordVisibilityToggle()}</div>
                  ) : (
                    <input
                      name={field}
                      type={type}
                      value={detailsForm[field]}
                      onChange={updateDetailsField}
                      required={field !== "password" && field !== "passportNumber"}
                    />
                  )}
                </label>
              ))}
              <div className="employee-form-actions">
                <button className="employee-cancel-button" type="button" onClick={() => { setIsEditingDetails(false); setError(""); }}>Cancel</button>
                <button className="employee-add-button" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          ) : (
            <dl className="employee-details-grid">
              {detailFields.filter(([, field]) => field !== "password").map(([label, field]) => (
                <div className="employee-detail-field" key={field}>
                  <dt>{label}</dt>
                  <dd>{field === "employeeId"
                    ? `EMP${String(selectedEmployee.id).padStart(4, "0")}`
                    : field === "userRole"
                      ? (selectedEmployee.userRole || "employee") === "manager" ? "Manager" : "Employee"
                      : field === "firstName"
                        ? selectedEmployee.firstName || selectedEmployee.fullName?.trim().split(/\s+/)[0] || "—"
                        : field === "lastName"
                          ? selectedEmployee.lastName || selectedEmployee.fullName?.trim().split(/\s+/).slice(1).join(" ") || "—"
                      : selectedEmployee[field] || "—"}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={`employees-content${mode === "create" ? " employees-create-content" : ""}`}>
      <div className="dashboard-card employees-card">
        <header className="employees-heading">
          {mode === "create" ? (
            <>
              <button className="employee-back-button" type="button" onClick={() => navigate(basePath)}>Back to Employees</button>
              <h1>Add Employee</h1>
              <button className="employee-cancel-button" type="button" onClick={() => setShowSpreadsheetImport((shown) => !shown)}>
                {showSpreadsheetImport ? "Manual Entry" : "Import Excel"}
              </button>
            </>
          ) : (
            <>
              <h1>Employees</h1>
              {!readOnly && <button className="employee-add-button" type="button" onClick={() => navigate(`${basePath}/new`)}>
                + Add Employee
              </button>}
            </>
          )}
        </header>

        {error && <p className="employee-error" role="alert">{error}</p>}

        {mode === "create" && (
          showSpreadsheetImport ? (
            createElement(Suspense, { fallback: <p role="status">Loading Excel import tools...</p> },
              createElement(EmployeeSpreadsheetImport, {
                onAdd: addEmployeeFromSpreadsheet,
                onClose: () => setShowSpreadsheetImport(false)
              })
            )
          ) : (
          <form className="employee-form" onSubmit={submitEmployee} noValidate>
            <div className="employee-image-upload">
              <div className="employee-image-controls">
                <div className="employee-image-circle">
                  <span>Employee Image</span>
                  <div className="employee-image-preview">
                    {profilePicturePreview ? <img src={profilePicturePreview} alt="Employee profile preview" /> : <span aria-hidden="true">?</span>}
                  </div>
                </div>
                <div className="employee-image-actions">
                  <label className="employee-image-picker">
                    Choose Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                          setFieldErrors((current) => ({ ...current, profilePicture: "Choose a JPG, PNG, or WEBP image." }));
                          event.target.value = "";
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          setFieldErrors((current) => ({ ...current, profilePicture: "Image must be 5 MB or smaller." }));
                          event.target.value = "";
                          return;
                        }
                        setFieldErrors((current) => ({ ...current, profilePicture: "" }));
                        setProfilePictureFile(file);
                        setProfilePicturePreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                  <small>JPG, PNG, or WEBP, up to 5 MB.</small>
                  {fieldError("profilePicture")}
                </div>
              </div>
            </div>
            <label className="employee-name-field">First Name<input name="firstName" value={form.firstName} onChange={updateField} required />{fieldError("firstName")}</label>
            <label className="employee-name-field">Last Name<input name="lastName" value={form.lastName} onChange={updateField} required />{fieldError("lastName")}</label>
            <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required />{fieldError("email")}</label>
            <label>Password<div className="employee-password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={updateField} minLength="8" required />{passwordVisibilityToggle()}</div>{fieldError("password")}</label>
            <label>Phone<input name="phone" type="tel" value={form.phone} onChange={updateField} required />{fieldError("phone")}</label>
            <label>User Role<select name="userRole" value={form.userRole} onChange={updateField} required><option value="manager">Manager</option><option value="employee">Employee</option></select>{fieldError("userRole")}</label>
            <label>Department<input name="department" value={form.department} onChange={updateField} required />{fieldError("department")}</label>
            <label>Designation<input name="designation" value={form.designation} onChange={updateField} required />{fieldError("designation")}</label>
            <label>Educational Qualifications<input name="educationalQualifications" value={form.educationalQualifications} onChange={updateField} required />{fieldError("educationalQualifications")}</label>
            <label>Passport Number (Optional)<input name="passportNumber" value={form.passportNumber} onChange={updateField} /></label>
            <label>Joining Date<input name="joiningDate" type="date" value={form.joiningDate} onChange={updateField} required />{fieldError("joiningDate")}</label>
            <h2 className="employee-documents-heading">Identity and Bank Documents</h2>
            <label>Aadhaar Card Number<input name="aadhaarNumber" inputMode="numeric" maxLength="12" pattern="[0-9]{12}" value={form.aadhaarNumber} onChange={updateField} placeholder="12-digit Aadhaar number" required />{fieldError("aadhaarNumber")}</label>
            <label className="employee-document-upload">Aadhaar Front Image<input name="aadhaarFrontImage" type="file" accept="image/jpeg,image/png,image/webp" onChange={updateDocumentFile} required /><small>{documentFiles.aadhaarFrontImage?.name || "Choose JPG, PNG, or WEBP, up to 5 MB."}</small>{fieldError("aadhaarFrontImage")}</label>
            <label className="employee-document-upload">Aadhaar Back Image<input name="aadhaarBackImage" type="file" accept="image/jpeg,image/png,image/webp" onChange={updateDocumentFile} required /><small>{documentFiles.aadhaarBackImage?.name || "Choose JPG, PNG, or WEBP, up to 5 MB."}</small>{fieldError("aadhaarBackImage")}</label>
            <label>PAN Card Number<input name="panNumber" maxLength="10" pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]" value={form.panNumber} onChange={updateField} placeholder="ABCDE1234F" required />{fieldError("panNumber")}</label>
            <label className="employee-document-upload">PAN Card Image<input name="panImage" type="file" accept="image/jpeg,image/png,image/webp" onChange={updateDocumentFile} required /><small>{documentFiles.panImage?.name || "Choose JPG, PNG, or WEBP, up to 5 MB."}</small>{fieldError("panImage")}</label>
            <label className="employee-document-upload">Blank Cheque Image<input name="blankChequeImage" type="file" accept="image/jpeg,image/png,image/webp" onChange={updateDocumentFile} required /><small>{documentFiles.blankChequeImage?.name || "Choose JPG, PNG, or WEBP, up to 5 MB."}</small>{fieldError("blankChequeImage")}</label>
            <h2 className="employee-payroll-heading">Salary Payment Bank Details</h2>
            <label>Bank Name<input name="bankName" value={form.bankName} onChange={updateField} required />{fieldError("bankName")}</label>
            <label>Account Holder Name<input name="accountHolderName" value={form.accountHolderName} onChange={updateField} required />{fieldError("accountHolderName")}</label>
            <label>Account Number<input name="accountNumber" inputMode="numeric" value={form.accountNumber} onChange={updateField} required />{fieldError("accountNumber")}</label>
            <label>IFSC Code<input name="ifscCode" value={form.ifscCode} onChange={updateField} required />{fieldError("ifscCode")}</label>
            <label>Branch<input name="bankBranch" value={form.bankBranch} onChange={updateField} required />{fieldError("bankBranch")}</label>
            <div className="employee-form-actions">
              <button className="employee-cancel-button" type="button" onClick={() => navigate(basePath)}>Cancel</button>
              <button className="employee-add-button" type="submit" disabled={saving}>{saving ? "Adding..." : "Save Employee"}</button>
            </div>
          </form>
          )
        )}

        {mode === "list" && (loading ? <p role="status">Loading employees...</p> : (
          <div className="table-wrapper employees-table-wrap">
            <table>
              <thead><tr><th>Employee ID</th><th>Employee Image</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Phone</th><th>User Role</th><th>Department</th><th>Designation</th><th>Education</th><th>Passport</th><th>Joining Date</th></tr></thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td className="employees-empty" colSpan={12}>No employees have been added yet.</td></tr>
                ) : employees.map((employee) => (
                  <tr key={employee.id} className={readOnly ? undefined : "employee-details-row"} title={readOnly ? undefined : "Double-click to view employee details"} onDoubleClick={readOnly ? undefined : () => navigate(`${basePath}/${employee.id}`)}>
                    <td>EMP{String(employee.id).padStart(4, "0")}</td>
                    <td><div className="employee-table-picture">{employee.profilePicture ? <img src={`http://localhost:5000${employee.profilePicture}`} alt="" /> : <span aria-hidden="true">{employee.firstName?.[0] || employee.fullName?.[0] || "?"}</span>}</div></td>
                    <td><strong>{employee.firstName || employee.fullName?.trim().split(/\s+/)[0]}</strong></td>
                    <td>{employee.lastName || employee.fullName?.trim().split(/\s+/).slice(1).join(" ")}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{(employee.userRole || "employee") === "manager" ? "Manager" : "Employee"}</td>
                    <td>{employee.department}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.educationalQualifications || "—"}</td>
                    <td>{employee.passportNumber || "—"}</td>
                    <td>{employee.joiningDate}</td>
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
