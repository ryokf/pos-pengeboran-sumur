import { Link, useLocation } from 'react-router-dom';

export default function BottomNavbar() {
    const location = useLocation();

    const menuItems = [
        { label: 'Dasbor', icon: '📊', path: '/' },
        { label: 'Pelanggan', icon: '👥', path: '/customers' },
        { label: 'Arus Kas', icon: '💰', path: '/finance/cash-flow' },
        { label: 'Tagihan', icon: '📋', path: '/finance/billing' },
        { label: 'Pengaturan', icon: '⚙️', path: '/settings' }
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="flex justify-around items-center h-16 px-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${ isActive(item.path)
                            ? 'text-blue-600'
                            : 'text-gray-600 hover:text-blue-500'
                            }`}
                    >
                        <span className="text-xl mb-1">{item.icon}</span>
                        <span className="text-xs font-medium truncate max-w-full px-1">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
