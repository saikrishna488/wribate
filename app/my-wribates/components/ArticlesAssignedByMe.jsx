import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Pencil,
  Eye,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import httpRequest from "@/app/utils/httpRequest";
import axios from "axios";
import url from '../../utils/baseUrl';
import { useAtom } from "jotai";
import { userAtom } from "@/app/states/GlobalStates";
import authHeader from "@/app/utils/authHeader";

// Generate years from 2020 to current year
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 2019 },
  (_, i) => currentYear - i
);

const categories = ["All Categories", "Computer Science", "Environmental Science", "Finance", "Physics", "Healthcare"];

function ArticlesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [user] = useAtom(userAtom);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  //fetchArticles
  const fetchArticles = async () => {
    const data = await httpRequest(axios.get(url + '/user/getarticlesassignedtoproffesor', {
      headers: authHeader()
    }));

    setArticles(data.articles)
    console.log(data)
  }

  // fetch categories
  useEffect(() => {
    fetchArticles()
  }, [])

  const filteredArticles = Array.isArray(articles)
    ? articles.filter((article) => {
      const matchesSearch =
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.student?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear = selectedYear === "all" || article.year?.toString() === selectedYear;
      const matchesCategory = selectedCategory === "All Categories" || article.category === selectedCategory;

      return matchesSearch && matchesYear && matchesCategory;
    })
    : [];

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Published":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case "Draft":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case "Under Review":
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const getPlagiarismColor = (score) => {
    if (score <= 10) return "text-green-600";
    if (score <= 20) return "text-yellow-600";
    return "text-red-600";
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return "text-gray-500";
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600"; // Overdue
    if (diffDays <= 3) return "text-orange-600"; // Due soon
    if (diffDays <= 7) return "text-yellow-600"; // Due this week
    return "text-green-600"; // Due later
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return "No due date";
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return due.toLocaleDateString();
  };

  const handleEdit = (id) => {
    console.log(`Edit article ${id}`);
  };

  const handleView = (id) => {
    console.log(`View article ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete article ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4">
      {/* Header */}
      <div className=" ">
        <div className="w-full mx-auto py-6">
          <h1 className="text-2xl font-bold text-gray-900">Articles Management</h1>
          <p className="mt-1 text-sm text-gray-600">Manage and track all Articles Assigned By You</p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mx-auto px-2 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-2 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, students, emails, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Year Filter */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer min-w-[120px]"
                >
                  <option value="all">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer min-w-[160px]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="p-4 space-y-4">
              {filteredArticles.map((article) => (
                <div key={article._id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 flex-1 pr-2">
                      {article.title}
                    </h3>
                    <span className={getStatusBadge(article.status)}>
                      {article.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Student:</span>
                      <div className="font-medium">{article.user_email || "N/A"}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <div className="font-medium text-xs">{article.email || "N/A"}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <div className={`font-medium ${getDueDateColor(article.due_date)}`}>
                        {formatDueDate(article.due_date)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Year:</span>
                      <div className="font-medium">
                        {article.createdAt ? new Date(article.createdAt).getFullYear() : "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <div className="font-medium">{article.category}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Plagiarism:</span>
                      <div className={`font-medium ${getPlagiarismColor(article.plagarism_score)}`}>
                        {article.plagarism_score}%
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleView(article._id)}
                      className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(article._id)}
                      className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plagiarism Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div title={article.title} className="text-sm font-medium cursor-pointer text-gray-900">
                        {article.title}
                      </div>
                      {
                        article.assigned_to && (
                          <div className="text-sm text-gray-500">
                            by {article.assigned_to}
                          </div>
                        )
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.student || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="max-w-[150px] truncate cursor-pointer" title={article.user_email}>
                        {article.user_email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`font-medium ${getDueDateColor(article.due_date)}`}>
                        {formatDueDate(article.due_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.createdAt ? new Date(article.createdAt).getFullYear() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(article.status)}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getPlagiarismColor(article.plagarism_score)}`}>
                        {article.plagarism_score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(article._id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No articles found</h3>
                <p className="text-sm">Try adjusting your search or filter criteria.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticlesTable;