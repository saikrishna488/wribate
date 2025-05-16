"use client"
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const WribateCard = ({ wribate, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white cursor-pointer border-0 hover:shadow-lg transition-shadow w-full group"
    >
      <div className="flex flex-row  relative overflow-hidden">
        <div className="flex-grow p-4 ">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-900 transition-colors">{wribate.title}</h3>
          <div className="flex flex-row items-center gap-2 text-xs text-gray-600">
            <span className="bg-blue-100 text-blue-900 px-2 py-1 font-medium uppercase tracking-wide inline-block w-fit">{wribate.category}</span>
            {wribate.institution && <span className="text-gray-700 inline-block font-medium">{wribate.institution}</span>}
          </div>
        </div>
        <div className="w-28 h-24 flex-shrink-0 flex items-center">
          {wribate.coverImage ? (
            <img
              src={wribate.coverImage}
              alt={wribate.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

  useEffect(() => {
    fetchWribates();
  }, []);

  const handleLoadMore = () => {
    fetchWribates();
  };

  const handleCardClick = (wribate) => {
    // Navigate to wribate details page
    router.push(`/wribate/${wribate._id}`);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="container bg-gray-200 min-h-screen w-full py-6">
      <div className="flex sticky top-0 z-30 py-4 px-4 bg-gray-200 items-center  justify-between mb-8 border-b-2 border-blue-900 pb-4">
        <div className=''>
          <button 
            onClick={handleBackClick}
            className="flex items-center text-blue-900 hover:text-blue-700 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold mt-2 text-gray-900">{category || `${type || ''} Wribates`}</h1>
        </div>
      </div>
      
      {loading && wribates.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
            <p className="text-blue-900 font-medium">Loading Wribates...</p>
          </div>
        </div>
      ) : wribates.length > 0 ? (
        <div className="grid lg:grid-cols-3 sm:mx-12  md:grid-cols-2 grid-cols-1 gap-8">
          {wribates.map((wribate) => (
            <WribateCard
              key={wribate._id}
              wribate={wribate}
              onClick={() => handleCardClick(wribate)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-600 font-medium text-lg">No wribates found in this category.</p>
          <p className="text-gray-500 mt-2">Try checking a different category or come back later.</p>
        </div>
      )}

      {/* Load More button */}
      {wribates.length > 0 && (
        <div className="mt-8 text-center">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 font-medium disabled:bg-blue-300 transition duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading More Wribates...
                </span>
              ) : (
                'Load More Wribates'
              )}
            </button>
          ) : (
            <p className="text-gray-600 border-t-2 border-gray-200 pt-6 mt-4 font-medium">No more wribates to load</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;