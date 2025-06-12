"use client";
import React, { useState, useRef } from "react";
import { navItems } from "./data";

const Navigation = ({ selectedCategory, setSelectedCategory }) => {
  const scrollContainerRef = useRef(null);
  // const [selectedCategory, setSelectedCategory] = useState(1);

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

  return (
    <div className="relative flex items-center border-b border-gray-200">
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto scrollbar-hide whitespace-nowrap  px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {navItems.map((item) => (
          <span
            key={item.id}
            className={`inline-block md:px-4 px-2 py-4 font-medium text-sm cursor-pointer ${
              selectedCategory === item.id
                ? "text-primary border-b-2 border-purple-900"
                : "text-gray-600 hover:text-purple-900 border-b-2 border-gray-200"
            }`}
            onClick={() => setSelectedCategory(item.id)}
          >
            {item.category}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
