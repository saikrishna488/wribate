'use client';

import { useParams, useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaWhatsapp, FaFacebookF, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6"; // Add relevant icons
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SingleBlogPage() {
  const { id } = useParams();
  const [blog,setBlog] = useState({});
  const [copied, setCopied] = useState(false);
  const router = useRouter(); // Use router hook

  useEffect(()=>{
    const fetchBlog = async () => {
      try {

        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/blog/'+id)
        const data = res.data;

        if (data.res) {
          setBlog(data.blog)
        }
      }
      catch (err) {
        console.log(err);
        toast.error("client error")
      }
    }

    fetchBlog();
  },[])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!blog) return <p className="text-center text-red-600 mt-20">Loading.</p>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 bg-white min-h-screen text-gray-900">
      <article>
        {/* Back Button positioned at the top */}
        <Button
          onClick={() => router.back()}
          className="bg-blue-900 text-white hover:bg-blue-800 mb-4 flex items-center gap-2"
        >
          <FaArrowLeft /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
        <p className="text-sm text-gray-600 mb-4">
          By <span className="font-medium">{blog.author_name}</span> · {new Date(blog.created_at).toLocaleDateString()}
        </p>

        <div className="w-full h-60 md:h-96 overflow-hidden mb-6">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="prose whitespace-pre-wrap prose-gray max-w-none text-[1rem] leading-7">
          {blog.content}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" /> {blog.views}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 text-white hover:bg-blue-800 flex items-center gap-2">
                <FaShareAlt /> Share
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 space-y-4">
              <DialogTitle>Share this blog</DialogTitle>
              <div className="flex items-center gap-4">
                <Button onClick={handleCopy} variant={"outline"} className="text-blue-900 text-sm">
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </Button>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">
                  <FaWhatsapp className="text-green-600 text-xl" />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">
                  <FaFacebookF className="text-blue-700 text-xl" />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">
                  <FaXTwitter className="text-black text-xl" />
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </article>
    </main>
  );
}
