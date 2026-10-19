import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routesPath';

import PublicLayout from '../layouts/PublicLayout';
import Home from '../pages/public/home/Home';
import Projects from '../pages/public/Projects';
import Contact from '../pages/public/Contact';
import AboutUs from '../pages/public/about/AboutUs';
import Wallet from '../pages/investor/Wallet';
import Earnings from '../pages/investor/Earnings';

import AdminDashboard from '../pages/admin/AdminDashboard/admindashboard';

import BasicInfo from '../pages/Registration/BasicInfo/BasicInfo';
import AddressInfo from '../pages/Registration/AddressInfo/AddressInfo';
import { KycDetails } from '../pages/Registration/KYCDetails/KycDetails';
import NomineeInfo from '../pages/Registration/NomineeInfo/NomineeInfo';
import { BankDetails } from '../pages/Registration/BankDetails/BankDetails';
import EarningPreference from '../pages/Registration/EarningPreference/EarningPreference';
import Login from '../pages/public/Login';

function AppRoutes() {

  return (
    <Routes>

      {/* Registration */}
      <Route
        path={ROUTES.BASIC_INFO}
        element={<BasicInfo />}
      />

      <Route
        path={ROUTES.ADDRESS_INFO}
        element={<AddressInfo />}
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
        <Route
          path={ROUTES.PROJECTS.slice(1)}
          element={<Projects />}
        />
        <Route
          path={ROUTES.CONTACT.slice(1)}
          element={<Contact />}
        />
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
          path="wallet"
          element={<Wallet />}
        />

        <Route
          path="earnings"
          element={<Earnings />}
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
          path="kyc-approvals"
          element={<AdminDashboard initialPage="KYC Approvals" />}
        />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
