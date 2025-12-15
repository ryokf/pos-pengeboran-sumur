import { useLocation } from 'react-router-dom';

export function useNavigation() {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/') return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return { isActive, currentPath: location.pathname };
}
