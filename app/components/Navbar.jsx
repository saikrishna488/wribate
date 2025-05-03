'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { Menu, Edit, PlusCircle, User, Search, X,LogOut,FileText,MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { expandAtom, userAtom } from '../states/GlobalStates';
import Image from 'next/image';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';

export default function Navbar() {
  const [expand, setExpand] = useAtom(expandAtom);
  const [user, setUser] = useAtom(userAtom);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {

    console.log(user)
    
    try {
      const url = user?.firebase_token?.length > 0 ? "/logout" : '/user/logout'
      const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
        withCredentials: true
      });
      const data = res.data;

      if (data.res) {
        setUser({})
        toast.success("Logged out");
        router.replace('/login');
      }
    } catch (err) {
      console.log(err);
      toast.error("Client error");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  if (pathname.includes('/admin') || pathname.includes('/login') || pathname.includes('/register')) {
    return null;
  }

  return (
    <nav className="w-full h-16 flex justify-center items-center z-30 border-b bg-gray-50 border-gray-200 sticky top-0 left-0 right-0 py-2">
      <div className="w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side: Menu + Logo */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setExpand(!expand)}
            className="border-gray-300 hover:border-gray-400"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </Button>

          <div
            onClick={() => router.push('/')}
            className="cursor-pointer flex items-center space-x-2 text-lg sm:text-xl font-semibold text-gray-800"
          >
            <Image
              src="/logo/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="hidden sm:inline">Wribate</span>
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center mx-4">
          <form onSubmit={handleSearch} className="w-full max-w-md relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wribates..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Mobile Search Bar (When Active) */}
        {isSearchVisible && (
          <div className="absolute top-16 left-0 right-0 bg-gray-50 p-3 shadow-md md:hidden z-40 border-b border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wribates..."
                className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={toggleSearchBar}
                className="absolute right-3 top-2.5"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </form>
          </div>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Search Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSearchBar}
            className="md:hidden border-gray-300 hover:border-gray-400 rounded-full"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </Button>

          {user?._id && (
            <Button
              onClick={() => router.push('/create-wribate')}
              className="bg-indigo-900 text-white hover:bg-indigo-700 rounded-full shadow p-0 w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline ml-1">Wribate</span>
            </Button>
          )}

          {!user?._id ? (
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              className="text-sm rounded-full border-gray-300 hover:bg-gray-100"
            >
              Get Started
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-300 hover:border-gray-400"
                >
                  <User className="w-5 h-5 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                <DropdownMenuItem className="cursor-pointer flex gap-2 items-center flex-col p-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 bg-gray-50">
                    <User className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className='flex flex-col items-center mt-2'>
                    <span className='font-bold text-gray-800'>{user?.name}</span>
                    <small className='text-gray-500 text-xs mt-1'>{user?.email}</small>
                  </div>
                  <Button
                    onClick={() => router.push('/profile')}
                    variant='outline'
                    className='py-1 w-full mt-3 rounded-md'
                  >
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push('/messages')}
                  className="cursor-pointer text-gray-700 font-medium py-2 flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
                  Messages
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push('/my-wribates')}
                  className="cursor-pointer text-gray-700 font-medium py-2 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                  My Wribates
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600 font-medium py-2 flex items-center"
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
  );
}