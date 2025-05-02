"use client"
import React, { useState, useRef } from "react";
import {
  useUploadImageMutation,
  useCreateWribateMutation,
  useGetCategoriesQuery
} from "./../../app/services/authApi";
import { Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SingleWribate = () => {
  const [formData, setFormData] = useState({
    title: "",
    coverImage: null,
    leadFor: "",
    leadAgainst: "",
    supportingFor: "",
    supportingAgainst: "",
    judge1: "",
    judge2: "",
    judge3: "",
    startDate: "",
    durationDays: 1,
    category: "",
    institution: "",
    scope: "Open",
    type: "Free",
    prizeAmount: "",
  });

  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [createWribate, { isLoading: wribateCreating }] = useCreateWribateMutation();
  const { data, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const dateInputRef = useRef(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    setFormData((prev) => ({ ...prev, coverImage: e.target.files[0] }));
  };

  const handleDateIconClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.();
      dateInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let wribateData = { ...formData };
      
      if (formData.coverImage) {
        const imageData = new FormData();
        imageData.append("image", formData.coverImage);
        
        const imageResponse = await uploadImage({
          type: "wribte",
          data: imageData,
        }).unwrap();
        
        if (imageResponse.status === 1) {
          wribateData.coverImage = imageResponse.cloudinaryUrl;
        } else {
          wribateData.coverImage = "mobilescreen.jpeg";
        }
      } else {
        wribateData.coverImage = "mobilescreen.jpeg";
      }

      wribateData.judges = [formData.judge1, formData.judge2, formData.judge3];
      
      const response = await createWribate(wribateData).unwrap();
      
      if (response?.status === 1) {
        toast.success("Wribate created successfully");
        router.push("/");
      } else {
        toast.error(
          response?.message ||
          response?.data?.message ||
          "Error occurred while creating wribate"
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.message ||
        err.data?.message ||
        "Error occurred while creating wribate"
      );
    }
  };

  return (
    <div className="w-full border-2 mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Create New Wribate</h1>
        <p className="text-gray-600 mt-2">Set up your debate and invite participants</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-8">
        {/* Basic Information */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Wribate Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter title for your debate"
              required
            />
          </div>

          {/* Cover Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Cover Image
            </label>
            <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium mb-2">Upload Cover Image</p>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your image here or click to browse
                </p>
                <label className="inline-block cursor-pointer">
                  <span className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    id="imageUpload"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                </label>
                {formData?.coverImage && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {formData.coverImage.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-3">
                  Recommended: 1200x630px, Max 5MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Setup */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Panel Setup</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-4">For</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Lead Panel Email
                  </label>
                  <input
                    type="email"
                    name="leadFor"
                    value={formData.leadFor}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Supporting Panel Email
                  </label>
                  <input
                    type="email"
                    name="supportingFor"
                    value={formData.supportingFor}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-4">Against</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Lead Panel Email
                  </label>
                  <input
                    type="email"
                    name="leadAgainst"
                    value={formData.leadAgainst}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Supporting Panel Email
                  </label>
                  <input
                    type="email"
                    name="supportingAgainst"
                    value={formData.supportingAgainst}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Judges */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Judges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Judge 1
              </label>
              <input
                type="email"
                name="judge1"
                value={formData.judge1}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Judge 2
              </label>
              <input
                type="email"
                name="judge2"
                value={formData.judge2}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Judge 3
              </label>
              <input
                type="email"
                name="judge3"
                value={formData.judge3}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Email address"
                required
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Start Date & Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  ref={dateInputRef}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <div 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={handleDateIconClick}
                >
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Duration in Days
              </label>
              <input
                type="number"
                name="durationDays"
                value={formData.durationDays}
                onChange={handleInputChange}
                min="1"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 2"
                required
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                required
              >
                <option value="">Select a category</option>
                {data &&
                  data.data.map((item) => (
                    <option key={item._id} value={item.categoryName}>
                      {item.categoryName}
                    </option>
                  ))}
              </select>
            </div>
            
            {userInfo?.userRole !== "user" && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Institution name"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Prize Amount
              </label>
              <input
                type="text"
                name="prizeAmount"
                value={formData.prizeAmount}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. $500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Scope
              </label>
              <div className="flex items-center h-12">
                <span className={`mr-3 text-sm ${formData.scope === "Private" ? "font-medium text-gray-800" : "text-gray-500"}`}>
                  Private
                </span>
                <div
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                    formData.scope === "Open" ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() =>
                    handleToggleChange(
                      "scope",
                      formData.scope === "Private" ? "Open" : "Private"
                    )
                  }
                >
                  <div 
                    className={`bg-white h-5 w-5 rounded-full shadow-md transform transition-transform ${
                      formData.scope === "Open" ? "translate-x-6" : ""
                    }`}>
                  </div>
                </div>
                <span className={`ml-3 text-sm ${formData.scope === "Open" ? "font-medium text-gray-800" : "text-gray-500"}`}>
                  Open to All
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Type
            </label>
            <div className="flex items-center h-12">
              <span className={`mr-3 text-sm ${formData.type === "Sponsored" ? "font-medium text-gray-800" : "text-gray-500"}`}>
                Sponsored
              </span>
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                  formData.type === "Free" ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() =>
                  handleToggleChange(
                    "type",
                    formData.type === "Sponsored" ? "Free" : "Sponsored"
                  )
                }
              >
                <div 
                  className={`bg-white h-5 w-5 rounded-full shadow-md transform transition-transform ${
                    formData.type === "Free" ? "translate-x-6" : ""
                  }`}>
                </div>
              </div>
              <span className={`ml-3 text-sm ${formData.type === "Free" ? "font-medium text-gray-800" : "text-gray-500"}`}>
                Free
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading || wribateCreating}
            className="w-full bg-blue-900 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors duration-200 flex items-center justify-center"
          >
            {(isLoading || wribateCreating) ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                Create Wribate
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SingleWribate;