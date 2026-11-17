const API_URL = "http://localhost:5000/api";

export const getEmployees = async () => {
  const response = await fetch(`${API_URL}/employees`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to load employees");
  return [...result].sort((first, second) => {
    const firstCreated = Date.parse(first.createdAt || "") || 0;
    const secondCreated = Date.parse(second.createdAt || "") || 0;
    return secondCreated - firstCreated || Number(second.id || 0) - Number(first.id || 0);
  });
};

export const createEmployee = async (employee, files = {}) => {
  const body = new FormData();
  Object.entries(employee).forEach(([field, value]) => body.append(field, value));
  Object.entries(files).forEach(([field, file]) => {
    if (file) body.append(field, file);
  });
  const response = await fetch(`${API_URL}/employees`, {
    method: "POST",
    body
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to add employee");
  return result;
};

export const updateEmployee = async (employeeId, updates) => {
  const response = await fetch(`${API_URL}/employees/${employeeId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to update employee");
  return result;
};

export const loginEmployee = async (email, password) => {
  const response = await fetch(`${API_URL}/employees/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.message || "Unable to sign in");
    error.status = response.status;
    throw error;
  }
  return {
    ...result.employee,
    accessToken: result.accessToken,
    accessTokenExpiresAt: result.expiresAt
  };
};

export const uploadEmployeeProfilePicture = async (employeeId, file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);
  const response = await fetch(`${API_URL}/employees/${employeeId}/profile-picture`, {
    method: "POST",
    body: formData
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to upload profile picture");
  return result;
};
