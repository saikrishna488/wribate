"use client"
import React, { useEffect, useState } from "react";
import SingleWribate from "./SingleWribate";
import BatchedWribate from "./BatchedWribate";
import { useSelector } from "react-redux";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import { useRouter } from "next/navigation";
import { AdSpaceContent } from "../components/Advertisements/Advertisement";

const CreateWribateForm = () => {
  const [type, setType] = useState("single");
  const [user] = useAtom(userAtom);
  const router = useRouter();

  const ads = [
    {
      src: "/Ads/01.png",
      alt: "Ad 1",
      link: "https://sponsor1.com"
    },
    {
      src: "/Ads/02.png",
      alt: "Ad 2",
      link: "https://sponsor2.com"
    },
    {
      src: "/Ads/03.png",
      alt: "Ad 3",
      link: "https://sponsor3.com"
    }
  ];

  useEffect(() => {
    if (!user?._id) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user?._id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 lg:w-3/4">
            <div className="bg-white shadow-sm border border-gray-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Create Wribate
                </h1>
              </div>

              {/* Navigation Buttons */}
              {user?.userRole !== "user" && (
                <div className="px-6 py-6 border-b border-gray-200">
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-none w-fit">
                    <button
                      className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${
                        type === "single"
                          ? "bg-blue-900 text-white shadow-sm"
                          : "text-gray-700 hover:text-blue-900 hover:bg-white"
                      }`}
                      onClick={() => setType("single")}
                    >
                      Single Wribate
                    </button>
                    <button
                      className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${
                        type === "batched"
                          ? "bg-blue-900 text-white shadow-sm"
                          : "text-gray-700 hover:text-blue-900 hover:bg-white"
                      }`}
                      onClick={() => setType("batched")}
                    >
                      Batched Wribate
                    </button>
                  </div>
                </div>
              )}

              {/* Content Area */}
              <div className="">
                {type === "single" && <SingleWribate />}
                {type === "batched" && <BatchedWribate />}
              </div>
            </div>
          </div>

          {/* Sidebar - Advertisements */}
          <div className="lg:w-1/4">
            <div className="bg-white shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Sponsored
                </h2>
              </div>
              <div className="p-4 space-y-4">
                {ads.map((ad, index) => (
                  <a
                    key={index}
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="border border-gray-200 overflow-hidden transition-all duration-200 hover:border-blue-900 hover:shadow-md">
                      <img
                        src={ad.src}
                        alt={ad.alt}
                        className="w-full h-auto transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWribateForm;