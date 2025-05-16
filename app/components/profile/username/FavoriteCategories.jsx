"use client"
import React from "react";
import { useGetCategoriesQuery } from "../../../services/authApi";

const FavoriteCategories = ({ user }) => {
    const { data: categoriesData, isLoading: isCategoriesLoading } =
        useGetCategoriesQuery();

    // Get the user's favorite categories
    const userFavorites = user?.favoriteCategories || [];

    return (
        <div className="bg-white shadow-md p-6 border-t-4 border-blue-900">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Favourite Categories
                </h2>
            </div>

            {isCategoriesLoading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {categoriesData?.data &&
                    categoriesData?.data.length > 0 ? (
                        categoriesData.data
                            .filter(category => userFavorites.includes(category._id))
                            .map((category) => (
                                <div
                                    key={category._id}
                                    className="p-3 0 bg-opacity-10 border border-blue-900 text-blue-900 md:min-w-[120px] text-center font-medium"
                                >
                                    {category.categoryName}
                                </div>
                            ))
                    ) : (
                        <p className="text-gray-500 w-full text-center p-4 border border-gray-200">
                            No categories available
                        </p>
                    )}
                    
                    {categoriesData?.data && userFavorites.length === 0 && (
                        <p className="text-gray-500 w-full text-center p-4 border border-gray-200">
                            This user hasn't selected any favorite categories yet
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FavoriteCategories;