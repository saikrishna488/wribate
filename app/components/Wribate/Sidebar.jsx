'use client';

import React from 'react';
import Link from 'next/link';
import { AdSpaceContent } from '../Advertisements/Advertisement';

const Sidebar = ({ category, country, allWribates = [], currentWribateId }) => {
  // First 5: same category & country
  const sameCatAndCountry = allWribates
    .filter(w =>
      w._id !== currentWribateId &&
      w.category === category &&
      w.country === country
    )
    .slice(0, 5);

  // Next 5: different category, same country
  const otherCatSameCountry = allWribates
    .filter(w =>
      w._id !== currentWribateId &&
      w.category !== category &&
      w.country === country
    )
    .slice(0, 5);

  const renderList = items =>
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
    </div>;

  const cardClasses = `
    bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-lg
    hover:border-blue-200 hover:shadow-md transition-all duration-200
  `;

  return (
    <div className="w-full lg:w-[30%] space-y-4 sm:space-y-6 mt-4 lg:mt-0">
      {/* Advertisement Slots */}
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

      {/* Related: same category & country */}
      <div className={cardClasses}>
        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
          More in {category}
        </h3>
        {sameCatAndCountry.length > 0
          ? renderList(sameCatAndCountry)
          : <div className="text-gray-500 text-sm">No related wribates found.</div>
        }
      </div>

      {/* Related: other categories, same country */}
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
