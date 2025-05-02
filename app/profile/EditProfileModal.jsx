import React, { useState, useEffect } from "react";
import {
  useUpdateProfileMutation,
  useUploadImageMutation,
} from "../services/authApi";
import { formatToYMD } from "../utils/dateFormat";
import { setCredentials } from "../features/authSlice";
import { useDispatch } from "react-redux";

const EditProfileModal = ({ isOpen, onClose, userInfo }) => {
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    country: "",
    dob: "",
  });

  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Initialize profile form with user data
  useEffect(() => {
    if (userInfo) {
      setProfileForm({
        name: userInfo.name || "",
        email: userInfo.email || "",
        country: userInfo.country || "",
        dob: userInfo.dob ? formatToYMD(userInfo.dob) : "",
      });

      // Reset image preview when modal is opened
      setProfileImagePreview(userInfo?.profilePhoto || "/user.png");
      setProfileImage(null);
    }
  }, [userInfo, isOpen]);

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
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData to handle file upload
      // const formData = new FormData();
      // formData.append("name", profileForm.name);
      // formData.append("email", profileForm.email);
      // formData.append("country", profileForm.country);
      // formData.append("dob", profileForm.dob);

      // if (profileImage) {
      //   formData.append("profileImage", profileImage);
      // }

      // const response = await updateProfile(formData).unwrap();

      const updatedProfile = { ...profileForm };
      if (profileImage) {
        console.log(profileImage);
        const imageData = new FormData();
        imageData.append("image", profileImage);
        const imageResponse = await uploadImage({
          type: "wribte",
          data: imageData,
        });

        console.log(imageResponse);

        if (imageResponse.data.status == 1) {
          updatedProfile.profilePhoto = imageResponse?.data?.cloudinaryUrl;
          //wribateData.coverImage = imageResponse?.data?.cloudinaryUrl;
        } else {
          //wribateData.coverImage = "mobilescreen.jpeg";
          //return;
        }
      }

      const response = await updateProfile({
        id: userInfo._id,
        updatedProfile,
      }).unwrap();
      if (response?.status == 1) {
        console.log(response);

        const updatedUser = {
          ...userInfo,
          name: response?.user?.name,
          email: response?.user?.email,
          profilePhoto: response?.user?.profilePhoto,
          dob: response?.user?.dob,
          country: response?.user?.country,
        };
        dispatch(setCredentials(updatedUser));

        console.log(response);

        Swal.fire({
          title: "Success!",
          text: "Your profile has been updated",
          icon: "success",
          confirmButtonText: "OK",
        });

        onClose();
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update profile",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating profile:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] my-8">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-64px)]">
          <form onSubmit={handleProfileSubmit} className="p-6">
            {/* Profile Image Upload */}
            {/* Profile Image Upload */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2">
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <label
                  htmlFor="profile-image"
                  style={{ zIndex: "100" }}
                  className="absolute -bottom-2 -right-2  bg-white rounded-full p-1 shadow-md cursor-pointer transform -translate-x-2 -translate-y-2 border border-gray-200"
                >
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
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
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="country"
              >
                Country
              </label>
              <div className="relative">
                {loading ? (
                  <div className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-500">
                    Loading countries...
                  </div>
                ) : (
                  <select
                    id="country"
                    name="country"
                    value={profileForm.country}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                )}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="dob"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={profileForm.dob}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
