"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import authHeader from '../utils/authHeader';

export default function WribateDashboard() {
  const [wribates, setWribates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();

  const categories = ['All', 'Technology', 'Science', 'Politics', 'Economics', 'Education', 'Philosophy', 'Arts'];

  useEffect(() => {
    const fetchWribates = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getByCategory/' + activeCategory, 
          { headers: authHeader() }
        );

        const data = res.data;

        if (data.res) {
          setWribates(data.wribates);
          setIsLoading(false);
        } else {
          toast.error("Error occurred");
        }
      } catch (err) {
        console.log(err);
        toast.error("Client error");
        setIsLoading(false);
      }
    };
    fetchWribates();
  }, [activeCategory]);

  const handleCardClick = (id) => {
    router.push(`/wribate/${id}`);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  };

  const getWribateStatus = (startDate, durationDays) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + durationDays);
    
    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Active";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format view count to display 'k' after 999
  const formatViews = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count;
  };

  // Filter wribates based on active category
  const filteredWribates = wribates.filter(wribate => 
    activeCategory === 'All' || wribate.category === activeCategory
  );

  // Sort wribates by created date for most recent
  const sortedWribates = [...filteredWribates].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Extract the most recent wribate and remaining wribates
  const mostRecentWribate = sortedWribates.length > 0 ? sortedWribates[0] : null;
  const remainingWribates = sortedWribates.length > 1 ? sortedWribates.slice(1) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-2 mr-2 sm:px-4 sm:mr-4 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Featured latest wribate */}
            {mostRecentWribate && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4">Latest Wribate</h2>
                <div 
                  onClick={() => handleCardClick(mostRecentWribate._id)}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-64 relative">
                      <img
                        src={mostRecentWribate.coverImage}
                        alt={mostRecentWribate.title}
                        className="absolute inset-0 w-full h-full object-contain object-center"
                      />
                    </div>
                    <div className="p-4 sm:p-6 md:p-6 md:w-2/3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0 pr-2">{mostRecentWribate.title}</h3>
                        <span className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${getStatusColor(getWribateStatus(mostRecentWribate.startDate, mostRecentWribate.durationDays))} inline-flex items-center justify-center whitespace-nowrap`}>
                          {getWribateStatus(mostRecentWribate.startDate, mostRecentWribate.durationDays)}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2 sm:gap-0">
                          <div>
                            <span className="font-medium text-gray-700">For:</span> 
                            <span className="text-gray-600 ml-1">{mostRecentWribate.leadFor.split('@')[0]}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Against:</span> 
                            <span className="text-gray-600 ml-1">{mostRecentWribate.leadAgainst.split('@')[0]}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 mt-3 pt-2 border-t border-gray-100">
                          <span>{getTimeAgo(mostRecentWribate.createdAt)}</span>
                          <span>{formatViews(Math.floor(Math.random() * 10000000))} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All other wribates */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {remainingWribates.map((wribate) => {
                const status = getWribateStatus(wribate.startDate, wribate.durationDays);
                const statusColor = getStatusColor(status);
                
                return (
                  <div
                    key={wribate._id}
                    onClick={() => handleCardClick(wribate._id)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="h-32 sm:h-40 relative overflow-hidden">
                      <img
                        src={wribate.coverImage}
                        alt={wribate.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1 pr-2">{wribate.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor} whitespace-nowrap inline-flex items-center justify-center`}>
                          {status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center text-sm gap-1 xs:gap-0">
                          <div>
                            <span className="font-medium text-gray-700">For:</span> 
                            <span className="text-gray-600 ml-1">{wribate.leadFor.split('@')[0]}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Against:</span> 
                            <span className="text-gray-600 ml-1">{wribate.leadAgainst.split('@')[0]}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                          <span>{getTimeAgo(wribate.createdAt)}</span>
                          <span>{formatViews(Math.floor(Math.random() * 10000000))} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        )}
      </div>
    </div>
  );
}