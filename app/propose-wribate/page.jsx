"use client"

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchX, MoreHorizontal } from "lucide-react";
import { debateAtom, userAtom } from "../states/GlobalStates";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User, ArrowUpCircle, PlayCircle } from "lucide-react";
import authHeader from "../utils/authHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DiscoverHotTopicsPage() {
  const [debates, setDebates] = useState([]);
  const [user] = useAtom(userAtom);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredDebates = selectedCategory === "All"
    ? debates
    : debates.filter((debate) => debate.category === selectedCategory);

  useEffect(() => {
    const fetchWrites = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose/' + selectedCategory, {
          withCredentials: true,
          headers: authHeader()
        });
        const data = res.data;
        if (data.res) setDebates(data.propose);
      } catch (err) {
        console.log(err);
      }
    };
    fetchWrites();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getallcategories', {
          headers: authHeader()
        });

        const data = res.data;
        if (data.res) {
          setCategories(data.categories);
        }
      }
      catch (err) {
        console.log(err);
        toast.error("error occurred");
      }
    };

    fetchCategories();
  }, []);

  // Separate the visible and dropdown categories
  const visibleCategories = ["All", ...categories.slice(0, 6).map(cat => cat.categoryName)];
  const dropdownCategories = categories.slice(6).map(cat => cat.categoryName);

  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-100">
      {/* Top Categories with Dropdown for more */}
      <div className="flex items-center mb-6 sm:w-[90vw] mx-auto">
        <nav className="flex gap-3 overflow-x-auto pb-2 flex-grow scrollbar-hide">
          {visibleCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`text-sm px-3 py-1 transition-colors duration-200 whitespace-nowrap
                ${selectedCategory === cat
                  ? 'border-b-2 border-blue-900 font-medium text-blue-900'
                  : 'text-gray-700 hover:text-blue-700'}
              `}
            >
              {cat}
            </button>
          ))}

          {dropdownCategories.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm px-3 py-1 transition-colors duration-200 text-gray-700 hover:text-blue-700 focus:outline-none">
                  <MoreHorizontal size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className=" p-2">
                <div className="grid sm:grid-cols-4 grid-cols-3 gap-2">
                  {dropdownCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`text-sm px-2 py-2 rounded transition-colors duration-200 whitespace-nowrap
                        ${selectedCategory === cat
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>

      {filteredDebates.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDebates.map((debate) => (
            <DebateCard
              key={debate._id}
              user={user}
              debate={debate}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <SearchX size={40} className="text-gray-300 mb-2" />
          <p className="text-gray-500">No topics are available to show</p>
          <p className="text-sm text-gray-400 mt-1">Try selecting a different category or propose a new topic</p>
        </div>
      )}
    </div>
  );
}

function DebateCard({ debate, user }) {
  const [votes, setVotes] = useState(debate.votes);
  const [propDebate, setPropDebate] = useAtom(debateAtom);
  const router = useRouter();

  const handleUpvote = async () => {
    try {
      if (!user?._id) {
        toast.error("Login to vote");
        return;
      }

      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user._id,
          propose_id: debate._id
        })
      });

      const data = await res.json();
      if (data.res) {
        toast.success("Voted successfully");
        setVotes((prev) => prev + 1);
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
    router.push(`/profile/${debate.user_id || ''}`);
  };

  return (
    <div className="bg-white border border-gray-200 flex flex-col gap-2">
      {/* Category banner */}
      <div className="bg-blue-900 text-white text-xs px-3 py-1 uppercase tracking-wider font-medium">
        {debate.category}
      </div>
      
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{debate.title}</h2>
        
        {/* Context */}
        <div className="text-sm text-gray-700 border-l-4 border-gray-200 pl-3">
          {debate?.context || "No context provided."}
        </div>
        
        {/* Metadata */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
          <div className="flex w-6 h-6 justify-center items-center rounded-full border">
            <User size={14} className="" />
          </div>
          <span>•</span>
          <span>{debate.country}</span>
          <span>•</span>
          <Badge variant="outline" className="bg-gray-50">
            {debate.tag}
          </Badge>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100">
          <Button 
            onClick={handleUpvote} 
            variant="outline" 
            size="sm" 
            className="flex gap-1 items-center text-blue-900 border-blue-900 hover:bg-blue-50"
          >
            <ArrowUpCircle size={16} /> {votes} Votes
          </Button>
          
          <Button 
            onClick={handleLaunch} 
            variant="default" 
            size="sm" 
            className="flex gap-1 items-center text-white bg-blue-900 hover:bg-blue-800"
          >
            <PlayCircle size={16} /> Launch Debate
          </Button>
        </div>
      </div>
    </div>
  );
}