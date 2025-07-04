'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchX, MoreHorizontal, Loader, Search, ChevronDown } from "lucide-react";
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
import CountryDropdown from '../components/Propose-Wribates/CountryDropdown'

export default function ProposeWribateContent() {
  const [debates, setDebates] = useState([]);
  const [user] = useAtom(userAtom);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [hook, setHook] = useState(false);
  const [lastId, setLastId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const countryDropdownRef = useRef(null);

  // Filter debates by both category and country
  const filteredDebates = debates.filter((debate) => {
    const categoryMatch = selectedCategory === "All" || debate.category === selectedCategory;
    const countryMatch = selectedCountry === "All Countries" || debate.country === selectedCountry;
    return categoryMatch && countryMatch;
  });

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Function to fetch wribates
  const fetchWribates = async (reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    try {
      setIsLoading(true);
      // If reset is true, we're changing categories, so we need to reset debates and lastId
      const id = reset ? "" : lastId;

      const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose/' + selectedCategory + '?lastId=' + id + "&user_id=" + user?._id);
      const data = res.data;

      if (data.res) {
        const newDebates = data?.propose || [];

        // If we're resetting, replace the debates array, otherwise append to it
        if (reset) {
          setDebates(newDebates);
        } else {
          // Filter out duplicates before adding to prevent key conflicts
          setDebates(prevDebates => {
            const existingIds = new Set(prevDebates.map(debate => debate._id));
            const uniqueNewDebates = newDebates.filter(debate => !existingIds.has(debate._id));
            return [...prevDebates, ...uniqueNewDebates];
          });
        }

        // Update lastId for pagination
        const newLastId = newDebates?.[newDebates.length - 1]?._id;
        setLastId(newLastId || null);

        // Check if we have more to load
        setHasMore(newDebates && newDebates.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load debates");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;

    // Trigger fetch when user is within 200px from bottom
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      fetchWribates(false);
    }
  }, [isLoading, hasMore, lastId, selectedCategory, user]);

  // When category changes, reset and fetch new debates
  useEffect(() => {
    setDebates([]);
    setLastId("");
    setHasMore(true);
    fetchWribates(true);
  }, [selectedCategory, hook]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://restcountries.com/v3.1/all?fields=name');
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getCountries')
        // Sort countries alphabetically by name
        const sortedCountries = response.data.data?.
          map(country => country.countryName)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sortedCountries);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching countries");
        // Fallback to empty array if API fails
        setCountries([]);
      }
    };

    fetchCountries();
  }, []);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
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
    <div className="container mx-auto min-h-screen bg-[#F3F2EF]">
      {/* Top Categories with Country Filter and Dropdown for more */}
      <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mb-2 px-4 py-4 w-full border-b bg-white mx-auto">
        {/* Categories Navigation */}
        <div className="w-full overflow-hidden">
          <nav className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {visibleCategories.map((cat, idx) => (
              <button
                key={`category-${idx}`}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm px-3 py-1 transition-colors duration-200 whitespace-nowrap flex-shrink-0
                  ${selectedCategory === cat
                    ? 'border-b-2 border-blue-900 font-medium text-blue-900'
                    : 'text-gray-700 hover:text-blue-700'}
                `}
              >
                {cat}
              </button>
            ))}

            {dropdownCategories.length > 0 && (
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="text-sm px-3 py-1 transition-colors duration-200 text-gray-700 hover:text-blue-700 focus:outline-none flex-shrink-0"
                    aria-label="More categories"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="p-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dropdownCategories.map((cat, idx) => (
                      <DropdownMenuItem
                        key={`dropdown-category-${idx}`}
                        onSelect={() => {
                          setSelectedCategory(cat);
                          setIsDropdownOpen(false);
                        }}
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

        {/* Country Filter Dropdown and Propose Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Country Dropdown */}
          <CountryDropdown
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
            className="w-full sm:w-auto sm:min-w-[200px]"
          />

          <Button
            onClick={() => {
              if (user?._id) {
                router.push('/propose-wribate/propose');
              } else {
                toast.error("Please login to propose a topic.");
              }
            }}
            className="bg-blue-900 hover:bg-blue-800 whitespace-nowrap"
          >
            Propose a Topic
          </Button>
        </div>
      </header>
      
      {filteredDebates.length > 0 ? (
        <>
          <div className="grid gap-6 grid-cols-1 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDebates.map((debate, index) => (
              <DebateCard
                key={`${debate._id}-${index}`}
                user={user}
                debate={debate}
                setHook={setHook}
                hook={hook}
              />
            ))}
          </div>

          {/* Loading indicator for infinite scroll */}
          {isLoading && filteredDebates.length > 0 && (
            <div className="flex justify-center mt-8 mb-4">
              <div className="flex items-center text-blue-900">
                <Loader size={16} className="mr-2 animate-spin" />
                <span className="text-sm font-medium">Loading more wribates...</span>
              </div>
            </div>
          )}

          {/* End of content indicator */}
          {!hasMore && filteredDebates.length > 0 && (
            <div className="flex justify-center mt-8 mb-4">
              <div className="flex items-center text-gray-500">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                <span className="text-sm font-medium">You've reached the end</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <SearchX size={40} className="text-gray-300 mb-2" />
          <p className="text-gray-500">No topics are available to show</p>
          <p className="text-sm text-gray-400 mt-1">
            Try selecting a different category{selectedCountry !== "All Countries" && " or country"} or propose a new topic
          </p>
        </div>
      )}
    </div>
  );
}