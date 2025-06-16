"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "../../states/GlobalStates";
import getAuthHeader from "../../utils/authHeader";
import httpRequest from "../../utils/httpRequest";
import WribateCard from "./WribateCard"; // Adjust path as needed

const Home = () => {
  const [user] = useAtom(userAtom);
  const [wribates, setWribates] = useState([]);
  const [filteredWribates, setFilteredWribates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWribates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await httpRequest(
        axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/user/myWribates',
          {
            _id: user._id,
            email: user.email // Fixed: using user.email instead of user._id
          },
          {
            headers: getAuthHeader()
          }
        ),
        null
      );
      
      setWribates(response.wribates);
      setFilteredWribates(response.wribates);
    } catch (err) {
      console.error('Error fetching wribates:', err);
      setError('Failed to load wribates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchWribates();
    }
  }, [user]);

  // Filter wribates based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWribates(wribates);
    } else {
      const filtered = wribates.filter(wribate =>
        wribate.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wribate.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wribate.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wribate.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredWribates(filtered);
    }
  }, [searchQuery, wribates]);

  const handleWribateClick = (wribate) => {
    // Handle wribate card click - navigate to detail page or perform action
    console.log('Clicked wribate:', wribate);
    // Example: router.push(`/wribate/${wribate._id}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading your wribates...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {/* Title and Search Bar Row */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wribates</h1>
              <p className="text-gray-600">
                {wribates.length > 0
                  ? `You have ${wribates.length} wribate${wribates.length !== 1 ? 's' : ''}`
                  : 'No wribates found'
                }
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80 md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search wribates..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-4 text-sm text-gray-600">
              {filteredWribates.length > 0
                ? `Found ${filteredWribates.length} result${filteredWribates.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : `No results found for "${searchQuery}"`
              }
            </div>
          )}
        </div>

        {filteredWribates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredWribates.map((wribate) => (
              <WribateCard
                key={wribate._id}
                wribate={wribate}
                onClick={() => handleWribateClick(wribate)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {searchQuery ? (
              <div>
                <div className="text-gray-500 text-lg mb-4">No matching wribates found</div>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or clear the search to see all wribates.
                </p>
                <button
                  onClick={clearSearch}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors mr-4"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div>
                <div className="text-gray-500 text-lg mb-4">No wribates yet</div>
                <p className="text-gray-400 mb-6">
                  Start creating your first wribate to see it here.
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Create New Wribate
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;