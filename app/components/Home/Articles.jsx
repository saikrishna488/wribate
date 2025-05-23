import React from "react";
import ArticleCard from "../ArticleCard";
import { formatDistanceToNow } from "date-fns";
import { AdSpaceContent } from "../Advertisements/Advertisement";

const NewsSections = ({
  mainWribate,
  onGoing,
  completed,
  free,
  sponsoredWribates,
}) => {
  // Function to format timestamp to "X time ago"
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="flex flex-col h-[80vh] lg:flex-row justify-between md:p-2 p-1">
      {/* Main News Column - 60% width on large screens, full width on small */}
      <div className="lg:w-[60%] overflow-y-auto min-h-screen scrollbar-thin pr-2 border-r-2 border-gray-400">
        <div className="pb-2 border-b-2 border-gray-400">
          <ArticleCard
            id={mainWribate._id}
            image={mainWribate.coverImage}
            title={mainWribate?.title}
            isLarge={true}
            category={mainWribate.category}
            tag={"Main"}
            createdAt={mainWribate.createdAt}
          />
        </div>
        <div className="mt-6">
          {free && free.length > 0 && (
            <>
              <p className="text-primary text-xl md:mt-1 font-bold ">Free</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 mt-2">
                {free.map((article, index) => (
                  <ArticleCard
                    id={article._id}
                    key={index}
                    image={article?.coverImage}
                    title={article?.title}
                    category={article.category}
                    tag={"Free"}
                    leadFor={article.leadFor}
                    leadAgainst={article.leadAgainst}
                    createdAt={article.createdAt}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          {sponsoredWribates && sponsoredWribates.length > 0 && (
            <>
              <p className="text-primary text-xl md:mt-1 font-bold">Featured</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 mt-2">
                {sponsoredWribates.map((article, index) => (
                  <ArticleCard
                    id={article._id}
                    key={index}
                    image={article?.coverImage}
                    title={article?.title}
                    category={article.category}
                    tag={"Sponsored"}
                    leadFor={article.leadFor}
                    leadAgainst={article.leadAgainst}
                    createdAt={article.createdAt}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="mt-6">
          {completed && completed.length > 0 && (
            <>
              <p className="text-primary text-xl md:mt-1 font-bold">Completed</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 scrollbar-thin pt-1 mt-2">
                {completed.map((article, index) => (
                  <ArticleCard
                    id={article._id}
                    key={index}
                    image={article?.coverImage}
                    title={article?.title}
                    category={article.category}
                    tag={"Completed"}
                    leadFor={article.leadFor}
                    leadAgainst={article.leadAgainst}
                    createdAt={article.createdAt}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle News Column - individually scrollable */}
      {onGoing && onGoing?.length > 0 ? (
        <div className="lg:w-[20%] h-full">
          <p className="text-primary text-xl font-bold pb-2 w-full px-2 my-0">On Going</p>
          <div className="overflow-y-auto md:h-[calc(100vh-130px)] mt-4 lg:mt-0 scrollbar-thin pr-2 pl-2 border-r-2 border-gray-200">
            {/* <p className="text-primary m-2">ongoing</p> */}
            {onGoing.map((article, index) => (
              <ArticleCard
                id={article._id}
                key={index}
                image={article?.coverImage}
                title={article?.title}
                isDouble={true}
                category={article.category}
                tag={"On Going"}
                leadFor={article.leadFor}
                leadAgainst={article.leadAgainst}
                createdAt={article.createdAt}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="">

        </div>

      )}

      {/* Featured News Column - individually scrollable */}
      <div className="md:w-[20%] border-l border-gray-400 p-2 space-y-4">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <div className="text-center mb-2">
              <span className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Advertisement</span>
            </div>
            <div className="overflow-hidden hover:shadow-md transition-shadow">
              <AdSpaceContent startingAd={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSections;