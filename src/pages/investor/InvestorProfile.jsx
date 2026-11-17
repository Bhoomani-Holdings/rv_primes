import RoleProfile from "../../components/RoleProfile/RoleProfile";

const readInvestorSession = () => {
  try {
    return JSON.parse(sessionStorage.getItem("investorSession") || "null") || {};
  } catch {
    return {};
  }
};

const formatAddress = (investor) =>
  [investor.address, investor.address1, investor.city, investor.state, investor.pincode, investor.country]
    .filter(Boolean)
    .join(", ");

export default function InvestorProfile() {
  const investor = readInvestorSession();
  const nomineeDetails = investor.nomineeDetails || {};
  const sections = [
    {
      title: "Personal details",
      fields: [
        { name: "fullName", label: "Full name", value: investor.fullName, editable: false },
        { name: "email", label: "Email address", value: investor.email, type: "email", editable: false },
        { name: "mobileNumber", label: "Phone number", value: investor.mobileNumber, type: "tel", editable: false },
        { name: "address", label: "Address", value: formatAddress(investor), editable: false, fullWidth: true },
      ],
    },
    {
      title: "Nominee",
      fields: [
        { name: "UserName", label: "Nominee name", value: nomineeDetails.UserName, editable: false },
        { name: "Relationship", label: "Nominee relationship", value: nomineeDetails.Relationship, editable: false },
      ],
    },
  ];

  return (
    <main className="investor-profile-page">
      <header className="investor-profile-page__header">
        <span>Account Centre</span>
        <h1>Profile</h1>
        <p>Your verified investor details and contact preferences.</p>
      </header>
      <RoleProfile
        profile={investor}
        roleLabel="Investor"
        badgeLabel="Verified"
        profileId={investor.investorId}
        summaryDetails={[
          { label: "Member since", value: investor.createdAt ? new Date(investor.createdAt).toLocaleDateString() : "—" },
        ]}
        sections={sections}
      />
    </main>
  );
}
