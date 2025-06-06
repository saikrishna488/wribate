"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';


import Footer from './components/Footer'
import Header from './components/Home/Header'
import WribateCard from './components/Home/WribateCard'
import SectionHeader from './components/Home/SectionHeader'
import HeroWribate from './components/Home/HeroWribate'
import SponsoredWribates from './components/Home/SponsoredWribates'
import CompletedWribates from './components/Home/CompleteWribates'
import FreeWribates from './components/Home/FreeWribates'
import ActiveWribates from './components/Home/ActiveWribates'
import OngoingWribates from './components/Home/OngoingWribate'
import AdSection from './components/Home/AdSection'

export default function WribateDashboard() {
  const [wribates, setWribates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const wribatesRef = useRef(null)
  const [categories, setCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const router = useRouter();


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getallcategories')

        const data = res.data

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

  const handleCardClick = (id) => {
    router.push(`/wribate/${id}`);
  };

  const handleViewMore = (category, type) => {
    // You can customize this function to navigate to a category-specific page
    // or show more items in the current view
    router.push(`/category/` + category + '?type=' + type);
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





  const upcomingWribates = wribates.filter(wribate =>
    (activeCategory === 'All' || wribate.category === activeCategory) &&
    getWribateStatus(wribate.startDate, wribate.durationDays) === "Upcoming"
  );







  if (categories.length == 0) {
    return (
      <div className='w-full min-h-[90vh] overflow-y-auto px-4 flex justify-center items-center h-64'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div ref={wribatesRef} className="h-[90vh] overflow-y-auto bg-white">
      <Header
        setActiveCategory={setActiveCategory}
        wribatesRef={wribatesRef}
        setWribates={setWribates}
        activeCategory={activeCategory}
        setIsLoading={setIsLoading}
        topCategories={topCategories}
        categories={categories}
        setCategories={setCategories}
        setTopCategories={setTopCategories}
      />

      <div className="w-full mx-auto flex flex-col lg:flex-row">
        {/* Main content - Left section */}
        <div className="w-full lg:w-[50%] px-4 border-r border-gray-300">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Hero Wribate */}
              <HeroWribate wribates={wribates} handleCardClick={handleCardClick} />



              {/* Sponsored Wribates */}
              <SponsoredWribates wribates={wribates} activeCategory={activeCategory} handleViewMore={handleViewMore} handleCardClick={handleCardClick} />



              {/* Completed Wribates */}
              <CompletedWribates wribates={wribates} activeCategory={activeCategory} handleViewMore={handleViewMore} handleCardClick={handleCardClick} getWribateStatus={getWribateStatus} />


              {/* Free Wribates */}
              <FreeWribates wribates={wribates} activeCategory={activeCategory} handleViewMore={handleViewMore} handleCardClick={handleCardClick} />

              {/* Active Wribates */}
              <ActiveWribates wribates={wribates} activeCategory={activeCategory} handleViewMore={handleViewMore} handleCardClick={handleCardClick} getWribateStatus={getWribateStatus} />

            </>
          )}
        </div>

        {/* Middle section - Ongoing Wribates */}
        <div className="w-full lg:w-[25%] px-4  border-r border-gray-300">
          {/* Ongoing Wribates Section */}
          <OngoingWribates wribates={wribates} activeCategory={activeCategory} handleViewMore={handleViewMore} handleCardClick={handleCardClick} getWribateStatus={getWribateStatus} />
        </div>

        {/* Right Sidebar - Ads */}
        <div className="w-full lg:w-[25%] px-4">
          {/* Ad section */}
          <AdSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}