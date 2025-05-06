"use client"
import React, { useEffect, useState } from "react";
import SingleWribate from "./SingleWribate";
import BatchedWribate from "./BatchedWribate";
import { useSelector } from "react-redux";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import { useRouter } from "next/navigation";

const CreateWribateForm = () => {
  const [type, setType] = useState("single");
  // const { user } = useSelector((state) => state.auth);
  const [user] = useAtom(userAtom);
  const router = useRouter(userAtom);

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
      router.push('/login')
    }
  }, [])

  if (!user?._id) {
    return null
  }

  return (
    <div className=" flex relative justify-center gap-4 items-start flex-col md:flex-row">
      <div className="w-full md:w-[75%]">
        {/* <div className="w-full flex flex-row justify-center md:gap-20 gap-4 md:p-2">
          <button
            className={`p-2 border border-gray-300 rounded  ${
              type == "single" ? "bg-blue-200" : "bg-white"
            }`}
            onClick={() => setType("single")}
          >
            Single wribate
          </button>

          {user?.userRole !== "user" && (
            <button
              className={`p-2 border border-gray-300 rounded  ${
                type == "batched" ? "bg-blue-200" : "bg-white"
              }`}
              onClick={() => setType("batched")}
            >
              Batched Wribate
            </button>
          )}
        </div> */}
        {type == "single" && <SingleWribate />}
        {type == "batched" && <BatchedWribate />}
      </div>
      <div className="md:w-[25%] p-4 space-y-4">
        {ads.map((ad, index) => (
          <a
            key={index}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-4"
          >
            <img
              src={ad.src}
              alt={ad.alt}
              className="w-full h-auto shadow-md hover:opacity-90 transition"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default CreateWribateForm;
