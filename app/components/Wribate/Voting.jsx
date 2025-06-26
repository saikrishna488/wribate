import React from 'react'
import VotesChart from "../../components/Wribate/Chart";
import {
    useAddVoteMutation,
} from "../../../app/services/authApi";
import toast from 'react-hot-toast';

const Voting = ({ wribate, selectedVote, votes, user, refetch, setSelectedVote, id }) => {
    
    const [addVote] = useAddVoteMutation();
    
    // ✅ VOTE COUNT EXTRACTION (Same logic as Header)
    const getVoteCounts = () => {
        let totalVotes = 0;
        let forVotes = 0;
        let againstVotes = 0;

        try {
            if (votes?.totalVotes !== undefined) {
                totalVotes = votes.totalVotes;
                forVotes = votes.forVotes || 0;
                againstVotes = votes.againstVotes || 0;
            }
            else if (votes?.roundVoteCounts && Array.isArray(votes.roundVoteCounts)) {
                votes.roundVoteCounts.forEach(round => {
                    const forCount = round.forVotes || round.for || round.forCount || round.yes || 0;
                    const againstCount = round.againstVotes || round.against || round.againstCount || round.no || 0;
                    
                    forVotes += forCount;
                    againstVotes += againstCount;
                });
                totalVotes = forVotes + againstVotes;
            }
            else if (votes && typeof votes === 'object') {
                const possibleFields = ['for', 'forVotes', 'forCount', 'yes'];
                const possibleAgainstFields = ['against', 'againstVotes', 'againstCount', 'no'];
                
                for (const field of possibleFields) {
                    if (votes[field] !== undefined) {
                        forVotes = votes[field];
                        break;
                    }
                }
                
                for (const field of possibleAgainstFields) {
                    if (votes[field] !== undefined) {
                        againstVotes = votes[field];
                        break;
                    }
                }
                
                totalVotes = forVotes + againstVotes;
            }
        } catch (error) {
            // Silent fallback to zero counts
        }
        
        return { totalVotes, forVotes, againstVotes };
    };

    const { totalVotes, forVotes, againstVotes } = getVoteCounts();
    
    const handleSubmitVote = async (string) => {
        if (!user?._id) {
            showLoginAlert();
            return;
        }
        
        setSelectedVote(string);
        const voteData = { vote: string };
        
        try {
            const response = await addVote({ id:wribate?._id, data: voteData }).unwrap();
            await refetch();
            toast.success(`Vote cast: ${string}`);
        } catch (err) {
            if (err?.data?.message?.includes('already voted') || err?.status === 409) {
                toast.error("You have already voted!");
            } else {
                toast.error("Failed to submit vote. Please try again.");
            }
        }
    };
    
    const showLoginAlert = () => {
        toast.error("Login to continue!");
    };
    
    return (
        <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold">Cast Your Vote</h2>
                    <div className="text-sm text-gray-500">
                        <span className="hidden sm:inline">#{window.location.hash === '#voting' ? 'You are here' : 'voting'}</span>
                    </div>
                </div>
                <div className="my-3 sm:my-4">
                    <p className="mb-2 sm:mb-3 font-medium text-sm sm:text-base">{wribate?.title}</p>
                    <div className="space-y-2 sm:space-y-3">
                        <button
                            className={`w-full p-2 sm:p-3 border text-left font-medium transition text-sm sm:text-base ${selectedVote === "For"
                                ? "bg-red-100 border-red-500 text-red-800"
                                : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                                }`}
                            onClick={() => handleSubmitVote("For")}
                        >
                            For
                        </button>
                        <button
                            className={`w-full p-2 sm:p-3 border text-left font-medium transition text-sm sm:text-base ${selectedVote === "Against"
                                ? "bg-blue-100 border-blue-500 text-blue-800"
                                : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                                }`}
                            onClick={() => handleSubmitVote("Against")}
                        >
                            Against
                        </button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                        <span className="text-red-500">*</span> 2 weeks left to vote
                    </p>
                </div>
            </div>
            
            <div className="p-3 sm:p-4 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Voting Results</h2>
                
                {/* ✅ CHART DISPLAY */}
                {votes?.roundVoteCounts && (
                    <VotesChart
                        data={votes?.roundVoteCounts}
                        title={wribate?.title}
                        wribate={wribate}
                    />
                )}
                
                {!votes?.roundVoteCounts && (
                    <div className="text-center py-4 text-gray-500">
                        <p>No votes yet. Be the first to vote!</p>
                    </div>
                )}

                {/* ✅ LIVE VOTE RESULTS BELOW CHART */}
                {totalVotes > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Live Vote Results</h4>
                            <div className="flex justify-center space-x-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-600">{forVotes}</div>
                                    <div className="text-base text-gray-600 font-medium">For</div>
                                    <div className="text-sm text-gray-500">
                                        {totalVotes > 0 ? `${Math.round((forVotes / totalVotes) * 100)}%` : '0%'}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-px h-16 bg-gray-300"></div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{againstVotes}</div>
                                    <div className="text-base text-gray-600 font-medium">Against</div>
                                    <div className="text-sm text-gray-500">
                                        {totalVotes > 0 ? `${Math.round((againstVotes / totalVotes) * 100)}%` : '0%'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Voting
