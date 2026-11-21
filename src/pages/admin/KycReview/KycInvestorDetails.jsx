import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { getUsers, updateUserKycStatus } from "../../../services/userService";
import { facePhotosFromKyc } from "../../../components/FaceCapture/faceData";
import { FACE_ANGLES } from "../../../components/FaceCapture/faceAngles";
import "./kycInvestorDetails.css";

const documentFields = [
  ["uploadpancard", "PAN card"],
  ["uploadaadhaar", "Aadhaar front"],
  ["uploadaddressproof", "Aadhaar back"],
  ["selfiephoto", "Selfie / photo"]
];

const hasSubmittedKycDocuments = (details) =>
  Boolean(details) && documentFields.every(([field]) => Boolean(details[field]));

const formatBasicApproval = (approval, status) => {
  if (!approval?.approvedAt) {
    return ["approved", "accept"].includes(String(status || "").toLowerCase())
      ? "Approved; approver details not recorded"
      : "Not approved";
  }
  const approver = approval.role === "admin"
    ? "admin"
    : `${approval.name || "Manager"}${approval.employeeId != null ? ` (Employee ID: ${approval.employeeId})` : ""}`;
  const approvedAt = new Date(approval.approvedAt);
  const timestamp = Number.isNaN(approvedAt.getTime()) ? "" : approvedAt.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return `Approved by ${approver}${timestamp ? ` on ${timestamp}` : ""}`;
};
const formatKycApproval = (approval, status) => formatBasicApproval(approval, status);

function DetailsSection({ title, fields }) {
  return (
    <section className="kyc-investor-section">
      <h2>{title}</h2>
      <dl>
        {fields.map(([label, value]) => (
          <div className={`kyc-investor-field${label.endsWith("Approved By") ? " kyc-investor-field-approval" : ""}`} key={label}>
            <dt>{label}</dt>
            <dd>{value || "Not provided"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function KycInvestorDetails({ userId, basePath = ROUTES.ADMIN_KYC_APPROVALS } = {}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingKycStatus, setPendingKycStatus] = useState("");

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

  const changeKycStatus = async () => {
    if (!pendingKycStatus) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await updateUserKycStatus(user.id, pendingKycStatus);
      navigate(basePath);
    } catch (updateError) {
      setError(updateError.message || "Unable to update KYC status");
      setPendingKycStatus("");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <section className="kyc-investor-details"><p role="status">Loading investor details...</p></section>;
  if (error && !user) return <section className="kyc-investor-details"><p className="kyc-investor-error" role="alert">{error}</p></section>;
  if (!user) return null;

  const kycDetails = user.kycDetails || {};
  const facePhotos = facePhotosFromKyc(kycDetails);
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
      <header className="kyc-investor-header">
        <button
          className="kyc-investor-back"
          type="button"
          onClick={() => navigate(basePath)}
        >
          Back to KYC Approvals
        </button>
        <div>
          <span>{user.investorId || "Investor"}</span>
          <h1>{user.fullName || "Investor details"}</h1>
          <p>{user.email || ""}</p>
        </div>
        <strong className={`kyc-investor-status ${status === "Approved" ? "is-approved" : status === "Rejected" ? "is-rejected" : status === "Pending for Approval" ? "is-pending" : "is-neutral"}`}>KYC: {status}</strong>
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
          ["Gender", user.gender],
          ["Basic Details Approved By", formatBasicApproval(user.basicDetailsApproval, user.approvalStatus)]
        ]}
      />

      <DetailsSection
        title="KYC Details"
        fields={[
          ["PAN number", kycDetails.pancardnumber],
          ["Aadhaar number", kycDetails.aadhaarnumber],
          ["KYC status", status],
          ["KYC Details Approved By", formatKycApproval(user.kycApproval, user.kycStatus)]
        ]}
      />

      <section className="kyc-investor-section">
        <h2>Face Verification</h2>
        {Object.keys(facePhotos).length > 0 ? (
          <div className="kyc-face-photos">
            {FACE_ANGLES.map(({ key, label }) => facePhotos[key] && (
              <figure className="kyc-face-photo" key={key}>
                <a href={facePhotos[key].src} target="_blank" rel="noreferrer">
                  <img src={facePhotos[key].src} alt={`${label} face verification`} />
                </a>
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p>Face verification photos not submitted</p>
        )}
      </section>

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
          onClick={() => setPendingKycStatus("Rejected")}
        >
          Reject KYC
        </button>
        <button
          className="kyc-investor-approve"
          type="button"
          disabled={saving || !documentsSubmitted}
          onClick={() => setPendingKycStatus("Approved")}
        >
          Approve KYC
        </button>
      </div>
      {pendingKycStatus && (
        <div
          className="kyc-confirm-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setPendingKycStatus("");
          }}
        >
          <section
            className="kyc-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="kyc-confirm-title"
            aria-describedby="kyc-confirm-message"
          >
            <h2 id="kyc-confirm-title">Confirm KYC {pendingKycStatus}</h2>
            <p id="kyc-confirm-message">
              Are you sure you want to {pendingKycStatus.toLowerCase()} {user.fullName || "this investor"}'s KYC application?
            </p>
            <div className="kyc-confirm-actions">
              <button type="button" className="kyc-confirm-cancel" disabled={saving} onClick={() => setPendingKycStatus("")}>Cancel</button>
              <button type="button" className={`kyc-confirm-submit ${pendingKycStatus === "Rejected" ? "is-reject" : "is-approve"}`} disabled={saving} onClick={changeKycStatus}>
                {saving ? "Saving..." : `Yes, ${pendingKycStatus}`}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
