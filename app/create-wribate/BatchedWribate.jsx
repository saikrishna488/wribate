"use client"
import React, { useState, useRef, useEffect } from "react";
import { useCreateBatchWribateMutation } from "../services/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

const BatchWribateUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [organisationName, setOrganisationName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rotate, setRotate] = useState("free");
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const [createBatchWribate, { isLoading, error }] =
    useCreateBatchWribateMutation();

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
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
        // Fallback to empty array if API fails
        setCountries([]);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setSearchTerm(selectedCountry);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
    // Clear selected country if search doesn't match
    if (!e.target.value || !countries.some(country => 
      country.toLowerCase() === e.target.value.toLowerCase()
    )) {
      setCountry("");
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("institution", organisationName);
    data.append("judges", displayName);
    data.append("country", country);

    console.log(data);
    try {
      const response = await createBatchWribate(data).unwrap();
      console.log(response?.statusCode);
      console.log(response.statusCode == 200);
      console.log(response.status);
      if (response) {
        toast.success("wribate created successfully");
        router.push("/");
      } else {
        console.log(response);
        toast.error(
          response?.message || "error occured while creating wribate",
          "error"
        );
      }
    } catch (err) {
      console.log(err.data);
      console.error(err);
      toast.error(err?.message || "error occured while creating wribate", "error");
    }
  };

  const sampleData = [
    { id: 1, name: "John", email: "abc@gmail.com", date: "DD-MM-YYYY" },
    { id: 2, name: "Sara", email: "xyz@gmail.com", date: "DD-MM-YYYY" },
    { id: 3, name: "Ravi", email: "ravi@ravi.com", date: "DD-MM-YYYY" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 bg-blue-900">
            <h1 className="text-2xl font-semibold text-white">
              Batch Wribate Upload
            </h1>
            <p className="text-blue-100 mt-2">
              Upload batch wribates using the format below. All batch wribates are private by default until concluded.
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Instructions Section */}
            <div className="mb-10">
              <div className="bg-blue-50 border-l-4 border-blue-900 p-6 mb-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">
                  Required File Format
                </h2>
                <p className="text-blue-800 mb-4">
                  Please ensure your file follows the exact format shown in the table below:
                </p>
                
                {/* Sample Table */}
                <div className="overflow-x-auto bg-white border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-900 text-white">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">No.</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Email</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Date</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Submit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 text-gray-900">
                            {row.id}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-900 font-medium">
                            {row.name}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-blue-600">
                            {row.email}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-700">
                            {row.date}
                          </td>
                          <td className="border border-gray-300 px-4 py-3"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Template Download */}
              <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border border-gray-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-900 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Need the template file?</span>
                </div>
                <a 
                  href="#" 
                  className="bg-blue-900 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 transition-colors duration-200"
                >
                  Download Excel Template
                </a>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">File Upload</h2>
              
              <div
                className="border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-12 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-900 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>

                <div className="mb-6">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-blue-900 text-white font-semibold py-3 px-8 hover:bg-blue-800 transition-colors duration-200 inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    SELECT FILE
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".xlsx,.xls,.csv"
                  />
                </div>

                <p className="text-gray-600">
                  or drag and drop your Excel/CSV file here
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: .xlsx, .xls, .csv
                </p>

                {/* Selected File Display */}
                {selectedFile && (
                  <div className="mt-8 bg-white border border-gray-200 p-4 flex items-center justify-between max-w-md mx-auto">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      className="text-red-600 hover:text-red-800 p-1"
                      onClick={() => setSelectedFile(null)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Organisation Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter organisation name"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none transition-colors duration-200"
                    value={organisationName}
                    onChange={(e) => setOrganisationName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Submitted By *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your display name"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none transition-colors duration-200"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Country *
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <input
                      type="text"
                      placeholder={isLoadingCountries ? "Loading countries..." : "Search and select country"}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none transition-colors duration-200"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setIsDropdownOpen(true)}
                      disabled={isLoadingCountries}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {isLoadingCountries ? (
                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Dropdown */}
                    {isDropdownOpen && !isLoadingCountries && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 max-h-60 overflow-y-auto shadow-lg">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((countryName, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleCountrySelect(countryName)}
                            >
                              <span className="text-gray-900">{countryName}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500">
                            No countries found matching "{searchTerm}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {country && (
                    <p className="mt-2 text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selected: {country}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Access Type
                  </label>
                  <div className="flex space-x-6 pt-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rotate"
                        value="free"
                        checked={rotate === "free"}
                        onChange={() => setRotate("free")}
                        className="w-4 h-4 text-blue-900 border-gray-300 focus:ring-blue-900"
                      />
                      <span className="ml-3 text-gray-900 font-medium">Free</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rotate"
                        value="premium"
                        checked={rotate === "premium"}
                        onChange={() => setRotate("premium")}
                        className="w-4 h-4 text-blue-900 border-gray-300 focus:ring-blue-900"
                      />
                      <span className="ml-3 text-gray-900 font-medium">Premium</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-600">
                    Please review all information before submitting your batch wribate.
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || !organisationName || !displayName || !country || isLoading}
                  className="bg-blue-900 text-white font-semibold py-3 px-8 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Submit Batch Wribate'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchWribateUpload;