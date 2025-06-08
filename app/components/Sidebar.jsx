'use client';

import { useAtom } from 'jotai';
import {
    Edit,
    FileText,
    Home,
    MessageSquare,
    HelpCircle,
    Trophy,
    Info,
    Handshake,
    User,
    LogOut,
    Plus,
    CreditCard,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { expandAtom, userAtom } from '../states/GlobalStates';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FaRegUser } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import { TbViewfinder } from "react-icons/tb";
import { MdOutlineMenu } from "react-icons/md";

export default function Sidebar() {
    const [expand, setExpand] = useAtom(expandAtom);
    const pathname = usePathname();
    const ref = useRef(null);
    const [user, setUser] = useAtom(userAtom);
    const router = useRouter();
    const [popup, setPopup] = useState(false)


    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && window.innerWidth >= 640) {
                setExpand(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (
        pathname.includes('/admin') ||
        pathname.includes('/login') ||
        pathname.includes('/register')
    ) {
        return null;
    }

    const menuItems = [
        {
            icon: <Home className="w-5 h-5" />,
            label: 'Home',
            href: '/',
        },
        {
            icon: <TbViewfinder className="w-5 h-5" />,
            label: 'Explore Topics',
            href: '/propose-wribate',
        },
        {
            icon: <MessageSquare className="w-5 h-5" />,
            label: 'Messages',
            href: '/messages',
        },
        {
            icon: <CreditCard className="w-5 h-5" />,
            label: 'Subscription',
            href: '/subscription',
        },
        {
            icon: <Trophy className="w-5 h-5" />,
            label: 'Tips to Win',
            href: '/tips-to-win',
        },
        {
            icon: <FileText className="w-5 h-5" />,
            label: 'Blogs',
            href: '/blogs',
        },
        {
            icon: <Info className="w-5 h-5" />,
            label: 'Why Wribate',
            href: '/why-wribate',
        },
        // {
        //     icon: <Handshake className="w-5 h-5" />,
        //     label: 'Terms and Conditions',
        //     href: '/terms',
        // }
    ];

    return (
        <div className="sticky h-[90vh] top-0 sm:w-20 z-40">
            <div
                ref={ref}
                className={`z-10 fixed h-full ${expand ? 'w-64' : 'w-20 hidden sm:flex'
                    } bg-white text-black border-r border-gray-200 flex flex-col justify-between py-4 transition-all duration-300 ease-in-out `}
            >

                <div className={`w-full flex flex-row items-center mb-10 px-4 ${expand ? 'justify-start' : 'justify-center'}`}
                    onClick={() => setExpand(!expand)}
                >
                    <MdOutlineMenu size={30} /> {expand && <span className='font-semibold px-2 text-blue-900 text-2xl'>Wribate</span>}

                </div>

                {/* Create Button with Dropdown */}
                <div className="px-4 mb-6 w-full text-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={() => setPopup(true)}
                                className={`rounded-full  flex border border-gray-300 shadow-md p-2 ${expand ? 'px-4 ': null}  items-center mx-auto gap-1`}
                            >
                                <Plus size={32} className='text-blue-700' strokeWidth={3} />
                                <span className={`${expand ? 'block text-xl' : 'hidden'}`}>Create</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent onCloseAutoFocus={() => setExpand(false)} align="start" className="w-56">
                            <DropdownMenuItem
                                onClick={() => router.push('/create-wribate')}
                                className="cursor-pointer py-2"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Create Wribate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => router.push('/propose-wribate/propose')}
                                className="cursor-pointer py-2"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Propose Wribate
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Sidebar Menu */}
                <div className="flex-1 overflow-y-auto px-2"
                    onMouseEnter={() => {
                        if (window.innerWidth >= 640) setExpand(true);
                    }}
                    onMouseLeave={() => {
                        if (window.innerWidth >= 640) {
                            setExpand(false);
                            // setCreateDropdownOpen(false);
                        }
                    }}
                >
                    <div className="flex flex-col">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.label} href={item.href} onClick={() => setExpand(false)}>
                                    <div
                                        className={`flex items-center px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                                            } ${expand ? 'justify-start' : 'justify-center'
                                            }`}
                                    >
                                        <div className={isActive ? 'text-indigo-600' : 'text-gray-500'}>
                                            {item.icon}
                                        </div>
                                        {expand && (
                                            <span className="ml-3 font-medium">
                                                {item.label}
                                            </span>
                                        )}
                                        {!expand && isActive && (
                                            <div className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-md"></div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* User Profile - Made sticky with original commented code preserved */}
                {
                    user?._id && (
                        <div
                            onClick={() => router.push('/profile')}
                            className={`w-full sticky bottom-0 py-4 border-t border-gray-200 flex items-center ${expand ? 'justify-center' : 'justify-center'}`}
                        >
                            <Button
                                variant='outline'
                                size='icon'
                                className="rounded-full border border-gray-300 hover:border-gray-400 overflow-hidden"
                            >
                                {user?.profilePhoto ? (
                                    <img
                                        src={user.profilePhoto}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <FaRegUser size={30} className="w-12 h-12 text-gray-700" />
                                )}
                            </Button>

                            <span className={`${expand ? 'block' : 'hidden'} cursor-pointer text-blue-900 px-2`}>
                                {user?.name}
                            </span>
                        </div>

                    )
                }
            </div>
        </div>
    );
}