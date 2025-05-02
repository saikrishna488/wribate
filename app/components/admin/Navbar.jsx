"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userAtom } from '@/app/states/globalstates';
import { useAtom } from 'jotai';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import axios from 'axios';

const Navbar = () => {

    const [user,setUser] = useAtom(userAtom);
    const path = usePathname()
    const router = useRouter()


    const logout = async ()=>{
        try{
            const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/slogout');
            const data = res.data

            if(data.res){
                setUser({})
                toast.success("Logged out");
                router.push('/admin/login');
            }
        }
        catch(err){
            toast.error("Logout failed")
        }
    }

    if (path.includes("/login")) {
        return null
    }

    return (
        <header className="sticky top-0 z-10 w-full px-4 py-4 sm:px-6 flex items-center justify-between bg-white shadow-sm">
            <div onClick={() => router.push('/admin')} className="cursor-pointer flex items-center space-x-3">
                <Image alt="logo" width={40} height={40} src={'/logo.png'} />
                <h1 className="text-xl font-bold text-gray-800">Wribate for Staff</h1>
            </div>

            <div>
                {
                    user?._id ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="rounded-full border w-8 h-8 p-2 border-gray-200"
                                >
                                    <User scale={2} className="text-gray-700" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-48 mt-2 bg-white">
                                <DropdownMenuItem className="cursor-pointer flex gap-1 items-center flex-col">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-700">
                                        <User className="w-14 h-14 text-gray-700" />
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <span className='font-bold'>{user?.name}</span>
                                        <small>{user?.email}</small>
                                    </div>
                                    <Button variant={'outline'} className='py-1 w-full'>Profile</Button>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )

                        : (
                            <Button onClick={() => router.push('/admin/login')} variant="outline">
                                Staff Login
                            </Button>
                        )
                }
            </div>


        </header>
    )
}

export default Navbar
