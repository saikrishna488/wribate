import { X } from "lucide-react";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TagsInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [categories, setCategories] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch categories from API
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

  // Filter categories based on input value
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = categories.filter(category => {
        const categoryName = typeof category === 'string' ? category : category.categoryName;
        return categoryName.toLowerCase().includes(inputValue.toLowerCase()) &&
               !value.includes(categoryName);
      });
      setFilteredCategories(filtered);
      setShowDropdown(filtered.length > 0);
      setHighlightedIndex(-1);
    } else {
      setFilteredCategories([]);
      setShowDropdown(false);
    }
  }, [inputValue, categories, value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addTag = (tagValue) => {
    const newTag = tagValue.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
    setInputValue('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    // Handle dropdown navigation
    if (showDropdown && filteredCategories.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCategories.length - 1 ? prev + 1 : 0
        );
        return;
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCategories.length - 1
        );
        return;
      }

      if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        const selectedCategory = filteredCategories[highlightedIndex];
        const categoryName = typeof selectedCategory === 'string' 
          ? selectedCategory 
          : selectedCategory.categoryName;
        addTag(categoryName);
        return;
      }

      if (e.key === 'Escape') {
        setShowDropdown(false);
        setHighlightedIndex(-1);
        return;
      }
    }

    // Add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
    // Remove last tag on Backspace if input is empty
    else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleCategorySelect = (category) => {
    const categoryName = typeof category === 'string' ? category : category.categoryName;
    addTag(categoryName);
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
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
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-grow outline-none border-none p-2 min-w-[100px] bg-transparent"
          placeholder={value.length === 0 ? "Type tags and press Enter/comma" : ""}
        />
      </div>

      {/* Dropdown for filtered categories */}
      {showDropdown && filteredCategories.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
          {filteredCategories.map((category, index) => {
            const categoryName = typeof category === 'string' ? category : category.categoryName;
            return (
              <div
                key={typeof category === 'string' ? category : category._id || index}
                className={`p-3 cursor-pointer ${
                  index === highlightedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleCategorySelect(category)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {categoryName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagsInput;