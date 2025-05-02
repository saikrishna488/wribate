// app/blog/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { BookX, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
export default function BlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([])

  const handleCardClick = (id) => {
    router.push(`/blogs/${id}`);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {

        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/blogs')
        const data = res.data;

        if (data.res) {
          setBlogs(data.blogs)
        }
      }
      catch (err) {
        console.log(err);
        toast.error("client error")
      }
    }

    fetchBlogs()
  }, [])

  return (
    <main className="w-full mx-auto px-4 py-10 bg-white min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Wribate Blog</h1>
        <p className="text-gray-600 mt-2">Insights, updates, and thought leadership from our community.</p>
      </header>

      <section className="grid sm:grid-cols-3 grid-cols-1 gap-8">
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            className="overflow-hidden rounded-none p-0 border-gray-200 cursor-pointer hover:shadow-md"
            onClick={() => handleCardClick(blog._id)}
          >
            <div className="flex flex-col h-full">
              <div className="flex-grow w-full">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-60 object-cover"
                />
              </div>
              <CardContent className="p-4 flex-grow h-full flex flex-col">
                <div className='flex-1'>
                  <h2 className="text-xl  font-semibold hover:text-blue-800 text-gray-900">{blog.title}</h2>

                </div>
                <p className="text-gray-700 flex-2 mt-4 text-sm line-clamp-4">{blog.content.slice(0, 200) + '....'}</p>
                <div className="mt-auto pt-2 justify-between text-sm  text-gray-500 flex items-center gap-1">
                  <span className='flex flex-row items-center p-2'><Eye className="w-4 h-4" /> {blog.views}</span>
                  <p className="text-sm text-gray-500 mt-1">
                    By <span className="font-medium">{blog.author_name}</span> · {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}

        {
          blogs?.length == 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-gray-50 border-dashed">
              <BookX size={48} className="text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No blogs published yet</h3>
              <p className="text-sm text-gray-500">When you publish your first blog post, it will appear here.</p>
            </div>
          )
        }
      </section>
    </main>
  );
}
