"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          setLoading(true);
          setError(null);
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search?query=${encodeURIComponent(query)}`);
          
          if (!res.ok) {
            throw new Error(`Search request failed with status ${res.status}`);
          }
          
          const data = await res.json();
          console.log("Search page results:", data);
          if (data.success) {
            setResults(data.data);
          } else {
            setError(data.message || 'Search failed');
          }
        } catch (error) {
          console.error("Search failed:", error);
          setError('Failed to fetch search results. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [query]);

  const handleWribateClick = (wribateId) => {
    router.push(`/wribate/${wribateId}`);
  };

  const handleUserClick = (userId) => {
    router.push(`/profile/${userId}`);
  };

  const handleDiscoverClick = () => {
    router.push('/propose-wribate');
  };
  
  // Better email masking function
  const maskEmail = (email) => {
    if (!email || typeof email !== 'string') return '';
    
    try {
      const parts = email.split('@');
      if (parts.length !== 2) return email;
      
      const username = parts[0];
      const domain = parts[1];
      
      // More sophisticated masking: show first char, some asterisks, last char
      const maskedUsername = username.length <= 2 
        ? username 
        : `${username.charAt(0)}${'*'.repeat(Math.min(username.length - 2, 3))}${username.charAt(username.length - 1)}`;
      
      return `${maskedUsername}@${domain}`;
    } catch (e) {
      console.error("Error masking email:", e);
      return '';
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">No search query provided</h1>
          <p className="text-gray-600 mb-6">Please enter a search term to see results</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
          >
            Go to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 border-b border-gray-300 pb-4"
        >
          Search results for "<span className="text-blue-600">{query}</span>"
        </motion.h1>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-8 shadow-sm"
          >
            <div className="flex">
              <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
            <p className="text-lg text-gray-600">Searching the Wribate universe...</p>
          </div>
        ) : (
          <>
            {/* Users Section - Enhanced styling */}
            <motion.section 
              initial="hidden"
              animate="show"
              variants={container}
              className="mb-12"
            >
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h2 className="text-2xl font-extrabold text-gray-800 uppercase tracking-wide">Users</h2>
              </div>
              
              <div className="border-b border-gray-300 mb-6"></div>
              
              {results?.users?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.users.map((user) => (
                    <motion.div 
                      key={user._id}
                      variants={item}
                      whileHover={{ 
                        scale: 1.03, 
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUserClick(user.userName)}
                      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:bg-blue-50 border border-gray-200"
                    >
                      <div className="flex items-center p-4">
                        <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0">
                          <img 
                            src={user.profilePhoto || user.profilePicture || '/default-avatar.png'} 
                            className="h-full w-full object-cover"
                            alt={user.name}
                            onError={(e) => {
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-lg text-gray-800">{user.name}</p>
                          <p className="text-blue-600">@{user.userName}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  variants={item}
                  className="bg-white rounded-lg shadow-md p-6 text-center border border-dashed border-gray-300"
                >
                  <p className="text-gray-500">No users found matching "<span className="font-medium">{query}</span>"</p>
                </motion.div>
              )}
            </motion.section>

            {/* Wribates Section - Enhanced styling */}
            <motion.section 
              initial="hidden"
              animate="show"
              variants={container}
              className="mb-12"
            >
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h2 className="text-2xl font-extrabold text-gray-800 uppercase tracking-wide">Wribates</h2>
              </div>
              
              <div className="border-b border-gray-300 mb-6"></div>
              
              {results?.wribates?.length > 0 ? (
                <div className="space-y-4">
                  {results.wribates.map((wribate) => (
                    <motion.div 
                      key={wribate._id}
                      variants={item}
                      whileHover={{ 
                        scale: 1.02, 
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleWribateClick(wribate._id)}
                      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:bg-green-50 border border-gray-200"
                    >
                      <div className="p-4">
                        <h3 className="font-bold text-xl text-gray-800">{wribate.title}</h3>
                        <div className="flex items-center mt-2">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                            {wribate.forEmail ? maskEmail(wribate.forEmail) : "User 1"}
                          </span>
                          <span className="mx-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded font-medium">VS</span>
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                            {wribate.againstEmail ? maskEmail(wribate.againstEmail) : "User 2"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  variants={item}
                  className="bg-white rounded-lg shadow-md p-6 text-center border border-dashed border-gray-300"
                >
                  <p className="text-gray-500">No wribates found matching "<span className="font-medium">{query}</span>"</p>
                </motion.div>
              )}
            </motion.section>

            {/* Discover Wribates Section - Enhanced styling */}
            <motion.section 
              initial="hidden"
              animate="show"
              variants={container}
              className="mb-12"
            >
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-2xl font-extrabold text-gray-800 uppercase tracking-wide">Discover Wribates</h2>
              </div>
              
              <div className="border-b border-gray-300 mb-6"></div>
              
              {results?.discoverWribates?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.discoverWribates.map((proposal) => (
                    <motion.div 
                      key={proposal._id}
                      variants={item}
                      whileHover={{ 
                        scale: 1.03, 
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDiscoverClick()}
                      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:bg-purple-50 border border-gray-200"
                    >
                      <div className="p-4">
                        <h3 className="font-bold text-xl text-gray-800">{proposal.title}</h3>
                        {(proposal.context || proposal.description) && (
                          <p className="text-gray-600 mt-1">
                            {(proposal.context || proposal.description || "").substring(0, 100)}
                            {(proposal.context || proposal.description || "").length > 100 ? "..." : ""}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  variants={item}
                  className="bg-white rounded-lg shadow-md p-6 text-center border border-dashed border-gray-300"
                >
                  <p className="text-gray-500">No discover wribates found matching "<span className="font-medium">{query}</span>"</p>
                </motion.div>
              )}
            </motion.section>

            {/* No results message if all empty */}
            {results && 
              (!results.users?.length && !results.wribates?.length && !results.discoverWribates?.length) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 bg-white rounded-lg shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl text-gray-700 mb-2">No results found for "<span className="font-medium">{query}</span>"</p>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">Try different keywords, check your spelling, or try a more general search term.</p>
                </motion.div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
