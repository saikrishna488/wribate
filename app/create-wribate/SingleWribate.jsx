"use client";
import React, { useState, useRef } from "react";
import {
  useUploadImageMutation,
  useCreateWribateMutation,
  useGetCategoriesQuery
} from "./../../app/services/authApi";
import { Calendar, Info, Upload, Clock, Users, Award, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { debateAtom, userAtom } from "../states/GlobalStates";
import axios from "axios";
import getAuthHeader from "../utils/authHeader";

const SingleWribate = () => {
  const [uploadImage] = useUploadImageMutation();
  const [user] = useAtom(userAtom);
  const [createWribate, { isLoading: wribateCreating }] = useCreateWribateMutation();
  const { data } = useGetCategoriesQuery();
  const [debate] = useAtom(debateAtom);
  const dateInputRef = useRef(null);
  const router = useRouter();

  // Shared class styles
  const inputClass = "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200";
  const labelClass = "block text-gray-700 text-sm font-medium mb-2";

  const [activeTooltip, setActiveTooltip] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: debate?.title || "",
    coverImage: null,
    coverImageBase64: null,
    leadFor: "",
    leadAgainst: "",
    supportingFor: "",
    supportingAgainst: "",
    judge1: "",
    judge2: "",
    judge3: "",
    startDate: "",
    durationDays: 1,
    category: debate?.category || "",
    institution: "",
    context: "", // Added context field
    scope: "Open", // Changed from "All" to "Private"
    type: "Free",
    prizeAmount: "",
    _id: user?._id || null
  });

  // Tooltip content for each field
  const tooltips = {
    title: "The main topic or question for debate. Be clear and concise.",
    coverImage: "An image to represent your debate topic. Ideal size is 1200×630px.",
    leadFor: "The primary advocate for the proposition/affirmative side.",
    leadAgainst: "The primary advocate for the opposition/negative side.",
    supportingFor: "Additional participant supporting the affirmative side.",
    supportingAgainst: "Additional participant supporting the negative side.",
    judges: "Impartial evaluators who will determine the outcome of the debate.",
    startDate: "When the debate will begin. All participants should be available.",
    durationDays: "How many days the debate will last. Longer debates allow for more in-depth arguments.",
    category: "The subject area your debate falls under.",
    context: "Additional background information to help participants understand the debate's scope and purpose.",
    institution: "Organization or school hosting/associated with this debate.",
    scope: "Private debates are invitation-only. Open debates allow public viewing and participation.",
    type: "Free debates have no monetary incentive. Sponsored debates include prizes.",
    prizeAmount: "The reward offered to winning participants in sponsored debates."
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, coverImage: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, coverImageBase64: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const toggleTooltip = (fieldName) => {
    setActiveTooltip(activeTooltip === fieldName ? null : fieldName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let wribateData = { ...formData };
      wribateData.judges = [formData.judge1, formData.judge2, formData.judge3];
      delete wribateData.coverImage;

      const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
      const istDate = new Date(wribateData.startDate).getTime() + istOffset; // Add IST offset
      wribateData.startDate = new Date(istDate).toISOString(); // Convert back to ISO string


      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/user/createWribate',
        wribateData,
        { withCredentials: true,
          headers: getAuthHeader()
         }
      );

      if (response.data.res) {
        toast.success("Wribate created successfully");
        router.push("/");
      } else {
        toast.error(response?.data?.message || "Error creating wribate");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || "Error creating wribate");
    } finally {
      setIsLoading(false);
    }
  };

  // Field label with optional tooltip
  const FieldLabel = ({ htmlFor, tooltip, children }) => (
    <div className="flex items-center justify-between mb-2">
      <label className={labelClass} htmlFor={htmlFor}>{children}</label>
      {tooltip && (
        <div className="relative">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => toggleTooltip(htmlFor)}
          >
            <Info size={16} />
          </button>
          {activeTooltip === htmlFor && (
            <div className="absolute z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 -mt-1 max-w-xs">
              {tooltip}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Wribate</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Set up your debate parameters, invite participants, and establish the rules for engagement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-6 px-8">
          <div className="flex justify-between items-center text-white">
            <h2 className="font-bold text-lg">New Debate Configuration</h2>
            <div className="text-sm opacity-75">All fields marked with * are required</div>
          </div>
        </div>

        <div className="p-8">
          {/* Basic Information */}
          <div className="mb-10 border-b border-gray-200 pb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full text-blue-700 mr-3">
                <Award size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>

            <div className="mb-6">
              <FieldLabel htmlFor="title" tooltip={tooltips.title}>
                Wribate Title*
              </FieldLabel>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Enter a clear title for your debate"
                required
              />
            </div>

            {/* Context Field */}
            <div className="mb-6">
              <FieldLabel htmlFor="context" tooltip={tooltips.context}>
                Context
              </FieldLabel>
              <textarea
                id="context"
                name="context"
                value={formData.context}
                onChange={handleInputChange}
                className={`${inputClass} h-24`}
                placeholder="Provide background information and context for the debate"
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: Additional context helps participants understand the scope of the debate
              </p>
            </div>

            {/* Cover Image Upload */}
            <div className="mb-6">
              <FieldLabel htmlFor="coverImage" tooltip={tooltips.coverImage}>
                Cover Image
              </FieldLabel>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Cover preview"
                        className="mx-auto h-40 object-cover rounded-md shadow-sm"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
                    {imagePreview ? "Change Image" : "Select Image"}
                    <input
                      id="coverImage"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </label>
                  {formData?.coverImage && (
                    <p className="mt-3 text-sm text-gray-600 font-medium">
                      Selected: {formData.coverImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Panel Setup */}
          <div className="mb-10 border-b border-gray-200 pb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full text-blue-700 mr-3">
                <Users size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Panel Setup</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* For Panel */}
              <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                <h3 className="font-semibold text-blue-800 mb-4 text-lg border-b border-blue-100 pb-2">For Side</h3>
                <div className="space-y-5">
                  <div>
                    <FieldLabel htmlFor="leadFor" tooltip={tooltips.leadFor}>
                      Lead Panelist Email*
                    </FieldLabel>
                    <input
                      id="leadFor"
                      type="email"
                      name="leadFor"
                      value={formData.leadFor}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="supportingFor" tooltip={tooltips.supportingFor}>
                      Supporting Panelist Email*
                    </FieldLabel>
                    <input
                      id="supportingFor"
                      type="email"
                      name="supportingFor"
                      value={formData.supportingFor}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="Email address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Against Panel */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-red-800 mb-4 text-lg border-b border-red-100 pb-2">Against Side</h3>
                <div className="space-y-5">
                  <div>
                    <FieldLabel htmlFor="leadAgainst" tooltip={tooltips.leadAgainst}>
                      Lead Panelist Email*
                    </FieldLabel>
                    <input
                      id="leadAgainst"
                      type="email"
                      name="leadAgainst"
                      value={formData.leadAgainst}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="supportingAgainst" tooltip={tooltips.supportingAgainst}>
                      Supporting Panelist Email*
                    </FieldLabel>
                    <input
                      id="supportingAgainst"
                      type="email"
                      name="supportingAgainst"
                      value={formData.supportingAgainst}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="Email address"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Judges */}
          <div className="mb-10 border-b border-gray-200 pb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full text-blue-700 mr-3">
                <Check size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Judges</h2>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <FieldLabel htmlFor="judge1" tooltip={tooltips.judges}>
                    Judge 1 Email*
                  </FieldLabel>
                  <input
                    id="judge1"
                    type="email"
                    name="judge1"
                    value={formData.judge1}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="judge2" tooltip={tooltips.judges}>
                    Judge 2 Email*
                  </FieldLabel>
                  <input
                    id="judge2"
                    type="email"
                    name="judge2"
                    value={formData.judge2}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="judge3" tooltip={tooltips.judges}>
                    Judge 3 Email*
                  </FieldLabel>
                  <input
                    id="judge3"
                    type="email"
                    name="judge3"
                    value={formData.judge3}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="mb-10 border-b border-gray-200 pb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full text-blue-700 mr-3">
                <Clock size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Schedule</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="startDate" tooltip={tooltips.startDate}>
                  Start Date & Time*
                </FieldLabel>
                <div className="relative">
                  <input
                    id="startDate"
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    ref={dateInputRef}
                    className={`${inputClass} pr-10`}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="durationDays" tooltip={tooltips.durationDays}>
                  Duration in Days*
                </FieldLabel>
                <input
                  id="durationDays"
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleInputChange}
                  className={inputClass}
                  min="1"
                  max="30"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full text-blue-700 mr-3">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Additional Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <FieldLabel htmlFor="category" tooltip={tooltips.category}>
                  Category*
                </FieldLabel>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`${inputClass} appearance-none bg-white`}
                  required
                >
                  <option value="">Select a category</option>
                  {data && data.data.map((item) => (
                    <option key={item._id} value={item.categoryName}>
                      {item.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {user?.userRole !== "user" && (
                <div>
                  <FieldLabel htmlFor="institution" tooltip={tooltips.institution}>
                    Institution
                  </FieldLabel>
                  <input
                    id="institution"
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Organization or school name"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Scope Toggle */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <FieldLabel htmlFor="scope" tooltip={tooltips.scope}>
                  Visibility
                </FieldLabel>
                <div className="flex items-center h-12">
                  <span className={`mr-3 text-sm ${formData.scope === "Open" ? "font-medium text-blue-800" : "text-gray-500"}`}>
                    Open to All
                  </span>
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${formData.scope === "Private" ? "bg-blue-600" : "bg-gray-300"}`}
                    onClick={() =>
                      handleToggleChange("scope", formData.scope === "Open" ? "Private" : "Open")
                    }
                  >
                    <div
                      className={`bg-white h-5 w-5 rounded-full shadow-md transform transition-transform ${formData.scope === "Private" ? "translate-x-6" : ""
                        }`}
                    ></div>
                  </div>
                  <span className={`ml-3 text-sm ${formData.scope === "Private" ? "font-medium text-blue-800" : "text-gray-500"}`}>
                    Private
                  </span>
                </div>
              </div>


              {/* Type Toggle */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <FieldLabel htmlFor="type" tooltip={tooltips.type}>
                  Debate Type
                </FieldLabel>
                <div className="flex items-center h-12">
                  <span className={`mr-3 text-sm ${formData.type === "Free" ? "font-medium text-blue-800" : "text-gray-500"}`}>
                    Free
                  </span>
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${formData.type === "Sponsored" ? "bg-blue-600" : "bg-gray-300"}`}
                    onClick={() => handleToggleChange("type", formData.type === "Free" ? "Sponsored" : "Free")}
                  >
                    <div className={`bg-white h-5 w-5 rounded-full shadow-md transform transition-transform ${formData.type === "Sponsored" ? "translate-x-6" : ""}`}>
                    </div>
                  </div>
                  <span className={`ml-3 text-sm ${formData.type === "Sponsored" ? "font-medium text-blue-800" : "text-gray-500"}`}>
                    Sponsored
                  </span>
                </div>
              </div>
            </div>

            {/* Conditional Prize Field */}
            {formData.type === "Sponsored" && (
              <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <FieldLabel htmlFor="prizeAmount" tooltip={tooltips.prizeAmount}>
                  Prize Amount*
                </FieldLabel>
                <input
                  id="prizeAmount"
                  type="text"
                  name="prizeAmount"
                  value={formData.prizeAmount}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="e.g. $500"
                  required={formData.type === "Sponsored"}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={isLoading || wribateCreating}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {(isLoading || wribateCreating) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Wribate...
                </>
              ) : "Create Wribate"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SingleWribate;