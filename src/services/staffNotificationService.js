const API_URL = "http://localhost:5000/api";

const request = async (path, accessToken, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Unable to load notifications.");
  return result;
};

export const getStaffNotifications = (accessToken) =>
  request("/staff/notifications", accessToken);

export const markStaffNotificationsRead = (accessToken) =>
  request("/staff/notifications/read-all", accessToken, { method: "PATCH" });
