'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define advertisement data with actual sponsor links
const advertisements = {
  sponsor1: {
    image: '/Ads/01.png', // You'll need to add these images to your public/ads directory
    alt: 'Sponsor 1',
    link: 'https://sponsor1.com',
    width: 400,
    height: 200,
  },
  sponsor2: {
    image: '/Ads/02.png',
    alt: 'Sponsor 2',
    link: 'https://sponsor2.com',
    width: 400,
    height: 200,
  },
  sponsor3: {
    image: '/Ads/03.png',
    alt: 'Sponsor 3',
    link: 'https://sponsor3.com',
    width: 400,
    height: 200,
  },
};

// Static advertisement component for fixed-size ads
export function StaticAdvertisement({ type = 'sponsor1', className = '' }) {
  const ad = advertisements[type];

  if (!ad) return null;

  return (
    <Link 
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer" 
      className={`group block transition-all duration-300 ${className}`}
    >
      <div className="relative">
        <img
          src={ad.image}
          alt={ad.alt}
          className="w-full h-auto transition-all duration-300 group-hover:brightness-105"
        />
        {/* Modern overlay effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Sponsor label */}
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 rounded-full opacity-0 group-hover:opacity-100 transform -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          Sponsor
        </div>
      </div>
    </Link>
  );
}

export function Advertisement({ type, className = '' }) {
  const ad = advertisements[type];

  if (!ad) return null;

  return (
    <Link 
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer" 
      className={`group block w-full transition-all duration-300 ${className}`}
    >
      <div className="relative w-full">
        <img
          src={ad.image}
          alt={ad.alt}
          className="w-full h-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-105"
        />
        {/* Modern overlay effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Sponsor label */}
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 rounded-full opacity-0 group-hover:opacity-100 transform -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          Sponsor
        </div>
      </div>
    </Link>
  );
}

// Advertisement container that fits into existing Ad Space
export function AdSpaceContent({ className = '', startingAd = 0 }) {
  const [currentAd, setCurrentAd] = React.useState(startingAd);
  const ads = ['sponsor1', 'sponsor2', 'sponsor3'];

  React.useEffect(() => {
    // Rotate ads every 3 seconds
    const interval = setInterval(() => {
      setCurrentAd((prev) => {
        // Calculate next ad index ensuring it's different from current
        const nextAd = (prev + 1) % ads.length;
        return nextAd;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* Fade transition between ads */}
      <div className="transition-opacity duration-500">
        <Advertisement type={ads[currentAd]} />
      </div>
    </div>
  );
}

// Vertical advertisement list component with title
export function VerticalAdvertisements({ className = '', showTitle = true }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-700 mb-2">ADVERTISEMENT</h3>
      )}
      <div className="space-y-4">
        <Advertisement type="sponsor1" />
        <Advertisement type="sponsor2" />
        <Advertisement type="sponsor3" />
      </div>
    </div>
  );
}

// Horizontal advertisement list component with title
export function HorizontalAdvertisements({ className = '', showTitle = true }) {
  return (
    <div className={className}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-700 mb-2">ADVERTISEMENT</h3>
      )}
      <div className="flex gap-4 overflow-x-auto">
        <Advertisement type="sponsor1" className="flex-shrink-0" />
        <Advertisement type="sponsor2" className="flex-shrink-0" />
        <Advertisement type="sponsor3" className="flex-shrink-0" />
      </div>
    </div>
  );
}

// Single random advertisement component with title
export function RandomAdvertisement({ className = '', showTitle = true }) {
  const adTypes = Object.keys(advertisements);
  const randomType = adTypes[Math.floor(Math.random() * adTypes.length)];
  
  return (
    <div className={className}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-700 mb-2">ADVERTISEMENT</h3>
      )}
      <Advertisement type={randomType} />
    </div>
  );
} 