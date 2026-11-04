import { useEffect, useState } from "react";
import { KycDetails } from "../../Registration/KYCDetails/KycDetails";
import NomineeInfo from "../../Registration/NomineeInfo/NomineeInfo";
import "./KycApprovals.css";

const getStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "accept" || normalized === "approved") return "approved";
  if (normalized === "reject" || normalized === "rejected") return "rejected";
  if (normalized === "not submitted") return "not-submitted";
  return "pending";
};

export default function InvestorKycApprovals() {
  const [investor, setInvestor] = useState(null);
  const [formStep, setFormStep] = useState("kyc");

  useEffect(() => {
    try {
      const savedInvestor = sessionStorage.getItem("investorSession");
      setInvestor(savedInvestor ? JSON.parse(savedInvestor) : null);
    } catch {
      setInvestor(null);
    }
  }, []);

  const status = investor?.kycStatus || "Not Submitted";
  const statusClass = getStatusClass(status);

  return (
    <main className="investor-kyc-page">
      <section className="investor-kyc-card" aria-labelledby="investor-kyc-title">
        <p className="investor-kyc-eyebrow">Investor Account</p>
        <h1 id="investor-kyc-title">KYC Approval Status</h1>
        {investor ? (
          <>
            <p className="investor-kyc-welcome">{investor.fullName}</p>
            <p className="investor-kyc-email">{investor.email}</p>
            <div className={`investor-kyc-status ${statusClass}`} role="status">
              {status}
            </div>
            <p className="investor-kyc-message">
              {statusClass === "approved" && "Your KYC documents have been approved."}
              {statusClass === "rejected" && "Your KYC documents were rejected. Please contact support for assistance."}
              {statusClass === "pending" && "Your KYC documents are waiting for review."}
              {statusClass === "not-submitted" && "You have not submitted your KYC documents yet."}
            </p>
          </>
        ) : (
          <p className="investor-kyc-message">Please sign in to view your KYC approval status.</p>
        )}
      </section>
      {investor && statusClass === "not-submitted" && formStep === "kyc" && (
        <KycDetails
          investorMode
          onInvestorKycSubmitted={(updatedInvestor) => {
            setInvestor(updatedInvestor);
            setFormStep("nominee");
          }}
        />
      )}
      {investor && formStep === "nominee" && (
        <NomineeInfo
          investorMode
          onInvestorNomineeSubmitted={(updatedInvestor) => {
            setInvestor(updatedInvestor);
            setFormStep("complete");
          }}
        />
      )}
      {investor && formStep === "complete" && (
        <p className="investor-kyc-message" role="status">
          KYC and nominee details submitted successfully.
        </p>
      )}
    </main>
  );
}
