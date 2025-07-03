"use client"
import React, { useEffect, useState } from 'react'
import Header from './Header'
import httpRequest from '../../utils/httpRequest';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import HeroArticle from './HeroArticle';
import FeaturedArticles from './FeaturedArticles';
import InstitutionArticles from './InstitutionArticles';
import Footer from '@/app/components/Footer';

const Articles = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [articles, setArticles] = useState([]);
    const [institution_articles, setInstitution_articles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch articles
    const fetchArticles = async() => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await httpRequest(axios.get(baseUrl+'/user/articles/'+activeCategory+'?is_home='+encodeURIComponent(true)));
            
            setArticles(data?.non_institutional || []);
            setInstitution_articles(data?.institutional || []);
            console.log(data);
        } catch (err) {
            console.error('Error fetching articles:', err);
            setError('Failed to load articles. Please try again later.');
            setArticles([]);
            setInstitution_articles([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchArticles();
    }, [activeCategory]);

    // Loading state
    if (loading) {
        return (
            <div className='bg-[#F3F2EF] min-h-screen'>
                <Header activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
                <main className='grid grid-cols-1 sm:grid-cols-2'>
                    <div className='px-4 flex flex-col gap-4'>
                        <div className="animate-pulse">
                            <div className="bg-gray-300 h-96 md:h-[32rem] lg:h-[40rem] rounded-lg mb-4"></div>
                            <div className="space-y-4">
                                <div className="bg-gray-300 h-48 rounded-lg"></div>
                                <div className="bg-gray-300 h-48 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className='bg-[#F3F2EF] min-h-screen'>
                <Header activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
                <main className='grid grid-cols-1 sm:grid-cols-2'>
                    <div className='px-4 flex flex-col gap-4'>
                        <div className="text-center py-12">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
                                <p className="text-red-600 mb-4">{error}</p>
                                <button 
                                    onClick={fetchArticles}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // No articles found state
    if (!loading && articles.length === 0 && institution_articles.length === 0) {
        return (
            <div className='bg-[#F3F2EF] min-h-screen'>
                <Header activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
                <main className='grid grid-cols-1'>
                    <div className='px-4 flex flex-col gap-4'>
                        <div className="text-center py-12">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                                <svg className="mx-auto h-16 w-16 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h3>
                                <p className="text-gray-600 mb-4">
                                    {activeCategory === "All" 
                                        ? "There are no articles available at the moment." 
                                        : `No articles found in "${activeCategory}" category.`
                                    }
                                </p>
                                {activeCategory !== "All" && (
                                    <button 
                                        onClick={() => setActiveCategory("All")}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        View All Categories
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className='bg-[#F3F2EF] min-h-screen'>
            <Header activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

            <main className='grid grid-cols-1  min-h-screen pb-20 sm:grid-cols-2'>
                <div className='px-4 flex flex-col gap-4 border-r border-gray-200'>
                    <HeroArticle article={articles[0]} />
                    <FeaturedArticles articles={articles} category={activeCategory}/>
                    <InstitutionArticles articles={institution_articles} category={activeCategory}/>
                </div>
            </main>
            <Footer/>
        </div>
    )
}

export default Articles;