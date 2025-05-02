import React from "react";
import { useRouter } from "next/navigation";
import removeBaseURL from "../utils/ImageFormat";

const ArticleCard = ({
  id,
  image,
  title,
  category,
  isLarge = false,
  isDouble = false,
  tag,
}) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push(`/wribate/${id}`);
  };

  // console.log("Title:", title, "Category:", category); // Debugging

  return (
    <div
      className={`relative mb-4 overflow-hidden border-b-2 border-r-2 border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-gray-100 
         ${isDouble ? "h-auto" : isLarge ? "h-96" : "h-64"}`}
      onClick={handleNavigate}
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className={`w-full object-cover ${
            isLarge ? "h-96" : isDouble ? "h-40" : "h-48"
          }`}
        />

        {/* Stronger Gradient Overlay for Readability */}
        {isLarge && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        )}

        {/* Sponsored Tag */}
        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md">
          {tag}
        </span>

        {/* Title & Category - positioned inside image for large articles */}
        {isLarge && (
          <div className="absolute bottom-4 left-4 text-white z-20 w-full pr-4">
            <p className="text-xs font-bold uppercase bg-black/70 px-2 py-1 inline-block rounded">
              {category}
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-tight bg-black/70 p-2 rounded">
              {title}
            </h3>
          </div>
        )}
      </div>

      {/* Content Section - only visible when not large */}
      {!isLarge && (
        <div className="p-3 bg-white">
          <p className="text-sm text-gray-600 font-semibold mb-1">{category}</p>
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;
