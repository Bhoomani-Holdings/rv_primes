
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routesPath';

import PublicLayout from '../layouts/PublicLayout';
import InvestorLayout from '../layouts/InvestorLayout';
import AdminLayout from '../layouts/AdminLayout';

import Home from '../pages/public/home/Home';
import Projects from '../pages/public/Projects';
import Contact from '../pages/public/Contact';
import AboutUs from '../pages/public/about/AboutUs';

import InvestorDashboard from '../pages/investor/Dashboard';
import Wallet from '../pages/investor/Wallet';
import Earnings from '../pages/investor/Earnings';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminProjects from '../pages/admin/Projects';

import BasicInfo from '../pages/Registration/BasicInfo/BasicInfo';
import AddressInfo from '../pages/Registration/AddressInfo/AddressInfo';
import { KycDetails } from '../pages/Registration/KYCDetails/KycDetails';
import NomineeInfo from '../pages/Registration/NomineeInfo/NomineeInfo';
import { BankDetails } from '../pages/Registration/BankDetails/BankDetails';
import EarningPreference from '../pages/Registration/EarningPreference/EarningPreference';

function AppRoutes() {

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routesPath'

import PublicLayout from '../layouts/PublicLayout'
import InvestorLayout from '../layouts/InvestorLayout'
import AdminLayout from '../layouts/AdminLayout'

import Home from '../pages/public/home/Home'
import Projects from '../pages/public/Projects'
import Contact from '../pages/public/Contact'

import InvestorDashboard from '../pages/investor/Dashboard'
import Wallet from '../pages/investor/Wallet'
import Earnings from '../pages/investor/Earnings'

import AdminDashboard from '../pages/admin/Dashboard'
import AdminUsers from '../pages/admin/Users'
import AdminProjects from '../pages/admin/Projects'

import BasicInfo from '../pages/Registration/BasicInfo/BasicInfo'
import AddressInfo from '../pages/Registration/AddressInfo/AddressInfo'
import { KycDetails } from '../pages/Registration/KYCDetails/KycDetails'
import NomineeInfo from '../pages/Registration/NomineeInfo/NomineeInfo'
import { BankDetails } from '../pages/Registration/BankDetails/BankDetails'
import EarningPreference from '../pages/Registration/EarningPreference/EarningPreference'

function AppRoutes () {

  return (
    <Routes>
      {/* Redirect */}
      <Route path='/' element={<Navigate to={ROUTES.BASIC_INFO} />} />

      

      {/* Registration */}
      <Route path={ROUTES.BASIC_INFO} element={<BasicInfo />} />

      <Route path={ROUTES.ADDRESS_INFO} element={<AddressInfo />} />

      <Route path={ROUTES.KYC_DETAILS} element={<KycDetails />} />

      <Route path={ROUTES.NOMINEE_INFO} element={<NomineeInfo />} />

      <Route path={ROUTES.BANK_DETAILS} element={<BankDetails />} />

      <Route
        path={ROUTES.EARNING_PREFERENCES}
        element={<EarningPreference />}
      />

      {/* Public */}
      <Route path={ROUTES.HOME} element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.PROJECTS.slice(1)} element={<Projects />} />
        <Route path={ROUTES.CONTACT.slice(1)} element={<Contact />} />
      </Route>

      {/* Investor */}
      <Route path={ROUTES.INVESTOR} element={<InvestorLayout />}>
        <Route index element={<InvestorDashboard />} />

        <Route path='wallet' element={<Wallet />} />

        <Route path='earnings' element={<Earnings />} />
      </Route>

      {/* Admin */}
      <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />

        <Route path='users' element={<AdminUsers />} />

        <Route path='projects' element={<AdminProjects />} />
      </Route>
    </Routes>
  )
}
}

export default AppRoutes
