import React from 'react';

const ProposeCard = ({ topic, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:-translate-y-1 transition-transform duration-200 hover:shadow-lg p-4 cursor-pointer border border-gray-200"
      onClick={() => onClick && onClick(topic)}
    >
      <div className="flex gap-4">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          {/* Title - 2 lines max */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {topic.title}
          </h3>
          
          {/* Context - 3 lines max */}
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {topic.context}
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-shrink-0">
          <img
            src={topic.image || '/api/placeholder/80/80'}
            alt={topic.title}
            className="w-20 h-20 rounded-lg object-cover bg-gray-100"
            onError={(e) => {
              e.target.src = '/api/placeholder/80/80';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposeCard;