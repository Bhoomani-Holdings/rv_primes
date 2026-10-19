import { useEffect, useState } from "react";
import { getUsers, updateUserKycStatus } from "../../../services/userService";
import "./kycReview.css";

const kycStatuses = ["Pending for Approval", "Accept", "Reject"];
const documentLinks = [
  ["uploadpancard", "PAN"],
  ["uploadaadhaar", "Aadhaar"],
  ["uploadaddressproof", "Address proof"],
  ["selfiephoto", "Selfie"]
];

export default function KycReview() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getUsers()
      .then((data) => {
        if (!cancelled) setUsers(data);
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

  const handleStatusChange = async (userId, kycStatus) => {
    setUpdatingUserId(userId);
    setError("");
    try {
      const updatedUser = await updateUserKycStatus(userId, kycStatus);
      setUsers((current) => current.map((user) => user.id === userId ? updatedUser : user));
    } catch (updateError) {
      setError(updateError.message || "Unable to update KYC status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <section className="kyc-review-content">
      <div className="dashboard-card kyc-review-card">
        <div className="kyc-review-heading">
          <h1>KYC Approvals</h1>
          <span>{users.filter((user) => user.kycDetails).length} submissions</span>
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
                  <th>Basic Details</th>
                  <th>Address</th>
                  <th>PAN Number</th>
                  <th>Aadhaar Number</th>
                  <th>KYC Documents</th>
                  <th>KYC Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const details = user.kycDetails;
                  return (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.fullName}</strong>
                        <span className="kyc-review-secondary">{user.email}</span>
                        <span className="kyc-review-secondary">{user.mobileNumber}</span>
                        <span className="kyc-review-secondary">DOB: {user.dateOfBirth || "-"}</span>
                        <span className="kyc-review-secondary">Gender: {user.gender || "-"}</span>
                      </td>
                      <td>{[user.address, user.address1, user.city, user.state, user.country, user.pincode].filter(Boolean).join(", ") || "-"}</td>
                      <td>{details?.pancardnumber || "-"}</td>
                      <td>{details?.aadhaarnumber || "-"}</td>
                      <td>
                        {details ? (
                          <div className="kyc-document-links">
                            {documentLinks.map(([field, label]) => details[field] && (
                              <a key={field} href={details[field]} target="_blank" rel="noreferrer">
                                {label}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="kyc-review-secondary">Not submitted</span>
                        )}
                      </td>
                      <td>
                        <select
                          className="kyc-status-select"
                          aria-label={`KYC status for ${user.fullName}`}
                          value={user.kycStatus || "Pending for Approval"}
                          disabled={!details || updatingUserId === user.id}
                          onChange={(event) => handleStatusChange(user.id, event.target.value)}
                        >
                          {kycStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        {!details && <span className="kyc-review-secondary">Not submitted</span>}
                      </td>
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