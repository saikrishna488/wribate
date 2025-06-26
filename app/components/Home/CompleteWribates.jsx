
import SectionHeader from './SectionHeader'
import WribateCard from './WribateCard'


const CompleteWribates = ({ wribates, activeCategory, handleViewMore, handleCardClick,getWribateStatus }) => {

    const completedWribates = wribates.filter(wribate =>
        (activeCategory === 'All' || wribate.category === activeCategory) &&
        getWribateStatus(wribate.startDate, wribate.durationDays) === "Completed"
    );
    return (
        <>
            {completedWribates.length > 0 && (
                <div className="mb-8 border-t pt-2 border-gray-300">
                    <SectionHeader
                        title="Completed"
                        borderColor="border-gray-700"
                        onViewMore={() => handleViewMore(activeCategory, "Completed")}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {completedWribates.slice(0, 4).map((wribate) => (
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

export default CompleteWribates
