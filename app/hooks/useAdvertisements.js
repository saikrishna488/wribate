'use client';

import { useState, useEffect } from 'react';
import { advertisementConfig } from '../config/advertisements';

export function useAdvertisements(page, section) {
  const [showAds, setShowAds] = useState(true);
  
  // Check if ads should be shown based on configuration
  useEffect(() => {
    const pageConfig = advertisementConfig[page];
    if (!pageConfig?.enabled) {
      setShowAds(false);
      return;
    }
    
    if (section && pageConfig.sections) {
      const sectionConfig = pageConfig.sections[section];
      setShowAds(sectionConfig?.enabled ?? false);
    } else {
      setShowAds(true);
    }
  }, [page, section]);
  
  // Get advertisement configuration for the current page/section
  const getConfig = () => {
    const pageConfig = advertisementConfig[page];
    if (!pageConfig?.enabled) return null;
    
    if (section && pageConfig.sections) {
      return pageConfig.sections[section];
    }
    
    return pageConfig;
  };
  
  return {
    showAds,
    config: getConfig(),
  };
} 