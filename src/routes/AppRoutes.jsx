import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="/investor" element={<InvestorLayout />}>
        <Route index element={<InvestorDashboard />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="earnings" element={<Earnings />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="projects" element={<AdminProjects />} />
      </Route>
    </Routes>
  );
}
