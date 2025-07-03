import { Calendar, Tag, User, Building, UserCheck, Eye } from 'lucide-react';


// Article Header Component
const ArticleHeader = ({ 
  title, 
  category, 
  publishedAt, 
  image, 
  user_email, 
  assigned_by, 
  assigned_to, 
  institution,
  views 
}) => {
  return (
    <div className="mb-8">
      {/* Article Image */}
      {image && (
        <div className="mb-8">
          <img 
            src={image} 
            alt={title}
            className="w-full h-64 md:h-80 object-contain rounded"
          />
        </div>
      )}
      
      {/* Category */}
      <div className="mb-3">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
          {category}
        </span>
      </div>
      
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
        {title}
      </h1>
      
      {/* Article Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b border-gray-100 pb-6">
        {user_email && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{user_email}</span>
          </div>
        )}
        
        {publishedAt && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
        
        {views !== undefined && (
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{views.toLocaleString()} views</span>
          </div>
        )}
        
        {institution && (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span>{institution}</span>
          </div>
        )}
        
        {assigned_by && (
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span>{assigned_by}</span>
          </div>
        )}
        
        {assigned_to && (
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>{assigned_to}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleHeader;