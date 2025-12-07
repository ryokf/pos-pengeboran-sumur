import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ open, setOpen }) {
    const location = useLocation();

    const menuItems = [
        { label: 'Dashboard', icon: '📊', path: '/' },
        { label: 'Orders', icon: '📦', path: '/orders' },
        { label: 'Customers', icon: '👥', path: '/customers' },
        { label: 'Arus Kas', icon: '💰', path: '/finance/cash-flow' },
        { label: 'Tagihan', icon: '📋', path: '/finance/billing' },
        { label: 'Employees', icon: '👨‍💼', path: '/employees' },
        { label: 'Reports', icon: '📈', path: '/reports' },
        { label: 'Settings', icon: '⚙️', path: '/settings' }
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Sidebar */}
            <div
                className={`${ open ? 'w-64' : 'w-20'
                    } bg-gray-900 text-white transition-all duration-300 ease-in-out shadow-lg overflow-y-auto`}
            >
                {/* Logo */}
                <div className="p-4 flex items-center justify-between">
                    <div className={`${ open ? 'flex items-center gap-2' : '' }`}>
                        <div className="text-2xl font-bold">⛏️</div>
                        {open && <span className="text-lg font-bold">POS BOR</span>}
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="mt-8 px-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${ isActive(item.path)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                                }`}
                            title={!open ? item.label : ''}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {open && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
}
