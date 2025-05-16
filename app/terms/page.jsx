"use client";
import React, { useState, useEffect } from "react";
import Introduction from '../components/Privacy/Introduction';
import Two from '../components/Privacy/Two';
import Three from '../components/Privacy/Three';
import Four from '../components/Privacy/Four';
import Five from '../components/Privacy/Five';
import Six from '../components/Privacy/Six';
import Seven from '../components/Privacy/Seven';
import Eight from '../components/Privacy/Eight';
import Nine from '../components/Privacy/Nine';
import Terms from '../components/Terms/Terms';
import { useRouter } from "next/navigation";

const LegalPages = () => {
  const [selectedSection, setSelectedSection] = useState("privacy");
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main content */}
      <main className={`flex-1 w-full p-4 md:p-6 lg:p-8 overflow-y-auto ${isMobile && sidebarOpen ? "opacity-50" : ""}`}>
        <Terms/>
      </main>
    </div>
  );
};

export default LegalPages;