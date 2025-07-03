'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import httpRequest from '../../utils/httpRequest';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import he from 'he';
import { Share2, Calendar, Tag, ExternalLink, User, Building, UserCheck, Eye, ArrowLeft, Code } from 'lucide-react';
import ArticleHeader from './components/Header';
import Comments from './components/Comments';
import ArticleContent from './components/ArticleContent'

// Back Button Component
const BackButton = () => {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
};

// Article Code Component
const ArticleCode = ({ code }) => {
  if (!code) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Code className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Article Code</span>
      </div>
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
        <code className="text-sm font-mono text-gray-800">{code}</code>
      </div>
    </div>
  );
};

// Share Button Component
const ShareButton = ({ title, url }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url || window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="mb-8">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
};

// Similar Articles Component
const SimilarArticles = ({ articles, currentArticleId }) => {
  const filteredArticles = articles?.filter(article => article.id !== currentArticleId) || [];
  
  if (filteredArticles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Articles</h3>
        <p className="text-gray-500">No similar articles found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Articles</h3>
      <div className="space-y-4">
        {filteredArticles.slice(0, 5).map((article) => (
          <div key={article.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
            <div className="flex gap-3">
              {article.image && (
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 cursor-pointer">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-500 mb-2">{article.category}</p>
                <a 
                  href={`/article/${article.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Read more <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

// Error Component
const ErrorMessage = ({ message }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Main Page Component
const Page = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch article
  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await httpRequest(axios.get(`${baseUrl}/user/getarticle/${id}`));
      setArticle(data.article);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!article) return <ErrorMessage message="Article not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        <BackButton />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Article Content - 70% width on large screens */}
          <div className="lg:w-[70%]">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <ArticleHeader 
                  title={article.title}
                  category={article.category}
                  publishedAt={article.publishedAt || article.createdAt}
                  image={article.image}
                  user_email={article.user_email}
                  assigned_by={article.assigned_by}
                  assigned_to={article.assigned_to}
                  institution={article.institution}
                  views={article.views}
                />
                
                <ArticleCode code={article.code} />
                
                <ShareButton 
                  title={article.title}
                  url={window?.location?.href}
                />
                
                <ArticleContent content={article.content} />
                <Comments id={article._id} />
              </div>
            </article>
          </div>

          {/* Sidebar - 30% width on large screens */}
          <div className="lg:w-[30%]">
            <div className="lg:sticky lg:top-8">
              <SimilarArticles 
                articles={similarArticles}
                currentArticleId={article.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;