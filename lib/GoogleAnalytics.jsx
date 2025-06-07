'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../app/firebase'; // 🔁 Make sure this path is correct

const GA_MEASUREMENT_ID = 'G-T2D4F06FCJ';

// 🔧 Utility functions
const trackCustomEvent = (eventName, params = {}) => {
  ReactGA.event(eventName, { ...params, timestamp: new Date().toISOString() });
};

const trackUserFlow = (flowStep, flowName, params = {}) => {
  ReactGA.event('user_flow', { flow_step: flowStep, flow_name: flowName, ...params });
};

const trackScreenView = (screenName, path) => {
  ReactGA.event('screen_view', { screen_name: screenName, screen_path: path });
};

const trackEngagementTime = (eventName, durationMs) => {
  ReactGA.event(eventName, { engagement_time_msec: durationMs });
};

const trackAppState = (state) => {
  ReactGA.event('app_state', { app_state: state });
};

const GoogleAnalytics = ({ userId }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lastActive, setLastActive] = useState(Date.now());

  useEffect(() => {
    ReactGA.initialize(GA_MEASUREMENT_ID);

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    ReactGA.send({ hitType: 'pageview', page: url });
    trackScreenView(pathname, url);
    trackCustomEvent('page_view', { page_path: url, page_title: document.title });

    // 🔒 Auth tracking
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        ReactGA.set({ user_id: user.uid });
        if (userId) {
          ReactGA.set({ db_user_id: userId });
        }
      }
    });

    // 🧠 Track flow (like onboarding, etc.)
    const flowStep = pathname.split('/')[1] || 'home';
    trackUserFlow(flowStep, 'navigation_flow');

    // 🌗 Track foreground/background state
    const handleVisibilityChange = () => {
      const state = document.visibilityState === 'visible' ? 'foreground' : 'background';
      trackAppState(state);

      if (state === 'foreground') {
        setLastActive(Date.now());
      } else {
        const duration = Date.now() - lastActive;
        trackEngagementTime('session_engagement', duration);
      }
    };

    // ⬇️ Scroll tracking
    const handleScroll = () => {
      const scrollDepth = Math.round((window.scrollY / document.body.scrollHeight) * 100);
      if (scrollDepth % 25 === 0) {
        trackCustomEvent('scroll_depth', { depth: `${scrollDepth}%` });
      }
    };

    // ⏱️ Session duration
    const startTime = Date.now();
    const trackSessionDuration = () => {
      const duration = Date.now() - startTime;
      trackEngagementTime('session_duration', duration);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', trackSessionDuration);

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', trackSessionDuration);
    };
  }, [pathname, searchParams, userId]);

  return null;
};

export default GoogleAnalytics;
