const API_URL = "http://localhost:5000/api";

const request = async (path, { accessToken, ...options } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.message || `Unable to load support requests (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return result;
};

export const loginAdmin = (email, password) => request("/admin/login", {
  method: "POST",
  body: JSON.stringify({ email, password })
});

export const getStaffSession = (accessToken) => request("/staff/session", { accessToken });

export const getStaffSupportRequests = (accessToken) => request("/staff/support", { accessToken });

export const endStaffSession = (accessToken) => request("/staff/session", {
  accessToken,
  method: "DELETE"
});
