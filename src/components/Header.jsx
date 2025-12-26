import { useState } from 'react';

export default function Header({ setSidebarOpen, sidebarOpen }) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample notifications data
  const notifications = [
    { id: 1, message: 'Pelanggan 1 memiliki hutang 25.000.000', type: 'debt', time: '2 jam yang lalu' },
    { id: 2, message: 'Pompa masjid berhenti beroperasi', type: 'alert', time: '30 menit yang lalu' },
    { id: 3, message: 'Keluhan baru: Air mati di RT 02', type: 'complaint', time: '15 menit yang lalu' }
  ];

  return (
    <header className="bg-white shadow-md px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Hamburger button - only visible on desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">Sistem Kelola Tagihan Air</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent ml-2 outline-none w-48"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{notifications.length}</span>
          </button>

          {/* Dropdown Menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notifikasi Terbaru</h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                          notif.type === 'debt' ? 'bg-red-500' :
                          notif.type === 'alert' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 font-medium">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                        <div className={`text-lg ${
                          notif.type === 'debt' ? '⚠️' :
                          notif.type === 'alert' ? '🚨' :
                          '📢'
                        }`}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-sm">Tidak ada notifikasi</p>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-100 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Lihat Semua Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            AH
          </div>
          <div className="hidden md:block">
            <p className="font-medium text-gray-800">Ahmad Hidayat</p>
            <p className="text-xs text-gray-500">Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
