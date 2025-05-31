import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { FaShareAlt, FaDownload, FaComments } from "react-icons/fa";
import { LiaFileAudioSolid } from "react-icons/lia";
import { MdHowToVote, MdTimeline } from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";

const Header = ({data, setShowSharePopup, scrollToSection, votes, seenSections}) => {
    // ✅ VOTE COUNT EXTRACTION
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
    
    // Calculate other counts
    const argumentsCount = data?.data?.arguments?.length || 0;
    const commentsCount = data?.data?.comments?.length || 0;
    const viewsCount = data?.data?.views || 0;

    // ✅ SMART BADGE VISIBILITY - Only show if not seen AND has content
    const shouldShowBadge = (sectionName, count) => {
        return count > 0 && !seenSections[sectionName];
    };

    return (
        <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm overflow-hidden">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                {data?.data?.title}
            </h1>
            
            <div className="flex flex-row justify-between sm:justify-center bg-gradient-to-r from-red-600 to-blue-900 border-b border-gray-200 text-sm sm:text-lg font-semibold">
                <div className="p-2 sm:p-3 text-center w-[33.33%] text-white break-words truncate sm:truncate-0">
                    {data?.data?.leadFor || "@Test 1"}
                </div>
                <div className="flex items-center  text-white justify-center font-bold text-lg">
                    VS
                </div>
                <div className="p-2 sm:p-3 text-center w-[33.33%] text-white break-words truncate sm:truncate-0">
                    {data?.data?.leadAgainst}
                </div>
            </div>
            
            <div className="p-3 sm:p-4">
                <div className="relative h-56 sm:h-80 w-full">
                    <img
                        src={data?.data?.coverImage}
                        alt="Debate Cover Image"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                </div>
            </div>
            
            {/* ✅ SMART NAVIGATION WITH CONDITIONAL BADGES */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm mb-3 sm:mb-0">
                        <Badge className="font-semibold mb-1 sm:mb-0">{data?.data?.category}</Badge>
                        {data?.data?.institution && (
                            <Badge className="font-semibold">{data.data.institution}</Badge>
                        )}
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm">
                        <Eye size={16} className="mr-1" />
                        <span className="font-medium">{viewsCount.toLocaleString()} views</span>
                    </div>
                </div>

                {/* NAVIGATION TABS WITH SMART BADGES */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Progress Navigation */}
                    <button 
                        className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                        onClick={() => scrollToSection('progress')}
                        title="View Wribate Progress"
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-full mb-2 transition-colors duration-300">
                            <MdTimeline size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 mb-1">Progress</span>
                        <span className="text-xs text-gray-500 group-hover:text-blue-500">View Timeline</span>
                    </button>
                    
                    {/* ✅ VOTING NAVIGATION - SMART BADGE */}
                    <button 
                        className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                        onClick={() => scrollToSection('voting')}
                        title="Cast Your Vote"
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-full mb-2 transition-colors duration-300 relative">
                            <MdHowToVote size={20} className="text-purple-600" />
                            {shouldShowBadge('voting', totalVotes) && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                                    {totalVotes > 99 ? '99+' : totalVotes}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 mb-1">
                            Vote ({totalVotes})
                        </span>
                        <span className="text-xs text-gray-500 group-hover:text-purple-500">
                            {totalVotes > 0 ? `${totalVotes} total votes` : 'Be first to vote'}
                        </span>
                    </button>
                    
                    {/* ✅ ARGUMENTS NAVIGATION - SMART BADGE */}
                    <button 
                        className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                        onClick={() => scrollToSection('arguments')}
                        title="Read Arguments"
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-full mb-2 transition-colors duration-300 relative">
                            <BiMessageSquareDetail size={20} className="text-green-600" />
                            {shouldShowBadge('arguments', argumentsCount) && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                                    {argumentsCount > 99 ? '99+' : argumentsCount}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 mb-1">
                            Arguments ({argumentsCount})
                        </span>
                        <span className="text-xs text-gray-500 group-hover:text-green-500">
                            {argumentsCount > 0 ? `${argumentsCount} arguments` : 'No arguments yet'}
                        </span>
                    </button>
                    
                    {/* ✅ COMMENTS NAVIGATION - SMART BADGE */}
                    <button 
                        className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                        onClick={() => scrollToSection('comments')}
                        title="Join Discussion"
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-full mb-2 transition-colors duration-300 relative">
                            <FaComments size={18} className="text-orange-600" />
                            {shouldShowBadge('comments', commentsCount) && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                                    {commentsCount > 99 ? '99+' : commentsCount}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-700 mb-1">
                            Comments ({commentsCount})
                        </span>
                        <span className="text-xs text-gray-500 group-hover:text-orange-500">
                            {commentsCount > 0 ? `${commentsCount} comments` : 'Start discussion'}
                        </span>
                    </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex flex-wrap justify-center gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button className="group flex items-center px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 text-sm">
                        <FaDownload size={14} className="mr-2 text-gray-600 group-hover:text-gray-700" />
                        <span className="text-gray-700 group-hover:text-gray-800">Download</span>
                    </button>
                    
                    <button className="group flex items-center px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 text-sm">
                        <LiaFileAudioSolid size={16} className="mr-2 text-gray-600 group-hover:text-gray-700" />
                        <span className="text-gray-700 group-hover:text-gray-800">Audio</span>
                    </button>
                    
                    <button
                        className="group flex items-center px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 text-sm"
                        onClick={() => setShowSharePopup(true)}
                    >
                        <FaShareAlt size={14} className="mr-2 text-gray-600 group-hover:text-gray-700" />
                        <span className="text-gray-700 group-hover:text-gray-800">Share</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header
