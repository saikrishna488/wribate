"use client"
import React, { useState, useEffect } from "react";
import { useGetCategoriesQuery } from "../services/authApi";
import axios from "axios";
import authHeader from "../utils/authHeader";
import toast from "react-hot-toast";

const FavoriteCategories = ({ user, setUser }) => {
    const [isUpdatingCategories, setIsUpdatingCategories] = useState(false);
    const [isEditingCategories, setIsEditingCategories] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [displayedFavorites, setDisplayedFavorites] = useState([]);

    // Fetch categories if not already available
    const { data: categoriesData, isLoading: isCategoriesLoading } =
        useGetCategoriesQuery();

    // Initialize selected categories from user
    useEffect(() => {
        if (
            user?._id &&
            user.favoriteCategories &&
            user?.favoriteCategories?.length > 0
        ) {
            const favourites = user?.favoriteCategories.map(
                (category) => category?._id
            );
            setSelectedCategories(favourites);
            setDisplayedFavorites(favourites);
        } else {
            setSelectedCategories([]);
            setDisplayedFavorites([]);
        }
    }, [user]);

    // Toggle category selection
    const toggleCategorySelection = (categoryId) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(
                selectedCategories.filter((id) => id !== categoryId)
            );
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    // Save favorite categories
    const saveFavoriteCategories = async () => {
        try {
            setIsUpdatingCategories(true);
            const updatedCategories = { categoryIds: selectedCategories };
            const res = await axios.post(
                process.env.NEXT_PUBLIC_BACKEND_URL + '/user/favouriteCategories',
                updatedCategories,
                {
                    headers: authHeader()
                }
            );

            const data = res.data;

            if (data.res) {
                toast.success("Your favorite categories have been updated");
                setIsEditingCategories(false);
                // Update displayed favorites immediately without waiting for the parent to update user
                setDisplayedFavorites([...selectedCategories]);
                setUser(data.user);
            }
            setIsUpdatingCategories(false);

        } catch (error) {
            toast.error("Failed to update favorite categories");
            console.log(error);
            setIsUpdatingCategories(false);
        }
    };

    return (
        <div className="bg-white shadow-md p-6 border-t-4 border-blue-900">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Favourite Categories
                </h2>
                <div>
                    {isEditingCategories ? (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsEditingCategories(false);
                                    // Reset selection to match current favorites when canceling
                                    setSelectedCategories([...displayedFavorites]);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-100"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={saveFavoriteCategories}
                                className="px-4 py-2 bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors shadow-sm"
                            >
                                {isUpdatingCategories ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        SAVING...
                                    </div>
                                ) : (
                                    "SAVE"
                                )}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditingCategories(true)}
                            className="px-4 py-2 bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors shadow-sm"
                        >
                            EDIT
                        </button>
                    )}
                </div>
            </div>

            {isCategoriesLoading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {categoriesData?.data &&
                        categoriesData?.data.length > 0 ? (
                        categoriesData.data.map((category) => {
                            // Use displayedFavorites for rendering when not editing
                            const isFavorite = displayedFavorites.includes(category._id);
                            // Use selectedCategories when in edit mode
                            const isSelected = selectedCategories.includes(category._id);

                            return (
                                <div
                                    key={category._id}
                                    onClick={() =>
                                        isEditingCategories &&
                                        toggleCategorySelection(category._id)
                                    }
                                    className={`p-3 ${isEditingCategories ? "cursor-pointer" : "cursor-default"} 
                                      ${isEditingCategories
                                            ? isSelected
                                                ? "bg-blue-900 text-white" // editing + selected
                                                : "bg-gray-100 hover:bg-gray-200" // editing + not selected
                                            : isFavorite
                                                ? "bg-blue-900 bg-opacity-10 border border-blue-900 text-white" // not editing + favorite
                                                : "bg-gray-100 text-gray-700" // not editing + not favorite
                                        }
                                      md:min-w-[120px] text-center transition-colors font-medium`}
                                >
                                    {category.categoryName}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 w-full text-center p-4 border border-gray-200">
                            No categories available
                        </p>
                    )}
                </div>
            )}

            {isEditingCategories && (
                <div className="mt-6 text-sm text-gray-500 p-4 border border-gray-200 bg-gray-50">
                    <p>Click on categories to select or deselect them as favorites</p>
                </div>
            )}
        </div>
    );
};

export default FavoriteCategories;