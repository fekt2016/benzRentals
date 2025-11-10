// Mobile Auth Sync Component - Tries to get authentication token from mobile app
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const MobileAuthSync = () => {
  const location = useLocation();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only check once on initial load
    if (hasChecked) {
      return;
    }

    const token = Cookies.get('token');
    const isAuthSyncPage = location.pathname === '/auth/sync';
    
    // Skip if already authenticated or on auth sync page
    if (token || isAuthSyncPage) {
      setHasChecked(true);
      return;
    }

    // Check if we're on a mobile device (likely to have mobile app installed)
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent.toLowerCase()
    );

    if (isMobileDevice) {
      console.log('[MobileAuthSync] 🌐 No token found on web app. Mobile app should sync automatically.');
      console.log('[MobileAuthSync] If mobile app is open, it will attempt to sync the token.');
      
      // The mobile app's periodic sync mechanism will handle opening the sync URL
      // We don't need to do anything here - just log for debugging
      setHasChecked(true);
    } else {
      setHasChecked(true);
    }
  }, [location.pathname, hasChecked]);

  // This component doesn't render anything visible
  return null;
};

export default MobileAuthSync;

