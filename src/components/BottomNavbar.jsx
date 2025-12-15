import { Link } from 'react-router-dom';
import { MENU_ITEMS } from '../utils';
import { useNavigation } from '../hooks/useNavigation';

export default function BottomNavbar() {
    const { isActive } = useNavigation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="flex justify-around items-center h-16 px-2">
                {MENU_ITEMS.map((item) => (
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
