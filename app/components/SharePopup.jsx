import React, { useState, useEffect } from "react";
import {
  FaCopy,
  FaTimes,
  FaShareAlt,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const SharePopup = ({ onClose, product }) => {
  const [productUrl, setProductUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get the current URL
    setProductUrl(window.location.href);

    // Update Open Graph tags
    updateOgTags();
  }, [product]);

  const updateOgTags = () => {
    const updateMetaTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    if (product) {
      updateMetaTag("og:title", product.title);
      updateMetaTag("og:image", product.image);
      updateMetaTag("og:url", window.location.href);
      updateMetaTag(
        "og:description",
        product.description ||
          `Check out this ${product.category} from ${product.institution}`
      );
      updateMetaTag("og:type", "article");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatShareText = () => {
    return `Check out this ${product?.category}: ${product?.title} from ${product?.institution}`;
  };

  const socialShareActions = [
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "text-blue-500",
      action: () => {
        const text = encodeURIComponent(formatShareText());
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
            productUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "text-blue-600",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            productUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "text-blue-700",
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            productUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "text-pink-500",
      action: () => {
        // Instagram direct sharing is limited, so this could open the website
        window.open(`https://www.instagram.com/`, "_blank");
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <div className="bg-gray-50 p-6 pb-0 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaShareAlt className="mr-3 text-gray-600" size={24} />
            Share this content
          </h2>
        </div>

        {/* URL Copy Section */}
        <div className="p-6 pb-0">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              value={productUrl}
              readOnly
              className="flex-grow px-3 py-2 text-sm text-gray-700 focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 transition-colors flex items-center"
            >
              {copied ? (
                <span className="text-green-600 text-sm">Copied!</span>
              ) : (
                <FaCopy size={18} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="p-6 pt-4 grid grid-cols-4 gap-4">
          {socialShareActions.map((platform) => (
            <button
              key={platform.name}
              onClick={platform.action}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 group transition-colors"
            >
              <platform.icon 
                size={28} 
                className={`${platform.color} group-hover:scale-110 transition-transform mb-2`} 
              />
              <span className="text-xs text-gray-700">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharePopup;