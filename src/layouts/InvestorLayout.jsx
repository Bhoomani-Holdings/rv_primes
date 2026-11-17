import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routesPath';
import Sidebar from '../components/Sidebar/Sidebar';
import TopHeader from '../components/topheader/TopHeader';
import { authApi } from '../api/authApi';
import { getInvestorNotifications } from '../services/investorService';
import { RiWallet3Line } from 'react-icons/ri';

const investorMenuItems = [
  { name: "Dashboard", icon: "▦" },
  { name: "My Investments", icon: "▣" },
  { name: "Earnings", icon: "↗" },
  { name: "Wallet", icon: <RiWallet3Line aria-hidden="true" /> },
  { name: "Withdrawals", icon: "↥" },
  { name: "Transactions", icon: "⇄" },
  { name: "Documents", icon: "▤" },
  { name: "Notifications", icon: "♧" },
  { name: "Profile", icon: "♙" },
  { name: "Support", icon: "⊙" },
];

export default function InvestorLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  let investor = null;

  try {
    investor = JSON.parse(sessionStorage.getItem('investorSession') || 'null');
  } catch {
    investor = null;
  }

  useEffect(() => {
    const refreshNotificationCount = () => {
      getInvestorNotifications()
        .then((result) => setNotificationCount(Number(result.unreadCount) || 0))
        .catch((error) => console.error("Unable to load investor notification count:", error));
    };
    const expireSession = () => navigate(ROUTES.LOGIN, { replace: true });

    if (investor?.accessToken) refreshNotificationCount();
    window.addEventListener('investor-notifications-updated', refreshNotificationCount);
    window.addEventListener('investor-session-expired', expireSession);
    return () => {
      window.removeEventListener('investor-notifications-updated', refreshNotificationCount);
      window.removeEventListener('investor-session-expired', expireSession);
    };
  }, [investor?.accessToken, pathname, navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 600) setIsMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [isMobileMenuOpen]);

  if (!investor?.accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const status = String(investor.kycStatus || 'Not Submitted').trim().toLowerCase();
  const kycApproved = status === 'approved' || status === 'accept';
  const isKycStatusPage = pathname === ROUTES.INVESTOR_KYC_APPROVALS;
  const activePageByRoute = {
    [ROUTES.INVESTOR_PROFILE]: "Profile",
    [ROUTES.INVESTOR_INVESTMENTS]: "My Investments",
    [ROUTES.WALLET]: "Wallet",
    [ROUTES.EARNINGS]: "Earnings",
    [ROUTES.INVESTOR_WITHDRAWALS]: "Withdrawals",
    [ROUTES.INVESTOR_TRANSACTIONS]: "Transactions",
    [ROUTES.INVESTOR_DOCUMENTS]: "Documents",
    [ROUTES.INVESTOR_NOTIFICATIONS]: "Notifications",
    [ROUTES.INVESTOR_SUPPORT]: "Support",
  };
  const activePage = activePageByRoute[pathname] || "Dashboard";

  if (!kycApproved && !isKycStatusPage) {
    return <Navigate to={ROUTES.INVESTOR_KYC_APPROVALS} replace />;
  }

  const handleNavigate = (page) => {
    setIsMobileMenuOpen(false);
    const destinations = {
      Dashboard: ROUTES.INVESTOR,
      "My Investments": ROUTES.INVESTOR_INVESTMENTS,
      Earnings: ROUTES.EARNINGS,
      Wallet: ROUTES.WALLET,
      Withdrawals: ROUTES.INVESTOR_WITHDRAWALS,
      Transactions: ROUTES.INVESTOR_TRANSACTIONS,
      Documents: ROUTES.INVESTOR_DOCUMENTS,
      Notifications: ROUTES.INVESTOR_NOTIFICATIONS,
      Profile: ROUTES.INVESTOR_PROFILE,
      Support: ROUTES.INVESTOR_SUPPORT,
    };
    if (destinations[page]) navigate(destinations[page]);
  };
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Unable to revoke investor session:", error);
    } finally {
      sessionStorage.removeItem('investorSession');
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  const menuItems = investorMenuItems.map((item) => item.name === "Notifications"
    ? { ...item, notification: notificationCount }
    : item);

  return (
    <div className="investor-layout">
      <Sidebar
        activePage={activePage}
        menuItems={menuItems}
        brand="Bhoomani Holdings"
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <div className="investor-main">
        <TopHeader
          user={investor}
          notificationCount={notificationCount}
          mobileMenuOpen={isMobileMenuOpen}
          onMenuClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        />
        <Outlet />
      </div>
    </div>
  );
}
