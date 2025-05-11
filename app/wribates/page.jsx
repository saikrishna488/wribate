"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import authHeader from '../utils/authHeader';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";

export default function WribateDashboard() {
  const [wribates, setWribates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const categoriesRef = useRef(null);
  const wribatesRef = useRef(null)
  const [categories, setCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false)

  // Ad data
  const ads = [
    {
      src: "/Ads/01.png",
      alt: "Ad 1",
      link: "https://sponsor1.com"
    },
    {
      src: "/Ads/02.png",
      alt: "Ad 2",
      link: "https://sponsor2.com"
    },
    {
      src: "/Ads/03.png",
      alt: "Ad 3",
      link: "https://sponsor3.com"
    }
  ];

  useEffect(() => {

    const fetchCategories = async () => {
      try {

        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getallcategories', {
          headers: authHeader()
        })

        const data = res.data
        console.log(data)

        if (data.res) {
          setCategories(data.categories)
          setTopCategories(data.categories.slice(0, 7))
        }
      }
      catch (err) {
        console.log(err);
        toast.error("error occured")
      }
    }

    fetchCategories()
  }, [])

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
          wribatesRef.current.scrollTop = 0;
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

    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      checkScrollPosition();
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [activeCategory]);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (!categoriesRef.current) return;

    const container = categoriesRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  useEffect(() => {
    const container = categoriesRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();

      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [categoriesRef]);

  const handleCardClick = (id) => {
    router.push(`/wribate/${id}`);
  };

  const getWribateStatus = (startDate, durationDays) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + durationDays);

    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Active";
  };

  // Scroll category navigation
  const scrollCategories = (direction) => {
    const container = categoriesRef.current;
    const scrollAmount = 200;

    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  // Filter wribates based on type and status
  const freeWribates = wribates.filter(wribate =>
    (activeCategory === 'All' || wribate.category === activeCategory) &&
    wribate.type === "Free"
  );

  const sponsoredWribates = wribates.filter(wribate =>
    (activeCategory === 'All' || wribate.category === activeCategory) &&
    wribate.type === "Sponsored"
  );

  const upcomingWribates = wribates.filter(wribate =>
    (activeCategory === 'All' || wribate.category === activeCategory) &&
    getWribateStatus(wribate.startDate, wribate.durationDays) === "Upcoming"
  );

  const activeWribates = wribates.filter(wribate =>
    (activeCategory === 'All' || wribate.category === activeCategory) &&
    getWribateStatus(wribate.startDate, wribate.durationDays) === "Active"
  );

  const completedWribates = wribates.filter(wribate =>
    (activeCategory === 'All' || wribate.category === activeCategory) &&
    getWribateStatus(wribate.startDate, wribate.durationDays) === "Completed"
  );

  // Sort wribates by created date for most recent
  const sortedWribates = [...wribates].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Extract the most recent wribate
  const heroWribate = sortedWribates.length > 0 ? sortedWribates[0] : null;


  if (categories.length == 0) {
    return (
      <div className='w-full px-4'>
        Loading...
      </div>
    )
  }

  return (
    <div ref={wribatesRef} className="h-[90vh] overflow-y-auto bg-gray-50">
      <header className="mb-6 py-2 bg-gray-50 sticky w-full px-2 top-0 z-20">
        <div className="border-b border-gray-200 relative flex items-center w-full">
          <div
            ref={categoriesRef}
            className="overflow-x-auto scrollbar-hide flex px-2 relative"
          >
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

              <DropdownMenuContent align="start" className=" p-2 bg-white shadow-lg rounded-md z-50 grid grid-cols-3 sm:grid-cols-4 gap-4">
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

      <div className="w-full mx-auto flex flex-col lg:flex-row">
        {/* Main content */}
        <div className="w-full lg:flex-1 px-4">


          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Hero Wribate */}
              {heroWribate && (
                <div id='hero' className="mb-8" >
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-blue-700 pl-3">
                    Featured Wribate
                  </h2>
                  <div
                    onClick={() => handleCardClick(heroWribate._id)}
                    className="bg-white cursor-pointer hover:shadow-lg border transition-shadow duration-300 w-full"
                  >
                    <div className="flex flex-col">
                      <div className="h-48 sm:h-64 md:h-96 relative">
                        <img
                          src={heroWribate.coverImage}
                          alt={heroWribate.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 bg-white w-full">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{heroWribate.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Free Wribates */}
              {freeWribates.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-green-700 pl-3">
                    Free Debates
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                    {freeWribates.map((wribate) => (
                      <div
                        key={wribate._id}
                        onClick={() => handleCardClick(wribate._id)}
                        className="bg-white cursor-pointer border hover:shadow-lg transition-shadow duration-300 w-full"
                      >
                        <div className="h-32 sm:h-40 relative">
                          <img
                            src={wribate.coverImage}
                            alt={wribate.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 sm:p-3 bg-white w-full">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">{wribate.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sponsored Wribates */}
              {sponsoredWribates.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-yellow-600 pl-3">
                    Sponsored Debates
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                    {sponsoredWribates.map((wribate) => (
                      <div
                        key={wribate._id}
                        onClick={() => handleCardClick(wribate._id)}
                        className="bg-white cursor-pointer hover:shadow-lg border transition-shadow duration-300 w-full"
                      >
                        <div className="h-32 sm:h-40 relative">
                          <img
                            src={wribate.coverImage}
                            alt={wribate.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 sm:p-3 bg-white w-full">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">{wribate.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Wribates */}
              {activeWribates.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-blue-700 pl-3">
                    Ongoing Debates
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                    {activeWribates.map((wribate) => (
                      <div
                        key={wribate._id}
                        onClick={() => handleCardClick(wribate._id)}
                        className="bg-white cursor-pointer hover:shadow-lg border transition-shadow duration-300 w-full"
                      >
                        <div className="h-32 sm:h-40 relative">
                          <img
                            src={wribate.coverImage}
                            alt={wribate.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 sm:p-3 bg-white w-full">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">{wribate.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Wribates */}
              {completedWribates.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-gray-700 pl-3">
                    Completed Debates
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                    {completedWribates.map((wribate) => (
                      <div
                        key={wribate._id}
                        onClick={() => handleCardClick(wribate._id)}
                        className="bg-white cursor-pointer hover:shadow-lg border transition-shadow duration-300 w-full"
                      >
                        <div className="h-32 sm:h-40 relative">
                          <img
                            src={wribate.coverImage}
                            alt={wribate.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 sm:p-3 bg-white w-full">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">{wribate.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Ad section */}
        <div className="w-full px-4 lg:w-64 lg:pl-6 lg:pr-4 mt-8 lg:mt-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-gray-700 pl-3">
              Sponsored
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {ads.map((ad, index) => (
                <a
                  key={index}
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-gray-200 hover:shadow-md transition-shadow w-full"
                >
                  <img src={ad.src} alt={ad.alt} className="w-full" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}