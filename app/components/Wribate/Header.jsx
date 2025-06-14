import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { FaShareAlt, FaDownload, FaComments } from "react-icons/fa";
import { LiaFileAudioSolid } from "react-icons/lia";
import { MdHowToVote, MdTimeline } from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";

const Header = ({ wribate, setShowSharePopup, scrollToSection, votes }) => {
  // Vote count extraction
  const getVoteCounts = () => {
    let total = 0, forVotes = 0, againstVotes = 0;
    if (votes?.totalVotes != null) {
      total = votes.totalVotes;
    } else if (Array.isArray(votes?.roundVoteCounts)) {
      votes.roundVoteCounts.forEach(r => {
        forVotes += r.forVotes || 0;
        againstVotes += r.againstVotes || 0;
      });
      total = forVotes + againstVotes;
    }
    return total;
  };

  const totalVotes = getVoteCounts();
  const argCount    = wribate?.arguments?.length || 0;
  const comCount    = wribate?.comments?.length  || 0;
  const viewsCount  = wribate?.views             || 0;

  // Define each action button
  const actions = [
    { key: "progress",  icon: MdTimeline,             title: "Progress", shortTitle: "Progress" },
    { key: "voting",    icon: MdHowToVote,            title: "Vote",      count: totalVotes, shortTitle: "Vote" },
    { key: "arguments", icon: BiMessageSquareDetail,  title: "Arguments", count: argCount,   highlight: true, shortTitle: "Args" },
    { key: "comments",  icon: FaComments,              title: "Comments",  count: comCount, shortTitle: "Comments" },
    { key: "download",  icon: FaDownload,              title: "Coming soon Download", shortTitle: "Download" },
    { key: "audio",     icon: LiaFileAudioSolid,       title: "Coming soon Audio Mode", shortTitle: "Audio" },
    { key: "share",     icon: FaShareAlt,              title: "Share",     action: () => setShowSharePopup(true), shortTitle: "Share" },
  ];

  return (
    <div className="bg-white border border-gray-200 shadow-sm mb-4 rounded-sm overflow-hidden">
      {/* Title */}
      <h1 className="text-lg sm:text-2xl font-bold p-3 sm:p-4 border-b bg-gray-50 leading-tight">
        {wribate?.title}
      </h1>

      {/* VS Banner */}
      <div className="flex items-center justify-center bg-gradient-to-r from-red-600 to-blue-900 text-white text-xs sm:text-sm font-semibold">
        <div className="flex-1 p-2 sm:p-3 text-center truncate min-w-0">
          <span className="block">{wribate?.leadFor}</span>
        </div>
        <div className="font-bold px-2 text-sm sm:text-base">VS</div>
        <div className="flex-1 p-2 sm:p-3 text-center truncate min-w-0">
          <span className="block">{wribate?.leadAgainst}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="p-2 sm:p-3 h-48 sm:h-44 md:h-80 border-t">
        <img
          src={wribate?.coverImage}
          alt="Cover"
          className="w-full h-full object-contain rounded"
        />
      </div>

      {/* Navigation Section */}
      <div className="p-2 sm:p-3 border-t border-gray-200 bg-gray-50">
        {/* Categories Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center flex-wrap gap-1.5">
            <Badge className="px-2 py-1 text-xs flex-shrink-0 transition hover:opacity-80">
              {wribate?.category}
            </Badge>
            {wribate?.institution && (
              <Badge className="px-2 py-1 text-xs flex-shrink-0 transition hover:opacity-80">
                {wribate?.institution}
              </Badge>
            )}
          </div>
          
          {/* Views - Mobile positioned top right */}
          <div className="flex-shrink-0 flex items-center text-gray-600 text-xs">
            <Eye size={12} className="mr-1" />
            <span className="hidden xs:inline">{viewsCount.toLocaleString()} views</span>
            <span className="xs:hidden">{viewsCount > 999 ? `${Math.floor(viewsCount/1000)}k` : viewsCount}</span>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
          {actions.map(({ key, icon: Icon, title, count, highlight, action }) => (
            <button
              key={key}
              onClick={() => (action ? action() : scrollToSection(key))}
              title={count != null ? `${title} (${count})` : title}
              className={`
                flex flex-col items-center justify-center p-1 sm:p-2 bg-white rounded-lg
                min-h-[60px] sm:min-h-[70px]
                ${highlight
                  ? "border-2 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                  : "border border-gray-200 hover:shadow-sm hover:border-gray-300"
                }
                transition-all duration-200 ease-out
                active:scale-95 sm:hover:scale-105
                touch-manipulation
                relative
              `}
            >
              <Icon
                size={24}
                className={`
                  pointer-events-none
                  ${highlight
                    ? "text-red-600"
                    : key === "progress"
                      ? "text-blue-600"
                      : key === "voting"
                        ? "text-purple-600"
                        : key === "comments"
                          ? "text-orange-600"
                          : key === "download"
                            ? "text-indigo-600"
                            : key === "audio"
                              ? "text-teal-600"
                              : "text-gray-600"
                  }
                `}
              />
              
              {/* Count - only show if exists */}
              {count != null && (
                <span className="text-xs font-medium text-gray-600 mt-1">
                  {count > 999 ? `${Math.floor(count/1000)}k+` : count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;