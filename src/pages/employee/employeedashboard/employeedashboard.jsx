import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiBell,
  FiBriefcase,
  FiCheckSquare,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiMessageCircle,
  FiUser,
  FiUsers,
  FiX,
  FiShield
} from "react-icons/fi";
import { ROUTES } from "../../../routes/routesPath";
import { getEmployees, updateEmployee } from "../../../services/employeeService";
import { getProjects } from "../../../services/dashboardService";
import { endStaffSession } from "../../../services/staffSupportService";
import { getUsers } from "../../../services/userService";
import ProfilePictureUpload from "../../../components/ProfilePictureUpload";
import RoleProfile, { getEmployeeProfileSections } from "../../../components/RoleProfile/RoleProfile";
import UsersPage from "../../admin/Users/Users";
import UserDetailsPage from "../../admin/Users/UserDetails";
import KycReviewPage from "../../admin/KycReview/KycReview";
import KycInvestorDetailsPage from "../../admin/KycReview/KycInvestorDetails";
import InvestorSupportRequests from "../../admin/Support/InvestorSupportRequests";
import StaffNotifications from "../../../components/StaffNotifications/StaffNotifications";
import UniversalSearch from "../../../components/UniversalSearch/UniversalSearch";
import useStaffNotifications from "../../../hooks/useStaffNotifications";
import "./employeedashboard.css";

const navigationItems = [
  { section: "dashboard", label: "Dashboard", icon: <FiGrid /> },
  { section: "kyc-approvals", label: "KYC Verification", icon: <FiShield /> },
  { section: "users", label: "Customers", icon: <FiUsers /> },
  { section: "tasks", label: "Tasks", icon: <FiCheckSquare /> },
  { section: "projects", label: "Projects", icon: <FiBriefcase /> },
  { section: "reports", label: "Reports", icon: <FiBarChart2 /> },
  { section: "support", label: "Support", icon: <FiMessageCircle /> },
  { section: "notifications", label: "Notifications", icon: <FiBell /> },
  { section: "profile", label: "Profile", icon: <FiUser /> }
];
const allowedSections = new Set(navigationItems.map((item) => item.section));

const kycDocumentFields = ["uploadpancard", "uploadaadhaar", "uploadaddressproof", "selfiephoto"];

const getKycDocumentCount = (user) =>
  kycDocumentFields.filter((field) => Boolean(user.kycDetails?.[field])).length;

const getKycStatus = (user) => {
  const status = String(user.kycStatus || user.kycDetails?.status || "").trim().toLowerCase();
  if (status === "accept" || status === "approved") return "Approved";
  if (status === "reject" || status === "rejected") return "Rejected";
  return "Pending";
};

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date)
    : "—";
};

const getInitials = (name) =>
  String(name || "Employee").trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [employee, setEmployee] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const staffNotifications = useStaffNotifications(employee);

  const employeePath = location.pathname.replace(/^\/employee\/dashboard\/?/, "").split("/").filter(Boolean);
  const section = employeePath[0] || "dashboard";
  const userId = section === "users" ? employeePath[1] : undefined;
  const kycUserId = section === "kyc-approvals" ? employeePath[1] : undefined;
  const isProfile = section === "profile";
  const isDashboardDataPage = ["users", "kyc-approvals", "profile", "notifications", "support", "tasks", "projects", "reports"].includes(section);
  const activeSection = section === "customers" ? "users" : section;

  useEffect(() => {
    try {
      const session = JSON.parse(sessionStorage.getItem("employeeSession") || "null");
      if (!session?.id) {
        navigate(ROUTES.EMPLOYEE_LOGIN, { replace: true });
      } else if (session.userRole === "manager") {
        navigate(ROUTES.MANAGER, { replace: true });
      } else if (session.userRole === "employee") {
        setEmployee(session);
      } else {
        sessionStorage.removeItem("employeeSession");
        navigate(ROUTES.EMPLOYEE_LOGIN, { replace: true });
      }
    } catch {
      sessionStorage.removeItem("employeeSession");
      navigate(ROUTES.EMPLOYEE_LOGIN, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!["dashboard", "projects", "reports"].includes(section)) return undefined;
    let active = true;
    setDashboardError("");
    Promise.all([getUsers(), getProjects()])
      .then(([users, projects]) => {
        if (active) setDashboardData({ users, projects });
      })
      .catch((error) => {
        if (active) setDashboardError(error.message || "Unable to load employee dashboard data.");
      });
    return () => { active = false; };
  }, [reloadKey, section]);

  useEffect(() => {
    if (!isProfile || !employee) return undefined;
    let active = true;
    getEmployees()
      .then((employees) => {
        if (active) setProfile(employees.find((item) => String(item.id) === String(employee.id)) || employee);
      })
      .catch((error) => {
        if (active) setProfileError(error.message || "Unable to load profile details.");
      });
    return () => { active = false; };
  }, [employee, isProfile]);

  useEffect(() => {
    if (!allowedSections.has(section)) navigate(ROUTES.EMPLOYEE_DASHBOARD, { replace: true });
  }, [navigate, section]);

  const handleLogout = async () => {
    try {
      if (employee?.accessToken) await endStaffSession(employee.accessToken);
    } catch (error) {
      console.error("Unable to revoke employee session:", error);
    } finally {
      sessionStorage.removeItem("employeeSession");
      navigate(ROUTES.EMPLOYEE_LOGIN, { replace: true });
    }
  };

  const goTo = (target) => {
    const paths = {
      dashboard: ROUTES.EMPLOYEE_DASHBOARD,
      "kyc-approvals": `${ROUTES.EMPLOYEE_DASHBOARD}/kyc-approvals`,
      users: `${ROUTES.EMPLOYEE_DASHBOARD}/users`,
      tasks: `${ROUTES.EMPLOYEE_DASHBOARD}/tasks`,
      projects: `${ROUTES.EMPLOYEE_DASHBOARD}/projects`,
      reports: `${ROUTES.EMPLOYEE_DASHBOARD}/reports`,
      support: `${ROUTES.EMPLOYEE_DASHBOARD}/support`,
      employees: `${ROUTES.EMPLOYEE_DASHBOARD}/employees`,
      notifications: `${ROUTES.EMPLOYEE_DASHBOARD}/notifications`,
      profile: `${ROUTES.EMPLOYEE_DASHBOARD}/profile`
    };
    setMobileMenuOpen(false);
    navigate(paths[target] || (target.startsWith("kyc-approvals/") ? `${ROUTES.EMPLOYEE_DASHBOARD}/${target}` : ROUTES.EMPLOYEE_DASHBOARD));
  };

  const handleProfileSave = async (values) => {
    const updates = Object.fromEntries(
      Object.entries(values).filter(([field, value]) =>
        value.trim() && value.trim() !== String(profile?.[field] || "")
      )
    );
    if (Object.keys(updates).length === 0) {
      throw new Error("Enter a new profile value before saving.");
    }

    const updatedEmployee = await updateEmployee(employee.id, updates);
    setProfile(updatedEmployee);
    setEmployee((current) => ({ ...current, ...updatedEmployee }));
    sessionStorage.setItem("employeeSession", JSON.stringify({ ...employee, ...updatedEmployee }));
    return updatedEmployee;
  };

  if (!employee) return null;

  const dashboardContent = dashboardError ? (
    <div className="employee-dashboard-state employee-dashboard-state--error" role="alert">
      <p>{dashboardError}</p>
      <button type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>
    </div>
  ) : !dashboardData ? (
    <div className="employee-dashboard-state" role="status">Loading dashboard data…</div>
  ) : (
    <DashboardHome
      data={dashboardData}
      onNavigate={goTo}
    />
  );

  return (
    <div className="employee-dashboard-layout">
      <aside className={`employee-dashboard-sidebar${mobileMenuOpen ? " employee-dashboard-sidebar--open" : ""}`}>
        <div className="employee-dashboard-brand">
          <strong>RV</strong>
          <span>PRIME ASSETS</span>
          <button type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
            <FiX aria-hidden="true" />
          </button>
        </div>
        <nav className="employee-dashboard-navigation" aria-label="Employee navigation">
          {navigationItems.map((item) => (
            <button
              className={activeSection === item.section ? "active" : ""}
              key={item.section}
              type="button"
              onClick={() => goTo(item.section)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.section === "notifications" && staffNotifications.unreadCount > 0 && (
                <span className="employee-dashboard-notification-count">
                  {staffNotifications.unreadCount > 99 ? "99+" : staffNotifications.unreadCount}
                </span>
              )}
            </button>
          ))}
          <button className="employee-dashboard-logout" type="button" onClick={handleLogout}>
            <FiLogOut aria-hidden="true" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      {mobileMenuOpen && (
        <button
          className="employee-dashboard-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div className="employee-dashboard-main">
        <header className="employee-dashboard-header">
          <button
            className="employee-dashboard-menu-toggle"
            type="button"
            aria-label="Open navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu aria-hidden="true" />
          </button>
          <UniversalSearch role="employee" />
          <div className="employee-dashboard-header-actions">
            <button className="employee-dashboard-user" type="button" onClick={() => goTo("profile")}>
              <span>Welcome, {employee.fullName || "Employee"}</span>
              <strong>{getInitials(employee.fullName)}</strong>
            </button>
            <button
              className="employee-dashboard-notification-bell"
              type="button"
              onClick={() => goTo("notifications")}
              aria-label={staffNotifications.unreadCount > 0 ? `Notifications, ${staffNotifications.unreadCount} unread` : "Notifications"}
            >
              <FiBell aria-hidden="true" />
              {staffNotifications.unreadCount > 0 && <span>{staffNotifications.unreadCount > 99 ? "99+" : staffNotifications.unreadCount}</span>}
            </button>
          </div>
        </header>
        <main className={`employee-dashboard-content${isDashboardDataPage ? " employee-dashboard-content--section" : ""}`}>
          {section === "dashboard" ? dashboardContent :
          section === "kyc-approvals" ? kycUserId
            ? <KycInvestorDetailsPage userId={kycUserId} basePath={`${ROUTES.EMPLOYEE_DASHBOARD}/kyc-approvals`} />
            : <KycReviewPage basePath={`${ROUTES.EMPLOYEE_DASHBOARD}/kyc-approvals`} /> :
          section === "users" ? userId
            ? <UserDetailsPage userId={userId} basePath={`${ROUTES.EMPLOYEE_DASHBOARD}/users`} />
            : <UsersPage basePath={`${ROUTES.EMPLOYEE_DASHBOARD}/users`} /> :
          section === "support" ? <InvestorSupportRequests staffRole="employee" /> :
          section === "profile" ? profileError
            ? <p className="employee-dashboard-error" role="alert">{profileError}</p>
            : !profile
              ? <div className="employee-dashboard-state" role="status">Loading profile…</div>
              : <RoleProfile
                profile={profile}
                roleLabel="Employee"
                profileId={profile.employeeId || `EMP-${profile.id}`}
                summaryDetails={[
                  { label: "Department", value: profile.department },
                  { label: "Joining date", value: profile.joiningDate }
                ]}
                sections={getEmployeeProfileSections(profile)}
                picture={<ProfilePictureUpload employee={profile} onUploaded={(profilePicture) => {
                  setProfile((current) => ({ ...current, profilePicture }));
                  setEmployee((current) => ({ ...current, profilePicture }));
                  sessionStorage.setItem("employeeSession", JSON.stringify({ ...employee, profilePicture }));
                }} />}
                onSave={handleProfileSave}
              /> :
          section === "projects" ? dashboardError
            ? <div className="employee-dashboard-state employee-dashboard-state--error" role="alert">{dashboardError}</div>
            : !dashboardData
              ? <div className="employee-dashboard-state" role="status">Loading projects…</div>
              : <ProjectsList projects={dashboardData.projects} /> :
          section === "reports" ? dashboardError
            ? <div className="employee-dashboard-state employee-dashboard-state--error" role="alert">{dashboardError}</div>
            : !dashboardData
              ? <div className="employee-dashboard-state" role="status">Loading report data…</div>
              : <ReportsOverview data={dashboardData} /> :
          section === "tasks" ? <EmptySection title="Tasks" message="Task information is not available in the connected backend." /> :
          section === "notifications" ? <StaffNotifications {...staffNotifications} onMarkAllRead={staffNotifications.markAllRead} /> :
          null}
        </main>
      </div>
    </div>
  );
}

function DashboardHome({ data, onNavigate }) {
  const kycEntries = data.users
    .map((user) => ({ user, documentCount: getKycDocumentCount(user), status: getKycStatus(user) }))
    .filter((entry) => entry.documentCount > 0)
    .sort((first, second) => Date.parse(second.user.kycDetails?.submittedAt || "") - Date.parse(first.user.kycDetails?.submittedAt || ""));
  const stats = [
    { title: "Pending KYC", value: kycEntries.filter((entry) => entry.status === "Pending").length, tone: "amber" },
    { title: "Approved KYC", value: kycEntries.filter((entry) => entry.status === "Approved").length, tone: "green" },
    { title: "Rejected KYC", value: kycEntries.filter((entry) => entry.status === "Rejected").length, tone: "rose" },
    { title: "Assigned Tasks", value: "—", tone: "purple" }
  ];

  return (
    <div className="employee-dashboard-overview">
      <section className="employee-dashboard-stats" aria-label="Employee overview">
        {stats.map((stat) => (
          <article className={`employee-dashboard-stat employee-dashboard-stat--${stat.tone}`} key={stat.title}>
            <span>{stat.title}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="employee-dashboard-panel employee-dashboard-kyc-queue">
        <div className="employee-dashboard-panel-heading">
          <h2>KYC Verification Queue</h2>
          <button type="button" onClick={() => onNavigate("kyc-approvals")}>View All</button>
        </div>
        <div className="employee-dashboard-table-wrap">
          <table>
            <thead>
              <tr><th>Customer Name</th><th>Submitted On</th><th>Documents</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {kycEntries.slice(0, 5).map(({ user, documentCount, status }) => (
                <tr key={user.id}>
                  <td>{user.fullName || "—"}</td>
                  <td>{formatDate(user.kycDetails?.submittedAt)}</td>
                  <td>{documentCount}/{kycDocumentFields.length}</td>
                  <td><span className={`employee-dashboard-status employee-dashboard-status--${status.toLowerCase()}`}>{status}</span></td>
                  <td><button className="employee-dashboard-review" type="button" onClick={() => onNavigate(`kyc-approvals/${user.id}`)}>Review</button></td>
                </tr>
              ))}
              {kycEntries.length === 0 && (
                <tr><td className="employee-dashboard-empty" colSpan="5">No KYC submissions are available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="employee-dashboard-panels">
        <section className="employee-dashboard-panel">
          <div className="employee-dashboard-panel-heading">
            <h2>My Tasks</h2>
            <button type="button" onClick={() => onNavigate("tasks")}>View All Tasks</button>
          </div>
          <p className="employee-dashboard-empty">Task information is not available in the connected backend.</p>
        </section>
        <CustomerOverview users={data.users} onViewAll={() => onNavigate("users")} />
      </div>

      <section className="employee-dashboard-panel employee-dashboard-activity">
        <div className="employee-dashboard-panel-heading"><h2>Recent Activity</h2></div>
        <p className="employee-dashboard-empty">No recent employee activity is available.</p>
      </section>
    </div>
  );
}

function CustomerOverview({ users, onViewAll }) {
  const segments = [
    { label: "Approved", count: users.filter((user) => getKycStatus(user) === "Approved").length, color: "#34a879" },
    { label: "Pending", count: users.filter((user) => getKycStatus(user) === "Pending").length, color: "#f2ae45" },
    { label: "Rejected", count: users.filter((user) => getKycStatus(user) === "Rejected").length, color: "#e56f78" }
  ];
  const total = users.length;
  let progress = 0;
  const gradient = total
    ? `conic-gradient(${segments.map((segment) => {
      const start = progress;
      progress += (segment.count / total) * 100;
      return `${segment.color} ${start}% ${progress}%`;
    }).join(", ")})`
    : "conic-gradient(#e7ecf4 0 100%)";

  return (
    <section className="employee-dashboard-panel employee-dashboard-customer-overview">
      <div className="employee-dashboard-panel-heading">
        <h2>Customer Overview</h2>
        <button type="button" onClick={onViewAll}>View All Customers</button>
      </div>
      <div className="employee-dashboard-customer-content">
        <div className="employee-dashboard-donut" style={{ background: gradient }}>
          <div><strong>{total}</strong><span>Customers</span></div>
        </div>
        <ul className="employee-dashboard-legend">
          {segments.map((segment) => (
            <li key={segment.label}>
              <span><i style={{ backgroundColor: segment.color }} />{segment.label}</span>
              <strong>{segment.count}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectsList({ projects }) {
  return (
    <section className="employee-dashboard-panel employee-dashboard-section-panel">
      <div className="employee-dashboard-panel-heading"><h2>Projects</h2></div>
      <div className="employee-dashboard-table-wrap">
        <table>
          <thead><tr><th>Project</th><th>Location</th><th>Total Units</th><th>Available Units</th><th>Status</th></tr></thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name || "—"}</td>
                <td>{project.city || project.location || "—"}</td>
                <td>{project.totalUnits ?? "—"}</td>
                <td>{project.availableUnits ?? "—"}</td>
                <td>{project.status || "—"}</td>
              </tr>
            ))}
            {projects.length === 0 && <tr><td className="employee-dashboard-empty" colSpan="5">No projects are available.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ReportsOverview({ data }) {
  const rows = [
    ["Customers", data.users.length],
    ["Projects", data.projects.length],
    ["KYC submissions", data.users.filter((user) => getKycDocumentCount(user) > 0).length]
  ];
  const downloadReport = () => {
    const csv = [["Metric", "Value"], ...rows].map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "employee-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="employee-dashboard-panel employee-dashboard-section-panel">
      <div className="employee-dashboard-panel-heading">
        <h2>Reports</h2>
        <button type="button" onClick={downloadReport}>Download Summary</button>
      </div>
      <div className="employee-dashboard-report-list">
        {rows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
    </section>
  );
}

function EmptySection({ title, message }) {
  return (
    <section className="employee-dashboard-panel employee-dashboard-section-panel">
      <div className="employee-dashboard-panel-heading"><h2>{title}</h2></div>
      <p className="employee-dashboard-empty">{message}</p>
    </section>
  );
}
