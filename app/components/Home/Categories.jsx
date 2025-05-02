import React, { useState, useRef } from "react";

const Navigation = ({ categories, isLoading, category, onChange }) => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleCategory = (name) => {
    onChange(name);
  };

  return (
    <div className="relative flex items-center border-b border-gray-200">
      {isLoading && <p>Loading Categories</p>}

      {categories && (
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto scrollbar-hide whitespace-nowrap  px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <span
            key={120}
            className={`inline-block md:px-4 px-2 py-4 font-medium text-sm cursor-pointer ${
              category === "All"
                ? "text-primary border-b-2 border-purple-900"
                : "text-gray-600 hover:text-purple-900 border-b-2 border-gray-200"
            }`}
            onClick={() => handleCategory("All")}
          >
            Home
          </span>
          {categories.map((item) => (
            <span
              key={item._id}
              className={`inline-block md:px-4 px-2 py-4 font-medium text-sm cursor-pointer ${
                category === item.categoryName
                  ? "text-primary border-b-2 border-purple-900"
                  : "text-gray-600 hover:text-purple-900 border-b-2 border-gray-200"
              }`}
              onClick={() => handleCategory(item?.categoryName)}
            >
              {item.categoryName}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navigation;
