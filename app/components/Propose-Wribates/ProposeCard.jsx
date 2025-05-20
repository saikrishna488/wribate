import { useRouter } from "next/navigation";
import { User, ArrowUpCircle, PlayCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { debateAtom, userAtom } from "../../states/GlobalStates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import Image from "next/image";
import axios from "axios";
import authHeader from "@/app/utils/authHeader";

function DebateCard({ debate, user, setHook, hook }) {
  const [votes, setVotes] = useState(debate.votes);
  const [propDebate, setPropDebate] = useAtom(debateAtom);
  const [users, setUsers] = useState([]);
  const router = useRouter();



  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/getusers?wribateId=' + encodeURIComponent(debate._id))
        const data = res.data;


        if (data.res) {
          setUsers(data.users);
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    fetchUsers();
  }, [hook])

  // const

  const handleUpvote = async (vote) => {
    try {
      if (!user?._id) {
        toast.error("Login to vote");
        return;
      }

      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose-vote', {
        id: user._id,
        propose_id: debate._id,
        voteSide: vote
      }, {
        headers: authHeader()
      });

      const data = res.data;
      if (data.res) {
        toast.success("Voted successfully");
        setVotes((prev) => prev + 1);
        vote == "for" ? debate.votesFor += 1 : debate.votesAgainst += 1
      } else {
        toast.success("Already voted!");
      }
    } catch (err) {
      toast.error("Error voting");
      console.log(err);
    }
  };

  const handleLaunch = () => {
    setPropDebate(debate);
    router.push('/create-wribate');
  };

  const handleProfileClick = () => {
    router.push(`/profile/${debate.username || ''}`);
  };

  // Truncate context to 120 characters
  const truncatedContext = debate?.context ?
    debate.context.length > 120 ?
      `${debate.context.substring(0, 120)}...` :
      debate.context :
    "No context provided.";


  function formatLikes(number) {
    if (number < 1000) return number.toString();

    const units = ["", "K", "M", "B", "T"];
    const index = Math.floor(Math.log10(number) / 3);
    const shortNumber = number / Math.pow(1000, index);

    return `${shortNumber.toFixed(1).replace(/\.0$/, "")}${units[index]}`;
  }
  return (
    <div className="bg-white border border-gray-200 shadow-sm flex flex-col h-full">
      {/* Category banner */}
      <div className="bg-blue-900 text-white text-xs px-3 py-1 uppercase tracking-wider font-medium">
        {debate.category}
      </div>

      <div className="p-4 flex flex-col h-full">
        {/* User info row - fixed height */}
        <div className="flex items-center gap-2 cursor-pointer h-10" onClick={handleProfileClick}>
          {debate.profilePhoto ? (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
              <Image
                src={debate.profilePhoto}
                alt={debate.username || "User"}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-100 border border-gray-200 flex-shrink-0">
              <User size={16} className="text-gray-600" />
            </div>
          )}
          <span className="font-medium text-sm text-gray-800">{debate.username || "Anonymous"}</span>
        </div>

        {/* Title - fixed height */}
        <div className="min-h-[3rem] mb-2">
          <h2 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">{debate.title}</h2>
        </div>

        {/* Context - fixed height */}
        <div className="text-sm text-gray-700 border-l-4 border-gray-200 pl-3 min-h-[3rem] mb-2">
          <p className="line-clamp-3">{truncatedContext}</p>
        </div>

        {/* Country and tags - fixed height */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 min-h-[2rem] mb-2">
          <span className="font-medium">{debate.country}</span>
          <span>•</span>
          <div className="flex flex-wrap gap-1">
            {debate.tags && Array.isArray(debate.tags) && debate.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* For/Against buttons - fixed height */}
        <div className="flex gap-2 h-10 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpvote("for")}
            className="flex gap-1 items-center border-red-600 text-red-600 hover:bg-green-50"
          >
            <ThumbsUp size={14} /> For {` ${formatLikes(debate.votesFor)}`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpvote("against")}
            className="flex gap-1 items-center border-blue-600 text-blue-600 hover:bg-red-50"
          >
            <ThumbsDown size={14} /> Against {` ${formatLikes(debate.votesAgainst)}`}
          </Button>
        </div>

        {/* Bottom row - user icons and launch button - fixed height */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100 h-12">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {users.map((user, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden flex-shrink-0"
                >
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={`User ${i}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-900 text-white flex items-center justify-center text-xs uppercase">
                      {user?.name?.[0] || "?"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>


          <Button
            onClick={handleLaunch}
            variant="default"
            size="sm"
            className="flex gap-1 items-center text-white bg-blue-900 hover:bg-blue-800"
          >
            <PlayCircle size={16} /> Quick Launch
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DebateCard;