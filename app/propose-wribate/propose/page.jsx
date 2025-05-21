"use client"
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { X, Edit3, MapPin, BookOpen, Tag, AlertTriangle } from "lucide-react";
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { userAtom } from '@/app/states/GlobalStates';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Custom Tags Input Component
const TagsInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e) => {
    // Add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      
      // Check if tag already exists
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    } 
    // Remove last tag on Backspace if input is empty
    else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap w-full border-2 border-gray-200 rounded-none p-1 focus-within:border-blue-900 focus-within:ring-0 bg-white">
      {value.map((tag, index) => (
        <div 
          key={index} 
          className="flex items-center bg-blue-900 text-white rounded-none px-2 py-1 m-1 text-sm"
        >
          <span>{tag}</span>
          <button 
            type="button" 
            onClick={() => removeTag(tag)} 
            className="ml-1 text-white hover:text-blue-200 focus:outline-none"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow outline-none border-none p-2 min-w-[100px] bg-transparent"
        placeholder={value.length === 0 ? "Type tags and press Enter" : ""}
      />
    </div>
  );
};

const WribateProposalForm = () => {
    const [user, setUser] = useAtom(userAtom);
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        tags: [], // Changed from 'tag' to 'tags' as an array
        country: '',
        context: '',
        user_id: user?._id || null
    });

    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getallcategories');

                const data = res.data;
                if (data.res) {
                    setCategories(data.categories);
                }

                console.log(data.categories)
            } catch (err) {
                console.log(err);
                toast.error("Error fetching categories");
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await axios.get('https://restcountries.com/v3.1/all?fields=name');
                const data = res.data;
                // Sort countries alphabetically by common name
                const sortedCountries = data
                    .map(country => country.name.common)
                    .sort((a, b) => a.localeCompare(b));
                setCountries(sortedCountries);
            } catch (err) {
                console.log(err);
                toast.error("Error fetching countries");
            }
        };

        fetchCountries();
    }, []);

    //handle form change
    const handleFormChange = (name, value) => {
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async () => {
        try {
            if (!user?._id) {
                toast.error("Login to continue");
                return;
            }

            if (formData.title.length > 175) {
                toast.error("You have exceeded length of 175 chars");
                return;
            }

            if (formData.tags.length === 0) {
                toast.error("Please add at least one tag");
                return;
            }

            if (formData.context.length > 500) {
                toast.error("You have exceeded length of 350 chars in context");
                return;
            }

            const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose', formData, {
                withCredentials: true
            });

            const data = res.data;

            if (data.res) {
                toast.success("Proposed");
                router.push('/propose-wribate');
            }
        }
        catch (err) {
            console.log(err);
            toast.error("Failed to Add!");
        }
    };

    useEffect(() => {
        if(!user?._id) {
            router.push('/login');
        }
    }, [user, router]);

    if(!user?._id) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8 border-l-4 border-blue-900 pl-4">
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">PROPOSE A WRIBATE</h1>
                    <div className="h-1 w-24 bg-blue-900 mt-2"></div>
                    <p className="mt-3 text-gray-600 font-medium">
                        Create a thoughtful wribate topic for the Wribate community
                    </p>
                </div>

                <Card className="shadow-lg rounded-none border-t-4 border-blue-900">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl font-bold text-blue-900 flex items-center">
                            <Edit3 className="mr-2" size={20} />
                            New Wribate Submission
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Fill in the form below with your wribate proposal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 px-6">
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="font-semibold text-gray-800 flex items-center">
                                    <BookOpen className="mr-2" size={16} />
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Enter your debate topic"
                                    value={formData.title}
                                    onChange={(e) => handleFormChange("title", e.target.value)}
                                    className="h-12 rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                />
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>Be clear and concise</span>
                                    <span>{formData.title.length}/175 characters</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="category" className="font-semibold text-gray-800">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleFormChange("category", value)}
                                    >
                                        <SelectTrigger id="category" className="h-12 rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none">
                                            {categories.map((category) => (
                                                <SelectItem key={category._id} value={category.categoryName}>
                                                    {category.categoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="country" className="font-semibold text-gray-800 flex items-center">
                                        <MapPin className="mr-2" size={16} />
                                        Country
                                    </Label>
                                    <Select
                                        value={formData.country}
                                        onValueChange={(value) => handleFormChange("country", value)}
                                    >
                                        <SelectTrigger id="country" className="h-12 rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0">
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none">
                                            {countries.map((country) => (
                                                <SelectItem key={country} value={country}>
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tags" className="font-semibold text-gray-800 flex items-center">
                                    <Tag className="mr-2" size={16} />
                                    Tags
                                </Label>
                                <TagsInput 
                                    value={formData.tags}
                                    onChange={(tags) => handleFormChange("tags", tags)}
                                />
                                <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add a tag</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="context" className="font-semibold text-gray-800">Context</Label>
                                <Textarea
                                    id="context"
                                    placeholder="Provide additional context for your debate topic"
                                    value={formData.context}
                                    onChange={(e) => handleFormChange("context", e.target.value)}
                                    rows={5}
                                    className="resize-none rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                />
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>Be clear and concise</span>
                                    <span>{formData.context.length}/500 characters</span>
                                </div>
                            </div>

                            {formData.title.length > 175 && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
                                    <AlertTriangle className="text-red-500 mr-2 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-red-700">
                                        Title exceeds the maximum of 175 characters. Please shorten it.
                                    </p>
                                </div>
                            )}

                            {formData.context.length > 350 && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
                                    <AlertTriangle className="text-red-500 mr-2 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-red-700">
                                        Context exceeds the maximum of 350 characters. Please shorten it.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-4 flex justify-between">
                        <Button 
                            variant="outline" 
                            className="rounded-none border-2 border-gray-300 hover:bg-gray-100 text-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-900 hover:bg-blue-800 text-white px-6 rounded-none"
                            disabled={formData.title.length > 100}
                        >
                            Submit Proposal
                        </Button>
                    </CardFooter>
                </Card>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                    All submissions are reviewed by our editorial team before publication
                </div>
            </div>
        </div>
    );
};

export default WribateProposalForm;