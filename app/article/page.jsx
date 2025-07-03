"use client"
import { useAtom } from 'jotai';
import React, { useState } from 'react'
import { userAtom } from '../states/GlobalStates';
import SingleArticle from './components/SingleArticle'
import BatchArticles from './components/BatchArticles';

const page = () => {
    const [selectedPage, setSelectedPage] = useState("single");
    const [user] = useAtom(userAtom);

    const changePage = (name) => {
        setSelectedPage(name)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Navigation Tabs */}
                {
                    user?.user_role != user && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => changePage("single")}
                                    className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${selectedPage === "single"
                                            ? "bg-blue-900 text-white border-b-2 border-blue-900"
                                            : "bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-900"
                                        } rounded-tl-lg`}
                                >
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Single Article
                                    </span>
                                </button>
                                <button
                                    onClick={() => changePage("batch")}
                                    className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${selectedPage === "batch"
                                            ? "bg-blue-900 text-white border-b-2 border-blue-900"
                                            : "bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-900"
                                        } rounded-tr-lg`}
                                >
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        Batch Articles
                                    </span>
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* Content Section */}
                <div className="bg-white rounded-lg shadow-sm min-h-[500px]">
                    <div className="">
                        {selectedPage === "single" && (
                            <div className="animate-fadeIn">
                                <SingleArticle />
                            </div>
                        )}
                        {selectedPage === "batch" && (
                            <div className="animate-fadeIn">
                                <BatchArticles />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default page