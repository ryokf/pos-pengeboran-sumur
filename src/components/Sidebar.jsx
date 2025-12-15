import { Link } from 'react-router-dom';
import { MENU_ITEMS } from '../utils';
import { useNavigation } from '../hooks/useNavigation';

export default function Sidebar({ open }) {
    const { isActive } = useNavigation();

    return (
        <>
            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <div
                className={`hidden md:block ${ open ? 'w-64' : 'w-20'
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
                    {MENU_ITEMS.map((item) => (
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
        </>
    );
}
