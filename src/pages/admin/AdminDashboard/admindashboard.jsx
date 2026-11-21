import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getDashboardData } from "../../../services/dashboardService";
import { endStaffSession, getStaffSession } from "../../../services/staffSupportService";

import { ROUTES } from "../../../routes/routesPath";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Header from "../../../components/topheader/TopHeader";
import StatCard from "../../../components/StatCard/StatCard";
import ProjectOverview from "../../../components/ProjectOverview/ProjectOverview";
import SalesOverview from "../../../components/SalesOverview/SalesOverview";
import KycApprovals from "../../../components/KycApprovals/KycApprovals";
import RecentTransactions from "../../../components/RecentTransactions/RecentTransactions";
import RevenueOverview from "../../../components/RevenueOverview/RevenueOverview";
import QuickActions from "../../../components/QuickActions/QuickActions";
import ProjectsPage from "../Projects/Projects";
import ProjectManagementPage from "../ProjectManagement/ProjectManagement";
import UsersPage from "../Users/Users";
import EmployeesPage from "../Employees/Employees";
import KycReviewPage from "../KycReview/KycReview";
import KycInvestorDetailsPage from "../KycReview/KycInvestorDetails";
import UserDetailsPage from "../Users/UserDetails";
import CareersPage from "../Careers/Careers";
import CareerApplicantsPage from "../Careers/CareerApplicants";
import AdminSettingsPage from "../Settings/AdminSettings";
import InvestorSupportRequests from "../Support/InvestorSupportRequests";
import StaffNotifications from "../../../components/StaffNotifications/StaffNotifications";
import useStaffNotifications from "../../../hooks/useStaffNotifications";

import "./admindashboard.css";

const readAdminSession = () => {
  try {
    return JSON.parse(sessionStorage.getItem("adminSession") || "null");
  } catch {
    return null;
  }
};

function AdminDashboard({ initialPage = "Dashboard" }) {
  const navigate = useNavigate();
  const { userId, employeeId } = useParams();
  const [adminSession, setAdminSession] = useState(readAdminSession);
  const staffNotifications = useStaffNotifications(adminSession);
  const isAuthenticatedAdmin = adminSession?.userRole === "admin" && Boolean(adminSession.accessToken);
  const [adminAuthStatus, setAdminAuthStatus] = useState(() => isAuthenticatedAdmin ? "checking" : "unauthenticated");
  const isProjectEditor = initialPage === "Add Project" || initialPage === "Edit Project";
  const isKycInvestorDetails = initialPage === "KYC Investor Details";
  const skipDashboardLoad = isProjectEditor || isKycInvestorDetails || initialPage === "Career Applicants" || initialPage === "Add Employee" || initialPage === "Employee Details" || initialPage === "Support" || initialPage === "Notifications";
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(!skipDashboardLoad);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState(initialPage);

  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (!isAuthenticatedAdmin) return undefined;
    let active = true;
    getStaffSession(adminSession.accessToken)
      .then(({ userRole }) => {
        if (!active) return;
        if (userRole !== "admin") {
          sessionStorage.removeItem("adminSession");
          setAdminSession(null);
          setAdminAuthStatus("unauthenticated");
          return;
        }
        setAdminAuthStatus("authenticated");
      })
      .catch((sessionError) => {
        if (!active) return;
        console.error("Unable to verify admin session:", sessionError);
        sessionStorage.removeItem("adminSession");
        setAdminSession(null);
        setAdminAuthStatus("unauthenticated");
      });
    return () => { active = false; };
  }, [adminSession, isAuthenticatedAdmin]);

  useEffect(() => {
    if (adminAuthStatus !== "authenticated") return undefined;
    if (skipDashboardLoad) {
      setLoading(false);
      setError("");
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();
        if (!cancelled) setDashboard(data);
      } catch (error) {
        if (!cancelled) setError("Unable to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [adminAuthStatus, initialPage, skipDashboardLoad]);

  const handleLogout = async () => {
    try {
      if (adminSession?.accessToken) await endStaffSession(adminSession.accessToken);
    } catch (logoutError) {
      console.error("Unable to revoke admin session:", logoutError);
    } finally {
      sessionStorage.removeItem("adminSession");
      setAdminSession(null);
      setAdminAuthStatus("unauthenticated");
      navigate(ROUTES.EMPLOYEE_LOGIN, { replace: true });
    }
  };

  if (adminAuthStatus === "checking") return <div className="loading">Verifying admin session...</div>;
  if (adminAuthStatus !== "authenticated") return <Navigate to={ROUTES.EMPLOYEE_LOGIN} replace />;

  if (loading && !skipDashboardLoad) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error && !skipDashboardLoad) {
    return <div className="error">{error}</div>;
  }

  const handleProjectCreated = ({ project, totalProjects, totalUnits }) => {
    setDashboard((current) => ({
      ...(current || {}),
      projects: [...(current?.projects || []), project],
      stats: { ...(current?.stats || {}), totalProjects, totalUnits }
    }));
  };

  const handleProjectUpdated = ({ project, stats }) => {
    setDashboard((current) => ({
      ...(current || {}),
      projects: (current?.projects || []).map((item) => item.id === project.id ? project : item),
      stats: { ...(current?.stats || {}), ...stats }
    }));
  };

  return (
    <div className="admin-layout">

      <Sidebar
        notificationCount={staffNotifications.unreadCount}
        activePage={activePage === "User Details" ? "Users" : activePage === "KYC Investor Details" ? "KYC Approvals" : activePage === "Add Employee" || activePage === "Employee Details" ? "Employees" : activePage}
        onLogout={handleLogout}
        onNavigate={(page) => {
          if (["Dashboard", "Projects", "Units", "Pricing Management", "Users", "Employees", "Careers", "KYC Approvals", "Settings", "Support", "Notifications"].includes(page)) {
            setActivePage(page);
            if (page === "Dashboard") navigate(ROUTES.ADMIN_DASHBOARD);
            if (page === "Projects") navigate(ROUTES.ADMIN_PROJECTS);
            if (page === "Users") navigate(ROUTES.ADMIN_USERS);
            if (page === "Employees") navigate(ROUTES.ADMIN_EMPLOYEES);
            if (page === "Careers") navigate(ROUTES.ADMIN_CAREERS);
            if (page === "KYC Approvals") navigate(ROUTES.ADMIN_KYC_APPROVALS);
            if (page === "Settings") navigate(ROUTES.ADMIN_SETTINGS);
            if (page === "Support") navigate(ROUTES.ADMIN_SUPPORT);
            if (page === "Notifications") navigate(ROUTES.ADMIN_NOTIFICATIONS);
          }
        }}
      />

      <main className="main-content">

        <Header
          user={adminSession}
          notificationCount={staffNotifications.unreadCount}
          onNotificationsClick={() => navigate(ROUTES.ADMIN_NOTIFICATIONS)}
        />

        {activePage === "Users" ? (
          <UsersPage />
        ) : activePage === "Employees" ? (
          <EmployeesPage />
        ) : activePage === "Add Employee" ? (
          <EmployeesPage mode="create" />
        ) : activePage === "Employee Details" ? (
          <EmployeesPage mode="detail" employeeId={employeeId} />
        ) : activePage === "User Details" ? (
          <UserDetailsPage userId={userId} />
        ) : activePage === "KYC Approvals" ? (
          <KycReviewPage />
        ) : activePage === "KYC Investor Details" ? (
          <KycInvestorDetailsPage userId={userId} />
        ) : activePage === "Careers" ? (
          <CareersPage />
        ) : activePage === "Career Applicants" ? (
          <CareerApplicantsPage />
        ) : activePage === "Settings" ? (
          <AdminSettingsPage />
        ) : activePage === "Support" ? (
          <InvestorSupportRequests staffRole="admin" />
        ) : activePage === "Notifications" ? (
          <StaffNotifications {...staffNotifications} onMarkAllRead={staffNotifications.markAllRead} />
        ) : activePage === "Projects" ? (
          <ProjectsPage
            mode="list"
            onProjectCreated={handleProjectCreated}
          />
        ) : activePage === "Add Project" || activePage === "Edit Project" ? (
          <ProjectsPage
            mode={activePage === "Add Project" ? "create" : "edit"}
            onProjectCreated={handleProjectCreated}
            onProjectUpdated={handleProjectUpdated}
          />
        ) : activePage === "Units" || activePage === "Pricing Management" ? (
          <ProjectManagementPage
            projects={dashboard.projects}
            mode={activePage === "Units" ? "units" : "pricing"}
            onProjectUpdated={handleProjectUpdated}
          />
        ) : (
        <section className="dashboard-content">

          <div className="stats-grid">

            <StatCard
              title="Total Projects"
              value={dashboard.stats.totalProjects}
              icon="▣"
              type="blue"
            />

            <StatCard
              title="Total Units"
              value={dashboard.stats.totalUnits.toLocaleString()}
              icon="▥"
              type="green"
            />

            <StatCard
              title="Total Investors"
              value={dashboard.stats.totalInvestors.toLocaleString()}
              icon="♙"
              type="purple"
            />

            <StatCard
              title="Total Sales"
              value={`₹ ${dashboard.stats.totalSales.toLocaleString("en-IN")}`}
              icon="₹"
              type="orange"
            />

            <StatCard
              title="Total Revenue"
              value={`₹ ${dashboard.stats.totalRevenue.toLocaleString("en-IN")}`}
              icon="₹"
              type="red"
            />

          </div>

          <div className="dashboard-row">

            <ProjectOverview
              projects={dashboard.projects}
              compact
              onViewAll={() => setActivePage("Projects")}
            />

            <SalesOverview
              sales={dashboard.salesOverview}
            />

          </div>

          <div className="dashboard-row bottom-row">

            <KycApprovals
              data={dashboard.kycApprovals}
              onReview={() => {
                setActivePage("KYC Approvals");
                navigate(ROUTES.ADMIN_KYC_APPROVALS);
              }}
            />

            <RecentTransactions
              transactions={dashboard.transactions}
            />

            <RevenueOverview
              data={dashboard.revenueOverview}
            />

          </div>

          <QuickActions />

        </section>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;
