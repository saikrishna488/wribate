"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter,useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { blogAtom, userAtom } from '@/app/states/GlobalStates';
import axios from 'axios';

export default function CreateEditArticle() {
    const [editBlog,setEditBlog] = useAtom(blogAtom);
    const [title, setTitle] = useState(editBlog.title ||'');
    const [content, setContent] = useState(editBlog.title || '');
    const [user] = useAtom(userAtom);
    const [imagePreview, setImagePreview] = useState(editBlog.image || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview((reader).result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setIsSubmitting(true);

            const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/blog',{
                title,
                content,
                author_id: user?._id,
                image: imagePreview,
                id:editBlog?._id || null
            }, {
                withCredentials: true
            });

            const data = res.data;

            if (data.res) {
                toast.success("Post published successfully!");
                router.push('/admin/blogs');
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to publish post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user?._id) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-md p-6">
                    <CardHeader className="text-center">
                        <CardTitle>Authentication Required</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-4">Please log in to create a blog post.</p>
                        <Button onClick={() => router.push('/login')}>
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                    <h1 className="font-medium ml-auto mr-auto text-lg">{editBlog?.title ? 'Edit' : 'Create'} New Post</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Blog Post Details</CardTitle>
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
                                <Label htmlFor="content" className="text-sm font-medium">
                                    Content <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your blog post content here..."
                                    className="min-h-[200px] focus:ring-2 focus:ring-blue-500"
                                    required
                                />
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
                                            onError={() => (setImagePreview)('/api/placeholder/500/300')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto bg-blue-800 hover:bg-blue-700"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Publishing...' : 'Publish Post'}
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </main>
        </div>
    );
}