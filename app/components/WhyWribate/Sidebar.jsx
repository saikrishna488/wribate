"use client"

import Link from "next/link"
import {
  Lightbulb,
  Sparkles,
  User,
  HelpCircle,
  GraduationCap,
  Users,
  Scale
} from "lucide-react"
import { ExternalLink } from 'lucide-react';

const menuItems = [
  { label: "Welcome", href: "#welcome", icon: ExternalLink },
  { label: "What is Wribate", href: "#what-is-wribate", icon: Lightbulb },
  { label: "Inspiration", href: "#inspiration", icon: Sparkles },
  { label: "Wribate for You", href: "#wribate-for-you", icon: User },
  { label: "Why Wribate", href: "#why-wribate", icon: HelpCircle },
  { label: "Wribate for Students", href: "#wribate-for-students", icon: GraduationCap },
  { label: "Who is a Wribater", href: "#who-is-wribater", icon: Users },
  { label: "Wribate vs Debate", href: "#wribate-vs-debate", icon: Scale },
]

export default function Sidebar() {
  return (
    <aside className="min-w-64 bg-white border-r h-full hidden sm:block sticky top-0 p-4">
      <nav className="flex flex-col gap-3">
        {menuItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
