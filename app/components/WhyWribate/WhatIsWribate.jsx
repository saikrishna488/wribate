"use client"
import { useRouter } from 'next/navigation';
import React from 'react';


export default function WhatIsWribateSection() {

  const router = useRouter();
  return (
    <section id="what-is-wribate" className="w-full py-16 md:min-h-screen bg-gray-50 border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold mb-8 text-center text-black">What is Wribate?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image (Left Side) - Order changed for mobile */}
          <div className="flex items-center justify-center order-2 md:order-1">
            <div className="w-full h-64 sm:h-80 rounded-lg shadow-md overflow-hidden">
              <img
                src="/whywribate/whatiswribate.png"
                alt="Wribate platform concept"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
          
          {/* Content (Right Side) */}
          <div className="flex flex-col justify-center items-center order-1 md:order-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4 leading-relaxed">
                Wribate is a thoughtful conversation platform designed for meaningful dialogue in an age of noise and division. It's where authentic voices are heard and diverse perspectives are valued.
              </p>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                Unlike traditional social media, Wribate creates a space where truth is prioritized over rhetoric, and where disagreements become opportunities for deeper understanding rather than conflict.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Our community values intellectual honesty, empathy, and the exchange of ideas that challenge and expand our understanding of complex topics. Join us in building conversations that matter.
              </p>
            </div>
            
            <div className="mt-6 flex justify-center md:justify-start">
              <button onClick={()=>router.push('#wribate-vs-debate')} className="px-6 py-2 bg-blue-800 rounded-full text-white text-2xl font-medium hover:bg-blue-500 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}