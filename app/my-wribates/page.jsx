"use client"
import React, { useEffect, useState } from 'react'
import MyWribates from './components/MyWribates'
import { useAtom } from 'jotai';
import { userAtom } from '../states/GlobalStates';
import { useRouter } from 'next/navigation';
import MyTopics from './components/MyTopics'
import ArticlesAssignedByMe from './components/ArticlesAssigned/ArticlesAssignedByMe';

const page = () => {
  // const [selectedPage, setSelectedPage] = useState('My Wribates');
   const [selectedPage, setSelectedPage] = useState('Article Assigned by me');

 
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (!user?._id) {
      router.push('/login')
    }
  }, [])

  if (!user?._id) {
    return null
  }

  return (
    <div className='w-full h-[90vh] overflow-y-auto'>
      {/* Navigation Menu */}
      <nav className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4 p-4">
            <button
              onClick={() => setSelectedPage('My Wribates')}
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${selectedPage === 'My Wribates'
                  ? 'text-gray-900 border-blue-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              My Wribates
            </button>
            <button
              onClick={() => setSelectedPage('My Proposed Topics')}
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${selectedPage === 'My Proposed Topics'
                  ? 'text-gray-900 border-blue-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              My Proposed Topics
            </button>
            <button
              onClick={() => setSelectedPage('Articles Dashboard')}
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${selectedPage === 'Articles Dashboard'
                  ? 'text-gray-900 border-blue-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Articles Dashboard
            </button>

            <button
              onClick={() => setSelectedPage('Article Assigned by me')}
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${selectedPage === 'Article Assigned by me'
                  ? 'text-gray-900 border-blue-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Article Assigned by Me
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        {selectedPage === 'My Wribates' && <MyWribates />}
        {selectedPage === 'My Proposed Topics' && <MyTopics/>}
        {selectedPage === 'Articles Dashboard' && <div>Articles Dashboard Content</div>}

        {selectedPage === 'Article Assigned by me' && <ArticlesAssignedByMe/>}
      </div>
    </div>
  )
}

export default page