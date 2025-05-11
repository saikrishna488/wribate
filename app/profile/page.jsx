"use client"
import React, { useState, useEffect } from "react";
import {
    useGetProfileQuery,
    useGetCategoriesQuery,
    useUpdateFavoriteCategoriesMutation,
} from "../services/authApi";
import formatDate from "../utils/dateFormat";
import EditProfileModal from "./EditProfileModal";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import authHeader from "../utils/authHeader";

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useAtom(userAtom);
    const [isUpdatingCategories,setIsUpdatingCategories] = useState(false);
    const [favoriteCategories,setFavoriteCategories] = useState(user?.favoriteCategories)

    // Fetch categories if not already available
    const { data: categoriesData, isLoading: isCategoriesLoading } =
        useGetCategoriesQuery();

    // State for editing mode and selected categories
    const [isEditingCategories, setIsEditingCategories] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // State for profile modal
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
        }
    }, [user]);

    const user_avatar = {
        avatar: user?.avatar || "/user.png",
    };

    const focusAreas = [
        { id: 1, icon: "🏆", title: "Wins", count: 4 },
        { id: 2, icon: "👑", title: "LeaderShips", count: 4 },
        { id: 3, icon: "💬", title: "Comments", count: 4 },
        { id: 4, icon: "💰", title: "Pecuniary", count: 4 },
        { id: 5, icon: "🚀", title: "Launches", count: 4 },
        { id: 6, icon: "⭐", title: "Reviews", count: 4 },
    ];

    const handleLogout = async () => {
        setUser({})
        localStorage.removeItem("token")
        toast.success("Logged out")
    };

    useEffect(() => {
        if (!user._id) {
            console.log("navigating to login");
            router.push("/login");
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
            const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/favouriteCategories', updatedCategories, {
                headers: authHeader()
            })

            const data = res.data;

            if (data.res) {
                toast.success("Your favorite categories have been updated");
                setIsEditingCategories(false);
                setUser(data.user)
            }
            setIsUpdatingCategories(false)

        } catch (error) {
            toast.error("Failed to update favorite categories");
            console.log(error)
            setIsUpdatingCategories(false)
        }
    };

    // Open edit profile modal
    const openProfileModal = () => {
        setIsProfileModalOpen(true);
    };

    // Close edit profile modal
    const closeProfileModal = () => {
        setIsProfileModalOpen(false);
    };

    if (!user._id) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {user?._id && (
                <div>
                    {/* Header */}
                    <header className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center">
                            <button
                                className="p-2 hover:bg-blue-800 transition-colors"
                                onClick={() => router.push("/")}
                                aria-label="Back"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold ml-4">Profile</h1>
                        </div>
                    </header>

                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left sidebar */}
                            <div className="lg:w-1/4">
                                <div className="bg-white shadow-md p-6 border-t-4 border-blue-900">
                                    <div className="overflow-hidden w-32 h-32 mx-auto relative border-4 border-blue-900">
                                        <div className="w-full h-full">
                                            <img
                                                src={user?.profilePhoto}
                                                alt={user?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                                        <p className="text-gray-600 mt-1">{user.email}</p>
                                        <p className="text-gray-600 mt-1">
                                            {user.country || "Country not specified"}
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            <span className="font-medium">DOB:</span>{" "}
                                            {user.dob ? formatDate(user?.dob) : "Not specified"}
                                        </p>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="mt-8 border-t border-gray-200 pt-6">
                                        <ul className="space-y-4">
                                            <li>
                                                <button
                                                    onClick={openProfileModal}
                                                    className="w-full p-3 flex justify-center bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
                                                >
                                                    <span className="mr-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </span>
                                                    Edit Profile
                                                </button>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/my-wribates"
                                                    className="w-full p-3 flex justify-center bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                                                >
                                                    <span className="mr-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                    </span>
                                                    My Wribates
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    className="w-full p-3 flex justify-center bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                                                    onClick={handleLogout}
                                                >
                                                    <span className="mr-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                    </span>
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>

                            {/* Main content */}
                            <div className="lg:w-3/4">
                                {/* Focus areas section */}
                                <div className="bg-white shadow-md p-6 mb-6 border-t-4 border-blue-900">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Activity Summary</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {focusAreas.map((area) => (
                                            <div
                                                key={area.id}
                                                className="p-4 border border-gray-200 flex items-center"
                                            >
                                                <span className="text-2xl mr-4">{area.icon}</span>
                                                <div>
                                                    <p className="text-lg font-semibold">{area.count}</p>
                                                    <p className="text-gray-500">{area.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Favorite Categories section */}
                                <div className="bg-white shadow-md p-6 border-t-4 border-blue-900">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            Favourite Categories
                                        </h2>
                                        <div>
                                            {isEditingCategories ? (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setIsEditingCategories(false)}
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
                                                    const isFavorite = user?.favoriteCategories?.some(
                                                        (fav) => fav === category._id
                                                    );

                                                    console.log(isFavorite)

                                                    const isSelected = selectedCategories.includes(
                                                        category._id
                                                    );

                                                    return (
                                                        <div
                                                            key={category._id}
                                                            onClick={() =>
                                                                isEditingCategories &&
                                                                toggleCategorySelection(category._id)
                                                            }
                                                            className={`p-3 cursor-${isEditingCategories ? "pointer" : "default"} 
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
                            </div>
                        </div>
                    </div>

                    {/* Render Edit Profile Modal component */}
                    <EditProfileModal
                        isOpen={isProfileModalOpen}
                        onClose={closeProfileModal}
                        userInfo={user}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfilePage;