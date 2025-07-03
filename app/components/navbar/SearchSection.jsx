import React, { useRef } from 'react';
import { X, Search, User, MessageCircle, Lightbulb } from 'lucide-react';

const SearchSection = ({ 
    setShowDropdown, 
    setSearchResults, 
    setLoading, 
    handleSearchSubmit, 
    showDropdown, 
    searchResults,
    searchQuery, 
    setSearchQuery, 
    loading 
}) => {
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const handleSearchInput = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (!query.trim()) {
            setShowDropdown(false);
            setSearchResults({ users: [], wribates: [], discoverWribates: [] });
            return;
        }

        setLoading(true);
        setShowDropdown(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?query=${encodeURIComponent(query)}`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            const data = await response.json();

            if (data.success) {
                setSearchResults(data.data);
            }
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults({ users: [], wribates: [], discoverWribates: [] });
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (url) => {
        // router.push(url);
        setShowDropdown(false);
        // setIsSearchVisible(false);
        console.log('Navigate to:', url);
    };

    return (
        <div className="hidden md:flex flex-1 justify-center mx-4 max-w-2xl">
            <div className="relative w-full" ref={searchRef}>
                <div className="relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search users, wribates, proposals..."
                            value={searchQuery}
                            onChange={handleSearchInput}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                            className="w-full h-10 pl-10 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                                     focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
                                     transition-all duration-200 placeholder-gray-500"
                        />
                        {searchQuery.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults({ users: [], wribates: [], discoverWribates: [] });
                                    setShowDropdown(false);
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && (
                    <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-96 overflow-y-auto z-50">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                <span className="ml-2 text-sm text-gray-600">Searching...</span>
                            </div>
                        ) : (
                            <div className="py-2">
                                {/* Users Section */}
                                {searchResults.users?.length > 0 && (
                                    <div className="mb-1">
                                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                                            Users
                                        </div>
                                        {searchResults.users.map((user) => (
                                            <button
                                                key={user._id}
                                                onClick={() => handleItemClick(`/profile/${user.userName}`)}
                                                className="w-full px-3 py-2 flex items-center hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                                    {user.profilePhoto ? (
                                                        <img
                                                            src={user.profilePhoto || '/default-avatar.png'}
                                                            alt={user.name || 'User'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        @{user.userName}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Wribates Section */}
                                {searchResults.wribates?.length > 0 && (
                                    <div className="mb-1">
                                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                                            Wribates
                                        </div>
                                        {searchResults.wribates.map((wribate) => (
                                            <button
                                                key={wribate._id}
                                                onClick={() => handleItemClick(`/wribate/${wribate._id}`)}
                                                className="w-full px-3 py-2 flex items-start hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mt-0.5">
                                                    <MessageCircle className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="ml-3 flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                                                        {wribate.title}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                                                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                                                            {wribate.leadFor}
                                                        </span>
                                                        <span className="text-gray-400">vs</span>
                                                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                                                            {wribate.leadAgainst}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Discover Wribates Section */}
                                {searchResults.discoverWribates?.length > 0 && (
                                    <div className="mb-1">
                                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                                            Proposals
                                        </div>
                                        {searchResults.discoverWribates.map((proposal) => (
                                            <button
                                                key={proposal._id}
                                                onClick={() => handleItemClick('/propose-wribate')}
                                                className="w-full px-3 py-2 flex items-start hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className="flex-shrink-0 w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mt-0.5">
                                                    <Lightbulb className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <div className="ml-3 flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                                                        {proposal.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 line-clamp-1">
                                                        {proposal.context?.substring(0, 80)}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* No Results */}
                                {searchQuery.trim() &&
                                    !searchResults.users?.length &&
                                    !searchResults.wribates?.length &&
                                    !searchResults.discoverWribates?.length && (
                                        <div className="px-3 py-8 text-center">
                                            <Search className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                            <p className="text-sm text-gray-600 mb-1">
                                                No results found for "{searchQuery}"
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Try adjusting your search terms
                                            </p>
                                        </div>
                                    )}

                                {/* View All Results */}
                                {searchQuery.trim() && 
                                 (searchResults.users?.length > 0 || 
                                  searchResults.wribates?.length > 0 || 
                                  searchResults.discoverWribates?.length > 0) && (
                                    <div className="border-t border-gray-100 mt-1">
                                        <button
                                            onClick={() => handleItemClick(`/search?q=${encodeURIComponent(searchQuery)}`)}
                                            className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                                        >
                                            View all results for "{searchQuery}"
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchSection;