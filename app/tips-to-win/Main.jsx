import React from "react";

// Header Component
const TipsHeader = () => {
  return (
    <div className="bg-white p-4 md:p-6 mb-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Master the Art of Wribate: Tips and Strategies for Success
      </h1>

      <p className="text-sm md:text-base text-gray-700 mb-6">
        Wribating is a powerful skill that sharpens your ability to think
        critically, argue persuasively, and communicate effectively. Whether for
        formal competitions or everyday communication, mastering Wribate™
         can set you apart as a clear, thoughtful communicator.
      </p>

      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden rounded-lg mb-4">
        <div className="absolute  bg-blue-900"></div>
        <img
          src="/tips/creative.png"
          alt="Students in a classroom setting engaged in discussion"
          className="w-full h-full object-contain"
        />
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
          {/* <h2 className="text-white text-xl md:text-2xl font-bold">
            Creative Wribating
          </h2> */}
        </div>
      </div>
      <div className="h-[4px] my-8  border-b-2 w-[70%] mx-auto border-gray-400"></div>
    </div>
  );
};

export default TipsHeader;
