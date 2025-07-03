import { useRouter } from 'next/navigation';
import React from 'react';

const HeroArticle = ({ article }) => {
  const { image, title } = article || {};
  const router = useRouter();


  const handleClick = async () => {
    const { _id, code } = article
    router.push('/article/' + (code ? code : _id))
  }

  if (!article?._id) {
    return null;
  }

  return (
    <div className='p-2'>
      <div onClick={handleClick} className="relative h-64 sm:h-80 w-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden shadow-md bg-gray-900">
        {/* Background Image */}
        {image && (
          <div className="absolute inset-0">
            <img
              src={image}
              alt={title || 'Hero article image'}
              className="h-full w-full object-fill"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex items-end h-full px-4 sm:px-6 lg:px-8 pb-8">
          <div className="w-full max-w-4xl">
            {title && (
              <h1 className="text-lg font-bold text-white leading-tight drop-shadow-2xl shadow-black text-shadow-lg">
                {title}
              </h1>
            )}
          </div>
        </div>

        {/* Fallback when no image is provided */}
        {!image && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
        )}
      </div>
    </div>
  );
};


export default HeroArticle;