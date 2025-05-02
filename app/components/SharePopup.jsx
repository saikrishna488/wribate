import React, { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaReddit,
  FaLinkedin,
  FaTimes,
} from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";

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

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(formatShareText() + " " + productUrl);

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `whatsapp://send?text=${text}`;
    } else {
      window.open(`https://web.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(formatShareText());
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
        productUrl
      )}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        productUrl
      )}`,
      "_blank"
    );
  };

  const shareToReddit = () => {
    const title = encodeURIComponent(
      product?.title || "Check out this product"
    );
    window.open(
      `https://www.reddit.com/submit?url=${encodeURIComponent(
        productUrl
      )}&title=${title}`,
      "_blank"
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        productUrl
      )}`,
      "_blank"
    );
  };

  // For saving recently used Instagram contacts
  const [recentInstagramUsers, setRecentInstagramUsers] = useState(() => {
    const saved = localStorage.getItem("recentInstagramUsers");
    return saved ? JSON.parse(saved) : [];
  });

  const [newInstagramUsername, setNewInstagramUsername] = useState("");

  const addInstagramUser = (e) => {
    e.preventDefault();
    if (newInstagramUsername.trim()) {
      const newUsers = [
        ...recentInstagramUsers.filter(
          (user) => user !== newInstagramUsername.trim()
        ),
        newInstagramUsername.trim(),
      ].slice(-5); // Keep only the 5 most recent

      setRecentInstagramUsers(newUsers);
      localStorage.setItem("recentInstagramUsers", JSON.stringify(newUsers));
      setNewInstagramUsername("");

      // Open DM for this user
      openInstagramDM(newInstagramUsername.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Share this content</h2>

        {/* URL Copy Section */}
        <div className="flex mb-6">
          <input
            type="text"
            value={productUrl}
            readOnly
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Main Social Media Sharing Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button
            onClick={shareToWhatsApp}
            className="flex flex-col items-center justify-center p-3 bg-green-100 rounded-lg hover:bg-green-200"
          >
            <FaWhatsapp size={28} className="text-green-600 mb-1" />
            <span className="text-xs">WhatsApp</span>
          </button>

          {/* <button
            onClick={() => setShowInstagramOptions(!showInstagramOptions)}
            className="flex flex-col items-center justify-center p-3 bg-pink-100 rounded-lg hover:bg-pink-200"
          >
            <FaInstagram size={28} className="text-pink-600 mb-1" />
            <span className="text-xs">Instagram</span>
          </button> */}

          <button
            onClick={shareToTwitter}
            className="flex flex-col items-center justify-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200"
          >
            <FaTwitter size={28} className="text-blue-500 mb-1" />
            <span className="text-xs">Twitter</span>
          </button>

          <button
            onClick={shareToFacebook}
            className="flex flex-col items-center justify-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200"
          >
            <FaFacebook size={28} className="text-blue-800 mb-1" />
            <span className="text-xs">Facebook</span>
          </button>

          <button
            onClick={shareToReddit}
            className="flex flex-col items-center justify-center p-3 bg-orange-100 rounded-lg hover:bg-orange-200"
          >
            <FaReddit size={28} className="text-orange-600 mb-1" />
            <span className="text-xs">Reddit</span>
          </button>

          <button
            onClick={shareToLinkedIn}
            className="flex flex-col items-center justify-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200"
          >
            <FaLinkedin size={28} className="text-blue-700 mb-1" />
            <span className="text-xs">LinkedIn</span>
          </button>
        </div>

        {/* Instagram Direct Messaging Options */}
      </div>
    </div>
  );
};

export default SharePopup;
