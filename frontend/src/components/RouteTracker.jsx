import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsAPI } from '../services/api';

const RouteTracker = () => {
    const location = useLocation();
    const prevLocationRef = useRef('ENTRY');

    useEffect(() => {
        const currentPath = location.pathname;

        // Skip tracking for admin paths to keep user clickstream pure
        if (currentPath.startsWith('/admin')) {
            prevLocationRef.current = currentPath;
            return;
        }

        const source = prevLocationRef.current;
        const target = currentPath;

        // Only track actual movement
        if (source !== target) {
            analyticsAPI.trackNavigation({ source, target })
                .catch(err => console.debug('Analytics Tracking Failed:', err)); // Silently fail analytics
        }

        // Update previous location for next transition
        prevLocationRef.current = currentPath;

    }, [location]);

    // This component doesn't render anything
    return null;
};

export default RouteTracker;
