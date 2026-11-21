const API_ORIGIN = "http://localhost:5000";
const API_URL = `${API_ORIGIN}/api`;

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error("Unable to load users");
  return response.json();
};

export const checkUserEmail = async (email) => {
  const response = await fetch(`${API_URL}/users/check-email?email=${encodeURIComponent(email)}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to check email availability");
  return result.available;
};

export const createUser = async (basicInfo, addressInfo, credentials) => {
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
    body: JSON.stringify({ basicInfo: registrationDetails, addressInfo, credentials })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to save user");
  return result;
};

export const updateUserApprovalStatus = async (userId, approvalStatus) => {
  const session = JSON.parse(sessionStorage.getItem("adminSession") || sessionStorage.getItem("employeeSession") || "null");
  const response = await fetch(`${API_URL}/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {})
    },
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

export const updateUserNomineeDetails = async (email, nomineeInfo) => {
  const response = await fetch(`${API_URL}/users/registration-details`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, nomineeInfo })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to save nominee details");
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
  const session = JSON.parse(sessionStorage.getItem("adminSession") || sessionStorage.getItem("employeeSession") || "null");
  const response = await fetch(`${API_URL}/users/${userId}/kyc-status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {})
    },
    body: JSON.stringify({ kycStatus })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to update KYC status");
  return result;
};

// ---- KYC face photos (front / left / right) ----
// The backend returns a relative path such as /api/kyc/face-photo/<id>.jpg; this makes it a full address.
export const faceImageUrl = (path) => {
  if (!path) return "";
  return /^(https?:|blob:|data:)/.test(path) ? path : `${API_ORIGIN}${path}`;
};

export const uploadFacePhoto = async (blob) => {
  const body = new FormData();
  body.append("photo", blob, "face.jpg");
  const response = await fetch(`${API_URL}/kyc/face-photo`, { method: "POST", body });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Unable to upload the photo");
  return result;
};

export const saveReviewerFacePhoto = async (userId, angle, photo) => {
  const response = await fetch(`${API_URL}/users/${userId}/face-photos/${angle}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photo)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Unable to save the face photo");
  return result;
};
