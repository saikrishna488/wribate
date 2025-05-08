"use client"
import React, { useState, useEffect } from "react";
import Categories from "./Categories";
import Articles from "./Articles";
import { useGetMyWribatesQuery } from "../services/authApi";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import { linkWithCredential } from "firebase/auth";
import getAuthHeader from "../utils/authHeader";

const Home = () => {
  // const {
  //   data: wribates,
  //   isLoading: wribatesLoading,
  //   error: wribatesError,
  // } = useGetMyWribatesQuery();
  const [user] = useAtom(userAtom);
  const [wribates,setWribates] = useState([])
  const [isLoading,setIsLoading] = useState(false);
  const [isError,setIsError] = useState(false)

  useEffect(() => {

    const fetchWribates = async () => {
      try{
        setIsLoading(true);
      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/myWribates', {
        _id: user._id,
        email: user._id
      },
        {
          withCredentials: true,
          headers : getAuthHeader()
        }
      )

      const data = res.data;

      console.log(data.data)
      if(data.res){
        setWribates(data)
        setIsLoading(false)
      }
      else{

      }

      }
      catch(err){
        console.log(err);
        setIsLoading(false)
        setIsError(true)
      }

    }

    fetchWribates()

  }, [])

  return (
    <div className="bg-gray-100">
      <Categories />
      {isLoading && <p>Wribates Loading</p>}
      {!isError &&  wribates && (
        <Articles
          mainWribate={
            wribates?.data?.ongoing[0] ||
            wribates?.data?.completed[0] ||
            wribates?.data?.freeWribates[0] ||
            wribates?.data?.sponsoredWribates[0]
          }
          onGoing={wribates?.data?.ongoing}
          completed={wribates?.data?.completed}
          free={wribates?.data?.freeWribates}
          sponsoredWribates={wribates?.data?.sponsoredWribates}
        />
      )}
      {isError && <h4>No wribates Found</h4>}
    </div>
  );
};

export default Home;
