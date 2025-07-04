"use client";
import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";

import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Eye, Clock, Share2, CircleX } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { ArrowLeft, Image } from "lucide-react";
import authHeader from "../../../utils/authHeader";

import ModalLayout from "../ArticlesAssigned/ModalLayout";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
// import Toastify from "../../../utils/Toast";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import he from "he";
import { PATHNAMES } from "@/app/config/pathNames";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function SimpleBlogPost() {
  const { id } = useParams();

  const [selectedArticle, setSelectedArticle] = useState(null);

  const [title, setTitle] = useState("");
  const { userId } = useSelector((state) => state?.auth);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [editorImage, setEditorImage] = useState("");
  const [oldImage, setOldImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsSubmitting(true);
        const URL =
          process.env.NEXT_PUBLIC_BACKEND_URL + "/user/articles/" + id;

        console.log(URL, id, "this is the url");
        const res = await axios.get(URL, {
          headers: authHeader(),
        });

        const data = res.data;

        if (data.res) {
          setSelectedArticle(data?.article);
          setTitle(data?.article?.title);
          setContent(data?.article?.content);
          setImagePreview(data.article?.image);
          setOldImage(data.article?.image);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch article");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle editor image selection
  const handleEditorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditorImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Insert image into editor
  const insertImageIntoEditor = () => {
    if (editorImage && window.quillRef) {
      const quill = window.quillRef.getEditor();
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.insertEmbed(index, "image", editorImage);
      quill.setSelection(index + 1);
      setEditorImage(""); // Clear the image after inserting
    }
  };

  // Handle content change
  const handleContentChange = (value) => {
    setContent(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content || content === "<p><br></p>") {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/user/articles/update";

      console.log(URL, "iurl here");
      const res = await axios.post(
        URL,
        {
          title,
          content,
          coverBaseImage64: oldImage !== imagePreview ? imagePreview : null,
          id: selectedArticle?._id || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const data = res.data;

      if (data.res) {
        toast.success("Article updated successfully!");
        router.push(PATHNAMES.MY_WRIBATES);
      }
    } catch (err) {
      console.error(err);
      console.log(err.response.data);
      //   Toastify(err.response.data.message || "Failed to publish post.", "warn");
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (!!userId) {
  //   return (
  //     <ModalLayout open={open} onClose={onClose}>
  //       <div className="flex items-center justify-center h-screen">
  //         <Card className="w-full max-w-md p-6">
  //           <CardHeader className="text-center">
  //             <CardTitle>Authentication Required</CardTitle>
  //           </CardHeader>
  //           <CardContent className="text-center">
  //             <p className="mb-4">Please log in to create a blog post.</p>
  //             <Button onClick={() => router.push("/signin")}>
  //               Go to Signin
  //             </Button>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </ModalLayout>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white border-b h-16 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>

          <h1 className="font-medium ml-auto mr-auto text-lg">Edit Article</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">
              Topic: {selectedArticle?.topic}
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a catchy title for your post"
                  className="focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Content <span className="text-red-500">*</span>
                </Label>

                {/* Image insertion controls */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
                  <Label htmlFor="editorImage" className="text-sm font-medium">
                    Insert Image:
                  </Label>
                  <Input
                    id="editorImage"
                    type="file"
                    accept="image/*"
                    onChange={handleEditorImageChange}
                    className="flex-1 cursor-pointer"
                  />
                  <Button
                    type="button"
                    onClick={insertImageIntoEditor}
                    disabled={!editorImage}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Image size={16} />
                    Insert
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden bg-white">
                  <ReactQuill
                    ref={(el) => {
                      window.quillRef = el;
                    }}
                    theme="snow"
                    value={he.decode(content)}
                    onChange={handleContentChange}
                    placeholder="Start writing your blog post..."
                    style={{
                      minHeight: "400px",
                    }}
                    className="min-h-[400px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Featured Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />

                {imagePreview && (
                  <div className="mt-3 border rounded-md overflow-hidden bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-56 object-contain mx-auto"
                      onError={() =>
                        setImagePreview("/api/placeholder/500/300")
                      }
                    />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-800 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publishing..." : "Publish Article"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </main>

      <style jsx global>{`
        .ql-editor {
          min-height: 350px !important;
          font-family: inherit;
        }

        .ql-container {
          font-family: inherit;
        }

        .ql-toolbar {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1px solid #e5e7eb !important;
        }

        .ql-container {
          border-left: none !important;
          border-right: none !important;
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
}
