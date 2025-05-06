"use client"
import React, { useState, useEffect } from "react";
import Introduction from '../components/Privacy/Introduction'
import Two from '../components/Privacy/Two'
import Three from '../components/Privacy/Three'
import Four from '../components/Privacy/Four'
import Five from '../components/Privacy/Five'
import Six from '../components/Privacy/Six'
import Seven from '../components/Privacy/Seven'
import Eight from '../components/Privacy/Eight'
import Nine from '../components/Privacy/Nine'
import Terms from '../components/Terms/Terms'
import { useRouter } from "next/navigation";

const LegalPages = () => {
  const [selectedSection, setSelectedSection] = useState("privacy-policy");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


  return (
    <div className="flex flex-row h-[90vh] overflow-y-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`sticky hidden sm:block z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-0`}
      >
        <nav className="px-4 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 h-full">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Legal Documents
          </h2>

          <div className="">
            <button
              onClick={() => router.push("#privacy")}
              className={`w-full text-left px-3 py-2 rounded-md mb-1 ${selectedSection === "privacy-policy"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                } font-medium`}
            >
              Privacy Policy
            </button>

          </div>

          <div>
            <button
              onClick={() => router.push("#terms")}
              className={`w-full text-left px-3 py-2 rounded-md mb-1 ${selectedSection === "terms-conditions"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                } font-medium`}
            >
              Terms & Conditions
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className={` overflow-y-auto  w-full p-4 md:p-8 lg:p-10 ${isMobile && sidebarOpen ? "opacity-50" : ""}`}>
         <Introduction/>
         <Two/>
         <Three/>
         <Four/>
         <Five/>
         <Six/>
         <Seven/>
         {/* <Eight/> */}
         <Nine/>
         <Terms/>
      </main>

    </div>
  );
};

export default LegalPages;