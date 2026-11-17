import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from './routesPath';

import PublicLayout from '../layouts/PublicLayout';
import InvestorLayout from '../layouts/InvestorLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/public/home/Home';
import Projects from '../pages/public/Projects';
import AboutUs from '../pages/public/about/AboutUs';
import PublicInfoPage from '../pages/public/publicinfo/PublicInfoPage';
import Sitemap from '../pages/public/sitemap/Sitemap';
import LegalPage from '../pages/public/legal/LegalPage';
import Careers from '../pages/public/careers/careers';
import {
  InvestorDocumentsPage,
  InvestorNotificationsPage,
  InvestorSupportPage,
  InvestorTransactionsPage,
  InvestorWithdrawalsPage
} from '../pages/investor/InvestorPortalPages';
import InvestorInvestments from '../pages/investor/InvestorInvestments';
import Wallet from '../pages/investor/Wallet';
import Earnings from '../pages/investor/Earnings';
import InvestorDashboard from '../pages/investor/investordashboard/investordashboard';
import InvestorProfile from '../pages/investor/InvestorProfile';
import InvestorKycApprovals from '../pages/investor/kycapproval/KycApprovals';

import AdminDashboard from '../pages/admin/AdminDashboard/admindashboard';

import BasicInfo from '../pages/Registration/BasicInfo/BasicInfo';
import { KycDetails } from '../pages/Registration/KYCDetails/KycDetails';
import NomineeInfo from '../pages/Registration/NomineeInfo/NomineeInfo';
import { BankDetails } from '../pages/Registration/BankDetails/BankDetails';
import EarningPreference from '../pages/Registration/EarningPreference/EarningPreference';
import Login from '../pages/public/login/login';
import EmployeeLogin from '../pages/employee/EmployeeLogin';
import EmployeeDashboard from '../pages/employee/employeedashboard/employeedashboard';
import ManagerDashboard from '../pages/manager/managerdashboard/ManagerDashboard';

function AppRoutes() {
  const { pathname } = useLocation();

  useEffect(() => {
    const preventWheelNumberChange = (event) => {
      const input = event.target;
      if (input instanceof HTMLInputElement && input.type === 'number' && document.activeElement === input) {
        event.preventDefault();
        input.blur();
      }
    };

    document.addEventListener('wheel', preventWheelNumberChange, { capture: true, passive: false });
    return () => document.removeEventListener('wheel', preventWheelNumberChange, true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>

      {/* Registration */}
      <Route
        path={ROUTES.BASIC_INFO}
        element={<BasicInfo />}
      />

      <Route
        path={ROUTES.ADDRESS_INFO}
        element={<Navigate to={ROUTES.BASIC_INFO} replace />}
      />

      <Route
        path={ROUTES.KYC_DETAILS}
        element={<KycDetails />}
      />

      <Route
        path={ROUTES.NOMINEE_INFO}
        element={<NomineeInfo />}
      />

      <Route
        path={ROUTES.BANK_DETAILS}
        element={<BankDetails />}
      />

      <Route
        path={ROUTES.EARNING_PREFERENCES}
        element={<EarningPreference />}
      />

      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.EMPLOYEE_LOGIN} element={<EmployeeLogin />} />
      <Route path={`${ROUTES.EMPLOYEE_DASHBOARD}/*`} element={<EmployeeDashboard />} />
      <Route path={`${ROUTES.MANAGER}/*`} element={<ManagerDashboard />} />
      <Route
        path={ROUTES.SIGNUP}
        element={<Navigate to={ROUTES.BASIC_INFO} replace />}
      />

      {/* Public */}
      <Route
        path={ROUTES.HOME}
        element={<PublicLayout />}
      >
      <Route
        path={ROUTES.ABOUT_US}
        element={<AboutUs />} />
       
        <Route index element={<Home />} />
        <Route path={ROUTES.OUR_BUSINESS.slice(1)} element={<PublicInfoPage />} />
        <Route path={ROUTES.OUR_TEAM.slice(1)} element={<PublicInfoPage />} />
        <Route path={ROUTES.NEWS_AND_UPDATES.slice(1)} element={<PublicInfoPage />} />
        <Route path={ROUTES.INVESTORS.slice(1)} element={<PublicInfoPage />} />
        <Route path={ROUTES.CAREERS.slice(1)} element={<Careers />} />
        <Route path={ROUTES.INVESTOR_OPPORTUNITIES.slice(1)} element={<PublicInfoPage />} />
        <Route path={ROUTES.HOW_IT_WORKS.slice(1)} element={<PublicInfoPage />} />
        <Route path={ROUTES.REFUND_POLICY.slice(1)} element={<PublicInfoPage />} />
        <Route path={ROUTES.FAQS.slice(1)} element={<PublicInfoPage />} />
        <Route path={ROUTES.DOCUMENTS.slice(1)} element={<PublicInfoPage />} />
        <Route path={ROUTES.SITEMAP.slice(1)} element={<Sitemap />} />
        <Route path={ROUTES.PRIVACY_POLICY.slice(1)} element={<LegalPage />} />
        <Route path={ROUTES.KYC_POLICY.slice(1)} element={<LegalPage />} />
        <Route path={ROUTES.DISCLAIMER.slice(1)} element={<LegalPage />} />
        <Route path={ROUTES.TERMS_AND_CONDITIONS.slice(1)} element={<LegalPage />} />
        <Route path={ROUTES.TERMS_OF_USE.slice(1)} element={<LegalPage />} />
        <Route
          path={ROUTES.PROJECTS.slice(1)}
          element={<Projects />}
        />
        <Route path={ROUTES.CONTACT.slice(1)} element={<PublicInfoPage />} />
      </Route>

      {/* Investor */}
      <Route
        path={ROUTES.INVESTOR}
        element={<InvestorLayout />}
      >
        <Route
          index
          element={<InvestorDashboard />}
        />

        <Route
          path="investments"
          element={<InvestorInvestments />}
        />

        <Route
          path="projects"
          element={<InvestorDashboard projectOnly />}
        />

        <Route
          path="profile"
          element={<InvestorProfile />}
        />

        <Route
          path="wallet"
          element={<Wallet />}
        />

        <Route
          path="earnings"
          element={<Earnings />}
        />

        <Route
          path="withdrawals"
          element={<InvestorWithdrawalsPage />}
        />

        <Route
          path="transactions"
          element={<InvestorTransactionsPage />}
        />

        <Route
          path="documents"
          element={<InvestorDocumentsPage />}
        />

        <Route
          path="notifications"
          element={<InvestorNotificationsPage />}
        />

        <Route
          path="support"
          element={<InvestorSupportPage />}
        />

        <Route
          path="kyc-approvals"
          element={<InvestorKycApprovals />}
        />

      </Route>

      {/* Admin */}
      <Route
        path={ROUTES.ADMIN}
        element={<AdminLayout />}
      >
        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="admindashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="projects"
          element={<AdminDashboard initialPage="Projects" />}
        />

        <Route
          path="projects/new"
          element={<AdminDashboard initialPage="Add Project" />}
        />

        <Route
          path="projects/:projectId"
          element={<AdminDashboard initialPage="Edit Project" />}
        />

        <Route
          path="users"
          element={<AdminDashboard initialPage="Users" />}
        />

        <Route
          path="users/:userId"
          element={<AdminDashboard initialPage="User Details" />}
        />

        <Route
          path="employees/new"
          element={<AdminDashboard initialPage="Add Employee" />}
        />

        <Route
          path="employees/:employeeId"
          element={<AdminDashboard initialPage="Employee Details" />}
        />

        <Route
          path="employees"
          element={<AdminDashboard initialPage="Employees" />}
        />

        <Route
          path="careers"
          element={<AdminDashboard initialPage="Careers" />}
        />

        <Route
          path="careers/:careerId/applicants"
          element={<AdminDashboard initialPage="Career Applicants" />}
        />

        <Route
          path="kyc-approvals"
          element={<AdminDashboard initialPage="KYC Approvals" />}
        />

        <Route
          path="kyc-approvals/:userId"
          element={<AdminDashboard initialPage="KYC Investor Details" />}
        />

        <Route
          path="settings"
          element={<AdminDashboard initialPage="Settings" />}
        />

        <Route
          path="support"
          element={<AdminDashboard initialPage="Support" />}
        />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
