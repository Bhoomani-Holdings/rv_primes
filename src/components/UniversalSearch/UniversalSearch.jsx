import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { getProjects } from "../../services/dashboardService";
import { getUsers } from "../../services/userService";
import { getEmployees } from "../../services/employeeService";
import "./UniversalSearch.css";

const pagesByRole = {
  admin: [
    ["Dashboard", "/admin/admindashboard"], ["Projects", "/admin/projects"], ["Users", "/admin/users"],
    ["Employees", "/admin/employees"], ["Careers", "/admin/careers"], ["KYC Approvals", "/admin/kyc-approvals"],
    ["Notifications", "/admin/notifications"], ["Settings", "/admin/settings"], ["Support", "/admin/support"]
  ],
  manager: [
    ["Dashboard", "/manager"], ["Projects", "/manager/projects"], ["Users", "/manager/users"],
    ["Employees", "/manager/employees"], ["Careers", "/manager/careers"], ["KYC Approvals", "/manager/kyc-approvals"],
    ["Notifications", "/manager/notifications"], ["Profile", "/manager/profile"], ["Support", "/manager/support"]
  ],
  employee: [
    ["Dashboard", "/employee/dashboard"], ["Projects", "/employee/dashboard/projects"], ["Customers", "/employee/dashboard/users"],
    ["KYC Verification", "/employee/dashboard/kyc-approvals"], ["Tasks", "/employee/dashboard/tasks"], ["Reports", "/employee/dashboard/reports"],
    ["Support", "/employee/dashboard/support"], ["Notifications", "/employee/dashboard/notifications"], ["Profile", "/employee/dashboard/profile"]
  ],
  investor: [
    ["Dashboard", "/investor"], ["Projects", "/investor/projects"], ["My Investments", "/investor/investments"],
    ["Earnings", "/investor/earnings"], ["Wallet", "/investor/wallet"], ["Withdrawals", "/investor/withdrawals"],
    ["Transactions", "/investor/transactions"], ["Documents", "/investor/documents"], ["KYC Approval Status", "/investor/kyc-approvals"],
    ["Support", "/investor/support"], ["Notifications", "/investor/notifications"], ["Profile", "/investor/profile"]
  ]
};

const recordText = (record) => Object.values(record || {}).filter((value) => ["string", "number"].includes(typeof value)).join(" ").toLowerCase();
const displayName = (user) => user.fullName || [user.firstname, user.lastname].filter(Boolean).join(" ") || user.name || user.email;

export default function UniversalSearch({ role = "admin" }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [records, setRecords] = useState({ projects: [], users: [], employees: [] });

  useEffect(() => {
    let current = true;
    const canSearchPeople = role !== "investor";
    const canSearchEmployees = ["admin", "manager"].includes(role);
    const requests = [
      getProjects().catch(() => []),
      canSearchPeople ? getUsers().catch(() => []) : Promise.resolve([]),
      canSearchEmployees ? getEmployees().catch(() => []) : Promise.resolve([])
    ];
    Promise.all(requests).then(([projects, users, employees]) => {
      if (current) setRecords({ projects, users, employees });
    });
    return () => { current = false; };
  }, [role]);

  useEffect(() => {
    const closeOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    const pages = (pagesByRole[role] || pagesByRole.admin)
      .filter(([label, path]) => `${label} ${path}`.toLowerCase().includes(term))
      .map(([label, path]) => ({ label, detail: "Page", path, group: "Pages" }));
    const projects = records.projects.filter((item) => recordText(item).includes(term)).slice(0, 4).map((item) => ({
      label: item.projectName || item.name || "Project", detail: "Project", path: role === "admin" ? `/admin/projects/${item.id}` : role === "manager" ? `/manager/projects/${item.id}` : role === "employee" ? "/employee/dashboard/projects" : "/investor/projects", group: "Projects"
    }));
    const users = role === "investor" ? [] : records.users.filter((item) => recordText(item).includes(term)).slice(0, 4).map((item) => ({
      label: displayName(item), detail: item.email || "Investor", path: role === "employee" ? `/employee/dashboard/users/${item.id}` : role === "manager" ? `/manager/users/${item.id}` : `/admin/users/${item.id}`, group: "Investors"
    }));
    const employees = ["admin", "manager"].includes(role) ? records.employees.filter((item) => recordText(item).includes(term)).slice(0, 4).map((item) => ({
      label: displayName(item), detail: item.email || item.employeeId || "Employee", path: role === "manager" ? `/manager/employees/${item.id}` : `/admin/employees/${item.id}`, group: "Employees"
    })) : [];
    return [...pages, ...projects, ...users, ...employees].slice(0, 10);
  }, [query, records, role]);

  const choose = (result) => {
    navigate(result.path);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") { setOpen(false); return; }
    if (event.key === "ArrowDown" && results.length) { event.preventDefault(); setActiveIndex((index) => (index + 1) % results.length); }
    if (event.key === "ArrowUp" && results.length) { event.preventDefault(); setActiveIndex((index) => (index - 1 + results.length) % results.length); }
    if (event.key === "Enter" && results[activeIndex]) { event.preventDefault(); choose(results[activeIndex]); }
  };

  return (
    <div className="universal-search" ref={wrapperRef}>
      <FiSearch className="universal-search-icon" aria-hidden="true" />
      <input
        type="search"
        value={query}
        placeholder="Search pages, projects, people..."
        aria-label="Search pages, projects, and people"
        aria-expanded={open && query.trim().length >= 2}
        aria-controls="universal-search-results"
        onFocus={() => setOpen(true)}
        onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); setOpen(true); }}
        onKeyDown={onKeyDown}
      />
      {query && <button type="button" className="universal-search-clear" aria-label="Clear search" onClick={() => setQuery("")}><FiX /></button>}
      {open && query.trim().length >= 2 && (
        <div className="universal-search-results" id="universal-search-results" role="listbox">
          {results.length ? results.map((result, index) => (
            <button key={`${result.group}-${result.path}-${result.label}-${index}`} type="button" role="option" aria-selected={index === activeIndex} className={`universal-search-result${index === activeIndex ? " is-active" : ""}`} onMouseEnter={() => setActiveIndex(index)} onClick={() => choose(result)}>
              <span><strong>{result.label}</strong><small>{result.detail}</small></span><em>{result.group}</em>
            </button>
          )) : <div className="universal-search-empty">No matching pages or records found.</div>}
        </div>
      )}
    </div>
  );
}
