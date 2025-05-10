"use client"

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { debateAtom, userAtom } from "../states/GlobalStates";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User, ArrowUpCircle, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import authHeader from "../utils/authHeader";
import { setCategories } from "../features/categoriesSlice";

export default function DiscoverHotTopicsPage() {
  const [debates, setDebates] = useState([]);
  const [user] = useAtom(userAtom);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([])
  const navRef = useRef(null);

  // const categories = ["All", "Politics", "Education", "Sports", "Technology", "Country"];

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
        })

        const data = res.data
        console.log(data)

        if (data.res) {
          setCategories(data.categories)
        }
      }
      catch (err) {
        console.log(err);
        toast.error("error occured")
      }
    }

    fetchCategories()
  }, [])

  const scrollNav = (direction) => {
    if (navRef.current) {
      const scrollAmount = 150;
      navRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  if(categories.length==0){
    return (
      <div>
        Loading
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-100">
      {/* Navigation Menu with Scroll Buttons */}
      <div className="flex items-center mb-4 sm:w-[90vw] mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="mr-1"
          onClick={() => scrollNav('left')}
        >
          <ChevronLeft size={20} />
        </Button>

        <nav ref={navRef} className="flex gap-3 overflow-x-auto pb-2 flex-grow scrollbar-hide">

          <button
            onClick={() => setSelectedCategory("All")}
            className={`text-sm px-3 py-1 transition-colors duration-200 whitespace-nowrap
                ${selectedCategory === "All"
                ? 'border-b-2 border-blue-900 font-medium text-blue-900'
                : 'text-gray-700 hover:text-blue-700'}
              `}
          >
            {"All"}
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.categoryName)}
              className={`text-sm px-3 py-1 transition-colors duration-200 whitespace-nowrap
                ${selectedCategory === cat.categoryName
                  ? 'border-b-2 border-blue-900 font-medium text-blue-900'
                  : 'text-gray-700 hover:text-blue-700'}
              `}
            >
              {cat.categoryName}
            </button>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="ml-1"
          onClick={() => scrollNav('right')}
        >
          <ChevronRight size={20} />
        </Button>
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
    <div className="bg-white shadow-md p-4 flex flex-col gap-2 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center">
        <div
          onClick={handleProfileClick}
          className="flex items-center cursor-pointer text-gray-800 hover:text-blue-700"
        >
          <User size={16} className="text-gray-400" />
        </div>
        <Button onClick={handleLaunch} variant="outline" size="sm" className="text-xs flex gap-1 items-center">
          <PlayCircle size={14} /> Launch
        </Button>
      </div>

      <h2 className="text-md font-bold text-gray-700">{debate.title}</h2>

      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
        <span>{debate.country}</span>
        <Badge variant="secondary">{debate.category}</Badge>
        <Badge variant="outline">{debate.tag}</Badge>
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{debate?.context || "No context provided."}</div>

      <Button onClick={handleUpvote} variant="ghost" className="flex gap-1 items-center text-sm self-end">
        <ArrowUpCircle size={16} /> {votes}
      </Button>
    </div>
  );
}