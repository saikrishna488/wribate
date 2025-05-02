"use client"
import React, { useState, useEffect } from "react";
import Categories from './components/Home/Categories'
import Articles from "./components/Home/Articles";
import {
  useGetCategoriesQuery,
  useGetMyWribatesByCategoryQuery,
} from "./services/authApi";
import { setCategories } from "./features/categoriesSlice";
import { useDispatch } from "react-redux";

// Replace with actual token

const Home = () => {
  const { data, isLoading, error } = useGetCategoriesQuery();
  const [category, setCategory] = useState(null);
  const dispatch = useDispatch();

  const {
    data: wribates,
    isLoading: wribatesLoading,
    error: wribatesError,
  } = useGetMyWribatesByCategoryQuery(category, {
    skip: !category,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data && data?.data && data?.data.length > 0) {
      console.log(data);
      console.log(data?.data[0]._id);

      setCategory(data?.data[0].categoryName);
      dispatch(setCategories(data?.data));
    }
  }, [data]);

  useEffect(() => {
    if (category) {
      console.log(category);
    }
  }, [category]);

  const handleCategoryChange = (name) => {
    setCategory(name);
  };

  console.log(wribates);
  // Reconnect only if the token changes

  return (
    <div className="bg-gray-100">
      {/* <Header /> */}
      <Categories
        categories={data?.data}
        isLoading={isLoading}
        category={category}
        onChange={handleCategoryChange}
      />
      {wribatesLoading && <p>Wribates Loading</p>}
      {!wribatesError && !wribatesLoading && wribates && (
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
