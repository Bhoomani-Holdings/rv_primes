import React from 'react';
import { Outlet } from 'react-router-dom';

export default function InvestorLayout() {
  return (
    <div className="investor-layout">
      <Outlet />
    </div>
  );
}
