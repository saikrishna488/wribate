"use client"
import React, { useState } from 'react';

const TermsAndConditions = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      content: "By accessing and using Wribate.com (the \"Platform\"), you agree to abide by these Terms & Conditions. If you do not agree, please do not use the Platform."
    },
    {
      id: 2,
      title: "User Responsibility for Content",
      content: [
        "Users are solely responsible for any content (including Wribates, articles, comments, and multimedia) they post.",
        "All content must comply with applicable local, national, and international laws.",
        "Users must ensure that their content does not violate copyrights, trademarks, privacy rights, or any other legal protections.",
        "Hate speech, defamation, harassment, explicit content, and illegal activities are strictly prohibited.",
        "Users must verify the accuracy of their content before publishing to avoid spreading false or misleading information."
      ]
    },
    {
      id: 3,
      title: "Compliance with Local Regulations",
      content: [
        "Users must comply with the laws and regulations of their respective jurisdictions while using the Platform.",
        "If any content violates legal or regulatory requirements, the Platform reserves the right to remove the content and suspend or terminate the user's account without prior notice."
      ]
    },
    {
      id: 4,
      title: "Licensing Agreement & Content Usage",
      content: [
        "By submitting content on the Platform, users grant Wribate.com and InnoRize EPL a non-exclusive, worldwide, perpetual, royalty-free license to publish, distribute, reproduce, monetize, and promote the content across its website, social media channels, and other platforms.",
        "Users waive any claims that Wribate.com and InnoRize EPL misused their content in any way.",
        "Users acknowledge that Wribate.com and InnoRize EPL have full discretion to modify, share, or monetize user-generated content (UGC) without requiring additional permission."
      ]
    },
    {
      id: 5,
      title: "Privacy Policy & Data Protection",
      content: [
        "Users accept and agree to Wribate.com's legally-compliant Privacy Policy, which governs how personal data is collected, stored, and used.",
        "The Platform does not sell personal user data to third parties and ensures compliance with data protection laws (e.g., GDPR, CCPA)."
      ]
    },
    {
      id: 6,
      title: "Indemnification & Liability",
      content: [
        "Users agree to indemnify, defend, and hold harmless Wribate.com, its affiliates, officers, employees, and partners from any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from:",
        "Content posted by the user that violates laws or third-party rights.",
        "Misuse of the Platform or violation of these Terms & Conditions.",
        "Any dispute or legal action involving content uploaded by the user.",
        "Users will be held legally liable for any defamatory, false, or illegal content they create and publish on the Platform."
      ],
      isImportant: true
    },
    {
      id: 7,
      title: "Moderation & Content Removal",
      content: "Wribate.com reserves the right to review, modify, or remove any content that violates these Terms & Conditions. The Platform may use automated tools or manual review to ensure compliance with community guidelines. Users may report any content that they believe violates the terms for further review."
    },
    {
      id: 8,
      title: "Intellectual Property Rights",
      content: "Users retain ownership of the content they post but grant Wribate.com a non-exclusive, worldwide, royalty-free license to display, distribute, and promote the content within the Platform. Users must not plagiarize or republish copyrighted content without proper authorization."
    },
    {
      id: 9,
      title: "Account Termination & Suspension",
      content: "Violation of these Terms & Conditions may result in temporary or permanent suspension of user accounts. Wribate.com reserves the right to restrict access to any user who repeatedly violates the guidelines."
    },
    {
      id: 10,
      title: "Liability Disclaimer",
      content: "Wribate.com is a platform for user-generated content and does not endorse, verify, or assume liability for any user-submitted content. Users agree to use the Platform at their own risk and acknowledge that Wribate.com is not responsible for any direct, indirect, incidental, or consequential damages arising from content posted on the site.",
      isImportant: true
    },
    {
      id: 11,
      title: "Changes to Terms & Conditions",
      content: "Wribate.com and InnoRize EPL may update these Terms & Conditions at any time. Continued use of the Platform constitutes acceptance of any modifications."
    },
    {
      id: 12,
      title: "Contact Information",
      content: "For any questions or concerns regarding these Terms & Conditions, please contact us at support@wribate.com."
    }
  ];

 const lastUpdated = "May 10, 2025";

  return (
    <div id="terms" className="w-full max-w-4xl mx-auto bg-white border border-gray-200 shadow-md">
      <div className="p-6">
        {/* Header with Last Updated */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-blue-900">Terms & Conditions</h2>
          <div className="text-sm bg-blue-50 px-3 py-1 border-l-4 border-blue-900 text-blue-900">
            Last Updated: <span className="font-semibold">{lastUpdated}</span>
          </div>
        </div>
        
        {/* Introduction Banner */}
        <div className="bg-blue-50 p-4 border-l-4 border-blue-900 mb-8">
          <p className="text-gray-800">
            Welcome to Wribate.com. These Terms & Conditions govern your use of our platform. 
            By accessing or using our services, you agree to be bound by these terms. Please read them carefully.
          </p>
        </div>
        
        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-blue-900 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-900 text-white mr-3 text-sm">
                    {section.id}
                  </span>
                  {section.title}
                </h3>
              </div>
              
              <div className={`text-gray-700 pl-11 ${section.isImportant ? 'bg-red-50 p-4 border-l-4 border-red-500' : ''}`}>
                {Array.isArray(section.content) ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{section.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Contact Information */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Contact Information</h3>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about these Terms & Conditions, 
            you may contact us at:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-blue-900">Email:</p>
              <p className="text-gray-700">
                <a href="mailto:info@wribate.com" className="text-blue-600 hover:underline">info@wribate.com</a>
              </p>
            </div>
            
            <div>
              <p className="font-semibold text-blue-900">Address:</p>
              <address className="not-italic text-gray-700">
                C/o INNORIZE ENTERPRISES PRIVATE LIMITED<br />
                D.No.17-1-389/18-B, 4th Floor,<br />
                Prashanth Nagar Colony, Saidabad,<br />
                Hyderabad, Telangana, India-500059.
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;