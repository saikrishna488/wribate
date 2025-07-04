"use client";

import { useParams, useRouter } from "next/navigation";
import { Eye, Clock, ArrowLeft, Share2, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import authHeader from "../../../utils/authHeader";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
import he from "he";
import ModalLayout from "./ModalLayout";

// Utility function to format relative time
const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
};

// const emptyImageURL =
//   "https://cdn.dribbble.com/userupload/34406570/file/original-c1f685352f44829bec0a57a07a87c3b9.jpg?resize=400x0";


  const emptyImageURL =
  "https://cdn.dribbble.com/userupload/34406570/file/original-c1f685352f44829bec0a57a07a87c3b9.jpg?resize=400x0";




  const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function ArticleContent() {
  const { id } = useParams();

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/user/articles/" + id,
          {
            headers: authHeader(),
          }
        );

        const data = res.data;
        if (data.res) {
          setSelectedArticle(data.article);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 w-20 mb-6"></div>
          <div className="h-8 bg-gray-300 w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-300 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-300"></div>
            <div className="h-4 bg-gray-300"></div>
            <div className="h-4 bg-gray-300 w-4/5"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!selectedArticle) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 bg-gray-50 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article not found
          </h1>
          <Button
            onClick={() => router.back()}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 ">
        {/* Navigation */}

        <div className="mb-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </div>

        {/* Article Container */}
        <article className="bg-white border border-gray-200 overflow-hidden">
          {/* Hero Image */}
          <div className="w-full h-64 md:h-96 overflow-hidden relative">
            <img
              src={
                selectedArticle.image ? selectedArticle.image : emptyImageURL
              }
              alt={selectedArticle.title}
              className="w-full h-full object-contain object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 pb-8">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
                {selectedArticle.title}
              </h1>

              {/* Author and Meta Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-900 text-white font-bold text-lg flex items-center justify-center">
                    {selectedArticle.assigned_to_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedArticle.assigned_to_name}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(selectedArticle.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {selectedArticle?.views?.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-900 hover:bg-blue-800 text-white px-6">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-0 p-6">
                    <DialogTitle className="text-xl font-semibold text-gray-900 mb-4">
                      Share this article
                    </DialogTitle>
                    <div className="space-y-4">
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="w-full border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                      >
                        {copied ? "Link Copied!" : "Copy Link"}
                      </Button>

                      <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `Check out this article: ${selectedArticle.title} ${shareUrl}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 hover:bg-green-50 transition-colors duration-200"
                        >
                          <FaWhatsapp className="text-green-600 text-2xl" />
                        </a>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            shareUrl
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 hover:bg-blue-50 transition-colors duration-200"
                        >
                          <FaFacebookF className="text-blue-700 text-2xl" />
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            shareUrl
                          )}&text=${encodeURIComponent(selectedArticle.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <FaXTwitter className="text-black text-2xl" />
                        </a>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className=" my-4 flex justify-between items-center">
                <div>
                  <p className="text-sm">Assigned by</p>
                  <p className="font-semibold text-gray-600">
                    {selectedArticle.assigned_to_name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm">Due date</p>
                  <p className="flex items-center gap-1">
                    {formatDate(selectedArticle.due_date)}
                  </p>
                </div>
              </div>

              <div className=" my-4 flex justify-between items-center">
                <div>
                  <p className="text-sm">Reviwer</p>
                  <p className="font-semibold text-gray-600">
                    {selectedArticle.reviewer_id}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm">Plagarism score</p>
                  <p className="font-semibold text-gray-600">
                    {selectedArticle.plagarism_score}
                  </p>
                </div>
              </div>

              <div className=" my-4 flex justify-between items-center">
                <div>
                  <p className="text-sm">Institution</p>
                  <p className="font-semibold text-gray-600">
                    {selectedArticle.institution}
                  </p>
                </div>

               
              </div>
            </header>

            {/* Blog Content */}

            {selectedArticle.content && (
              <div
                className="blog-content max-w-none text-gray-700 leading-relaxed"
                style={{
                  // fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: "1.8",
                  // Removed: fontSize: '1.1rem'
                }}
                dangerouslySetInnerHTML={{
                  __html: he.decode(selectedArticle.content || ""),
                }}
              />
            )}

            {!selectedArticle.content && (
              <p className="text-sm  mb-0text-gray-500 text-center">
                Content not available yet
              </p>
            )}

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-900"></div>
                  Published {formatRelativeTime(selectedArticle.createdAt)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  {selectedArticle?.views} views
                </div>
              </div>
            </footer>
          </div>
        </article>

        {/* Back to Blog CTA */}
        {/* <div className="mt-12 text-center">
          <Button
            onClick={() => router.push('/blog')}
            variant="outline"
            className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white px-8 py-3"
          >
            Read More Articles
          </Button>
        </div> */}
      </div>
    </main>
  );
}
