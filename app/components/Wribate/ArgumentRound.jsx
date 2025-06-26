import React from 'react';
import he from "he";
import { useRouter } from "next/navigation";
import { StaticAdvertisement } from '../Advertisements/Advertisement';

const ArgumentRound = ({ 
    roundData, 
    index, 
    wribate, 
    forArgument, 
    againstArgument, 
    isRoundMasked, 
    userIsPremium, 
    wribateIsFeatured,
    visibility,
    totalRounds 
}) => {
    const router = useRouter();
    const roundNumber = roundData.roundNumber;

    // Helper function to get round title
    const getRoundTitle = (roundNumber) => {
        switch (roundNumber) {
            case 1:
                return "Opening Arguments";
            case 2:
                return "Rebuttals";
            case 3:
                return "Closing Arguments";
            default:
                return `Round ${roundNumber}`;
        }
    };

    // PREMIUM MASK: Only first two lines blurred, rest hidden
    const PremiumMask = ({ roundNumber, forArgument, againstArgument }) => {
        // Helper to split argument into lines
        const splitLines = (text) => {
            if (!text) return [];
            // Split on <br> or newlines
            return text.split(/\n|<br\s*\/?>/i).filter(line => line.trim() !== '');
        };

        const forLines = splitLines(he.decode(forArgument || ""));
        const againstLines = splitLines(he.decode(againstArgument || ""));

        const renderBlurredLines = (lines) => {
            const firstTwo = lines.slice(0, 2).join('<br/>');
            return <div className="blurred-lines" dangerouslySetInnerHTML={{ __html: firstTwo }} />;
        };

        return (
            <div className="relative">
                {/* Only first two lines blurred/opaqued */}
                <div className="premium-content-preview">
                    <div className="border-l-4 border-red-300 bg-red-50 rounded-r-sm p-3 mb-4">
                        <div className="flex items-center mb-3">
                            <img src="/user.png" alt="" className="rounded-full w-6 h-6 mr-2" />
                            <span className="font-medium text-red-600">{wribate.leadFor}</span>
                        </div>
                        {forLines.length > 0 ? renderBlurredLines(forLines) : <p className="text-gray-500">No argument submitted.</p>}
                    </div>
                    <div className="border-r-4 border-blue-300 bg-blue-50 p-3">
                        <div className="flex items-center justify-end mb-3">
                            <span className="font-medium text-blue-600">{wribate.leadAgainst}</span>
                            <img src="/user.png" alt="" className="rounded-full w-6 h-6 ml-2" />
                        </div>
                        {againstLines.length > 0 ? renderBlurredLines(againstLines) : <p className="text-gray-500">No argument submitted.</p>}
                    </div>
                </div>
                {/* Blocked rest of the content */}
                <div className="blocked-content flex justify-between mt-2">
                    <div className="blocked-for w-1/2 border-l-4 border-red-300 bg-red-100 rounded-r-sm p-3 ml-0 mr-auto">
                        {forLines.length > 2 ? <p>Content hidden. Subscribe to view full argument.</p> : null}
                    </div>
                    <div className="blocked-against w-1/2 border-r-4 border-blue-300 bg-blue-100 rounded-l-sm p-3 ml-auto mr-0">
                        {againstLines.length > 2 ? <p className="text-right">Content hidden. Subscribe to view full argument.</p> : null}
                    </div>
                </div>
                {/* Subscription prompt */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50/90 border border-blue-200 rounded-md px-5 py-3 mt-3 gap-2 sm:gap-0 backdrop-blur-sm">
                    <div className="flex items-center text-blue-900 text-base font-medium">
                        <svg className="w-5 h-5 mr-2 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>
                            To access the full content of <b>{getRoundTitle(roundNumber)}</b>, subscribe to <span className="text-blue-700 font-semibold">Premium</span>.
                        </span>
                    </div>
                    <button
                        onClick={() => router.push('/subscription')}
                        className="mt-2 sm:mt-0 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded transition-all duration-200 text-base shadow"
                    >
                        Upgrade Now
                    </button>
                </div>
                <style jsx>{`
                    .premium-content-preview {
                        position: relative;
                        opacity: 0.4;
                        filter: blur(1px);
                        pointer-events: none;
                        -webkit-mask-image: linear-gradient(to bottom, 
                            rgba(0,0,0,1) 0%, 
                            rgba(0,0,0,0.8) 60%, 
                            rgba(0,0,0,0.3) 85%, 
                            rgba(0,0,0,0) 100%);
                        mask-image: linear-gradient(to bottom, 
                            rgba(0,0,0,1) 0%, 
                            rgba(0,0,0,0.8) 60%, 
                            rgba(0,0,0,0.3) 85%, 
                            rgba(0,0,0,0) 100%);
                    }
                    .blocked-content p {
                        font-style: italic;
                        color: #3b82f6; /* blue-500 */
                        font-weight: 600;
                        margin: 0;
                    }
                `}</style>
            </div>
        );
    };

    return (
        <div className={`${index !== 0 ? 'border-t border-gray-200 pt-6 sm:pt-8' : ''}`}>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-100 flex items-center flex-wrap gap-2">
                <span>Round {roundNumber}: {getRoundTitle(roundNumber)}</span>
                {isRoundMasked && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        🔒 Premium Only
                    </span>
                )}
                {wribateIsFeatured && !isRoundMasked && roundNumber === 1 && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                        ✓ Free Preview
                    </span>
                )}
            </h3>

            {isRoundMasked ? (
                <PremiumMask
                    roundNumber={roundNumber}
                    forArgument={forArgument}
                    againstArgument={againstArgument}
                />
            ) : (
                <div className="space-y-4 sm:space-y-6">
                    <div className="argument border-l-4 border-red-500 bg-red-50 rounded-r-sm p-2 sm:p-3 ml-0 mr-auto w-full sm:w-[90%]">
                        <div className="flex items-center mb-2 sm:mb-3">
                            <img src="/user.png" alt="" className="rounded-full w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                            <span className="font-medium text-red-800 text-sm sm:text-base">{wribate.leadFor}</span>
                        </div>
                        {forArgument ? (
                            <div
                                className="prose max-w-none text-md sm:text-md"
                                dangerouslySetInnerHTML={{ __html: he.decode(forArgument) }}
                            />
                        ) : (
                            <p className="text-gray-500 text-md sm:text-base">No argument submitted.</p>
                        )}
                    </div>
                    <div className="argument border-r-4 border-blue-500 bg-blue-50 p-2 sm:p-3 ml-auto mr-0 w-full sm:w-[90%]">
                        <div className="flex items-center justify-end mb-2 sm:mb-3">
                            <span className="font-medium text-blue-800 text-sm sm:text-base">{wribate.leadAgainst}</span>
                            <img src="/user.png" alt="" className="rounded-full w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                        </div>
                        {againstArgument ? (
                            <div
                                className="prose max-w-none text-md sm:text-md"
                                dangerouslySetInnerHTML={{ __html: he.decode(againstArgument) }}
                            />
                        ) : (
                            <p className="text-gray-500 text-right text-md sm:text-base">No argument submitted.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Show advertisements between rounds for non-premium users */}
            {index < totalRounds - 1 && !userIsPremium && !isRoundMasked && visibility && (
                <div className="mt-8">
                    <div className="text-center mb-2">
                        <span className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Advertisement</span>
                    </div>
                    <div className="transform transition-transform duration-300">
                        <StaticAdvertisement type={`sponsor${index + 1}`} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArgumentRound;