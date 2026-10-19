const API_URL = "http://localhost:5000/api";

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error("Unable to load users");
  return response.json();
};

export const createUser = async (basicInfo, addressInfo) => {
  const registrationDetails = {
    firstname: basicInfo.firstname,
    lastname: basicInfo.lastname,
    mobileNumber: basicInfo.mobileNumber,
    email: basicInfo.email,
    dateofbirth: basicInfo.dateofbirth,
    gender: basicInfo.gender
  };
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ basicInfo: registrationDetails, addressInfo })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to save user");
  return result;
};

export const updateUserApprovalStatus = async (userId, approvalStatus) => {
  const response = await fetch(`${API_URL}/users/${userId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approvalStatus })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to update user status");
  return result;
};

export const updateUserRegistrationDetails = async (email, nomineeInfo, bankInfo) => {
  const response = await fetch(`${API_URL}/users/registration-details`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, nomineeInfo, bankInfo })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to save registration details");
  return result;
};

export const submitUserKyc = async (email, kycDetails) => {
  const response = await fetch(`${API_URL}/users/kyc`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, kycDetails })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to save KYC details");
  return result;
};

export const updateUserKycStatus = async (userId, kycStatus) => {
  const response = await fetch(`${API_URL}/users/${userId}/kyc-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kycStatus })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to update KYC status");
  return result;
};