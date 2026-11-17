import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { getDashboardData, getProjects } from "../../../services/dashboardService";
import { getEmployees, updateEmployee } from "../../../services/employeeService";
import { endStaffSession } from "../../../services/staffSupportService";
import { ROUTES } from "../../../routes/routesPath";
import Header from "../../../components/topheader/TopHeader";
import ProjectsPage from "../../admin/Projects/Projects";
import EmployeesPage from "../../admin/Employees/Employees";
import CareersPage from "../../admin/Careers/Careers";
import CareerApplicantsPage from "../../admin/Careers/CareerApplicants";
import ProfilePictureUpload from "../../../components/ProfilePictureUpload";
import RoleProfile, { getEmployeeProfileSections } from "../../../components/RoleProfile/RoleProfile";
import UsersPage from "../../admin/Users/Users";
import UserDetailsPage from "../../admin/Users/UserDetails";
import KycReviewPage from "../../admin/KycReview/KycReview";
import KycInvestorDetailsPage from "../../admin/KycReview/KycInvestorDetails";
import InvestorSupportRequests from "../../admin/Support/InvestorSupportRequests";
import { FiMessageCircle } from "react-icons/fi";
import "./manager.css";

const managerItems = [
  { name: "Dashboard", icon: "⌂" },
  { name: "Projects", icon: "▦" },
  { name: "Employees", icon: "♙" },
  { name: "Careers", icon: "▤" },
  { name: "Notifications", icon: "notifications", notification: 3 },
  { name: "Profile", icon: "◉" }
];
const managerNavigationItems = [
  ...managerItems.slice(0, 3),
  { name: "Users", icon: "♙" },
  { name: "KYC Approvals", icon: "✓" },
  { name: "Support", icon: <FiMessageCircle aria-hidden="true" /> },
  ...managerItems.slice(3)
];

const formatINR = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(Number(amount) || 0);

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("employeeSession") || "null"); }
    catch { return null; }
  }, []);
  const managerPath = location.pathname.replace(/^\/manager\/?/, "").split("/").filter(Boolean);
  const section = managerPath[0] || "dashboard";
  const skipDashboardLoad = section === "support";
  const projectId = section === "projects" && managerPath[1] !== "new" ? managerPath[1] : undefined;
  const projectMode = section === "projects" ? (managerPath[1] === "new" ? "create" : projectId ? "edit" : "list") : "list";
  const employeeMode = section !== "employees" ? "list" : managerPath[1] === "new" ? "create" : managerPath[1] ? "detail" : "list";
  const employeeId = employeeMode === "detail" ? managerPath[1] : undefined;
  const userId = section === "users" ? managerPath[1] : undefined;
  const kycUserId = section === "kyc-approvals" ? managerPath[1] : undefined;
  const careerId = section === "careers" && managerPath[1] && managerPath[2] === "applicants" ? managerPath[1] : undefined;
  const activePage = section === "projects" ? "Projects" : section === "employees" ? "Employees" : section === "users" ? "Users" : section === "kyc-approvals" ? "KYC Approvals" : section === "careers" ? "Careers" : section === "support" ? "Support" : section === "notifications" ? "Notifications" : section === "profile" ? "Profile" : "Dashboard";
  const [data, setData] = useState({ dashboard: null, projects: [], employees: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboard, projects, employees] = await Promise.all([
        getDashboardData(), getProjects(), getEmployees()
      ]);
      setData({ dashboard, projects, employees });
    } catch (loadError) {
      setError(loadError.message || "Unable to load manager data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (skipDashboardLoad) {
      setLoading(false);
      setError("");
      return;
    }
    loadData();
  }, [loadData, skipDashboardLoad]);

  if (!session) return <Navigate to={ROUTES.EMPLOYEE_LOGIN} replace />;
  if (session.userRole !== "manager") return <Navigate to={ROUTES.EMPLOYEE_DASHBOARD} replace />;

  const goTo = (name) => navigate(name === "Dashboard" ? "/manager" : `/manager/${name === "KYC Approvals" ? "kyc-approvals" : name.toLowerCase()}`);
  const logout = async () => {
    try {
      if (session?.accessToken) await endStaffSession(session.accessToken);
    } catch (error) {
      console.error("Unable to revoke manager session:", error);
    } finally {
      sessionStorage.removeItem("employeeSession");
      navigate(ROUTES.EMPLOYEE_LOGIN, { replace: true });
    }
  };
  const handleProfileSave = async (values) => {
    const employee = data.employees.find((item) => String(item.id) === String(session.id)) || session;
    const updates = Object.fromEntries(
      Object.entries(values).filter(([field, value]) =>
        value.trim() && value.trim() !== String(employee[field] || "")
      )
    );
    if (Object.keys(updates).length === 0) {
      throw new Error("Enter a new profile value before saving.");
    }

    const updatedEmployee = await updateEmployee(session.id, updates);
    setData((current) => ({
      ...current,
      employees: current.employees.map((item) =>
        String(item.id) === String(session.id) ? { ...item, ...updatedEmployee } : item
      ),
    }));
    sessionStorage.setItem("employeeSession", JSON.stringify({ ...session, ...updatedEmployee }));
    return updatedEmployee;
  };

  return (
    <div className="manager-layout">
      <Sidebar activePage={activePage} onNavigate={goTo} onLogout={logout} menuItems={managerNavigationItems} brand="Bhoomani Holdings" />
      <div className="manager-main">
        <Header user={{ ...session, profilePicture: data.employees.find((item) => String(item.id) === String(session.id))?.profilePicture || session.profilePicture }} />
        <main className="manager-content">
        {loading ? <div className="manager-message" role="status">Loading manager data…</div> : error ? (
          <div className="manager-message manager-error" role="alert"><p>{error}</p><button onClick={loadData}>Try again</button></div>
        ) : section === "projects" ? <ProjectsPage mode={projectMode} basePath="/manager/projects" projectId={projectId} onProjectCreated={loadData} onProjectUpdated={loadData} /> :
          section === "employees" ? <EmployeesPage mode={employeeMode} basePath="/manager/employees" employeeId={employeeId} /> :
          section === "users" ? userId ? <UserDetailsPage userId={userId} basePath="/manager/users" /> : <UsersPage basePath="/manager/users" /> :
          section === "kyc-approvals" ? kycUserId ? <KycInvestorDetailsPage userId={kycUserId} basePath="/manager/kyc-approvals" /> : <KycReviewPage basePath="/manager/kyc-approvals" /> :
          section === "careers" ? careerId ? <CareerApplicantsPage careerId={careerId} basePath="/manager/careers" /> : <CareersPage basePath="/manager/careers" /> :
          section === "support" ? <InvestorSupportRequests staffRole="manager" /> :
          section === "notifications" ? <div className="manager-message">Notification details are not available yet.</div> :
          section === "profile" ? <ProfileSection employee={data.employees.find((item) => String(item.id) === String(session.id)) || session} onSave={handleProfileSave} onPictureUpdated={(profilePicture) => {
            setData((current) => ({ ...current, employees: current.employees.map((item) => String(item.id) === String(session.id) ? { ...item, profilePicture } : item) }));
            sessionStorage.setItem("employeeSession", JSON.stringify({ ...session, profilePicture }));
          }} /> :
          <DashboardSection dashboard={data.dashboard} projects={data.projects} employees={data.employees} onProjects={() => goTo("Projects")} onEmployees={() => goTo("Employees")} />}
        </main>
      </div>
    </div>
  );
}

function DashboardSection({ dashboard, projects, employees, onProjects, onEmployees }) {
  const stats = dashboard?.stats || {};
  const totalUnits = projects.reduce((sum, project) => sum + (Number(project.totalUnits) || 0), 0);
  const soldUnits = projects.reduce((sum, project) => sum + (Number(project.soldUnits) || 0), 0);
  const sales = dashboard?.salesOverview || [];
  const maxSales = Math.max(1, ...sales.map((item) => Number(item.sales) || 0));
  const employeeCount = employees.filter((employee) => employee.userRole !== "manager").length;
  const cards = [
    ["Projects", projects.length, "blue"],
    ["Total Units", totalUnits.toLocaleString("en-IN"), "orange"],
    ["Units Sold", soldUnits.toLocaleString("en-IN"), "purple"],
    ["Employees", employeeCount.toLocaleString("en-IN"), "green"],
    ["Total Revenue", formatINR(stats.totalRevenue), "violet"]
  ];
  return <>
    <section className="manager-stats" aria-label="Manager overview">
      {cards.map(([label, value, color]) => <article className={`manager-stat ${color}`} key={label}><span>{label}</span><strong>{value}</strong></article>)}
    </section>
    <section className="manager-dashboard-grid">
      <article className="manager-card manager-projects-card">
        <div className="manager-card-heading"><h2>My Projects Overview</h2><button onClick={onProjects}>View All Projects</button></div>
        <div className="manager-table-wrap"><table><thead><tr><th>Project Name</th><th>Total Units</th><th>Sold Units</th><th>Available Units</th><th>Revenue</th></tr></thead>
          <tbody>{projects.slice(0, 5).map((project) => <tr key={project.id}><td>{project.name}</td><td>{project.totalUnits ?? 0}</td><td>{project.soldUnits ?? 0}</td><td>{project.availableUnits ?? 0}</td><td>{formatINR(project.currentValue)}</td></tr>)}
            {!projects.length && <tr><td colSpan="5" className="manager-empty">No projects are available.</td></tr>}</tbody></table></div>
      </article>
      <article className="manager-card manager-chart-card"><div className="manager-card-heading"><h2>Sales Trend</h2><span>₹ / month</span></div>
        {sales.length ? <div className="manager-bars" role="img" aria-label="Monthly sales overview">{sales.map((item) => <div className="manager-bar-item" key={item.month} title={`${item.month}: ${formatINR(item.sales)}`}><div className="manager-bar" style={{ height: `${Math.max(4, (Number(item.sales) / maxSales) * 100)}%` }} /><span>{item.month}</span></div>)}</div> : <p className="manager-empty">Sales trend data is not available.</p>}
      </article>
    </section>
    <section className="manager-card manager-project-list-card"><div className="manager-card-heading"><h2>Team Overview</h2><button onClick={onEmployees}>View Employees</button></div><p>{employeeCount.toLocaleString("en-IN")} employees are listed in the employee directory.</p></section>
    <ManagerQuickActions onProjects={onProjects} onEmployees={onEmployees} projects={projects} />
  </>;
}

function ManagerQuickActions({ onProjects, onEmployees, projects }) {
  const downloadReport = () => {
    const rows = [
      ["Project", "Total Units", "Sold Units", "Available Units", "Current Value"],
      ...projects.map((project) => [project.name, project.totalUnits ?? 0, project.soldUnits ?? 0, project.availableUnits ?? 0, project.currentValue ?? 0])
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "manager-project-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const actions = [
    ["⊞", "Add Project", onProjects],
    ["⌂", "Add Unit", onProjects],
    ["₹", "Update Price", onProjects],
    ["♙+", "Add Manager", onEmployees],
    ["♙+", "Create User", onEmployees],
    ["◖", "Send Notification", null],
    ["▤", "Generate Report", downloadReport]
  ];
  return <section className="manager-card manager-quick-actions">
    <div className="manager-card-heading"><h2>Quick Actions</h2></div>
    <div className="manager-actions-grid">
      {actions.map(([icon, label, action]) => <button key={label} type="button" className="manager-action" onClick={action || undefined} disabled={!action} title={!action ? "Notifications are not available in the current backend" : label}>
        <span className="manager-action-icon" aria-hidden="true">{icon}</span><span>{label}</span>
      </button>)}
    </div>
  </section>;
}

function ProfileSection({ employee, onPictureUpdated, onSave }) {
  return (
    <RoleProfile
      profile={employee}
      roleLabel="Manager"
      profileId={employee.employeeId || `EMP-${employee.id}`}
      summaryDetails={[
        { label: "Department", value: employee.department },
        { label: "Joining date", value: employee.joiningDate },
      ]}
      sections={getEmployeeProfileSections(employee)}
      picture={<ProfilePictureUpload employee={employee} onUploaded={onPictureUpdated} />}
      onSave={onSave}
    />
  );
}
