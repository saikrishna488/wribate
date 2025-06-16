'use client';

import React from 'react';
import Link from 'next/link';
import { AdSpaceContent } from '../Advertisements/Advertisement';
import { useAtom } from 'jotai';
import { adsAtom } from '@/app/states/GlobalStates';

const Sidebar = ({
  category = '',       // comma-separated string of current wribate’s categories
  country = '',
  allWribates = [],
  currentWribateId
}) => {
  // Helper: split a comma-separated category string into trimmed array
  const splitCats = str => str.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const [visibility, setVisibility] = useAtom(adsAtom);

  const currentCats = splitCats(category);

  // Filter: same country & any overlapping category
  const sameCatAndCountry = allWribates
    .filter(w => {
      if (w._id === currentWribateId || w.country !== country) return false;
      const wCats = splitCats(w.category || '');
      return wCats.some(cat => currentCats.includes(cat));
    })
    .slice(0, 10);

  // Filter: same country & no overlapping category
  const otherCatSameCountry = allWribates
    .filter(w => {
      if (w._id === currentWribateId || w.country !== country) return false;
      const wCats = splitCats(w.category || '');
      return !wCats.some(cat => currentCats.includes(cat));
    })
    .slice(0, 10);

  // Card wrapper classes
  const cardClasses = `
    bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-lg
    hover:border-blue-200 hover:shadow-md transition-all duration-200
  `;

  // Render a list of wribate links with dividers
  const renderList = items => (
    <div className="divide-y divide-gray-200">
      {items.map(w => (
        <Link
          key={w._id}
          href={`/wribate/${w._id}`}
          className="block py-3 px-2 hover:bg-gray-50 transition-colors duration-150"
        >
          <h4 className="font-medium text-sm sm:text-base text-gray-800 hover:text-blue-600">
            {w.title}
          </h4>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{new Date(w.createdAt).toLocaleDateString()}</span>
            <span>{w.comments?.length ?? 0} comments</span>
          </div>
        </Link>
      ))}
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

      {/* First card: Similar Wribates */}
      <div className={cardClasses}>
        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
          Similar Wribates
        </h3>
        {sameCatAndCountry.length > 0
          ? renderList(sameCatAndCountry)
          : <div className="text-gray-500 text-sm">No related wribates found.</div>
        }
      </div>

      {/* Second card: Same country, other categories */}
      <div className={cardClasses}>
        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
          More topics
        </h3>
        {otherCatSameCountry.length > 0
          ? renderList(otherCatSameCountry)
          : <div className="text-gray-500 text-sm">No additional wribates found.</div>
        }
      </div>
    </div>
  );
};

export default Sidebar;
