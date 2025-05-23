'use client';

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchX, MoreHorizontal, Loader } from "lucide-react";
import { debateAtom, userAtom } from "../states/GlobalStates";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import authHeader from "../utils/authHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import DebateCard from '../components/Propose-Wribates/ProposeCard';

export default function ProposeWribateContent() {
  const [debates, setDebates] = useState([]);
  const [user] = useAtom(userAtom);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hook, setHook] = useState(false);
  const [lastId, setLastId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const filteredDebates = selectedCategory === "All"
    ? debates
    : debates.filter((debate) => debate.category === selectedCategory);

  // Function to fetch wribates
  const fetchWribates = async (reset = false) => {
    try {
      setIsLoading(true);
      // If reset is true, we're changing categories, so we need to reset debates and lastId
      const id = reset ? "" : lastId;
      
      const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose/' + selectedCategory + '?lastId=' + id);
      const data = res.data;
      
      if (data.res) {
        // If we're resetting, replace the debates array, otherwise append to it
        if (reset) {
          setDebates(data?.propose || []);
        } else {
          setDebates([...debates, ...data?.propose]);
        }
        
        // Update lastId for pagination
        const newLastId = data.propose?.[data.propose.length - 1]?._id;
        setLastId(newLastId || null);
        
        // Check if we have more to load
        setHasMore(data.propose && data.propose.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load debates");
    } finally {
      setIsLoading(false);
    }
  };

  // When category changes, reset and fetch new debates
  useEffect(() => {
    setDebates([]);
    setLastId("");
    fetchWribates(true);
  }, [selectedCategory, hook]);

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
        toast.error("Error occurred while fetching categories");
      }
    };

    fetchCategories();
  }, []);

  // Handle load more button click
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchWribates();
    }
  };

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

              <DropdownMenuContent align="start" className="p-2">
                <div className="grid sm:grid-cols-4 grid-cols-3 gap-2">
                  {dropdownCategories.map((cat, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onSelect={() => setSelectedCategory(cat)}
                      className={`text-sm px-2 py-2 rounded transition-colors duration-200 whitespace-nowrap cursor-pointer
            ${selectedCategory === cat
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-gray-100'}
          `}
                    >
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>

      {filteredDebates.length > 0 ? (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDebates.map((debate) => (
              <DebateCard
                key={debate._id}
                user={user}
                debate={debate}
                setHook={setHook}
                hook={hook}
              />
            ))}
          </div>
          
          {/* Load More Button */}
          <div className="flex justify-center mt-8 mb-4">
            {hasMore && (
              <Button 
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-blue-900 text-white hover:bg-blue-800 transition-colors px-8 py-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Wribates'
                )}
              </Button>
            )}
            
            {!hasMore && filteredDebates.length > 0 && (
              <p className="text-gray-500 text-sm">No more wribates to load</p>
            )}
          </div>
        </>
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