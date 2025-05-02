'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plus, FileText, MessageSquare, BarChart2, Settings, Menu, Tag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { userAtom } from '../states/globalstates';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';

const features = [
  {
    title: 'Blogs',
    description: 'Create and manage blog posts.',
    icon: <FileText className="h-6 w-6" />,
    action: 'Manage Blogs',
    path: "/admin/blogs"
  },
  {
    title: 'Users',
    description: 'Manage user accounts and permissions.',
    icon: <User className="h-6 w-6" />,
    action: 'Manage Users',
    path: "/admin/users"
  },
  {
    title: 'Wribates',
    description: 'Oversee wribate topics and trends.',
    icon: <MessageSquare className="h-6 w-6" />,
    action: 'Manage Wribates',
    path: "/admin/wribates"
  },
  {
    title: 'Reports',
    description: 'View and handle reports from users.',
    icon: <BarChart2 className="h-6 w-6" />,
    action: 'View Reports',
    path: "/admin/reports"
  },
  {
    title: 'Categories',
    description: 'Organize categories for content.',
    icon: <Tag className="h-6 w-6" />,
    action: 'Edit Categories',
    path: "/admin/categories"
  },
  {
    title: 'Settings',
    description: 'Adjust platform configuration.',
    icon: <Settings className="h-6 w-6" />,
    action: 'Open Settings',
    path: "/admin/settings"
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  
  // Check if user is not logged in
  if (!user || !user._id) {
    return (
      <div className="flex flex-col items-center justify-center h-[90%] bg-gray-50 p-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Staff Access Only</h1>
          <p className="text-lg mb-6">
            This dashboard is restricted to Wribate staff members only. 
            If you're interested in joining our team and contributing to our platform, 
            please visit our careers page.
          </p>
          <div className="space-y-4">
            <p className="text-gray-700">
              Wribate is a collaborative platform that brings together writers, readers, and debaters 
              in a unique online community. We're always looking for talented individuals to help us 
              grow and improve our services.
            </p>
            <Button 
              onClick={() => toast.success("Positions are open soon..")}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              View Career Opportunities
            </Button>
            <Button 
              onClick={() => router.push('/')}
              variant="outline" 
              className="ml-4"
            >
              Back to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // If user is logged in, show the dashboard
  return (
    <div className="p-6">
      {/* Main Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name || 'Admin'}. Manage your platform here.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden rounded-none">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="mb-4 text-gray-800">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <Button 
                onClick={() => router.push(feature.path)}
                variant="default"
                className="mt-auto w-full bg-gray-900 hover:bg-gray-800 text-white"
              >
                {feature.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}