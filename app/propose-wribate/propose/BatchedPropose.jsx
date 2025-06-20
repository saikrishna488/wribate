"use client";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import authHeader from "../../utils/authHeader";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import { userAtom } from "../../states/GlobalStates";
import { useRouter } from "next/navigation";
import { PATHNAMES } from "../../config/pathNames";

const BatchPropose = () => {
  const [file, setFile] = useState(null);
  const [country, setCountry] = useState("");
  const [institution, setInstitution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user] = useAtom(userAtom);
  const router = useRouter();

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    // if (!country || !institution) {
    //   toast.error('Please fill in all required fields');
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("country", country || "IND");
      formData.append("institution", institution);

      // Replace with your actual API endpoint
      const URL =
        process.env.NEXT_PUBLIC_BACKEND_URL + "/user/articles/bulk-create";

      console.log(URL, "this  url");
      const response = await axios.post(URL, formData, {
        headers: authHeader(),
      });

      const data = response.data;

      if (data.res) {
        toast.success("Batch proposal submitted successfully!");
        router.push(PATHNAMES.MY_WRIBATES);
      } else {
        throw new Error("Failed to submit batch proposal");
      }
    } catch (error) {
      console.error("Error submitting batch proposal:", error);
      toast.error("Error submitting batch proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleData = [
    {
      id: 1,
      topic: "Topic 1",
      email: "abc@gmail.com",
      date: "DD-MM-YYYY",
      reviewer: "cdef@gmail.com"
    },
    { id: 2, topic: "Topic 2", email: "xyz@gmail.com", date: "DD-MM-YYYY" ,reviewer: "lmn@gmail.com"},
    { id: 3, topic: "Topic 3", email: "ravi@ravi.com", date: "DD-MM-YYYY", reviewer: "vuw@gmail.com" },
  ];

  const renderXLFormateInstruction = () => {
    return (
      <div className="mb-10">
        <div className="bg-blue-50 border-l-4 border-blue-900 p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Required File Format
          </h2>
          <p className="text-blue-800 mb-4">
            Please ensure your file follows the exact format shown in the table
            below:
          </p>

          {/* Sample Table */}
          <div className="overflow-x-auto bg-white border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Article Topic
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Student Email
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Due Date
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Reviewer
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                
                    <td className="border border-gray-300 px-4 py-3 text-gray-900 font-medium">
                      {row.topic}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-blue-600">
                      {row.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                      {row.date}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                      {row.reviewer}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Template Download */}
        <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border border-gray-200">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-blue-900 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-gray-900 font-medium">
              Need the template file?
            </span>
          </div>
          <a
            href="#"
            className="bg-blue-900 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 transition-colors duration-200"
          >
            Download Excel Template
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Batch Article Assignment
      </h3>

      {renderXLFormateInstruction()}

      <div className="space-y-6">
        {/* File Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Excel/CSV File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <div className="text-gray-600">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">
                  Excel (.xlsx, .xls) or CSV files only
                </p>
              </div>
            </label>
          </div>
          {file && (
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {file.name} - Ready to upload
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <CountryDropdown value={country} onChange={setCountry} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution / University
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Institution or University"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-md font-medium w-full md:w-auto transition-colors ${
            isSubmitting
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-900 text-white hover:bg-blue-800"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </div>
          ) : (
            "Submit Batch Article Assignment"
          )}
        </button>
      </div>
    </div>
  );
};

export default BatchPropose;

const CountryDropdown = ({ value, onChange, className = "" }) => {
  const [countries, setCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // const res = await axios.get('https://restcountries.com/v3.1/all?fields=name');
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/user/getCountries"
        );
        // Sort countries alphabetically by name
        const sortedCountries = response.data.data
          ?.map((country) => country.countryName)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sortedCountries);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching countries");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter countries based on search term
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    onChange(inputValue);
    setIsOpen(true);
  };

  const handleCountrySelect = (country) => {
    onChange(country);
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
      inputRef.current?.blur();
    } else if (e.key === "Enter" && filteredCountries.length > 0) {
      e.preventDefault();
      handleCountrySelect(filteredCountries[0]);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={
            loading ? "Loading countries..." : "Search for a country"
          }
          disabled={loading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>

      {isOpen && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <div
                key={country}
                onClick={() => handleCountrySelect(country)}
                className="px-3 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-900 border-b border-gray-100 last:border-b-0"
              >
                {country}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No countries found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
