"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Clock, Search, X, Upload, Image, Save } from "lucide-react";
import authHeader from "../../utils/authHeader";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import he from "he";
import fetchCategories from "../../utils/fetchCategories";
import { useAtom } from "jotai";
import { articleAtom, userAtom } from "../../states/GlobalStates";
import fetchCountries from "../../utils/fetchCountries";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Searchable Category Dropdown Component
const SearchableCategoryDropdown = ({ 
    categories, 
    selectedCategory, 
    onCategorySelect, 
    required = false 
}) => {
    const [categorySearch, setCategorySearch] = useState(selectedCategory || "");
    const [showCategories, setShowCategories] = useState(false);

    // Filter categories based on search
    const filteredCategories = (categories || []).filter(
        (cat) =>
            typeof cat?.categoryName === "string" &&
            cat.categoryName.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const handleCategorySelect = (selectedCategory) => {
        onCategorySelect(selectedCategory);
        setCategorySearch(selectedCategory);
        setShowCategories(false);
    };

    const handleClear = () => {
        setCategorySearch('');
        onCategorySelect('');
    };

    // Update search when selectedCategory changes externally
    useEffect(() => {
        setCategorySearch(selectedCategory || "");
    }, [selectedCategory]);

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
                Category {required && '*'}
            </Label>
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        value={categorySearch}
                        onChange={(e) => {
                            setCategorySearch(e.target.value);
                            setShowCategories(true);
                        }}
                        onFocus={() => setShowCategories(true)}
                        placeholder="Search categories"
                        className="pl-9 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {categorySearch && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {showCategories && (
                    <>
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        type="button"
                                        onClick={() => handleCategorySelect(cat.categoryName)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        {cat.categoryName}
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                    No categories found
                                </div>
                            )}
                        </div>
                        {/* Click outside to close dropdown */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowCategories(false)}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

// Searchable Country Dropdown Component
const SearchableCountryDropdown = ({ 
    countries, 
    selectedCountry, 
    onCountrySelect, 
    required = false 
}) => {
    const [countrySearch, setCountrySearch] = useState(selectedCountry || "");
    const [showCountries, setShowCountries] = useState(false);

    // Filter countries based on search
    const filteredCountries = (countries || []).filter(
        (country) =>
            typeof country === "string" &&
            country.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const handleCountrySelect = (selectedCountry) => {
        onCountrySelect(selectedCountry);
        setCountrySearch(selectedCountry);
        setShowCountries(false);
    };

    const handleClear = () => {
        setCountrySearch('');
        onCountrySelect('');
    };

    // Update search when selectedCountry changes externally
    useEffect(() => {
        setCountrySearch(selectedCountry || "");
    }, [selectedCountry]);

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
                Country {required && '*'}
            </Label>
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        value={countrySearch}
                        onChange={(e) => {
                            setCountrySearch(e.target.value);
                            setShowCountries(true);
                        }}
                        onFocus={() => setShowCountries(true)}
                        placeholder="Search countries"
                        className="pl-9 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {countrySearch && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {showCountries && (
                    <>
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                                filteredCountries.map((country,i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleCountrySelect(country)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        {country}
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                    No countries found
                                </div>
                            )}
                        </div>
                        {/* Click outside to close dropdown */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowCountries(false)}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

// Institution Dropdown Component
const InstitutionDropdown = ({ 
    userInstitution, 
    selectedInstitution, 
    onInstitutionSelect, 
    required = false 
}) => {
    const [showInstitutions, setShowInstitutions] = useState(false);

    // Create institution options
    const institutionOptions = [
        { value: "None", label: "None" },
        { value: userInstitution, label: userInstitution || "Your Institution" }
    ].filter(option => option.value); // Filter out empty values

    const handleInstitutionSelect = (selectedInstitution) => {
        onInstitutionSelect(selectedInstitution);
        setShowInstitutions(false);
    };

    const getDisplayValue = () => {
        if (!selectedInstitution) return "Select institution";
        return selectedInstitution;
    };

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
                Institution {required && '*'}
            </Label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowInstitutions(!showInstitutions)}
                    className="w-full h-10 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                >
                    <span className={selectedInstitution ? "text-gray-900" : "text-gray-500"}>
                        {getDisplayValue()}
                    </span>
                    <X className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${showInstitutions ? 'rotate-180' : ''}`} />
                </button>

                {showInstitutions && (
                    <>
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                            {institutionOptions.map((institution) => (
                                <button
                                    key={institution.value}
                                    type="button"
                                    onClick={() => handleInstitutionSelect(institution.value)}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                                        selectedInstitution === institution.value ? 'bg-blue-50 text-blue-700' : ''
                                    }`}
                                >
                                    {institution.label}
                                </button>
                            ))}
                        </div>
                        {/* Click outside to close dropdown */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowInstitutions(false)}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

// Main Component
export default function WriteYourArticle() {
    const [article, setArticle] = useAtom(articleAtom);
    const [title, setTitle] = useState(article?.title || "");
    const [user] = useAtom(userAtom);
    const [content, setContent] = useState(article?.content || "");
    const [imagePreview, setImagePreview] = useState(article?.image || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);

    // State for category, country, and institution
    const [category, setCategory] = useState(article?.category || "");
    const [country, setCountry] = useState(article?.country || "");
    const [institution, setInstitution] = useState(article?.institution || "");

    // Refs for file inputs
    const featuredImageRef = useRef(null);
    const contentImageRef = useRef(null);
    const quillRef = useRef(null);

    const router = useRouter();

    //fetch countries
    useEffect(() => {
        const getCountries = async () => {
            const data = await fetchCountries()
            if (data) {
                setCountries(data)
            }
        }

        getCountries();
    }, []);

    // fetch categories
    useEffect(() => {
        const getCategories = async () => {
            const data = await fetchCategories()
            if (data) {
                setCategories(data)
            }
        }

        getCategories();
    }, []);
        
    const handleFeaturedImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleContentImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                insertImageIntoContent(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const insertImageIntoContent = (imageUrl) => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            const index = range ? range.index : quill.getLength();

            quill.insertEmbed(index, 'image', imageUrl);
            quill.setSelection(index + 1);
        }
    };

    const handleContentChange = (value) => {
        setContent(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content || content === "<p><br></p>" || !imagePreview) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/user/createarticle";

            const res = await axios.post(
                URL,
                {
                    title,
                    content,
                    category,
                    country,
                    institution,
                    image: imagePreview,
                    id: article._id || null
                },
                {
                    headers: authHeader()
                }
            );

            const data = res.data;

            if (data.res) {
                toast.success("Article published successfully!");
                router.push('/');
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to publish article");
        } finally {
            setIsSubmitting(false);
        }
    };

    //handle user if not loggedin
    if(!user?._id){
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simplified Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <h1 className="text-2xl font-semibold text-gray-900">{article?.title ? 'Edit' : 'Write'} Article</h1>
                    <p className="text-gray-600 mt-1">Create and publish your content</p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Title Section */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                            Title *
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter article title"
                            className="text-lg h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Category Section */}
                    <SearchableCategoryDropdown
                        categories={categories}
                        selectedCategory={category}
                        onCategorySelect={setCategory}
                        required={true}
                    />

                    {/* Country Section */}
                    <SearchableCountryDropdown
                        countries={countries}
                        selectedCountry={country}
                        onCountrySelect={setCountry}
                        required={false}
                    />

                    {/* Institution Section */}
                    <InstitutionDropdown
                        userInstitution={user?.institution}
                        selectedInstitution={institution}
                        onInstitutionSelect={setInstitution}
                        required={false}
                    />

                    {/* Featured Image Section */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Featured Image
                        </Label>

                        <div className="border border-gray-300 rounded-lg p-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Featured image preview"
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => featuredImageRef.current?.click()}
                                    className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload featured image</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                </div>
                            )}
                            <input
                                ref={featuredImageRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFeaturedImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-gray-700">
                                Content *
                            </Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => contentImageRef.current?.click()}
                                className="text-xs"
                            >
                                <Image className="w-3 h-3 mr-1" />
                                Insert Image
                            </Button>
                        </div>

                        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={he.decode(content)}
                                onChange={handleContentChange}
                                placeholder="Start writing your article..."
                                style={{ minHeight: "400px" }}
                            />
                        </div>

                        <input
                            ref={contentImageRef}
                            type="file"
                            accept="image/*"
                            onChange={handleContentImageChange}
                            className="hidden"
                        />

                        <p className="text-xs text-gray-500">
                            {content.replace(/<[^>]*>/g, '').length} characters
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-900 hover:bg-blue-700 text-white px-8 py-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Publish Article
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>

            <style jsx global>{`
        .ql-editor {
          min-height: 350px !important;
          font-family: inherit;
          font-size: 15px;
          line-height: 1.6;
          padding: 16px;
        }

        .ql-container {
          font-family: inherit;
          border: none !important;
        }

        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background: #f9fafb;
          padding: 8px 12px;
        }

        .ql-toolbar .ql-formats {
          margin-right: 12px;
        }

        .ql-toolbar button {
          padding: 4px;
        }

        .ql-toolbar button:hover {
          color: #2563eb;
        }

        .ql-toolbar .ql-active {
          color: #2563eb;
        }
      `}</style>
        </div>
    );
}