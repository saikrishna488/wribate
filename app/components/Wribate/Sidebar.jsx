'use client';

import React from 'react';
import Link from 'next/link';
import { AdSpaceContent } from '../Advertisements/Advertisement';
import { useAtom } from 'jotai';
import { adsAtom } from '@/app/states/GlobalStates';

const Sidebar = ({
  category = '',
  country = '',
  allWribates = [],
  currentWribateId
}) => {
  // Helper: split a comma-separated category string into trimmed array
  const splitCats = str => str.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const [visibility, setVisibility] = useAtom(adsAtom);

  const currentCats = splitCats(category);

  // Get current wribate's institution
  const currentWribate = allWribates.find(w => w._id === currentWribateId);
  const currentInstitution = currentWribate?.institution || '';

  // Light blue variations for categories (consistent theme)
  const getCategoryColor = () => {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  // Light blue variations for countries
  const getCountryColor = () => {
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  // Institution color
  const getInstitutionColor = () => {
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  // ENHANCED: Similar wribates with institution-based cascading logic
  const getSimilarWribates = () => {
    // Step 1: Same category + same country + same institution (highest similarity)
    const sameCategoryCountryInstitution = allWribates.filter(w => {
      const wCategories = splitCats(w.category);
      const hasOverlap = wCategories.some(cat => currentCats.includes(cat));
      
      return w._id !== currentWribateId &&
             w.country === country &&
             w.institution === currentInstitution &&
             currentInstitution && // Only if current wribate has institution
             hasOverlap;
    });

    // Step 2: Same category + same country + different institution
    const sameCategoryAndCountry = allWribates.filter(w => {
      const wCategories = splitCats(w.category);
      const hasOverlap = wCategories.some(cat => currentCats.includes(cat));
      
      return w._id !== currentWribateId &&
             w.country === country &&
             w.institution !== currentInstitution &&
             hasOverlap;
    });

    // Step 3: Same category + different country (lowest priority)
    const sameCategoryDifferentCountry = allWribates.filter(w => {
      const wCategories = splitCats(w.category);
      const hasOverlap = wCategories.some(cat => currentCats.includes(cat));
      
      return w._id !== currentWribateId &&
             w.country !== country &&
             hasOverlap;
    });

    // Combine in order of relevance and limit to 10 total
    const combined = [
      ...sameCategoryCountryInstitution,
      ...sameCategoryAndCountry,
      ...sameCategoryDifferentCountry
    ];

    return combined.slice(0, 10);
  };

  // ENHANCED: More topics with institution-based cascading logic
  const getMoreTopics = () => {
    // Step 1: Same country + same institution + different category (highest relevance)
    const sameCountryInstitutionDiffCategory = allWribates.filter(w => {
      const wCategories = splitCats(w.category);
      const hasOverlap = wCategories.some(cat => currentCats.includes(cat));
      
      return w._id !== currentWribateId &&
             w.country === country &&
             w.institution === currentInstitution &&
             currentInstitution && // Only if current wribate has institution
             !hasOverlap; // Different category
    });

    // Step 2: Same country + different institution + different category
    const sameCountryDiffInstitutionDiffCategory = allWribates.filter(w => {
      const wCategories = splitCats(w.category);
      const hasOverlap = wCategories.some(cat => currentCats.includes(cat));
      
      return w._id !== currentWribateId &&
             w.country === country &&
             w.institution !== currentInstitution &&
             !hasOverlap; // Different category
    });

    // Step 3: Different country + different category (lowest priority)
    const diffCountryDiffCategory = allWribates.filter(w => {
      const wCategories = splitCats(w.category);
      const hasOverlap = wCategories.some(cat => currentCats.includes(cat));
      
      return w._id !== currentWribateId &&
             w.country !== country &&
             !hasOverlap; // Different category
    });

    // Combine in order of relevance and limit to 10 total
    const combined = [
      ...sameCountryInstitutionDiffCategory,
      ...sameCountryDiffInstitutionDiffCategory,
      ...diffCountryDiffCategory
    ];

    return combined.slice(0, 10);
  };

  const similarWribates = getSimilarWribates();
  const moreTopics = getMoreTopics();

  // Helper: get username from various possible fields
  const getUsername = (w, side) => {
    const name = side === 'for' ? w.leadFor : w.leadAgainst;
    
    // If it's still an email (no user found), show email prefix
    if (name && name.includes('@')) {
      return name.split('@')[0];
    }
    
    // Otherwise return the full name
    return name || '';
  };

  const cardClasses = `
    bg-white border border-gray-200 shadow-sm p-4 rounded-lg
    hover:border-blue-200 hover:shadow-md transition-all duration-200
  `;

  // Renders a list of wribate links
  const renderList = items => (
    <div className="space-y-1">
      {items.map((w, index) => {
        const userFor = getUsername(w, 'for');
        const userAgainst = getUsername(w, 'against');
        const mainCategory = splitCats(w.category)[0] || w.category;
        const institute = w.institution || '';
        
        return (
          <div key={w._id}>
            {/* Elegant divider line between cards (except for first item) */}
            {index > 0 && (
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-gray-50 px-2">
                    {/* <div className="w-2 h-2 bg-gray-300 rounded-full"></div> */}
                  </div>
                </div>
              </div>
            )}
            
            <Link
              href={`/wribate/${w._id}`}
              className="block p-4 hover:bg-gray-50 transition-all duration-200 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm group"
            >
              {/* Title */}
              <h4 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 mb-3 leading-tight transition-colors duration-200">
                {w.title}
              </h4>
              
              {/* Simple and Clean Username Container */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gradient-to-r from-red-50 to-blue-50 rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
                    {userFor && (
                      <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-md">
                        {userFor}
                      </span>
                    )}
                    {userFor && userAgainst && (
                      <span className="mx-2 text-xs font-bold text-gray-500">
                        VS
                      </span>
                    )}
                    {userAgainst && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                        {userAgainst}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 font-medium">
                  {new Date(w.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Clean Badges with hover tooltips */}
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {/* Category Badge */}
                  {mainCategory && (
                    <div className="group/badge relative">
                      <span 
                        className={`
                          text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 cursor-help
                          ${getCategoryColor()} hover:shadow-sm hover:scale-105
                        `}
                      >
                        {mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1)}
                      </span>
                      {/* Clean Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Category: {mainCategory}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Institution Badge */}
                  {institute && (
                    <div className="group/badge relative">
                      <span 
                        className={`
                          text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 cursor-help
                          ${getInstitutionColor()} hover:shadow-sm hover:scale-105
                        `}
                      >
                        {institute}
                      </span>
                      {/* Clean Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Institution: {institute}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Country Badge */}
                  {w.country && (
                    <div className="group/badge relative">
                      <span 
                        className={`
                          text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 cursor-help
                          ${getCountryColor()} hover:shadow-sm hover:scale-105
                        `}
                      >
                        {w.country}
                      </span>
                      {/* Clean Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Country: {w.country}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 font-medium">
                  {w.comments?.length ?? 0} comments
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full lg:w-[30%] space-y-4 sm:space-y-6 mt-4 lg:mt-0">
      {/* Advertisement Slots (unchanged) */}
      {
        visibility && (
          <>
            <div className={cardClasses}>
              <div className="mb-2 font-bold uppercase text-[10px] sm:text-xs tracking-wider text-gray-600">
                Advertisement
              </div>
              <AdSpaceContent startingAd={0} />
            </div>

            <div className={cardClasses}>
              <div className="mb-2 font-bold uppercase text-[10px] sm:text-xs tracking-wider text-gray-600">
                Advertisement
              </div>
              <AdSpaceContent startingAd={2} />
            </div>
          </>
        )
      }

      {/* Similar Wribates */}
      <div className={cardClasses}>
        <h3 className="font-bold text-lg mb-4 text-gray-800">
          Similar Wribates
        </h3>
        {similarWribates.length > 0
          ? renderList(similarWribates)
          : <div className="text-gray-500 text-sm text-center py-6">No related wribates found.</div>
        }
      </div>

      {/* More Topics */}
      <div className={cardClasses}>
        <h3 className="font-bold text-lg mb-4 text-gray-800">
          More Topics
        </h3>
        {moreTopics.length > 0
          ? renderList(moreTopics)
          : <div className="text-gray-500 text-sm text-center py-6">No additional wribates found.</div>
        }
      </div>
    </div>
  );
};

export default Sidebar;
