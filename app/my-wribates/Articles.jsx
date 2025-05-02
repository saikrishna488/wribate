"use client"
import React from "react";
import ArticleCard from "../components/ArticleCard";

// Article Card Component

const NewsSections = ({
  mainWribate,
  onGoing,
  completed,
  free,
  sponsoredWribates,
}) => {
  // Sample data - replace with real data in production

  console.log(mainWribate);
  console.log(onGoing);
  console.log(free);

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden md:p-2 p-1">
      {/* Main News Column - 65% width on large screens, full width on small */}
      <div className="lg:w-[60%] overflow-y-auto md:h-[calc(100vh-130px)] scrollbar-hide pr-2 pb-2 border-r-2  border-gray-200 ">
        <div className="pb-2 border-b-2 border-gray-200">
          <ArticleCard
            id={mainWribate._id}
            image={mainWribate.coverImage}
            title={mainWribate?.title}
            isLarge={true}
            category={mainWribate.category}
            tag={"Main"}
          />
        </div>
        <div className="mt-1">
          {free && free.length > 0 && (
            <>
              <p>free</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 scrollbar-hide pt-1 mt-2">
                {free.map((article, index) => (
                  <ArticleCard
                    id={article._id}
                    key={index}
                    image={article?.coverImage}
                    title={article?.title}
                    category={article.category}
                    tag="Free"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-1">
          {sponsoredWribates && sponsoredWribates.length > 0 && (
            <>
              <p>sponsored</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 scrollbar-hide pt-1 mt-2">
                {sponsoredWribates.map((article, index) => (
                  <ArticleCard
                    id={article._id}
                    key={index}
                    image={article?.coverImage}
                    title={article?.title}
                    category={article.category}
                    tag={"Sponsored"}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="mt-1">
          {completed && completed.length > 0 && (
            <>
              <p>completed</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 scrollbar-hide pt-1 mt-2">
                {completed.map((article, index) => (
                  <ArticleCard
                    id={article._id}
                    key={index}
                    image={article?.coverImage}
                    title={article?.title}
                    category={article.category}
                    tag={"Completed"}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle News Column - individually scrollable */}
      {onGoing && onGoing?.length > 0 && (
        <div className="lg:w-[20%]">
          <div className=" overflow-y-auto md:h-[calc(100vh-130px)]  mt-4 lg:mt-0 scrollbar-hide pr-2 pl-2 border-r-2 border-gray-200">
            <p>ongoing</p>
            {onGoing.map((article, index) => (
              <ArticleCard
                id={article._id}
                key={index}
                image={article?.coverImage}
                title={article?.title}
                isDouble={true}
                category={article.category}
                tag={"On Going"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Featured News Column - individually scrollable */}
      {/* <div className="lg:w-[20%]"></div> */}
      <div className="md:w-[20%] overflow-y-auto md:h-[calc(100vh-130px)] px-2 mt-4 lg:mt-0 scrollbar-hide">
        Hello
      </div>
    </div>
  );
};

export default NewsSections;
