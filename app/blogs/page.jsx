// app/blog/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { BookX, Eye, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import he from 'he';

// Utility function to format relative time
const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

export default function BlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCardClick = (id) => {
    router.push(`/blogs/${id}`);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/blogs');
        const data = res.data;

        if (data.res) {
          setBlogs(data.blogs);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <main className="w-full mx-auto px-6 py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-12"></div>
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200">
                  <div className="h-60 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full mx-auto px-6 py-12 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-gray-200 pb-8">
          <div className="border-l-4 border-blue-900 pl-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Wribate Blog</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Insights, updates, and thought leadership from our community of writers and thinkers.
            </p>
          </div>
        </header>

        <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          {blogs.map((blog) => (
            <Card
              key={blog._id}
              className="overflow-hidden border py-0 border-gray-200 bg-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              onClick={() => handleCardClick(blog._id)}
            >
              <div className="flex flex-col h-full">
                <div className="relative overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-64 object-fill transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-900 transition-colors duration-200">
                      {blog.title}
                    </h2>
                    
                    <div 
                      className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4"
                      dangerouslySetInnerHTML={{ 
                        __html: he.decode(blog.content.slice(0, 200) + '...') 
                      }}
                    />
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                          <Eye className="w-3 h-3" />
                          {blog.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(blog.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                        {blog.author_name?.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm text-gray-700">
                        By <span className="font-semibold text-blue-900">{blog.author_name}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}

          {blogs?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-gray-300 bg-white">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <BookX size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No blogs published yet</h3>
              <p className="text-gray-500 max-w-md leading-relaxed">
                Be the first to share your thoughts and insights with our community. 
                Your stories and expertise are what make this platform special.
              </p>
            </div>
          )}
        </section>

        {blogs?.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 border border-gray-200">
              <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
              Showing {blogs.length} blog{blogs.length === 1 ? '' : 's'}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}