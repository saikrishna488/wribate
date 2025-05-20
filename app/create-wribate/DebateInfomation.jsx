import React, { useState, useEffect, useRef } from 'react'
import { Upload, Award, ChevronRight, Search, X } from "lucide-react";
import axios from 'axios';
import FieldLabel, { tooltips } from './FieldLabel'
import toast from 'react-hot-toast';

// Original SearchableDropdown component remains unchanged
const SearchableDropdown = ({ id, name, value, onChange, options, placeholder, required }) => {
  // Component code remains unchanged
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  
  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    typeof option === 'string' 
      ? option.toLowerCase().includes(searchTerm.toLowerCase())
      : option.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = (option) => {
    const selectedValue = typeof option === 'string' ? option : option.categoryName;
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
    setSearchTerm('');
  };

  // Clear selection
  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { name, value: '' } });
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const inputClass = "w-full p-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-900 text-sm transition-all duration-200 bg-gray-50";

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <div 
        className={`${inputClass} flex items-center justify-between cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-grow flex items-center">
          <Search size={16} className="text-gray-400 mr-2" />
          {isOpen ? (
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="flex-grow border-none bg-transparent focus:outline-none p-0"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={value ? 'text-black' : 'text-gray-400'}>
              {value || placeholder}
            </span>
          )}
        </div>
        {value && !isOpen && (
          <button onClick={handleClear} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.categoryName;
              const optionId = typeof option === 'string' ? option : option._id;
              
              return (
                <div
                  key={optionId || index}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {optionValue}
                </div>
              );
            })
          ) : (
            <div className="p-3 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

// Custom FieldLabel component with properly horizontal tooltip styling
const HorizontalFieldLabel = ({ htmlFor, tooltip, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipStyle = {
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    trigger: {
      marginLeft: '0.5rem',
      color: '#9ca3af',
      cursor: 'pointer'
    },
    tooltip: {
      position: 'absolute',
      left: 'calc(100% + 10px)',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      // These width properties create a horizontal rectangle
      width: '220px',      // Increased fixed width
      maxHeight: '60px',   // Limit the height
      zIndex: 50,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      // Make sure text flows properly in this shape
      display: 'flex',
      alignItems: 'center'
    },
    arrow: {
      position: 'absolute',
      left: '-6px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 0,
      height: 0,
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderRight: '6px solid #1e293b'
    }
  };

  return (
    <div style={tooltipStyle.container}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {children}
      </label>
      {tooltip && (
        <div className="relative ml-2">
          <button
            type="button"
            style={tooltipStyle.trigger}
            onClick={() => setShowTooltip(!showTooltip)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          {showTooltip && (
            <div style={tooltipStyle.tooltip}>
              <div style={tooltipStyle.arrow}></div>
              {tooltip}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


const DebateInformation = ({ formData, handleInputChange, handleFileUpload, data, user, setCurrentSection, imagePreview }) => {
    const inputClass = "w-full p-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-900 text-sm transition-all duration-200 bg-gray-200";
    
    // Get category options from data
    const categoryOptions = data?.data || [];
    
    // State for countries list and detection
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    
    // Fetch countries from API
    useEffect(() => {
        const fetchCountries = async () => {
            setIsLoading(true);
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
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, []);
    
    // Auto-detect user's country by IP when component mounts
    useEffect(() => {
        const detectUserCountry = async () => {
            // Only attempt detection if country is not already set
            if (formData.country) return;
            
            setIsDetectingLocation(true);
            try {
                // Using ipapi.co service for IP geolocation
                const res = await axios.get('https://ipapi.co/json/');
                if (res.data && res.data.country_name) {
                    // Update form data with detected country
                    handleInputChange({
                        target: {
                            name: 'country',
                            value: res.data.country_name
                        }
                    });
                }
            } catch (err) {
                console.log("Could not detect location:", err);
                // Silent failure as this is an enhancement
            } finally {
                setIsDetectingLocation(false);
            }
        };
        
        detectUserCountry();
    }, [formData.country, handleInputChange]); // Added dependencies to prevent lint warnings
    
    // Custom handler for dropdowns
    const handleDropdownChange = (e) => {
        handleInputChange(e);
    };

    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-900 text-white p-2 mr-3">
                        <Award size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
                </div>

                <div className="mb-6 ">
                    <HorizontalFieldLabel htmlFor="title" tooltip={tooltips.title}>
                        Wribate Title*
                    </HorizontalFieldLabel>
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

                <div className="mb-6">
                    <HorizontalFieldLabel htmlFor="context" tooltip={tooltips.context}>
                        Context
                    </HorizontalFieldLabel>
                    <textarea
                        id="context"
                        name="context"
                        value={formData.context}
                        onChange={handleInputChange}
                        className={`${inputClass} h-24`}
                        placeholder="Provide background information and context for the debate"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Optional: Additional context helps participants understand the scope of the wribate
                    </p>
                </div>

                <div className="mb-6">
                    <HorizontalFieldLabel htmlFor="coverImage" tooltip={tooltips.coverImage}>
                        Cover Image
                    </HorizontalFieldLabel>
                    <div className="border border-dashed border-gray-300 p-6  bg-gray-200">
                        <div className="text-center">
                            {imagePreview ? (
                                <div className="mb-4">
                                    <img
                                        src={imagePreview}
                                        alt="Cover preview"
                                        className="mx-auto h-40 object-cover"
                                    />
                                </div>
                            ) : (
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            )}
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white hover:bg-blue-800 transition font-medium">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <HorizontalFieldLabel htmlFor="category" tooltip={tooltips.category}>
                            Category*
                        </HorizontalFieldLabel>
                        <SearchableDropdown
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleDropdownChange}
                            options={categoryOptions}
                            placeholder="Select a category"
                            required
                        />
                    </div>

                    <div>
                        <HorizontalFieldLabel htmlFor="country" tooltip={tooltips.country || "Select the country relevant to this debate"}>
                            Country
                        </HorizontalFieldLabel>
                        {isLoading ? (
                            <div className={`${inputClass} flex items-center`}>
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-900 rounded-full animate-spin mr-2"></div>
                                <span className="text-gray-500">Loading countries...</span>
                            </div>
                        ) : (
                            <div className="relative">
                                <SearchableDropdown
                                    id="country"
                                    name="country"
                                    value={formData.country || ""}
                                    onChange={handleDropdownChange}
                                    options={countries}
                                    placeholder={isDetectingLocation ? "Detecting your location..." : "Select a country"}
                                />
                                {isDetectingLocation && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {user?.userRole !== "user" && (
                    <div className="mt-6">
                        <HorizontalFieldLabel htmlFor="institution" tooltip={tooltips.institution}>
                            Institution
                        </HorizontalFieldLabel>
                        <input
                            id="institution"
                            type="text"
                            name="institution"
                            value={formData.institution || ""}
                            onChange={handleInputChange}
                            className={inputClass}
                            placeholder="Organization or school name"
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-10">
                <button
                    type="button"
                    onClick={() => setCurrentSection(2)}
                    className="bg-blue-900 text-white font-bold py-3 px-8 flex items-center"
                >
                    Next: Participants <ChevronRight size={20} className="ml-2" />
                </button>
            </div>
        </div>
    )
}

export default DebateInformation
