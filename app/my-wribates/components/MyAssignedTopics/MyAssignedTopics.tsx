import React, { useState } from "react";
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
  ChevronDown,
} from "lucide-react";

import ArticleDetailsModal from "../MyAssignedTopics/ArticleDetailsModal";
import EditArticle from "./CreateEditArticle";
import CreateEditArticle from "./CreateEditArticle";
import ArticleContent from "./ArticleContent";

interface Customer {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive" | "Pending";
  location: string;
  orders: number;
  spent: string;
  lastSeen: string;
  avatar: string;
  year: number;
}

const customers: Customer[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@company.com",
    status: "Active",
    location: "New York, USA",
    orders: 12,
    spent: "$2,456",
    lastSeen: "2 hours ago",
    avatar: "🧑‍💼",
    year: 2024,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    status: "Active",
    location: "London, UK",
    orders: 8,
    spent: "$1,890",
    lastSeen: "1 day ago",
    avatar: "👩‍💼",
    year: 2024,
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike@startup.io",
    status: "Pending",
    location: "San Francisco, USA",
    orders: 5,
    spent: "$945",
    lastSeen: "3 days ago",
    avatar: "👨‍💻",
    year: 2023,
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@design.co",
    status: "Active",
    location: "Toronto, Canada",
    orders: 15,
    spent: "$3,210",
    lastSeen: "5 hours ago",
    avatar: "👩‍🎨",
    year: 2024,
  },
  {
    id: 5,
    name: "James Brown",
    email: "james@tech.com",
    status: "Inactive",
    location: "Sydney, Australia",
    orders: 3,
    spent: "$567",
    lastSeen: "1 week ago",
    avatar: "👨‍🔬",
    year: 2023,
  },
  {
    id: 6,
    name: "Lisa Martinez",
    email: "lisa@marketing.pro",
    status: "Active",
    location: "Barcelona, Spain",
    orders: 9,
    spent: "$1,678",
    lastSeen: "1 hour ago",
    avatar: "👩‍💼",
    year: 2024,
  },
  {
    id: 7,
    name: "David Kim",
    email: "david@ecommerce.shop",
    status: "Pending",
    location: "Seoul, South Korea",
    orders: 7,
    spent: "$1,234",
    lastSeen: "2 days ago",
    avatar: "👨‍💼",
    year: 2023,
  },
  {
    id: 8,
    name: "Anna Rodriguez",
    email: "anna@consulting.biz",
    status: "Active",
    location: "Mexico City, Mexico",
    orders: 11,
    spent: "$2,089",
    lastSeen: "4 hours ago",
    avatar: "👩‍⚕️",
    year: 2024,
  },
];

const navigationItems = [
  { icon: Home, label: "January", active: false },
  { icon: Users, label: "February", active: true },
  { icon: ShoppingBag, label: "March", active: false },
  { icon: BarChart3, label: "April", active: false },
  { icon: Settings, label: "May", active: false },
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
  const [activeTab, setActiveTab] = useState("Customers");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState({});

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear =
      selectedYear === "all" || customer.year === selectedYear;
    return matchesSearch && matchesYear;
  });

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

    {/* <CreateEditArticle/> */}
    <ArticleContent/>

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
            Articles
          </h1>
        </div>
      </div>

      <div className="flex bg-red-500">
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
                  item.active || activeTab === item.label
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
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
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
          <div className="flex-1 overflow-auto bg-white">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="px-4 py-2 space-y-3">
                {filteredCustomers.map((customer) => (
                  <div
                    onClick={() => {
                      setSelectedArticle(customer);
                    }}
                    key={customer.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                          {customer.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                      <span className={getStatusBadge(customer.status)}>
                        {customer.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <div className="font-medium text-gray-900">
                          {customer.location}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Orders:</span>
                        <div className="font-medium text-gray-900">
                          {customer.orders}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Spent:</span>
                        <div className="font-medium text-gray-900">
                          {customer.spent}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Year:</span>
                        <div className="font-medium text-gray-900">
                          {customer.year}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/Tablet Table View */}
            <div className="hidden sm:block min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden md:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Spent
                    </th>
                    <th className="hidden lg:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="hidden lg:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Seen
                    </th>
                    <th className="relative px-4 lg:px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr
                      onClick={() => {
                        setSelectedArticle(customer);
                      }}
                      key={customer.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0">
                            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm lg:text-lg">
                              {customer.avatar}
                            </div>
                          </div>
                          <div className="ml-3 lg:ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(customer.status)}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.location}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.orders}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.spent}
                      </td>
                      <td className="hidden lg:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.year}
                      </td>
                      <td className="hidden lg:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.lastSeen}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <MoreHorizontal className="h-4 w-4 lg:h-5 lg:w-5" />
                        </button>
                      </td>
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
                Showing {filteredCustomers.length} of {customers.length}{" "}
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

      {/* {selectedArticle && (
        <ArticleDetailsModal
          open={selectedArticle ? true : false}
          onClose={() => {
            setSelectedArticle(null);
          }}
          selectedArticle={selectedArticle}
        />
      )} */}

      {/* <EditArticle
        open={selectedArticle ? true : false}
        onClose={() => {
          setSelectedArticle(null);
        }}
      /> */}
    </div>
  );
}

export default App;
