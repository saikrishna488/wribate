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
  const router = useRouter(userAtom);

  useEffect(() => {
    if (!user?._id) {
      router.push('/login')
    }
  }, [])

  if (!user?._id) {
    return null
  }

  return (
    <div className="flex relative justify-center gap-4 items-start flex-col md:flex-row">
      <div className="w-full md:w-[75%]">
        <div className="w-full flex flex-row justify-center md:gap-20 gap-4 md:p-2">
          {user?.userRole !== "user" && (
            <>
              <button
                className={`p-2 border border-gray-300 rounded  ${type == "single" ? "bg-blue-200" : "bg-white"}`}
                onClick={() => setType("single")}
              >
                Single wribate
              </button>
              <button
                className={`p-2 border border-gray-300 rounded  ${type == "batched" ? "bg-blue-200" : "bg-white"}`}
                onClick={() => setType("batched")}
              >
                Batched Wribate
              </button>
            </>
          )}
        </div>
        {type == "single" && <SingleWribate />}
        {type == "batched" && <BatchedWribate />}
      </div>
      <div className="md:w-[25%] p-4 space-y-4">
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

export default CreateWribateForm;
