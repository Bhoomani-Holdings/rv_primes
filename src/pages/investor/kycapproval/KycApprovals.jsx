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

const hasCompleteNomineeDetails = (details) =>
  ["UserName", "UserNumber", "Relationship"].every(
    (field) => typeof details?.[field] === "string" && details[field].trim()
  );

export default function InvestorKycApprovals() {
  const [investor, setInvestor] = useState(null);
  const [formStep, setFormStep] = useState("kyc");
  const [isEditingKyc, setIsEditingKyc] = useState(false);

  useEffect(() => {
    try {
      const savedInvestor = sessionStorage.getItem("investorSession");
      const currentInvestor = savedInvestor ? JSON.parse(savedInvestor) : null;
      setInvestor(currentInvestor);
      if (currentInvestor?.kycDetails?.uploadpancard) {
        setFormStep(hasCompleteNomineeDetails(currentInvestor.nomineeDetails) ? "complete" : "nominee");
      } else {
        setFormStep("kyc");
      }
    } catch {
      setInvestor(null);
      setFormStep("kyc");
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
              {statusClass === "pending" && investor?.kycDetails?.uploadpancard && !hasCompleteNomineeDetails(investor.nomineeDetails)
                ? "Add your nominee details to complete your KYC submission."
                : statusClass === "pending" && "Your KYC documents are waiting for review."}
              {statusClass === "not-submitted" && "You have not submitted your KYC documents yet."}
            </p>
          </>
        ) : (
          <p className="investor-kyc-message">Please sign in to view your KYC approval status.</p>
        )}
      </section>
      {investor && formStep === "kyc" && (statusClass === "not-submitted" || isEditingKyc) && (
        <KycDetails
          investorMode
          onInvestorKycSubmitted={(updatedInvestor) => {
            setInvestor(updatedInvestor);
            setIsEditingKyc(false);
            setFormStep("nominee");
          }}
        />
      )}
      {investor && formStep === "nominee" && (
        <NomineeInfo
          investorMode
          onCancel={() => {
            setIsEditingKyc(true);
            setFormStep("kyc");
          }}
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
