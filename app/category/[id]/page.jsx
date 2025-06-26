"use client"
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import WribateCard from './WribateCard';

const Page = () => {
  const [wribates, setWribates] = useState([]);
  const [lastCreatedAt, setLastCreatedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState("");
  
  const { id } = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const router = useRouter();

  const fetchWribates = async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/category/${id}/?type=${encodeURIComponent(type || '')}&lastCreatedAt=${encodeURIComponent(lastCreatedAt)}`
      );
        
      const data = res.data;
      if (data.res) {
        // Set category name if available
        if (data.categoryName && !category) {
          setCategory(data.categoryName);
        }
        
        // Check if we received new wribates
        if (data.wribates.length > 0) {
          // Properly merge existing and new wribates
          setWribates(prevWribates => [...prevWribates, ...data.wribates]);
          
          // Set the lastCreatedAt from the last item
          const newLastCreatedAt = data.wribates[data.wribates.length - 1].createdAt;
          
          // Check if we've reached the end (same lastCreatedAt means no more pagination)
          if (newLastCreatedAt === lastCreatedAt) {
            setHasMore(false);
          } else {
            setLastCreatedAt(newLastCreatedAt);
          }
        } else {
          // No more wribates to load
          setHasMore(false);
        }
      }
    } catch (err) {
      console.log(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    
    // Trigger fetch when user is within 200px from bottom
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      fetchWribates();
    }
  }, [loading, hasMore, lastCreatedAt]);

  useEffect(() => {
    fetchWribates();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCardClick = (wribate) => {
    // Navigate to wribate details page
    const {_id,code} = wribate
    router.push(`/wribate/${code? code : _id}`);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={handleBackClick}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 mb-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {category || `${type || ''} Wribates`}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading && wribates.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-blue-600 font-medium">Loading Wribates...</p>
            </div>
          </div>
        ) : wribates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {wribates.map((wribate) => (
              <WribateCard
                key={wribate._id}
                wribate={wribate}
                onClick={() => handleCardClick(wribate)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Wribates Found</h3>
              <p className="text-gray-600 mb-4">No content available in this category yet.</p>
              <p className="text-sm text-gray-500">Try checking a different category or come back later.</p>
            </div>
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {loading && wribates.length > 0 && (
          <div className="mt-8 flex justify-center items-center py-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-blue-600 text-sm font-medium">Loading more wribates...</p>
            </div>
          </div>
        )}

        {/* End of content indicator */}
        {!hasMore && wribates.length > 0 && (
          <div className="mt-12 text-center">
            <div className="border-t border-gray-200 pt-8">
              <div className="inline-flex items-center text-gray-500">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                <span className="font-medium">You've reached the end</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;