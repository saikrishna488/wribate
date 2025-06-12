import React, { useState, useEffect } from "react";

const ArticleDetailsModal = ({
  open,
  onClose,
  selectedArticle,
}) => {


  // Dummy article data
  const article = {
    title: "The Future of Renewable Energy",
    topic: "Sustainable Technology",
    student: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/100?img=32",
    },
    year: "2024",
    dueDate: "2025-06-15",
    submittedOnTime: false,
    plagiarismScore: 45,
    articleImage: "https://source.unsplash.com/800x400/?solar,energy",
  };

  // Open modal after mount (for demo)
  useEffect(() => {
    // const timeout = setTimeout(() => onClose(), 300);
    // return () => clearTimeout(timeout);
  }, []);

  const closeModal = () => onClose();
  const handleSave = () => {
    alert("Saved!");
    onClose()
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 relative scale-95  animate-fadeInUp">
            {/* Header */}

            <div className="mb-4">
              <h2 className="text-2xl font-semibold">{article.title}</h2>
              <p className="text-sm text-gray-500">{article.topic}</p>
            </div>

            {/* Student Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={article.student.avatar}
                alt={article.student.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {article.student.name}
                </p>
                <p className="text-sm text-gray-500">{article.year} Batch</p>
              </div>
            </div>

            {/* Article Image */}
            {article.articleImage && (
              <div className="mb-4">
                <img
                  src={article.articleImage}
                  alt="Article"
                  className="w-full max-h-64 object-cover rounded"
                />
              </div>
            )}

            {/* Details Section */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-500 text-sm">Due Date</p>
                <p className="font-medium">{article.dueDate}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Submitted On Time</p>
                <p
                  className={`font-medium ${
                    article.submittedOnTime ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {article.submittedOnTime ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Plagiarism Score */}
            <div className="mb-6">
              <p className="text-gray-500 text-sm mb-1">Plagiarism Score</p>
              <div className="w-full bg-gray-200 rounded-full h-4 relative">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${article.plagiarismScore}%` }}
                ></div>
                <span className="absolute right-2 top-[-2px] text-xs font-semibold text-gray-700">
                  {article.plagiarismScore}%
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleDetailsModal;
