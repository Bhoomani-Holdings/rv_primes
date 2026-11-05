import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { getUsers, updateUserKycStatus } from "../../../services/userService";
import "./kycInvestorDetails.css";

const documentFields = [
  ["uploadpancard", "PAN card"],
  ["uploadaadhaar", "Aadhaar"],
  ["uploadaddressproof", "Address proof"],
  ["selfiephoto", "Selfie / photo"]
];

const hasSubmittedKycDocuments = (details) =>
  Boolean(details) && documentFields.every(([field]) => Boolean(details[field]));

function DetailsSection({ title, fields }) {
  return (
    <section className="kyc-investor-section">
      <h2>{title}</h2>
      <dl>
        {fields.map(([label, value]) => (
          <div className="kyc-investor-field" key={label}>
            <dt>{label}</dt>
            <dd>{value || "Not provided"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function KycInvestorDetails({ userId }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getUsers()
      .then((users) => {
        if (cancelled) return;
        const selectedUser = users.find((item) => String(item.id) === String(userId));
        setUser(selectedUser || null);
        if (!selectedUser) setError("Investor not found");
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Unable to load investor details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const changeKycStatus = async (kycStatus) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const updatedUser = await updateUserKycStatus(user.id, kycStatus);
      setUser(updatedUser);
      setNotice(`KYC ${kycStatus.toLowerCase()}.`);
    } catch (updateError) {
      setError(updateError.message || "Unable to update KYC status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <section className="kyc-investor-details"><p role="status">Loading investor details...</p></section>;
  if (error && !user) return <section className="kyc-investor-details"><p className="kyc-investor-error" role="alert">{error}</p></section>;
  if (!user) return null;

  const kycDetails = user.kycDetails || {};
  const nominee = user.nomineeDetails || {};
  const bank = user.bankDetails || {};
  const documentsSubmitted = hasSubmittedKycDocuments(user.kycDetails);
  const status = user.kycStatus === "Accept"
    ? "Approved"
    : user.kycStatus === "Reject"
      ? "Rejected"
      : documentsSubmitted
        ? user.kycStatus || "Pending for Approval"
        : "Not submitted";

  return (
    <section className="kyc-investor-details">
      <button
        className="kyc-investor-back"
        type="button"
        onClick={() => navigate(ROUTES.ADMIN_KYC_APPROVALS)}
      >
        Back to KYC Approvals
      </button>

      <header className="kyc-investor-header">
        <div>
          <span>{user.investorId || "Investor"}</span>
          <h1>{user.fullName || "Investor details"}</h1>
          <p>{user.email || ""}</p>
        </div>
        <strong className="kyc-investor-status">KYC: {status}</strong>
      </header>

      {error && <p className="kyc-investor-error" role="alert">{error}</p>}
      {notice && <p className="kyc-investor-notice" role="status">{notice}</p>}

      <DetailsSection
        title="Basic Details"
        fields={[
          ["Investor ID", user.investorId],
          ["Full name", user.fullName],
          ["Email", user.email],
          ["Mobile number", user.mobileNumber],
          ["Date of birth", user.dateOfBirth],
          ["Gender", user.gender]
        ]}
      />

      <DetailsSection
        title="KYC Details"
        fields={[
          ["PAN number", kycDetails.pancardnumber],
          ["Aadhaar number", kycDetails.aadhaarnumber],
          ["KYC status", status]
        ]}
      />

      <section className="kyc-investor-section">
        <h2>KYC Documents</h2>
        {documentsSubmitted ? (
          <div className="kyc-investor-documents">
            {documentFields.map(([field, label]) => (
              <a key={field} href={kycDetails[field]} target="_blank" rel="noreferrer">
                View {label}
              </a>
            ))}
          </div>
        ) : (
          <p>Not submitted</p>
        )}
      </section>

      <DetailsSection
        title="Nominee Details"
        fields={[
          ["Nominee name", nominee.UserName],
          ["Mobile number", nominee.UserNumber],
          ["Relationship", nominee.Relationship]
        ]}
      />

      <DetailsSection
        title="Bank Details"
        fields={[
          ["Account holder", bank.accountholdername],
          ["Bank name", bank.bankname],
          ["Account number", bank.accountnumber],
          ["IFSC code", bank.ifsccode],
          ["UPI ID", bank.upiid]
        ]}
      />

      <section className="kyc-investor-section">
        <h2>Cancelled Cheque</h2>
        {bank.cancelledcheque ? (
          <a href={bank.cancelledcheque} target="_blank" rel="noreferrer">View cancelled cheque</a>
        ) : (
          <p>Not provided</p>
        )}
      </section>

      <div className="kyc-investor-actions">
        {!documentsSubmitted && <p>Approve or reject is available after the investor submits all KYC documents.</p>}
        <button
          className="kyc-investor-reject"
          type="button"
          disabled={saving || !documentsSubmitted}
          onClick={() => changeKycStatus("Rejected")}
        >
          Reject KYC
        </button>
        <button
          className="kyc-investor-approve"
          type="button"
          disabled={saving || !documentsSubmitted}
          onClick={() => changeKycStatus("Approved")}
        >
          Approve KYC
        </button>
      </div>
    </section>
  );
}
