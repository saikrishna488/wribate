import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { FaShareAlt, FaDownload, FaComments } from "react-icons/fa";
import { LiaFileAudioSolid } from "react-icons/lia";

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
                <div className="relative h-56 sm:h-80 w-full">
                    <img
                        src={data?.data?.coverImage}
                        alt="Debate Cover Image"
                        className="absolute top-0 left-0 w-full h-full object-cover"
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
        </div>
    )
}

export default Header
