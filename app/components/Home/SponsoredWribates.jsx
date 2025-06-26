import React from 'react'
import SectionHeader from './SectionHeader'
import WribateCard from './WribateCard'

const SponsoredWribates = ({ wribates, activeCategory,handleViewMore,handleCardClick }) => {

    const sponsoredWribates = wribates.filter(wribate =>
        (activeCategory === 'All' || wribate.category === activeCategory) &&
        wribate.type === "Sponsored"
    );
    return (
        <>
            {sponsoredWribates.length > 0 && (
                <div className="mb-8 border-t pt-2 border-gray-300">
                    <SectionHeader
                        title="Featured"
                        borderColor="border-yellow-600"
                        onViewMore={() => handleViewMore(activeCategory, "Sponsored")}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sponsoredWribates.slice(0, 4).map((wribate) => (
                            <WribateCard
                                key={wribate._id}
                                wribate={wribate}
                                onClick={() => handleCardClick(wribate._id, wribate?.code)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default SponsoredWribates
