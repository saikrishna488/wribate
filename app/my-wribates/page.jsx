"use client"
import React, { useState, useEffect } from "react";
import Categories from "./Categories";
import Articles from "./Articles";
import { useGetMyWribatesQuery } from "../services/authApi";

const Home = () => {
  const {
    data: wribates,
    isLoading: wribatesLoading,
    error: wribatesError,
  } = useGetMyWribatesQuery();

  return (
    <div className="bg-gray-100">
      <Categories />
      {wribatesLoading && <p>Wribates Loading</p>}
      {wribates && (
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
      {wribatesError && <p>No Wribates Found</p>}
    </div>
  );
};

export default Home;
