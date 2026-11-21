import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { getUsers, updateUserApprovalStatus } from "../../../services/userService";
import "./userDetails.css";

const showValue = (value) => value || "Not provided";
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
const getApprovalStatusClass = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();
  if (normalizedStatus === "approved") return "is-approved";
  if (normalizedStatus === "rejected") return "is-rejected";
  return "is-pending";
};

function DetailSection({ title, fields }) {
  return (
    <section className="user-detail-section">
      <h2>{title}</h2>
      <dl>
        {fields.map(([label, value]) => (
          <div className={`user-detail-field${label.endsWith("Approved By") ? " user-detail-field-approval" : ""}`} key={label}>
            <dt>{label}</dt>
            <dd>{showValue(value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function UserDetails({ userId, basePath = ROUTES.ADMIN_USERS } = {}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [pendingApprovalStatus, setPendingApprovalStatus] = useState("");

  const changeApprovalStatus = async (approvalStatus) => {
    setSavingStatus(true);
    setStatusError("");
    try {
      const updatedUser = await updateUserApprovalStatus(userId, approvalStatus);
      setUser(updatedUser);
      navigate(basePath);
      return true;
    } catch (updateError) {
      setStatusError(updateError.message || "Unable to update approval status");
      return false;
    } finally {
      setSavingStatus(false);
    }
  };

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
      <button className="user-details-back" type="button" onClick={() => navigate(basePath)}>
        Back to Users
      </button>
      <header className="user-details-header">
        <h1>{user.fullName}</h1>
        <span className={`user-detail-approval-status ${getApprovalStatusClass(user.approvalStatus)}`}>
          {user.approvalStatus || "Pending for Approval"}
        </span>
      </header>

      <DetailSection
        title="Basic Details"
        fields={[
          ["First Name", user.firstName],
          ["Last Name", user.lastName],
          ["Email", user.email],
          ["Mobile Number", user.mobileNumber],
          ["Date of Birth", user.dateOfBirth],
          ["Gender", user.gender],
          ["Basic Details Approved By", formatBasicApproval(user.basicDetailsApproval, user.approvalStatus)]
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
        title="KYC Details"
        fields={[
          ["PAN number", user.kycDetails?.pancardnumber],
          ["Aadhaar number", user.kycDetails?.aadhaarnumber],
          ["KYC status", user.kycStatus || "Not submitted"],
          ["KYC Details Approved By", formatKycApproval(user.kycApproval, user.kycStatus)]
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
      <div className="user-approval-actions">
        <button
          className="user-approval-button user-approval-button-reject"
          type="button"
          disabled={savingStatus}
          onClick={() => setPendingApprovalStatus("Rejected")}
        >
          Reject
        </button>
        <button
          className="user-approval-button user-approval-button-approve"
          type="button"
          disabled={savingStatus}
          onClick={() => setPendingApprovalStatus("Approved")}
        >
          Approve
        </button>
      </div>
      {pendingApprovalStatus && (
        <div
          className="user-approval-confirm-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !savingStatus) setPendingApprovalStatus("");
          }}
        >
          <section
            className="user-approval-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="user-approval-confirm-title"
            aria-describedby="user-approval-confirm-message"
          >
            <h2 id="user-approval-confirm-title">Confirm {pendingApprovalStatus}</h2>
            <p id="user-approval-confirm-message">
              Are you sure you want to {pendingApprovalStatus.toLowerCase()} {user.fullName || "this investor"}'s basic details?
            </p>
            {statusError && <p className="user-details-error" role="alert">{statusError}</p>}
            <div className="user-approval-confirm-actions">
              <button type="button" className="user-approval-confirm-cancel" disabled={savingStatus} onClick={() => setPendingApprovalStatus("")}>Cancel</button>
              <button
                type="button"
                className={`user-approval-confirm-submit ${pendingApprovalStatus === "Rejected" ? "is-reject" : "is-approve"}`}
                disabled={savingStatus}
                onClick={async () => {
                  const status = pendingApprovalStatus;
                  const updated = await changeApprovalStatus(status);
                  if (updated) setPendingApprovalStatus("");
                }}
              >
                {savingStatus ? "Saving..." : `Yes, ${pendingApprovalStatus}`}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
