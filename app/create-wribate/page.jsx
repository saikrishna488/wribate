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


  useEffect(()=>{
    if(!user?._id){
      router.push('/login')
    }
  },[])

  if(!user?._id){
    return null
  }

  return (
    <div className=" flex justify-center items-start flex-col md:flex-row">
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
      <div className="w-full md:w-[25%]">Hello</div>
    </div>
  );
};

export default CreateWribateForm;
