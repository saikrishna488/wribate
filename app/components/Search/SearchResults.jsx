"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchDropdown() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ 
    users: [], 
    wribates: [], 
    discoverWribates: [] 
  });
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim()) {
        try {
          setLoading(true);
          console.log("Fetching results for:", query);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?query=${encodeURIComponent(query)}`
          );
          const data = await res.json();
          console.log("Search response:", data);
          setResults(data.data || { users: [], wribates: [], discoverWribates: [] }); 
          setShowDropdown(true);
        } catch (error) {
          console.error("Search failed:", error);
          setResults({ users: [], wribates: [], discoverWribates: [] });
        } finally {
          setLoading(false);
        }
      } else {
        setShowDropdown(false);
        setResults({ users: [], wribates: [], discoverWribates: [] });
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search users, wribates, proposals..."
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-[999] max-h-96 overflow-y-auto">
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="text-center py-2">Loading results...</div>
            ) : (
              <>
                {/* Users Section */}
                {results.users?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">USERS</h3>
                    {results.users.map((user) => (
                      <Link
                        key={user._id}
                        href={`/profile/${user.userName}`}
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                        onClick={() => setShowDropdown(false)}
                      >
                        <img 
                          src={user.profilePhoto || '/default-avatar.png'} 
                          className="w-8 h-8 rounded-full mr-3"
                          alt={user.name}
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">@{user.userName}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Wribates Section */}
                {results.wribates?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">WRIBATES</h3>
                    {results.wribates.map((wribate) => (
                      <Link
                        key={wribate._id}
                        href={`/wribate/${wribate._id}`}
                        className="block p-2 hover:bg-gray-100 rounded"
                        onClick={() => setShowDropdown(false)}
                      >
                        <p className="font-medium">{wribate.title}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {wribate.description
                            ? wribate.description.substring(0, 50) + "..."
                            : "No description available."}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Discover Wribates Section - MODIFIED TO REDIRECT TO MAIN DISCOVER PAGE */}
                {results.discoverWribates?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">DISCOVER WRIBATES</h3>
                    {results.discoverWribates.map((proposal) => (
                      <Link
                        key={proposal._id}
                        href="/discover" // Changed to redirect to main discover page
                        className="block p-2 hover:bg-gray-100 rounded"
                        onClick={() => setShowDropdown(false)}
                      >
                        <p className="font-medium">{proposal.title}</p>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Show "No results" only if we have query but no results */}
                {query.trim() && 
                  !results.users?.length && 
                  !results.wribates?.length && 
                  !results.discoverWribates?.length && (
                    <div className="text-center py-2 text-gray-500">No results found</div>
                )}

                {/* "See All" Link */}
                {query.trim() && (
                  <div className="pt-4 border-t">
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="flex items-center justify-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => setShowDropdown(false)}
                    >
                      See all results for "{query}"
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
