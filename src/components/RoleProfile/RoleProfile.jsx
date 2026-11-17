import { useState } from "react";
import "./RoleProfile.css";

const getInitials = (name = "") =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";

export const getEmployeeProfileSections = (employee) => [
  {
    title: "Personal details",
    fields: [
      { name: "fullName", label: "Full name", value: employee.fullName, editable: false, autoComplete: "name" },
      { name: "email", label: "Email address", value: employee.email, type: "email", editable: false, autoComplete: "email" },
      { name: "phone", label: "Phone number", value: employee.phone, type: "tel", editable: true, autoComplete: "tel" },
    ],
  },
  {
    title: "Employment details",
    fields: [
      { name: "userRole", label: "Role", value: employee.userRole, editable: false },
      { name: "department", label: "Department", value: employee.department, editable: true },
      { name: "designation", label: "Designation", value: employee.designation, editable: true },
      { name: "educationalQualifications", label: "Qualifications", value: employee.educationalQualifications, editable: true },
      { name: "joiningDate", label: "Joining date", value: employee.joiningDate, type: "date", editable: false },
    ],
  },
  {
    title: "Bank details",
    fields: [
      { name: "accountHolderName", label: "Account holder", value: employee.accountHolderName, editable: true },
      { name: "bankName", label: "Bank name", value: employee.bankName, editable: true },
      { name: "accountNumber", label: "Account number", value: employee.accountNumber, editable: true },
      { name: "ifscCode", label: "IFSC code", value: employee.ifscCode, editable: true },
      { name: "bankBranch", label: "Bank branch", value: employee.bankBranch, editable: true },
    ],
  },
];

export default function RoleProfile({
  profile,
  roleLabel,
  badgeLabel,
  profileId,
  summaryDetails = [],
  sections,
  picture,
  onSave
}) {
  const hasEditableFields = sections.some((section) => section.fields.some((field) => field.editable));
  const [values, setValues] = useState(() => Object.fromEntries(
    sections.flatMap((section) => section.fields.map((field) => [field.name, field.value ?? ""]))
  ));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const name = profile?.fullName || profile?.name || "User";

  const handleChange = (event) => {
    const { name: fieldName, value } = event.target;
    setValues((current) => ({ ...current, [fieldName]: value }));
    setError("");
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!hasEditableFields || !onSave) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await onSave(values);
      setSaved(true);
    } catch (saveError) {
      setError(saveError.message || "Unable to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="role-profile" aria-label={`${roleLabel} profile`}>
      <aside className="role-profile__summary">
        {picture || <div className="role-profile__avatar" aria-hidden="true">{getInitials(name)}</div>}
        <h1>{name}</h1>
        {profileId && <p className="role-profile__id">{profileId}</p>}
        <span className="role-profile__badge">{badgeLabel || roleLabel}</span>
        <dl>
          {summaryDetails.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </aside>

      <form className="role-profile__form" onSubmit={handleSubmit}>
        {sections.map((section) => (
          <section className="role-profile__section" key={section.title}>
            <h2>{section.title}</h2>
            <div className="role-profile__fields">
              {section.fields.map((field) => (
                <label
                  className={`role-profile__field${field.fullWidth ? " role-profile__field--full" : ""}`}
                  htmlFor={`role-profile-${field.name}`}
                  key={field.name}
                >
                  <span>{field.label}</span>
                  <input
                    id={`role-profile-${field.name}`}
                    name={field.name}
                    type={field.type || "text"}
                    value={values[field.name] ?? ""}
                    onChange={handleChange}
                    readOnly={!field.editable}
                    required={field.required}
                    autoComplete={field.autoComplete}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}

        {hasEditableFields && (
          <div className="role-profile__actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && <span role="status">Profile updated.</span>}
            {error && <span className="role-profile__error" role="alert">{error}</span>}
          </div>
        )}
      </form>
    </section>
  );
}
