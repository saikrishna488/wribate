import React from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';

const Header = ({ wribatesRef, setWribates, activeCategory, setIsLoading, setActiveCategory, topCategories, categories, setCategories, setTopCategories }) => {

    const categoriesRef = useRef(null);
    const router = useRouter();





    useEffect(() => {
        const fetchWribates = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(
                    process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getByCategory/' + activeCategory
                );

                const data = res.data;

                if (data.res) {
                    setWribates(data.wribates);
                    wribatesRef.current && (wribatesRef.current.scrollTop = 0)
                    setIsLoading(false);
                } else {
                    toast.error("Error occurred");
                }
            } catch (err) {
                console.log(err);
                toast.error("Client error");
                setIsLoading(false);
            }
        };
        fetchWribates();
    }, [activeCategory]);


    return (
        <header className="mb-6 py-2 bg-gray-50 sticky w-full px-2 top-0 z-20">
            <div className="border-b border-gray-200 relative flex items-center justify-center w-full">
                <div
                    ref={categoriesRef}
                    className="overflow-x-auto scrollbar-hide flex px-2 relative"
                >

                    <button
                        className={`px-3 py-2 mr-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeCategory === "My Wribates"
                            ? "border-blue-700 text-blue-700 scroll-smooth"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                        onClick={() => router.push('/my-wribates')}
                    >
                        {"My Wribates"}
                    </button>
                    {/* All + Top Categories */}
                    <button
                        className={`px-3 py-2 mr-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeCategory === "All"
                            ? "border-blue-700 text-blue-700 scroll-smooth"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                        onClick={() => setActiveCategory("All")}
                    >
                        {"All"}
                    </button>
                    {topCategories.map((category) => (
                        <button
                            key={category._id}
                            className={`px-3 py-2 mr-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeCategory === category.categoryName
                                ? "border-blue-700 text-blue-700"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                            onClick={() => setActiveCategory(category.categoryName)}
                        >
                            {category.categoryName}
                        </button>
                    ))}

                    {/* Three Dots Button */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="px-3 py-2 mr-4 text-sm font-medium whitespace-nowrap transition-colors text-gray-600 hover:text-gray-900"
                            >
                                <BsThreeDots />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className="p-2 bg-white shadow-lg rounded-md z-50 grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {categories.slice(8).map((category) => (
                                <DropdownMenuItem
                                    key={category._id}
                                    className="text-gray-700 hover:text-blue-700 text-sm"
                                    onClick={() => {
                                        setActiveCategory(category.categoryName);
                                    }}
                                >
                                    {category.categoryName}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Header
