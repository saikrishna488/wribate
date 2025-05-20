'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { Menu, X, LogOut, FileText, MessageSquare, Bell, User, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { expandAtom, userAtom } from '../states/GlobalStates';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { MdOutlineMenu } from "react-icons/md";
import { MdLogout } from "react-icons/md";

export default function Navbar() {
  const [expand, setExpand] = useAtom(expandAtom);
  const [user, setUser] = useAtom(userAtom);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], wribates: [], discoverWribates: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = async () => {
    setUser({});
    localStorage.removeItem('token')
    toast.success("Logout successfull")
  };

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
    // Focus the input when the search bar appears
    setTimeout(() => {
      if (isSearchVisible === false && inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const toggleSidebar = () => {
    setExpand(!expand);
  };
  
  // Search functionality
  const handleSearchInput = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setShowDropdown(false);
      setSearchResults({ users: [], wribates: [], discoverWribates: [] });
      return;
    }
    
    setLoading(true);
    setShowDropdown(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?query=${encodeURIComponent(query)}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults({ users: [], wribates: [], discoverWribates: [] });
    } finally {
      setLoading(false);
    }
  };
  
  // Search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
      setIsSearchVisible(false); // Hide mobile search if active
    }
  };

  // Function to handle item click
  const handleItemClick = (url) => {
    router.push(url);
    setShowDropdown(false);
    setIsSearchVisible(false);
  };

  // Don't render navbar on admin, login, or register pages
  if (pathname.includes('/admin') || pathname.includes('/login') || pathname.includes('/register')) {
    return null;
  }

  return (
    <>
      <nav className={`w-full h-16 flex justify-center items-center z-30 border-b sticky top-0 left-0 right-0 transition-all duration-200 ${scrolled ? 'bg-white' : 'bg-white'
        }`}>
        <div className="w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Left Side: Menu + Logo */}
          <div onClick={() => setExpand(!expand)} className="flex items-center space-x-3">
            <div className='lg:hidden block'>
              <MdOutlineMenu size={30} />
            </div>

            <div
              onClick={() => router.push('/')}
              className="cursor-pointer flex items-center space-x-2 text-lg sm:text-xl font-semibold text-gray-800"
            >
              <div className="relative w-10 h-10 sm:w-10 sm:h-10">
                <Image
                  src="/logo/logo.png"
                  alt="Wribate Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden sm:inline bg-blue-900 bg-clip-text text-transparent font-bold">
                Wribate
              </span>
            </div>
          </div>

          {/* Center: Search Component (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center mx-4 max-w-xl">
            <div className="relative w-full" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search users, wribates, proposals..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                {searchQuery.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults({ users: [], wribates: [], discoverWribates: [] });
                      setShowDropdown(false);
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>
              
              {/* Desktop dropdown - Enhanced styling */}
              {showDropdown && (
                <div 
                  className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[80vh] overflow-y-auto animate-fadeIn"

                  style={{ 
                    marginTop: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                    top: "100%"
                  }}
                >
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="inline-block animate-spin h-6 w-6 border-t-2 border-blue-500 border-r-2 rounded-full mr-2"></div>
                      <span className="text-gray-600 font-medium">Searching...</span>
                    </div>
                  ) : (
                    <>
                      {/* Users Section - Enhanced header styling */}
                      {searchResults.users?.length > 0 && (
                        <div className="border-b border-gray-300">
                          <div className="px-4 py-3 bg-gray-50 border-b border-gray-300">
                            <h3 className="text-sm font-extrabold text-gray-800 tracking-wide uppercase">Users</h3>
                          </div>
                          <ul className="py-2">
                            {searchResults.users.map((user) => (
                              <li key={user._id} className="px-1">
                                <button 
                                  onClick={() => handleItemClick(`/profile/${user.userName}`)}
                                  className="flex items-center w-full p-2.5 transition-all duration-150 hover:bg-blue-50 active:bg-blue-100 rounded-md"
                                >
                                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                                    {user.profilePhoto ? (
                                      <img 
                                        src={user.profilePhoto || '/default-avatar.png'}
                                        alt={user.name || 'User'}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-gray-600 text-sm font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                                    )}
                                  </div>
                                  <div className="ml-3 overflow-hidden">
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">@{user.userName}</p>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Wribates Section - Enhanced header styling */}
                      {searchResults.wribates?.length > 0 && (
                        <div className="border-b border-gray-300">
                          <div className="px-4 py-3 bg-gray-50 border-b border-gray-300">
                            <h3 className="text-sm font-extrabold text-gray-800 tracking-wide uppercase">Wribates</h3>
                          </div>
                          <ul className="py-2">
                            {searchResults.wribates.map((wribate) => (
                              <li key={wribate._id} className="px-1">
                                <button
                                  onClick={() => handleItemClick(`/wribate/${wribate._id}`)}
                                  className="w-full text-left p-2.5 transition-all duration-150 hover:bg-blue-50 active:bg-blue-100 rounded-md"
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-md bg-green-100 flex-shrink-0 flex items-center justify-center mr-3">
                                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-800 line-clamp-1">{wribate.title}</h4>
                                      <div className="flex items-center mt-1.5">
                                        <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                                          User 1
                                        </span>
                                        <span className="mx-1.5 px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-medium">VS</span>
                                        <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                                          User 2
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Discover Wribates Section - Enhanced header styling */}
                      {searchResults.discoverWribates?.length > 0 && (
                        <div>
                          <div className="px-4 py-3 bg-gray-50 border-b border-gray-300">
                            <h3 className="text-sm font-extrabold text-gray-800 tracking-wide uppercase">Discover Wribates</h3>
                          </div>
                          <ul className="py-2">
                            {searchResults.discoverWribates.map((proposal) => (
                              <li key={proposal._id} className="px-1">
                                <button
                                  onClick={() => handleItemClick("/propose-wribate")}
                                  className="w-full text-left p-2.5 transition-all duration-150 hover:bg-blue-50 active:bg-blue-100 rounded-md"
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-md bg-purple-100 flex-shrink-0 flex items-center justify-center mr-3">
                                      <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-800 line-clamp-1">{proposal.title}</h4>
                                      <p className="text-xs text-gray-500 truncate mt-0.5">
                                        {proposal.context?.substring(0, 60)}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* No Results Message */}
                      {searchQuery.trim() && 
                       !searchResults.users?.length && 
                       !searchResults.wribates?.length && 
                       !searchResults.discoverWribates?.length && (
                        <div className="p-8 text-center">
                          <div className="inline-block p-3 mb-3 rounded-full bg-gray-100">
                            <Search className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">No results found for "{searchQuery}"</p>
                          <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
                        </div>
                      )}
                      
                      {/* See All Link */}
                      {searchQuery.trim() && (searchResults.users?.length > 0 || searchResults.wribates?.length > 0 || searchResults.discoverWribates?.length > 0) && (
                        <div className="p-3 border-t border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <button
                            onClick={() => handleItemClick(`/search?q=${encodeURIComponent(searchQuery)}`)}
                            className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium py-1.5"
                          >
                            <span>See all results for "{searchQuery}"</span>
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearchBar}
              className="md:hidden hover:bg-gray-100 text-gray-700"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 text-gray-700 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {
              user?._id && (
                <Button
                  variant='ghost'
                  onClick={logout}
                  className="hover:bg-gray-100 w-8 h-8 text-gray-700 hidden sm:flex"
                >
                  <MdLogout size={30} className="w-8 h-8" />
                </Button>
              )
            }

            {/* User Menu */}
            {!user?._id ? (
              <Button
                onClick={() => router.push('/login')}
                variant="primary"
                className="bg-blue-900 text-white rounded-full text-sm px-4 py-2 transition-colors"
              >
                Get Started
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full sm:hidden hover:bg-gray-100 overflow-hidden border-2 border-gray-200"
                  >
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-700" />
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-xl p-2">
                  <div className="px-4 py-3 flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      {user?.avatar ? (
                        <Image
                          src={user.avatar}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-700" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => router.push('/profile')}
                    className="cursor-pointer text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    My Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push('/messages')}
                    className="cursor-pointer text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                    Messages
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push('/my-wribates')}
                    className="cursor-pointer text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50"
                  >
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                    My Wribates
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push('/settings')}
                    className="cursor-pointer text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 mr-2 text-blue-600" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-600 font-medium py-2 rounded-md hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar (When Active) */}
      {isSearchVisible && (
        <div className="fixed top-16 left-0 right-0 bg-white p-3 shadow-md md:hidden z-50 border-b border-gray-200">
          <div className="w-full relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search users, wribates, proposals..."
                value={searchQuery}
                onChange={handleSearchInput}
                autoFocus
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </form>
            
            {/* Mobile dropdown with enhanced styling */}
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[60vh] overflow-y-auto z-[9999]">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="inline-block animate-spin h-5 w-5 border-t-2 border-blue-500 border-r-2 rounded-full mr-2"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <>
                    {/* Users Section - Enhanced styling */}
                    {searchResults.users?.length > 0 && (
                      <div className="border-b border-gray-300">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-300">
                          <h3 className="text-sm font-extrabold text-gray-800 tracking-wide uppercase">Users</h3>
                        </div>
                        <ul className="py-2">
                          {searchResults.users.map((user) => (
                            <li key={user._id} className="px-1">
                              <button 
                                onClick={() => handleItemClick(`/profile/${user.userName}`)}
                                className="flex items-center w-full p-2.5 transition-all duration-150 hover:bg-blue-50 active:bg-blue-100 rounded-md"
                              >
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                                  {user.profilePhoto ? (
                                    <img 
                                      src={user.profilePhoto || '/default-avatar.png'}
                                      alt={user.name || 'User'}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-gray-600 text-sm font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                                  )}
                                </div>
                                <div className="ml-3 overflow-hidden">
                                  <p className="font-medium text-gray-800">{user.name}</p>
                                  <p className="text-xs text-gray-500 truncate">@{user.userName}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Wribates Section - Enhanced styling */}
                    {searchResults.wribates?.length > 0 && (
                      <div className="border-b border-gray-300">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-300">
                          <h3 className="text-sm font-extrabold text-gray-800 tracking-wide uppercase">Wribates</h3>
                        </div>
                        <ul className="py-2">
                          {searchResults.wribates.map((wribate) => (
                            <li key={wribate._id} className="px-1">
                              <button
                                onClick={() => handleItemClick(`/wribate/${wribate._id}`)}
                                className="w-full text-left p-2.5 transition-all duration-150 hover:bg-blue-50 active:bg-blue-100 rounded-md"
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-md bg-green-100 flex-shrink-0 flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-800 line-clamp-1">{wribate.title}</h4>
                                    <div className="flex items-center mt-1.5">
                                      <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                                        User 1
                                      </span>
                                      <span className="mx-1.5 px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-medium">VS</span>
                                      <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                                        User 2
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Discover Wribates Section - Enhanced styling */}
                    {searchResults.discoverWribates?.length > 0 && (
                      <div>
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-300">
                          <h3 className="text-sm font-extrabold text-gray-800 tracking-wide uppercase">Discover Wribates</h3>
                        </div>
                        <ul className="py-2">
                          {searchResults.discoverWribates.map((proposal) => (
                            <li key={proposal._id} className="px-1">
                              <button
                                onClick={() => handleItemClick("/propose-wribate")}
                                className="w-full text-left p-2.5 transition-all duration-150 hover:bg-blue-50 active:bg-blue-100 rounded-md"
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-md bg-purple-100 flex-shrink-0 flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-800 line-clamp-1">{proposal.title}</h4>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                      {proposal.context?.substring(0, 60)}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* No Results Message */}
                    {searchQuery.trim() && 
                     !searchResults.users?.length && 
                     !searchResults.wribates?.length && 
                     !searchResults.discoverWribates?.length && (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">No results found for "{searchQuery}"</p>
                      </div>
                    )}
                    
                    {/* See All Link */}
                    {searchQuery.trim() && (searchResults.users?.length > 0 || searchResults.wribates?.length > 0 || searchResults.discoverWribates?.length > 0) && (
                      <div className="p-3 border-t border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <button
                          onClick={() => handleItemClick(`/search?q=${encodeURIComponent(searchQuery)}`)}
                          className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium py-1"
                        >
                          <span>See all results</span>
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={toggleSearchBar}
            className="absolute right-5 top-5"
            aria-label="Close search"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      )}
    </>
  );
}
