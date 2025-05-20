'use client';
import { useState } from 'react';
import { debounce } from 'lodash';
import Link from 'next/link';
import Image from 'next/image';

const GlobalSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState({
        users: [],
        wribates: [],
        discoverWribates: []
    });
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = debounce(async (query) => {
        if (!query?.trim()) {
            setResults({ users: [], wribates: [], discoverWribates: [] });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?query=${encodeURIComponent(query)}`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            const data = await response.json();
            if (data.success) {
                setResults(data.data);
            }
        } catch (error) {
            setResults({ users: [], wribates: [], discoverWribates: [] });
        } finally {
            setLoading(false);
        }
    }, 300);

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder="Search users, wribates, proposals..."
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                    setShowResults(true);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showResults && searchQuery && (
                <div className="absolute w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                    {loading && <div className="p-4 text-center">Loading...</div>}
                    {!loading && (
                        <>
                            {results.users?.length > 0 && (
                                <div className="p-3 border-b">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Users</h3>
                                    {results.users.map((user) => (
                                        <Link
                                            href={`/profile/${user.userName}`}
                                            key={user._id}
                                            className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                                        >
                                            <Image
                                                src={user.profilePhoto || user.profilePicture || '/default-avatar.png'}
                                                alt={user.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                            <span className="ml-2">{user.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {results.wribates?.length > 0 && (
                                <div className="p-3 border-b">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Wribates</h3>
                                    {results.wribates.map((wribate) => (
                                        <Link
                                            href={`/wribate/${wribate._id}`}
                                            key={wribate._id}
                                            className="block p-2 hover:bg-gray-50 rounded-lg"
                                        >
                                            <h4 className="font-medium">{wribate.title}</h4>
                                            <p className="text-sm text-gray-500 truncate">
                                                {wribate.context?.substring(0, 50)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {results.discoverWribates?.length > 0 && (
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Discover Wribates</h3>
                                    {results.discoverWribates.map((proposal) => (
                                        <Link
                                            href="/propose-wribate" // Changed to redirect to main discover page
                                            key={proposal._id}
                                            className="block p-2 hover:bg-gray-50 rounded-lg"
                                        >
                                            <h4 className="font-medium">{proposal.title}</h4>
                                            <p className="text-sm text-gray-500 truncate">
                                                {proposal.context?.substring(0, 50)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {!results.users?.length && !results.wribates?.length && !results.discoverWribates?.length && (
                                <div className="p-4 text-center text-gray-500">
                                    No results found
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;