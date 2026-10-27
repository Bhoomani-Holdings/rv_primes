import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDashboardData } from "../../../services/dashboardService";

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
import KycReviewPage from "../KycReview/KycReview";
import UserDetailsPage from "../Users/UserDetails";

import "./admindashboard.css";

function AdminDashboard({ initialPage = "Dashboard" }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isProjectEditor = initialPage === "Add Project" || initialPage === "Edit Project";
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(!isProjectEditor);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState(initialPage);

  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (isProjectEditor) {
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
  }, [initialPage, isProjectEditor]);

  if (loading && !isProjectEditor) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error && !isProjectEditor) {
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
        activePage={activePage === "User Details" ? "Users" : activePage}
        onNavigate={(page) => {
          if (["Dashboard", "Projects", "Units", "Pricing Management", "Users", "KYC Approvals"].includes(page)) {
            setActivePage(page);
            if (page === "Dashboard") navigate(ROUTES.ADMIN_DASHBOARD);
            if (page === "Projects") navigate(ROUTES.ADMIN_PROJECTS);
            if (page === "Users") navigate(ROUTES.ADMIN_USERS);
            if (page === "KYC Approvals") navigate(ROUTES.ADMIN_KYC_APPROVALS);
          }
        }}
      />

      <main className="main-content">

        <Header />

        {activePage === "Users" ? (
          <UsersPage />
        ) : activePage === "User Details" ? (
          <UserDetailsPage userId={userId} />
        ) : activePage === "KYC Approvals" ? (
          <KycReviewPage />
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