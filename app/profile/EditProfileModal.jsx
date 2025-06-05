import React, { useState, useEffect } from "react";
import axios from "axios";
import formatToYMD from "../utils/dateFormat";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import toast from "react-hot-toast";
import authHeader from "../utils/authHeader";
import Compressor from 'compressorjs';
import { FaTimes, FaCamera, FaChevronDown } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";

const EditProfileModal = ({ isOpen, onClose, onProfileUpdate }) => {
  const [user, setUser] = useAtom(userAtom);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [profileForm, setProfileForm] = useState({
    image: "",
    name: "",
    username: "",
    email: "",
    country: "",
    dob: "",
    bio: "",
    institution: "",
    institution_email: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Email verification states
  const [emailChanged, setEmailChanged] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  // Institution email verification states
  const [institutionEmailChanged, setInstitutionEmailChanged] = useState(false);
  const [institutionOtpSent, setInstitutionOtpSent] = useState(false);
  const [institutionOtp, setInstitutionOtp] = useState("");
  const [institutionEmailVerified, setInstitutionEmailVerified] = useState(false);

  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        id: user?._id,
        image: user.profilePhoto || "",
        name: user.name || "",
        username: user.userName || "",
        email: user.email || "",
        country: user.country || "",
        institution: user.institution || "",
        institution_email: user.institution_email || "",
        dob: user.dob || "",
        bio: user.bio || "", // Include the bio field
      });

      // Reset image preview when modal is opened
      setProfileImagePreview(user?.profilePhoto || "/user.png");
      setProfileImage(null);

      // Reset email verification states
      setEmailChanged(false);
      setOtpSent(false);
      setOtp("");
      setEmailVerified(user?.emailVerified || false);

      // Reset institution email verification states
      setInstitutionEmailChanged(false);
      setInstitutionOtpSent(false);
      setInstitutionOtp("");
      setInstitutionEmailVerified(user?.institutionEmailVerified || false);
    }
  }, [user, isOpen]);

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        // Sort countries alphabetically by name
        const sortedCountries = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle profile form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    // Check if email was changed
    if (name === "email" && value !== user.email) {
      setEmailChanged(true);
      setEmailVerified(false);
    } else if (name === "email" && value === user.email) {
      setEmailChanged(false);
      setEmailVerified(user?.emailVerified || false);
    }

    // Check if institution email was changed
    if (name === "institution_email" && value !== user.institution_email) {
      setInstitutionEmailChanged(true);
      setInstitutionEmailVerified(false);
    } else if (name === "institution_email" && value === user.institution_email) {
      setInstitutionEmailChanged(false);
      setInstitutionEmailVerified(user?.institutionEmailVerified || false);
    }

    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6, // Adjust quality (0 to 1)
        maxWidth: 800, // Optional: limit width
        maxHeight: 800, // Optional: limit height
        success(compressedFile) {
          setProfileImage(compressedFile);
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfileForm({ ...profileForm, image: reader.result });
            setProfileImagePreview(reader.result);
          };
          reader.readAsDataURL(compressedFile);
        },
        error(err) {
          console.error('Image compression error:', err);
          toast.error('Failed to compress image');
        },
      });
    }
  };

  // Handle OTP request
  const handleRequestOtp = async () => {
    setIsRequestingOtp(true);
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/user/sendOTP", {
        email: profileForm.email
      });

      const data = response.data;

      if (data.res) {
        setOtpSent(true);
        toast.success("OTP sent!")
      }
      else {
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error("error occured")
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setIsVerifyingEmail(true);
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/user/verifyOTP", {
        email: profileForm.email,
        otp: otp
      });

      const data = response.data;

      if (data.res) {
        setEmailVerified(true);
        toast.success("Verified");
      }
      else {
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error("Error Occured")
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Handle Institution Email OTP request
  const handleRequestInstitutionOtp = async () => {
    setIsRequestingOtp(true);
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/user/sendOTP", {
        email: profileForm.institution_email
      });

      const data = response.data;

      if (data.res) {
        setInstitutionOtpSent(true);
        toast.success("OTP sent to institution email!")
      }
      else {
        setInstitutionEmailVerified(true)
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error("error occured")
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Handle Institution Email OTP verification
  const handleVerifyInsftitutionOtp = async () => {
    setIsVerifyingEmail(true);
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/user/verifyOTP", {
        email: profileForm.institution_email,
        otp: institutionOtp
      });

      const data = response.data;

      if (data.res) {
        setInstitutionEmailVerified(true);
        toast.success("Institution email verified!");
      }
      else {
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error("Error Occured")
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle Institution OTP input change
  const handleInstitutionOtpChange = (e) => {
    setInstitutionOtp(e.target.value);
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/api/user/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data?.cloudinaryUrl || null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if email changed but not verified
    if (emailChanged && !emailVerified) {
      toast.error("Verify Email to continue")
      return;
    }

    // Prevent submission if institution email changed but not verified
    if (institutionEmailChanged && !institutionEmailVerified) {
      toast.error("Verify Institution Email to continue")
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const updatedProfile = { ...profileForm };

      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/updateprofile', updatedProfile, {
        headers: authHeader()
      })

      const data = res.data;
      console.log(data)
      if (data.res) {
        toast.success("Updated!")
        setUser(data.user);
        onClose();
      }
      else {
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error("Client Error")
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-0 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 p-5 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-72px)]">
          <form onSubmit={handleProfileSubmit} className="p-6">
            {/* Profile Image Upload */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="h-32 w-32 border-4 rounded-full border-blue-900 overflow-hidden">
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-blue-900 p-2 cursor-pointer text-white"
                >
                  <FaCamera className="w-5 h-5" />
                </label>
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wide"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full p-3 border-2 border-gray-300 focus:border-blue-900 focus:outline-none"
                  required
                />
              </div>

              {/* Username Field */}
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wide"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  className="w-full p-3 border-2 border-gray-300 focus:border-blue-900 focus:outline-none"
                  required
                />
              </div>

              {/* Bio Field */}
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wide"
                  htmlFor="bio"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows="4"
                  placeholder="Write a short bio about yourself..."
                  className="w-full p-3 border-2 border-gray-300 focus:border-blue-900 focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Share a little about yourself. Max 250 characters.
                </p>
              </div>

              {/* Email Field with Verification */}
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wide"
                  htmlFor="email"
                >
                  Email Address {emailVerified && <span className="text-green-600 text-xs ml-2">✓ Verified</span>}
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className={`w-full p-3 border-2 ${emailChanged && !emailVerified
                      ? "border-yellow-500"
                      : emailVerified
                        ? "border-green-500"
                        : "border-gray-300"
                      } focus:border-blue-900 focus:outline-none`}
                    required
                  />
                  {emailChanged && !emailVerified && (
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={isRequestingOtp}
                      className="px-3 py-1 bg-blue-900 text-white font-bold whitespace-nowrap"
                    >
                      {isRequestingOtp ? "Sending..." : "Get OTP"}
                    </button>
                  )}
                </div>

                {/* OTP Verification Section */}
                {emailChanged && otpSent && !emailVerified && (
                  <div className="mt-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter OTP sent to your email"
                        value={otp}
                        onChange={handleOtpChange}
                        className="w-full p-3 border-2 border-gray-300 focus:border-blue-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingEmail || !otp.trim()}
                        className="px-3 py-1 bg-blue-900 text-white font-bold whitespace-nowrap"
                      >
                        {isVerifyingEmail ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Enter the verification code sent to your email address to confirm your email.
                    </p>
                  </div>
                )}
              </div>

              {/* Institution Field - Disabled */}
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wide"
                  htmlFor="institution"
                >
                  Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={profileForm.institution}
                  className="w-full p-3 border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                  disabled
                  placeholder="Institution cannot be changed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Institution information is managed by your administrator and cannot be modified.
                </p>
              </div>

              {/* Institution Email Field */}
              {
                (user.userRole != 'user') && (
                  <div>
                    <label
                      className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wide"
                      htmlFor="institution_email"
                    >
                      Institution Email {institutionEmailVerified && <span className="text-green-600 text-xs ml-2">✓ Verified</span>}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        id="institution_email"
                        name="institution_email"
                        value={profileForm.institution_email}
                        onChange={handleProfileChange}
                        className={`w-full p-3 border-2 ${institutionEmailChanged && !institutionEmailVerified
                          ? "border-yellow-500"
                          : institutionEmailVerified
                            ? "border-green-500"
                            : "border-gray-300"
                          } focus:border-blue-900 focus:outline-none`}
                        placeholder="Enter your institution email address"
                      />
                      {institutionEmailChanged && !institutionEmailVerified && (
                        <button
                          type="button"
                          onClick={handleRequestInstitutionOtp}
                          disabled={isRequestingOtp}
                          className="px-3 py-1 bg-blue-900 text-white font-bold whitespace-nowrap"
                        >
                          {isRequestingOtp ? "Sending..." : "Get OTP"}
                        </button>
                      )}
                    </div>

                    {/* Institution Email OTP Verification Section */}
                    {institutionEmailChanged && institutionOtpSent && !institutionEmailVerified && (
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter OTP sent to your institution email"
                            value={institutionOtp}
                            onChange={handleInstitutionOtpChange}
                            className="w-full p-3 border-2 border-gray-300 focus:border-blue-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyInsftitutionOtp}
                            disabled={isVerifyingEmail || !institutionOtp.trim()}
                            className="px-3 py-1 bg-blue-900 text-white font-bold whitespace-nowrap"
                          >
                            {isVerifyingEmail ? "Verifying..." : "Verify"}
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Enter the verification code sent to your institution email address to confirm your email.
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      Your official institution email address.
                    </p>
                  </div>
                )
              }

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wide"
                  htmlFor="country"
                >
                  Country
                </label>
                <div className="relative">
                  {loading ? (
                    <div className="w-full p-3 border-2 border-gray-300 bg-gray-50 text-gray-500">
                      Loading countries...
                    </div>
                  ) : (
                    <select
                      id="country"
                      name="country"
                      value={profileForm.country}
                      onChange={handleProfileChange}
                      className="w-full p-3 border-2 border-gray-300 focus:border-blue-900 focus:outline-none appearance-none"
                    >
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <FaChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wide"
                  htmlFor="dob"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={profileForm.dob ? profileForm.dob.slice(0, 10) : ""}
                  onChange={handleProfileChange}
                  className="w-full p-3 border-2 border-gray-300 focus:border-blue-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-5 border-t-2 border-gray-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-900 text-white font-bold shadow-md hover:bg-blue-800 transition-colors"
                disabled={isUpdatingProfile || (emailChanged && !emailVerified) || (institutionEmailChanged && !institutionEmailVerified)}
              >
                {isUpdatingProfile ? (
                  <div className="flex items-center">
                    <AiOutlineLoading className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    SAVING...
                  </div>
                ) : (
                  "SAVE CHANGES"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;