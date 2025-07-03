import React from 'react';
import ArticleCard from './ArticleCard';
import { useRouter } from 'next/navigation';

const InstitutionArticles = ({ articles = [], category }) => {
  const router = useRouter();

  return (
    <section className="w-full mx-auto">
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-lg border-l-4 px-2 border-blue-900 font-bold text-gray-900">Insitution Articles</h2>
        <button onClick={()=>router.push('/articles/category/'+category+'/?type='+"institutional")} className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 flex items-center gap-1">
          View More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </header>
      
      <main className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article._id || article.id} article={article} />
        ))}
      </main>
      
      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default InstitutionArticles;