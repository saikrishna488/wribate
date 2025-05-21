'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../app/firebase'; // ✅ Make sure this is your correct path

const GA_MEASUREMENT_ID = 'G-T2D4F06FCJ';

const GoogleAnalytics = ({ userId }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // ✅ Only initialize once
    ReactGA.initialize(GA_MEASUREMENT_ID);

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    ReactGA.send({ hitType: 'pageview', page: url });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        ReactGA.set({ user_id: user.uid });
        if (userId) {
          ReactGA.set({ db_user_id: userId });
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, searchParams, userId]);

  return null;
};

export default GoogleAnalytics;
