import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import InvestorLayout from '../layouts/InvestorLayout';
import AdminLayout from '../layouts/AdminLayout';

import Home from '../pages/public/Home';
import Projects from '../pages/public/Projects';
import Contact from '../pages/public/Contact';

import InvestorDashboard from '../pages/investor/Dashboard';
import Wallet from '../pages/investor/Wallet';
import Earnings from '../pages/investor/Earnings';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminProjects from '../pages/admin/Projects';

import BasicInfo from '../pages/Registration/BasicInfo/BasicInfo';
import { BankDetails } from '../pages/Registration/BankDetails/BankDetails';
import { KycDetails } from '../pages/Registration/KYCDetails/KycDetails';
// import BankDetails from '../pages/Registration/BankDetails/BankDetails';

import AddressInfo from '../pages/Registration/AddressInfo/AddressInfo';
import EarningPreference from '../pages/Registration/EarningPreference/EarningPreference';

function AppRoutes() {
  return (
    <Routes>

      {/* Redirect */}
      <Route
        path="/"
        element={<Navigate to="/basic_details" />}
      />

      {/* Registration Routes */}
      <Route
        path="/basic_details"
        element={<BasicInfo />}
      />

      
      <Route
        path="/bank_details"
        element={<BankDetails />}
      />
      <Route path='/kyc_details' element={<KycDetails/>}/>
     
     <Route path="/address_info" element={<AddressInfo/>}/>
     <Route path="/earning_preferences" element={<EarningPreference/>}/>

      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Investor Routes */}
      <Route path="/investor" element={<InvestorLayout />}>
        <Route index element={<InvestorDashboard />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="earnings" element={<Earnings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="projects" element={<AdminProjects />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;