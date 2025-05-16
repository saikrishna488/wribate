"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

  // Modified to redirect to main discover page
  const handleDiscoverClick = () => {
    router.push('/propose-wribate');
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">No search query provided</h1>
          <p className="text-gray-600 mb-4">Please enter a search term to see results</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">
          Search results for "{query}"
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600 mb-4"></div>
            <p>Searching...</p>
          </div>
        ) : (
          <>
            {/* Users Section - Always show */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Users</h2>
              {results?.users?.length > 0 ? (
                <div className="bg-white rounded-lg shadow divide-y">
                  {results.users.map((user) => (
                    <div 
                      key={user._id} 
                      className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150"
                      onClick={() => handleUserClick(user.userName)}
                    >
                      <div className="flex items-center">
                        <img 
                          src={user.profilePhoto || user.profilePicture || '/default-avatar.png'} 
                          className="w-10 h-10 rounded-full mr-4 object-cover"
                          alt={user.name}
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-gray-500">@{user.userName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 p-4 bg-white rounded-lg shadow">No users found</p>
              )}
            </section>

            {/* Wribates Section - Always show */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Wribates</h2>
              {results?.wribates?.length > 0 ? (
                <div className="bg-white rounded-lg shadow divide-y">
                  {results.wribates.map((wribate) => (
                    <div 
                      key={wribate._id} 
                      className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150"
                      onClick={() => handleWribateClick(wribate._id)}
                    >
                      <h3 className="font-medium">{wribate.title}</h3>
                      <p className="text-gray-600 mt-1">
                        {wribate.description
                          ? wribate.description.substring(0, 100) + "..."
                          : "No description available."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 p-4 bg-white rounded-lg shadow">No wribates found</p>
              )}
            </section>

            {/* Discover Wribates Section - MODIFIED TO REDIRECT TO MAIN DISCOVER PAGE */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Discover Wribates</h2>
              {results?.discoverWribates?.length > 0 ? (
                <div className="bg-white rounded-lg shadow divide-y">
                  {results.discoverWribates.map((proposal) => (
                    <div 
                      key={proposal._id} 
                      className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150"
                      onClick={() => handleDiscoverClick()} // Modified to redirect to main discover page
                    >
                      <h3 className="font-medium">{proposal.title}</h3>
                      <p className="text-gray-600 mt-1">
                        {proposal.description
                          ? proposal.description.substring(0, 100) + "..."
                          : "No description available."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 p-4 bg-white rounded-lg shadow">No discover wribates found</p>
              )}
            </section>

            {/* No results message if all empty */}
            {results && 
              (!results.users?.length && !results.wribates?.length && !results.discoverWribates?.length) && (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500 mb-2">No results found for "{query}"</p>
                  <p className="text-gray-400 text-sm">Try different keywords or check your spelling</p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
