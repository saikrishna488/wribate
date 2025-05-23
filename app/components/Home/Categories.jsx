'use client';

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Navigation = ({ categories, isLoading, category, onChange }) => {
  const scrollContainerRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setShowArrows(window.innerWidth >= 768); // Show arrows on devices wider than 768px
      checkScrollability();
    };

    // Check if scrolling is possible
    const checkScrollability = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    // Add scroll event listener to update arrow visibility
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", checkScrollability);
    }

    return () => {
      window.removeEventListener("resize", checkIfMobile);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", checkScrollability);
      }
    };
  }, [categories]);

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
    <div className="w-full relative border-b border-gray-200">
      {isLoading && <p>Loading Categories</p>}

      {categories && (
        <div className="flex items-center w-full">
          {/* Left scroll arrow - only visible on desktop when scrollable */}
          {showArrows && canScrollLeft && (
            <button 
              onClick={scrollLeft}
              className="hidden md:flex absolute left-0 z-10 h-full items-center justify-center px-2 bg-white rounded-full bg-opacity-75 hover:bg-opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="text-gray-600 hover:text-purple-900" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto px-4 scrollbar-hide"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
              WebkitOverflowScrolling: "touch", // Improved mobile scrolling
            }}
          >
            <div className="flex space-x-4 min-w-max">
              <span
                key="all"
                className={`md:px-4 px-2 py-2 font-medium text-md cursor-pointer ${
                  category === "All"
                    ? "text-primary border-b-2 border-purple-900"
                    : "text-gray-600 hover:text-purple-900"
                }`}
                onClick={() => handleCategory("All")}
              >
                Home
              </span>
              {categories.map((item) => (
                <span
                  key={item._id}
                  className={`md:px-4 px-2 py-2 font-medium text-md cursor-pointer ${
                    category === item.categoryName
                      ? "text-primary border-b-2 border-purple-900"
                      : "text-gray-600 hover:text-purple-900"
                  }`}
                  onClick={() => handleCategory(item.categoryName)}
                >
                  {item.categoryName}
                </span>
              ))}
            </div>
          </div>

          {/* Right scroll arrow - only visible on desktop when scrollable */}
          {showArrows && canScrollRight && (
            <button 
              onClick={scrollRight}
              className="hidden md:flex absolute right-0 rounded-full z-10 h-full items-center justify-center px-2 bg-white bg-opacity-75 hover:bg-opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="text-gray-600 hover:text-purple-900" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navigation;