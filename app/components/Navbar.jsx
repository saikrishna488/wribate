'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { Menu, Search, X, LogOut, FileText, MessageSquare, Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { expandAtom, userAtom } from '../states/GlobalStates';
import Image from 'next/image';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { MdOutlineMenu } from "react-icons/md";

export default function Navbar() {
  const [expand, setExpand] = useAtom(expandAtom);
  const [user, setUser] = useAtom(userAtom);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll effect for navbar
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

  const logout = async () => {
    try {
      const url = user?.firebase_token?.length > 0 ? "/logout" : '/user/logout';
      const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
        withCredentials: true
      });
      const data = res.data;

      if (data.res) {
        setUser({});
        toast.success("Logged out successfully");
        router.replace('/login');
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Something went wrong during logout");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchVisible(false);
    }
  };

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const toggleSidebar = () => {
    setExpand(!expand);
  };

  // Don't render navbar on admin, login, or register pages
  if (pathname.includes('/admin') || pathname.includes('/login') || pathname.includes('/register')) {
    return null;
  }

  return (
    <>
      <nav className={`w-full h-16 flex justify-center items-center z-20 border-b sticky top-0 left-0 right-0 transition-all duration-200 ${scrolled ? 'bg-white' : 'bg-white'
        }`}>
        <div className="w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Left Side: Menu + Logo */}
          <div onClick={()=>setExpand(!expand)} className="flex items-center space-x-3">
            <div className='lg:hidden block'>
              <MdOutlineMenu size={30}/>
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

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center mx-4 max-w-xl">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wribates..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </form>
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

            {/* Messages Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/messages')}
              className="hover:bg-gray-100 text-gray-700 hidden sm:flex"
              aria-label="Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>

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
                    className="rounded-full hover:bg-gray-100 overflow-hidden border-2 border-gray-200"
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
        <div className="fixed top-16 left-0 right-0 bg-white p-3 shadow-md md:hidden z-30 border-b border-gray-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wribates..."
              className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={toggleSearchBar}
              className="absolute right-3 top-2.5"
              aria-label="Close search"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}