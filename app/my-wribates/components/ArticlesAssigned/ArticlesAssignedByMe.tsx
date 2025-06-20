import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Home,
  ShoppingBag,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Eye,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import getAuthHeader from "../../../utils/authHeader";
import { PATHNAMES } from "../../../config/pathNames";

import NoItemsCard from "./NoItemsCard";

import { useRouter } from "next/navigation";

interface Customer {
  _id: string;
  topic: string;
  student_id: string;
  student_name: "Active" | "Inactive" | "Pending";
  batch: string;
  due_date: number;
  spent: string;
  lastSeen: string;
  avatar: string;
  year: number;
}

const customers: any[] = [
  {
    _id: "68550400cbc984d66be07304",
    image: "https://via.placeholder.com/800x600.png?text=Sample+Image+3",
    topic: "Topic here",
    title: "Sample Article Title 3",
    content:
      "This is the content for sample article number 3. Lorem ipsum dolor sit amet.",
    assigned_by_name: "sulthan babu chirathala",
    assigned_by_id: "684511250a0181f8d45ea5a1",
    assigned_to_name: "Writer 3",
    assigned_to_id: "68550400cbc984d66be072fa",
    submitted_on_time: false,
    status: "pending",
    views: 61,
    plagarism_score: 14,
    due_date: "2025-06-25T03:54:15.536Z",
    created_at: "2025-06-20T06:47:28.108Z",
    updated_at: "2025-06-20T06:47:28.108Z",
    __v: 0,
    createdAt: "2025-06-20T06:47:28.114Z",
    updatedAt: "2025-06-20T06:47:28.114Z",
  },
];

const navigationItems = [
  { icon: Home, label: "January", active: false },
  { icon: Users, label: "February", active: true },
  { icon: ShoppingBag, label: "March", active: false },
  { icon: BarChart3, label: "April", active: false },
  { icon: Settings, label: "May", active: false },
  { icon: Settings, label: "June", active: false },
  { icon: Settings, label: "July", active: false },
  { icon: Settings, label: "August", active: false },
  { icon: Settings, label: "September", active: false },
  { icon: Settings, label: "October", active: false },
  { icon: Settings, label: "November", active: false },
  { icon: Settings, label: "December", active: false },
];

// Generate years from 2020 to current year
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 2019 },
  (_, i) => currentYear - i
);

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [activeTab, setActiveTab] = useState(navigationItems[0].label);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const formData = {
          ...(selectedYear !== "all"
            ? {
                startDate: getDates()?.startDate || "",
                endDate: getDates()?.endDate || "",
              }
            : {}),
        };

        const res = await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/user/articles",
          formData,
          {
            headers: getAuthHeader(),
          }
        );
        const data = res.data;
        if (data.res) {
          setArticles(data.articles);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [selectedYear, activeTab]);

  const getDates = () => {
    // If year is not selected (or is "all"), fallback to current year
    const year = selectedYear === "all" ? currentYear : selectedYear;

    // Find index of activeTab (month name)
    const monthIndex = navigationItems.findIndex(
      (item) => item.label === activeTab
    );

    // If month not found, return entire year range
    if (monthIndex === -1) {
      return {
        startDate: new Date(`${year}-01-01T00:00:00.000Z`),
        endDate: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }

    // JS months are 0-indexed (0 = Jan, 11 = Dec)
    const startDate = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59));

    return { startDate, endDate };
  };

  const filteredCustomers = () => {
    let filtList = articles || [];

    return filtList?.filter((customer: any) => {
      const matchesSearch =
        customer.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.assigned_to_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customer.due_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.plagarism_score.toString().includes(searchTerm.toLowerCase());
      const matchesYear =
        selectedYear === "all" || customer.year === selectedYear;

      return matchesSearch && matchesYear;
    });
  };

  const slicedText = (text: string, maxLength: number = 20) => {
    if (!text) return "";

    if (text.length > maxLength) {
      return text.slice(0, maxLength) + " ...";
    }
    return text;
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Active":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case "Inactive":
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

 

  return (
    <div className="h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white  px-4 sm:px-6 py-4">
        <div className=" space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 
              absolute 
              self-start rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="text-xl sm:text-2xl text-center font-bold text-gray-900 ">
            Assigned by me Articles
          </h1>
        </div>
      </div>

      <div className="flex w-full justify-center">
        {/* Left Navigation Sidebar */}
        <div
          className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        >
          {/* Logo/Brand */}
          <div className="flex items-center justify-between lg:px-0 sm:px-6 md:py-4 lg:py-0  sm:border-b lg:border-0 border-gray-200">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 ml-auto rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-3 sm:px-4 py-4 lg:pt-0 sm:py-6 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === item.label
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-sm sm:text-base pl-3">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1  w-full flex flex-col overflow-hidden lg:ml-0">
          {/* Search Bar and Year Filter */}
          <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Year Selection */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(
                      e.target.value === "all"
                        ? "all"
                        : parseInt(e.target.value)
                    )
                  }
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
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
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto bg-white bg-red-500">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="px-4 py-2 space-y-3">
                {filteredCustomers().map((customer) => (
                  <div
                    onClick={() => {
                      router.push(`${PATHNAMES.VIEW_ARTICLES}/${customer._id}`);
                    }}
                    key={customer._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {slicedText(customer.topic, 100)}
                          </div>
                        </div>
                      </div>
                      <span className={getStatusBadge(customer.status)}>
                        {customer.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Student</span>
                        <div className="font-medium text-gray-900 mt-1">
                          {customer.assigned_to_name}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Sumitted on Time:</span>
                        <div className="font-medium text-gray-900">
                          {customer.submitted_on_time}
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-500">Plagarism score:</span>
                        <div className="font-medium text-gray-900">
                          {customer.plagarism_score}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Due date:</span>
                        <div className="font-medium text-gray-900">
                          {customer.due_date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/Tablet Table View */}
            <div className="hidden sm:block min-w-full flex-1 bg-red-500 w-full">
              <table className="min-w-full bg-red-500 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className=" px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year/Batch
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted on time
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plagarism score
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>

                    {/* <th className="relative px-4 lg:px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers()?.map((customer) => (
                    <tr
                      onClick={() => {
                        router.push(
                          `${PATHNAMES.VIEW_ARTICLES}/${customer._id}`
                        );
                      }}
                      key={customer._id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {slicedText(customer.topic)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {customer.assigned_to_name}
                      </td>
                      <td className=" px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.due_date}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.submitted_on_time}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.plagarism_score}
                      </td>
                      <td className=" px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Eye
                          className="opacity-50"
                          onClick={() => {
                            router.push(
                              `${PATHNAMES.VIEW_ARTICLES}/${customer._id}`
                            );
                          }}
                        />
                      </td>

                      {/* <td className="hidden lg:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.status}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer/Pagination */}
          <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                Showing {filteredCustomers()?.length} of {articles?.length}{" "}
                customers
                {selectedYear !== "all" && (
                  <span className="ml-1">for {selectedYear}</span>
                )}
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-200">
                  Prev
                </button>
                <button className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors duration-200">
                  1
                </button>
                <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-200">
                  2
                </button>
                <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-200">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
