import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MENU_ITEMS } from '../utils';
import { useNavigation } from '../hooks/useNavigation';

// Show first 4 items directly, rest go into "More" menu
const VISIBLE_COUNT = 4;

export default function BottomNavbar() {
    const { isActive } = useNavigation();
    const [showMore, setShowMore] = useState(false);
    const moreMenuRef = useRef(null);

    const visibleItems = MENU_ITEMS.slice(0, VISIBLE_COUNT);
    const overflowItems = MENU_ITEMS.slice(VISIBLE_COUNT);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
                setShowMore(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check if any overflow item is active
    const isOverflowActive = overflowItems.some(item => isActive(item.path));

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="flex justify-around items-center h-16 px-1">
                {visibleItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 transition-colors ${ isActive(item.path)
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-blue-500'
                            }`}
                    >
                        <span className="text-xl mb-0.5">{item.icon}</span>
                        <span className="text-[10px] font-medium truncate max-w-full px-0.5 leading-tight">
                            {item.label}
                        </span>
                    </Link>
                ))}

                {/* "More" button */}
                {overflowItems.length > 0 && (
                    <div className="relative flex-1 flex items-center justify-center h-full" ref={moreMenuRef}>
                        <button
                            onClick={() => setShowMore(!showMore)}
                            className={`flex flex-col items-center justify-center w-full h-full min-w-0 transition-colors ${ isOverflowActive
                                ? 'text-blue-600'
                                : 'text-gray-500 hover:text-blue-500'
                                }`}
                        >
                            <span className="text-xl mb-0.5">⋯</span>
                            <span className="text-[10px] font-medium leading-tight">Lainnya</span>
                        </button>

                        {/* Popup Menu */}
                        {showMore && (
                            <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                                {overflowItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setShowMore(false)}
                                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${ isActive(item.path)
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
