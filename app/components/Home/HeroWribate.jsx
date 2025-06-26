import React from 'react'

const HeroWribate = ({ wribates,handleCardClick }) => {

    // Extract the most recent wribate for hero
     // Sort wribates by created date for most recent
  const sortedWribates = [...wribates].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

    const heroWribate = sortedWribates.length > 0 ? sortedWribates[0] : null;
    return (
        <>
            {heroWribate && (
                <div id='hero' className="mb-8 border-b hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    {/* <div className="flex justify-between items-center mb-3">
                    <h2 className={`text-xl font-bold text-gray-900 border-l-4 pl-3`}>
                      Featured
                    </h2>
                  </div> */}
                    <div
                        onClick={() => handleCardClick(heroWribate._id,heroWribate?.code)}
                        className="bg-white cursor-pointer hover:shadow-lg border ghtransition-shadow duration-300 w-full"
                    >
                        <div className="flex flex-col">
                            <div className="w-full h-40 md:h-80 relative">
                                <img
                                    src={heroWribate.coverImage}
                                    alt={heroWribate.title}
                                    className="w-full h-full object-fill"
                                />
                                {/* Overlay for title */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white p-4">{heroWribate.title}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default HeroWribate
