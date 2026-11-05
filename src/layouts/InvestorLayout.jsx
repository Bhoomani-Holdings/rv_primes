import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../routes/routesPath';

export default function InvestorLayout() {
  const { pathname } = useLocation();
  let investor = null;

  try {
    investor = JSON.parse(sessionStorage.getItem('investorSession') || 'null');
  } catch {
    investor = null;
  }

  if (!investor) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const status = String(investor.kycStatus || 'Not Submitted').trim().toLowerCase();
  const kycApproved = status === 'approved' || status === 'accept';
  const isKycStatusPage = pathname === ROUTES.INVESTOR_KYC_APPROVALS;

  if (!kycApproved && !isKycStatusPage) {
    return <Navigate to={ROUTES.INVESTOR_KYC_APPROVALS} replace />;
  }

  return (
    <div className="investor-layout">
      <Outlet />
    </div>
  );
}
