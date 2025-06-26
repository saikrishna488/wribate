import React from 'react'
import SectionHeader from './SectionHeader'

const OngoingWribate = ({ wribates, activeCategory, handleViewMore, handleCardClick,getWribateStatus}) => {



    // Get ongoing wribates (including upcoming ones for display)
  const ongoingWribates = [...wribates]
    .filter(wribate =>
      getWribateStatus(wribate.startDate, wribate.durationDays) !== "Completed"
    )
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);
  return (
   <>
   <div className="mb-8">
            <SectionHeader
              title="Trending"
              borderColor="border-purple-700"
              onViewMore={() => handleViewMore(activeCategory, "Ongoing")}
            />
            {ongoingWribates.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {ongoingWribates.map((wribate) => (
                  <div
                    key={wribate._id}
                    onClick={() => handleCardClick(wribate._id, wribate?.code)}
                    className="bg-white cursor-pointer border shadow-md w-full rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="flex flex-col">
                      <div className="w-full h-40 relative">
                        <img
                          src={wribate.coverImage}
                          alt={wribate.title}
                          className="w-full h-full object-fill"
                        />
                        {/* Overlay to ensure text is always readable */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>


                      </div>
                      <div className="p-3 bg-white w-full">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{wribate.title}</h3>
                        <div className="flex flex-row mt-1 text-xs text-gray-600 items-center justify-between">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{wribate.category}</span>
                          {wribate.institution && (
                            <span className="text-gray-500 text-xs truncate max-w-[50%]">{wribate.institution}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-4 border text-center text-gray-500">
                No ongoing wribates available at the moment.
              </div>
            )}
          </div>
   </>
  )
}

export default OngoingWribate
