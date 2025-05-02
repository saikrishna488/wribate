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
    Handshake
} from 'lucide-react';
import Link from 'next/link';
import { expandAtom } from '../states/globalStates';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Sidebar() {
    const [expand, setExpand] = useAtom(expandAtom);
    const pathname = usePathname();
    const ref = useRef(null);

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
        <div className="sticky h-full top-0 sm:w-20 z-40">
            <div
                ref={ref}
                onMouseEnter={() => {
                    if (window.innerWidth >= 640) setExpand(true);
                }}
                onMouseLeave={() => {
                    if (window.innerWidth >= 640) setExpand(false);
                }}
                className={`z-10 fixed h-full ${expand ? 'w-64' : 'w-20 hidden sm:flex'
                    } bg-gray-50 text-black border-r border-gray-200 flex flex-col py-4 px-2 transition-all duration-300 ease-in-out`}
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
                            label: 'Propose Wribate',
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
                                        className={`text-sm font-medium overflow-hidden transition-all duration-300 ${expand
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
            </div>
        </div>

    );
}
