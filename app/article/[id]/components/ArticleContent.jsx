import he from 'he';

// Article Content Component
const ArticleContent = ({ content }) => {
  const decodedContent = he.decode(content);
  
  return (
    <div className="prose prose-lg bg-gray-50 p-2 rounded-md max-w-none">
      <div 
        className="article-content text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: decodedContent }}
      />
    </div>
  );
};

export default ArticleContent;