const API_URL = "http://localhost:5000/api";

export const authApi = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    const result = await response.json();
    if (!response.ok) {
      const error = new Error(result.message || "Unable to sign in");
      error.code = result.code;
      throw error;
    }
    return result;
  },
  logout: async () => {
    const session = JSON.parse(sessionStorage.getItem("investorSession") || "null");
    if (!session?.accessToken) return;
    const response = await fetch(`${API_URL}/investor/session`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.message || "Unable to end investor session");
    }
  },
};
