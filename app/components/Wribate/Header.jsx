import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { FaShareAlt, FaDownload, FaComments } from "react-icons/fa";
import { LiaFileAudioSolid } from "react-icons/lia";
import { MdHowToVote, MdTimeline } from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";

<<<<<<< HEAD
const Header = ({data, setShowSharePopup}) => {
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
                <div className="relative h-56 sm:h-80 w-full mx-auto sm:w-[80%]">
                    <img
                        src={data?.data?.coverImage}
                        alt="Debate Cover Image"
                        className="absolute top-0 left-0 w-full h-full object-fill"
                    />
                </div>
            </div>
            
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between items-start sm:items-center border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm mb-3 sm:mb-2 md:mb-0 w-full sm:w-auto">
                    <Badge className="font-semibold mb-1 sm:mb-0">{data?.data?.category}</Badge>
                    {data?.data?.institution && (
                        <Badge className="font-semibold">{data.data.institution}</Badge>
                    )}
                </div>
                
                <div className="flex flex-wrap gap-3 sm:gap-4">
                    <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                        <Eye size={14} className="mr-1" />
                        <span>{data?.data?.views}</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                        <FaComments size={14} className="mr-1" />
                        <span>{data?.data?.comments?.length}</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                        <FaDownload size={14} className="mr-1" />
                        <span>Download</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                        <LiaFileAudioSolid size={16} className="mr-1" />
                        <span>Audio</span>
                    </button>
                    <button
                        className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
                        onClick={() => setShowSharePopup(true)}
                    >
                        <FaShareAlt size={14} className="mr-1" />
                        <span>Share</span>
                    </button>
                </div>
            </div>
=======
const Header = ({ data, setShowSharePopup, scrollToSection, votes }) => {
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
  const argCount    = data?.data?.arguments?.length || 0;
  const comCount    = data?.data?.comments?.length  || 0;
  const viewsCount  = data?.data?.views             || 0;

  // Define each action button
  const actions = [
    { key: "progress",  icon: MdTimeline,             title: "Progress" },
    { key: "voting",    icon: MdHowToVote,            title: "Vote",      count: totalVotes },
    { key: "arguments", icon: BiMessageSquareDetail,  title: "Arguments", count: argCount,   highlight: true },
    { key: "comments",  icon: FaComments,              title: "Comments",  count: comCount },
    { key: "download",  icon: FaDownload,              title: "Download" },
    { key: "audio",     icon: LiaFileAudioSolid,       title: "Audio" },
    { key: "share",     icon: FaShareAlt,              title: "Share",     action: () => setShowSharePopup(true) },
  ];

  return (
    <div className="bg-white border border-gray-200 shadow-sm mb-4 rounded-sm overflow-hidden">
      {/* Title */}
      <h1 className="text-2xl font-bold p-3 border-b bg-gray-50">
        {data?.data?.title}
      </h1>

      {/* VS Banner */}
      <div className="flex items-center justify-center bg-gradient-to-r from-red-600 to-blue-900 text-white text-sm font-semibold">
        <div className="w-1/3 p-2 text-center truncate">{data?.data?.leadFor}</div>
        <div className="font-bold">VS</div>
        <div className="w-1/3 p-2 text-center truncate">{data?.data?.leadAgainst}</div>
      </div>

      {/* Cover Image */}
      <div className="p-3 border-t">
        <img
          src={data?.data?.coverImage}
          alt="Cover"
          className="w-full h-48 object-cover rounded"
        />
      </div>

      {/* Single‐line nav */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center flex-wrap space-x-2">
          {/* Category badge */}
          <Badge className="px-2 py-1 text-xs flex-shrink-0 transition hover:opacity-80">
            {data?.data?.category}
          </Badge>
          {data?.data?.institution && (
            <Badge className="px-2 py-1 text-xs flex-shrink-0 transition hover:opacity-80">
              {data.data.institution}
            </Badge>
          )}

          {/* Buttons */}
          <div className="flex flex-1 min-w-0 space-x-2">
            {actions.map(({ key, icon: Icon, title, count, highlight, action }) => (
              <button
                key={key}
                onClick={() => (action ? action() : scrollToSection(key))}
                title={count != null ? `${title} (${count})` : title}
                className={`
                  flex-1 flex items-center justify-center p-2 bg-white rounded-lg
                  ${highlight
                    ? "border-2 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                    : "border border-gray-200 hover:shadow-sm hover:border-gray-300"
                  }
                  transition-transform duration-200 ease-out
                  hover:scale-105
                  relative
                `}
              >
                <Icon
                  size={16}
                  className={`
                    pointer-events-none mr-1
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
                {count != null && (
                  <span className="pointer-events-none text-xs font-medium text-gray-700">
                    ({count})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Views */}
          <div className="flex-shrink-0 flex items-center text-gray-600 text-xs space-x-1">
            <Eye size={14} className="mr-1" />
            <span>{viewsCount.toLocaleString()} views</span>
          </div>
>>>>>>> 6402724e6778581c6cebe42528c43b30c760b9fd
        </div>
  );
};

export default Header;
