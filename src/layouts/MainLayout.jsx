import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BottomNavbar from '../components/BottomNavbar';
import { useState } from 'react';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="no-print">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="no-print">
          <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        </div>
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>
        <div className="no-print">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
}
