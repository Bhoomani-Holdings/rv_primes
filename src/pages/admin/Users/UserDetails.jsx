import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { getUsers } from "../../../services/userService";
import "./userDetails.css";

const showValue = (value) => value || "Not provided";

function DetailSection({ title, fields }) {
  return (
    <section className="user-detail-section">
      <h2>{title}</h2>
      <dl>
        {fields.map(([label, value]) => (
          <div className="user-detail-field" key={label}>
            <dt>{label}</dt>
            <dd>{showValue(value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function UserDetails({ userId }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getUsers()
      .then((users) => {
        if (!cancelled) {
          const selectedUser = users.find((item) => String(item.id) === String(userId));
          setUser(selectedUser || null);
          if (!selectedUser) setError("User not found");
        }
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Unable to load user details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <section className="user-details-content"><p role="status">Loading user details...</p></section>;
  if (error || !user) return <section className="user-details-content"><p className="user-details-error" role="alert">{error || "User not found"}</p></section>;

  const nominee = user.nomineeDetails || {};
  const bank = user.bankDetails || {};

  return (
    <section className="user-details-content">
      <button className="user-details-back" type="button" onClick={() => navigate(ROUTES.ADMIN_USERS)}>
        Back to Users
      </button>
      <header className="user-details-header">
        <h1>{user.fullName}</h1>
        <span>{user.approvalStatus || "Pending for Approval"}</span>
      </header>

      <DetailSection
        title="Basic Details"
        fields={[
          ["First Name", user.firstName],
          ["Last Name", user.lastName],
          ["Email", user.email],
          ["Mobile Number", user.mobileNumber],
          ["Date of Birth", user.dateOfBirth],
          ["Gender", user.gender]
        ]}
      />

      <DetailSection
        title="Address Details"
        fields={[
          ["Address", user.address],
          ["Address Line 2", user.address1],
          ["City", user.city],
          ["State", user.state],
          ["Country", user.country],
          ["Pincode", user.pincode]
        ]}
      />

      <DetailSection
        title="Nominee Details"
        fields={[
          ["Nominee Name", nominee.UserName],
          ["Mobile Number", nominee.UserNumber],
          ["Relationship", nominee.Relationship]
        ]}
      />

      <DetailSection
        title="Bank Details"
        fields={[
          ["Account Holder", bank.accountholdername],
          ["Bank Name", bank.bankname],
          ["Account Number", bank.accountnumber],
          ["IFSC Code", bank.ifsccode],
          ["UPI ID", bank.upiid]
        ]}
      />
      <section className="user-detail-section">
        <h2>Cancelled Cheque</h2>
        {bank.cancelledcheque ? (
          <a href={bank.cancelledcheque} target="_blank" rel="noreferrer">View cancelled cheque</a>
        ) : (
          <p>Not provided</p>
        )}
      </section>
    </section>
  );
}