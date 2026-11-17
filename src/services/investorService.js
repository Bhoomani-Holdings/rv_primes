const API_URL = "http://localhost:5000/api";

const request = async (path, options = {}) => {
  let session;
  try {
    session = JSON.parse(sessionStorage.getItem("investorSession") || "null");
  } catch (error) {
    console.error("Unable to read investor session:", error);
    throw new Error("Unable to read investor session. Sign in again.");
  }
  if (!session?.accessToken) throw new Error("Your investor session is missing. Sign in again.");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem("investorSession");
      window.dispatchEvent(new Event("investor-session-expired"));
    }
    throw new Error(result.message || `Unable to load investor data (${response.status}).`);
  }
  return result;
};

export const getInvestorWallet = () => request("/investor/wallet");
export const getInvestorInvestments = () => request("/investor/investments");
export const getInvestorEarnings = () => request("/investor/earnings");
export const getInvestorTransactions = () => request("/investor/transactions");
export const getInvestorWithdrawals = () => request("/investor/withdrawals");
export const getInvestorDocuments = () => request("/investor/documents");
export const getInvestorNotifications = () => request("/investor/notifications");
export const markInvestorNotificationsRead = () => request("/investor/notifications/read-all", {
  method: "PATCH"
});
export const getInvestorSupportTickets = () => request("/investor/support");
export const createInvestorSupportTicket = (ticket) => request("/investor/support", {
  method: "POST",
  body: JSON.stringify(ticket)
});

export const investorDocumentUrl = (url) => {
  if (!url) return "";
  return /^(https?:|blob:|data:)/.test(url) ? url : `http://localhost:5000${url}`;
};
