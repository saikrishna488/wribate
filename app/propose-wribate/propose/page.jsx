"use client"
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { userAtom } from '@/app/states/GlobalStates';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const WribateProposalForm = () => {
    const [user, setUser] = useAtom(userAtom);
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        tag: '',
        country: '',
        context: '',
        user_id: user?._id || null
    });

    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]); // fixed spelling from "countires"

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getallcategories');

                const data = res.data;
                if (data.res) {
                    setCategories(data.categories);
                }
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
    const handleFormChange = (name,value)=>{
        setFormData({...formData,[name]:value});
    }

    const handleSubmit = async () => {

        try {

            if (!user?._id) {
                toast.error("login to continue")
                return;
            }

            if (formData.title.length > 100) {
                toast("You have exceeded lenth of 100 chars");
            }

            const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose', formData, {
                withCredentials: true
            })

            const data = res.data;

            if (data.res) {
                toast.success("Proposed")
                router.push('/propose-wribate')
            }
        }
        catch (err) {
            console.log(err);
            toast.error("Failed to Add!")
        }
    };

    useEffect(()=>{
        if(!user?._id){
            router.push('/login')
        }
    })


    if(!user?._id){
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Propose a Wribate</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Create a new debate topic for the community to discuss
                    </p>
                </div>

                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900">New Wribate Details</CardTitle>
                        <CardDescription>Fill in the information below to create your Wribate</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="font-medium">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter your debate topic"
                                    value={formData.title}
                                    onChange={(e) => handleFormChange("title", e.target.value)}
                                    className="h-10"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category" className="font-medium">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleFormChange("category", value)}
                                >
                                    <SelectTrigger id="category" className="h-10">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category._id} value={category.categoryName}>
                                                {category.categoryName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tag" className="font-medium">Tag</Label>
                                <Input
                                    id="tag"
                                    placeholder="Enter a tag"
                                    value={formData.tag}
                                    onChange={(e) => handleFormChange("tag", e.target.value)}
                                    className="h-10"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="country" className="font-medium">Country</Label>
                                <Select
                                    value={formData.country}
                                    onValueChange={(value) => handleFormChange("country", value)}
                                >
                                    <SelectTrigger id="country" className="h-10">
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="context" className="font-medium">Context</Label>
                                <Textarea
                                    id="context"
                                    placeholder="Provide additional context for your debate topic"
                                    value={formData.context}
                                    onChange={(e) => handleFormChange("context", e.target.value)}
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-blue-800 hover:bg-blue-900 text-white px-6"
                                >
                                    Submit Proposal
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WribateProposalForm;