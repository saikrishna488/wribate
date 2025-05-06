'use client';

import { useAtom } from 'jotai';
import {
    Edit,
    FileText,
    Plus,
    Home,
    MessageSquare,
    HelpCircle,
    Trophy,
    Info,
    Handshake,
    User,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import { expandAtom, userAtom } from '../states/GlobalStates';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
    const [expand, setExpand] = useAtom(expandAtom);
    const pathname = usePathname();
    const ref = useRef(null);
    const [user, setUser] = useAtom(userAtom);

    const logout = async () => {

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

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setExpand(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    if (
        pathname.includes('/admin') ||
        pathname.includes('/login') ||
        pathname.includes('/register')
    ) {
        return null;
    }



    return (
        <div className="sticky h-[90vh] top-0 sm:w-20 z-40">
            <div
                ref={ref}
                onMouseEnter={() => {
                    if (window.innerWidth >= 640) setExpand(true);
                }}
                onMouseLeave={() => {
                    if (window.innerWidth >= 640) setExpand(false);
                }}
                className={`z-10 fixed h-full ${expand ? 'w-64' : 'w-20 hidden sm:flex'
                    } bg-gray-50 text-black border-r border-gray-200 flex flex-col justify-between items-center  py-4 px-2 transition-all duration-300 ease-in-out`}
            >
                {/* Sidebar Menu */}
                <div className="flex flex-col gap-1">
                    {[
                        {
                            icon: <Home className="w-6 h-6" />,
                            label: 'Home',
                            href: '/',
                        },
                        {
                            icon: <Plus className="w-6 h-6" />,
                            label: 'Wribate',
                            href: '/create-wribate',
                        },
                        {
                            icon: <Edit className="w-6 h-6" />,
                            label: 'Launch Wribate',
                            href: '/propose-wribate',
                        },
                        {
                            icon: <MessageSquare className="w-6 h-6" />,
                            label: 'Messages',
                            href: '/messages',
                        },
                        {
                            icon: <Trophy className="w-6 h-6" />,
                            label: 'Tips to Win',
                            href: '/tips-to-win',
                        },
                        {
                            icon: <FileText className="w-6 h-6" />,
                            label: 'Blogs',
                            href: '/blogs',
                        },
                        {
                            icon: <Handshake className="w-6 h-6" />,
                            label: 'Terms and Conditions',
                            href: '/terms',
                        },
                        {
                            icon: <Info className="w-6 h-6" />,
                            label: 'Why Wribate',
                            href: '/why-wribate',
                        },
                    ].map(({ icon, label, href }) => (
                        <Link key={label} onClick={() => setExpand(false)} href={href}>
                            <div
                                className={`flex relative items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 transition duration-200 ${expand ? 'justify-start' : 'justify-center'
                                    }`}
                            >
                                {icon}
                                {expand && (
                                    <span
                                        className={`text-md font-medium overflow-hidden transition-all duration-300 ${expand
                                            ? 'max-w-[200px] opacity-100'
                                            : 'max-w-0 opacity-0'
                                            }`}
                                    >
                                        {label}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='sticky'>
                <DropdownMenu >
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
                </div>
            </div>
        </div>

    );
}
