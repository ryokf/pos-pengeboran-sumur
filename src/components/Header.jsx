export default function Header({ setSidebarOpen, sidebarOpen }) {
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
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">POS Pengeboran Sumur</h1>
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

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </button>

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
