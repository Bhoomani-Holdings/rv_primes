import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { getUsers } from "../../../services/userService";
import "./kycReview.css";

const documentLinks = [
  ["uploadpancard", "PAN"],
  ["uploadaadhaar", "Aadhaar"],
  ["uploadaddressproof", "Address proof"],
  ["selfiephoto", "Selfie"]
];

const hasSubmittedKycDocuments = (details) =>
  Boolean(details) && documentLinks.every(([field]) => Boolean(details[field]));

export default function KycReview() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const openInvestorDetails = (userId) =>
    navigate(`${ROUTES.ADMIN_KYC_APPROVALS}/${userId}`);

  const getKycStatusLabel = (status, documentsSubmitted) => {
    if (!documentsSubmitted) return "Not submitted";
    if (status === "Accept") return "Approved";
    if (status === "Reject") return "Rejected";
    return status || "Pending for Approval";
  };

  const getKycStatusClass = (status, documentsSubmitted) => {
    const label = getKycStatusLabel(status, documentsSubmitted).toLowerCase();
    if (label === "approved") return "is-approved";
    if (label === "rejected") return "is-rejected";
    if (label === "pending for approval") return "is-pending";
    return "is-neutral";
  };

  useEffect(() => {
    let cancelled = false;

    getUsers()
      .then((data) => {
        if (!cancelled) {
          setUsers([...data].sort((first, second) => Number(second.id) - Number(first.id)));
        }
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Unable to load KYC submissions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="kyc-review-content">
      <div className="dashboard-card kyc-review-card">
        <div className="kyc-review-heading">
          <h1>KYC Approvals</h1>
          <span>{users.filter((user) => hasSubmittedKycDocuments(user.kycDetails)).length} submissions</span>
        </div>
        {error && <p className="kyc-review-error" role="alert">{error}</p>}
        {loading ? (
          <p role="status">Loading KYC submissions...</p>
        ) : users.length === 0 ? (
          <p className="kyc-review-empty">No registered users yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Investor ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>PAN Number</th>
                  <th>Aadhaar Number</th>
                  <th>KYC Documents</th>
                  <th>KYC Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const details = user.kycDetails;
                  const documentsSubmitted = hasSubmittedKycDocuments(details);
                  return (
                    <tr
                      key={user.id}
                      className="kyc-review-row"
                      tabIndex={0}
                      onDoubleClick={() => openInvestorDetails(user.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") openInvestorDetails(user.id);
                      }}
                    >
                      <td title="Double-click to view investor details">{user.investorId || "-"}</td>
                      <td><strong>{user.fullName || "-"}</strong></td>
                      <td>{user.email || "-"}</td>
                      <td>{details?.pancardnumber || "-"}</td>
                      <td>{details?.aadhaarnumber || "-"}</td>
                      <td>
                        {documentsSubmitted
                          ? <span className="kyc-documents-submitted">Submitted</span>
                          : <span className="kyc-review-secondary">Not submitted</span>}
                      </td>
                      <td><span className={`kyc-status-label ${getKycStatusClass(user.kycStatus, documentsSubmitted)}`}>{getKycStatusLabel(user.kycStatus, documentsSubmitted)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
