"use client"
import React, { useState, useEffect } from "react";
import { useUploadImageMutation } from "../services/authApi";
import {
    useGetProfileQuery,
    useGetCategoriesQuery,
    useUpdateFavoriteCategoriesMutation,
} from "../services/authApi";
import { logout } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../utils/dateFormat";
import EditProfileModal from "./EditProfileModal";
import { baseApi } from "../services/baseApi";
import { setCredentials } from "../features/authSlice"; // Import the new component
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "../states/globalStates";
import Link from "next/link";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    // const { isLoggedIn, userInfo } = useSelector((state) => state.auth);
    const [user, setUser] = useAtom(userAtom);
    const { categories } = useSelector((state) => state.category);

    // Fetch categories if not already available
    const { data: categoriesData, isLoading: isCategoriesLoading } =
        useGetCategoriesQuery();

    // State for editing mode and selected categories
    const [isEditingCategories, setIsEditingCategories] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // State for profile modal
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Update categories mutation
    const [updateCategories, { isLoading: isUpdatingCategories }] =
        useUpdateFavoriteCategoriesMutation();


    //
    

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
        { id: 1, icon: "💻", title: "Wins", count: 4 },
        { id: 2, icon: "🔒", title: "LeaderShips", count: 4 },
        { id: 3, icon: "👨‍💻", title: "Comments", count: 4 },
        { id: 4, icon: "🌐", title: "Pecuniary", count: 4 },
        { id: 5, icon: "🐞", title: "Launches", count: 4 },
        { id: 6, icon: "🐞", title: "Reviews", count: 4 },
    ];

    const handleLogout = async () => {
        // Swal.fire({
        //   title: "Logout",
        //   text: "Are you sure? Do you want to logout",
        //   icon: "warning",
        //   showCancelButton: true,
        //   confirmButtonText: "Logout",
        //   cancelButtonText: "Cancel",
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     dispatch(logout());
        //     localStorage.removeItem("token");
        //     navigate("/app/login");
        //   }
        // });

        try {

            const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/user/logout", {
                withCredentials: true
            })
            const data = res.data;

            if (data.res) {
                toast.success("Logged out");
                router.replace('/login');
            }

            localStorage.removeItem("token");

            dispatch(baseApi.util.resetApiState());
            //navigate("/app");
            dispatch(logout());

        }
        catch (err) {
            console.log(err);
            toast.error("Client error")
        }


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
            console.log(selectedCategories);
            const updatedCategories = { categoryIds: selectedCategories };
            const response = await updateCategories(updatedCategories).unwrap();

            dispatch(setCredentials(response?.data));

            toast.success("Your favorite categories have been updated")

            setIsEditingCategories(false);
        } catch (error) {
            toast.error("Failed to update favorite categorie")
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


    if(!user._id){
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            { user?._id && (
                <div>
                    <header className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={() => router.push("/")}
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
                    </header>

                    <div className="container mx-auto px-4 md:px-6 py-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left sidebar */}
                            <div className="md:w-1/4">
                                <div>
                                    <div className="bg-yellow-400 overflow-hidden w-32 h-32 mx-auto md:mx-0 relative rounded-full">
                                        <div className="w-full h-full rounded-full">
                                            <img
                                                src={user?.profilePhoto || user_avatar?.avatar}
                                                alt={user?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-center md:text-left">
                                    <h1 className="text-xl font-bold">{user?.name}</h1>
                                    <p className="text-gray-600">{user.email}</p>
                                    <p className="text-gray-600">
                                        {user.country || "Country"}
                                    </p>
                                    <p className="text-gray-600">
                                        DOB:{" "}
                                        {user.dob ? formatDate(user?.dob) : "Not specified"}
                                    </p>
                                </div>

                                {/* Navigation */}
                                <nav className="mt-8 font-bold flex flex-col justify-center md:justify-center items-center md:items-start">
                                    <ul className="space-y-2 md:">
                                        <li>
                                            <button
                                                onClick={openProfileModal}
                                                className="block py-1 cursor-pointer hover:text-gray-700"
                                            >
                                                Edit Profile
                                            </button>
                                        </li>
                                        <li>
                                            <Link
                                                href="/my-wribates"
                                                className="block hover:text-gray-700 py-1"
                                            >
                                                My Wribates
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                className="block cursor-pointer hover:text-gray-700 py-1"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>

                            {/* Main content */}
                            <div className="md:w-3/4">
                                {/* Focus areas section */}
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
                                        {focusAreas.map((area) => (
                                            <div
                                                key={area.id}
                                                className={`p-3 rounded-lg border border-gray-200 flex items-center ${area.id === 1 ? "bg-gray-50" : ""
                                                    }`}
                                            >
                                                <span className="mr-3 text-lg">{area.count}</span>
                                                <span>{area.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Favorite Categories section */}
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl text-gray-600 font-bold">
                                            Favourite Categories
                                        </h2>
                                        <div>
                                            {isEditingCategories ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setIsEditingCategories(false)}
                                                        className="px-4 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={saveFavoriteCategories}
                                                        className="px-4 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                                                        disabled={isUpdatingCategories}
                                                    >
                                                        {isUpdatingCategories ? "Saving..." : "Save"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setIsEditingCategories(true)}
                                                    className="px-4 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isCategoriesLoading ? (
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-3">
                                            {categoriesData?.data &&
                                                categoriesData?.data.length > 0 ? (
                                                categoriesData.data.map((category) => {
                                                    const isFavorite = user.favoriteCategories?.some(
                                                        (fav) => fav?._id === category._id
                                                    );

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
                                                            className={`p-2 rounded cursor-${isEditingCategories ? "pointer" : "default"
                                                                } 
                              ${isEditingCategories
                                                                    ? isSelected
                                                                        ? "bg-primary text-white" // editing + selected
                                                                        : "bg-gray-100 hover:bg-gray-200" // editing + not selected
                                                                    : isFavorite
                                                                        ? "bg-primary bg-opacity-20 border border-primary" // not editing + favorite
                                                                        : "bg-gray-100" // not editing + not favorite
                                                                }
                              md:min-w-[100px] text-center transition-colors`}
                                                        >
                                                            {category.categoryName}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-gray-500 w-full text-center">
                                                    No categories available
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {isEditingCategories && (
                                        <div className="mt-4 text-sm text-gray-500">
                                            Click on categories to select or deselect them as
                                            favorites
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
                        user={user}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
