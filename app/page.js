"use client"
import React, { useState } from 'react'
import Home from './components/Home/Home'
import Articles from './articles/components/Articles'
import { useAtom } from 'jotai'
import { pageAtom } from './states/GlobalStates'

const page = () => {
  const [selectedPage, setSelectedPage] = useAtom(pageAtom);

  return (
    <div className='bg-gray-50'>
      <header className='bg-white block sm:hidden shadow-sm border-b border-gray-200'>
        <nav className='max-w-6xl mx-auto px-4 py-3'>
          <div className='grid grid-cols-2 gap-4 max-w-md mx-auto'>
            <button 
              onClick={() => setSelectedPage("wribate")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPage === "wribate" 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-blue-900/10 text-blue-900 hover:bg-blue-900/20'
              }`}
            >
              Wribates
            </button>
            <button 
              onClick={() => setSelectedPage("article")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPage === "article" 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-blue-900/10 text-blue-900 hover:bg-blue-900/20'
              }`}
            >
              Articles
            </button>
          </div>
        </nav>
      </header>

      <main className=''>
        {selectedPage === "wribate" && <Home/>}
        {selectedPage === "article" && <Articles/>}
      </main>
    </div>
  )
}

export default page