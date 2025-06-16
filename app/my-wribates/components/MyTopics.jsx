import React, { useEffect, useState } from 'react'
import httpRequest from '../../utils/httpRequest';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom } from '../../states/GlobalStates';
import authHeader from '../../utils/authHeader';
import TopicCard from './TopicCard';

const MyTopics = () => {
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useAtom(userAtom);

    const fetchTopics = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const body = { _id: user?._id }
            const data = await httpRequest(axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/mytopics', body, {
                headers: authHeader()
            }));

            setTopics(data.topics);
            setFilteredTopics(data.topics);
        } catch (err) {
            console.error('Error fetching topics:', err);
            setError('Failed to load topics');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user?._id) {
            fetchTopics();
        }
    }, [user]);

    // Filter topics based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredTopics(topics);
        } else {
            const filtered = topics.filter(topic =>
                topic.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.context?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredTopics(filtered);
        }
    }, [searchQuery, topics]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleTopicClick = (topic) => {
        console.log('Clicked topic:', topic);
        // Handle topic click - navigate to detail page or perform action
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-600">Loading your topics...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-600">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (topics.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <div className="text-gray-500 text-xl mb-4">No topics yet</div>
                        <p className="text-gray-400 mb-6">
                            Start proposing topics to see them here.
                        </p>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Propose New Topic
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    {/* Title and Search Bar Row */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Proposed Topics</h1>
                            <p className="text-gray-600">
                                {topics.length > 0
                                    ? `You have ${topics.length} proposed topic${topics.length !== 1 ? 's' : ''}`
                                    : 'No topics found'
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
                                placeholder="Search topics..."
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
                            {filteredTopics.length > 0
                                ? `Found ${filteredTopics.length} result${filteredTopics.length !== 1 ? 's' : ''} for "${searchQuery}"`
                                : `No results found for "${searchQuery}"`
                            }
                        </div>
                    )}
                </div>

                {/* Topics Grid */}
                {filteredTopics.length > 0 ? (
                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-3">
                        {filteredTopics.map((topic) => (
                            <TopicCard
                                key={topic._id || topic.id}
                                topic={topic}
                                onClick={() => handleTopicClick(topic)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        {searchQuery ? (
                            <div>
                                <div className="text-gray-500 text-lg mb-4">No matching topics found</div>
                                <p className="text-gray-400 mb-6">
                                    Try adjusting your search terms or clear the search to see all topics.
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
                                <div className="text-gray-500 text-lg mb-4">No topics yet</div>
                                <p className="text-gray-400 mb-6">
                                    Start proposing topics to see them here.
                                </p>
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                    Propose New Topic
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyTopics