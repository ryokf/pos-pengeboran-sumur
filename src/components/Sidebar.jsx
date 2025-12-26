import { Link } from 'react-router-dom';
import { MENU_ITEMS } from '../utils';
import { useNavigation } from '../hooks/useNavigation';

export default function Sidebar({ open }) {
    const { isActive } = useNavigation();

    return (
        <>
            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <div
                className={`hidden md:flex md:flex-col h-screen ${ open ? 'w-64' : 'w-20'
                    } bg-linear-to-b from-gray-900 via-gray-900 to-gray-950 text-white transition-all duration-300 ease-in-out shadow-2xl border-r border-gray-800`}
            >
                {/* Logo Section */}
                <div className={`p-6 ${ open ? 'px-6' : 'px-4' } border-b border-gray-800`}>
                    <div className={`${ open ? 'flex items-center gap-3' : 'flex justify-center' }`}>
                        <div className="text-3xl">⛏️</div>
                        {open && (
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    POS BOR
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    Kelola Tagihan Air
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto sidebar-scroll">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                group relative flex items-center gap-3 px-4 py-3.5 rounded-xl
                                transition-all duration-200 ease-in-out
                                ${ isActive(item.path)
                                    ? 'bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                                    : 'text-gray-300 hover:bg-gray-800/60 hover:text-white hover:scale-[1.02]'
                                }
                                ${ !open && 'justify-center' }
                            `}
                            title={!open ? item.label : ''}
                        >
                            {/* Active indicator */}
                            {isActive(item.path) && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                            )}

                            {/* Icon */}
                            <span className={`text-2xl transition-transform duration-200 ${ isActive(item.path) ? '' : 'group-hover:scale-110'
                                }`}>
                                {item.icon}
                            </span>

                            {/* Label */}
                            {open && (
                                <span className={`text-sm font-semibold tracking-wide ${ isActive(item.path) ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                    }`}>
                                    {item.label}
                                </span>
                            )}

                            {/* Hover effect overlay */}
                            {!isActive(item.path) && (
                                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/5 group-hover:to-cyan-600/5 transition-all duration-200" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Footer Section */}
                {open && (
                    <div className="p-4 border-t border-gray-800">
                        <div className="text-xs text-gray-500 text-center">
                            © 2024 POS Pengeboran
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
