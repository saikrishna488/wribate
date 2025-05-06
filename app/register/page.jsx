"use client"
import React, { useState, useEffect } from "react";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useSignupMutation,
  useCheckAvailableUserNameMutation,
} from "../services/authApi";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auth, googleProvider, facebookProvider, githubProvider, appleProvider, twitterProvider, yahooProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
// Import react-icons
import {FcGoogle} from 'react-icons/fc'
import { FaFacebook, FaGithub, FaXTwitter, FaYahoo, FaApple } from "react-icons/fa6";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    name: "",
    email: "",
    otp: "",
    password: "",
  });
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [signup, { isLoading: registering }] = useSignupMutation();
  const [checkAvailability, { isLoading: checking }] =
    useCheckAvailableUserNameMutation();

  const [userNameAvailable, setUserNameAvailable] = useState(null); // null, true, false
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [debouncedUserName, setDebouncedUserName] = useState("");
  const [user,setUser] = useAtom(userAtom)

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shimmerPosition, setShimmerPosition] = useState(-100);

  const carouselImages = [
    '/login/Slide1.PNG',
    '/login/Slide2.PNG',
    '/login/Slide3.PNG',
    '/login/Slide4.PNG',
  ];

  // Handle image carousel animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle title shimmer animation
  useEffect(() => {
    const animateShimmer = () => {
      setShimmerPosition((prevPos) => {
        if (prevPos > 100) {
          return -100;
        }
        return prevPos + 1;
      });
    };

    const interval = setInterval(animateShimmer, 15);
    return () => clearInterval(interval);
  }, []);

  // Fetch countries when component mounts
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {

      if (!formData?.email) {
        toast.error("Enter Email");
        return
      }

      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/sendOTP', {
        email: formData.email
      }, {
        withCredentials: true
      })

      const data = response.data

      if (data.res) {
        setOtpSent(true);
        toast.success("OTP sent successfully");
      } else {
        setOtpVerified(true)
        toast.error(data?.msg || "Error occurred while sending OTP");
      }
    } catch (err) {
      toast.error(err?.response?.message || "Error occurred while sending OTP");
    }
  };


  //verify otp
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {


      if (!formData?.email || !formData?.otp) {
        toast.error("Enter Email");
        return
      }


      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/verifyOTP', {
        email: formData?.email,
        otp: formData?.otp
      })

      const data = response.data;
      if (data?.res) {
        setOtpVerified(true);
        toast.success("OTP verified successfully");
      } else {
        toast.error(data?.msg || "OTP expired");
      }
    } catch (err) {
      toast.error(err?.response?.message || "Error occurred while verifying OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!otpVerified) {
      toast.error("Please Verify mail to continue")
    }

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/signUp', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        userName: formData.userName,
        country: formData.country,
        dob: formData.dob,
      }, {
        withCredentials: true
      });

      const data = response.data;

      if (data.res) {
        toast.success("Signup successful");
        router.push("/login");
      } else {
        toast.error(data?.msg || "Failed to Register");
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.message || "Error occurred while registering the user"
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.userName && formData.userName !== debouncedUserName) {
        setDebouncedUserName(formData.userName);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [formData.userName, debouncedUserName]);


  //providers
  const handleProviderLogin = async (provider) => {
    try {
      // Sign in with the selected provider
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Get the Firebase ID token
      const token = await user.getIdToken();  // This gives the Firebase ID token
  
      // Now, send the token to your backend using Axios
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+ '/firebase', {
        token: token, // Send the Firebase token in the request body
      },{
        withCredentials:true
      });
  
      if (response.data.res) {
        toast.success("Login Success");
        setUser(response.data.user)
        router.push('/')
      } else {
        toast.error(response.data.msg); // Show error message if any
      }
    } catch (error) {
      console.error("Error logging in with provider: ", error.message);
      toast.error("Login failed");
    }
  };

  useEffect(() => {
    const checkUserNameAvailability = async () => {
      if (debouncedUserName && debouncedUserName.length >= 3) {
        setCheckingUsername(true);
        try {
          const dataObject = {
            userName: debouncedUserName,
          };
          const response = await checkAvailability(dataObject).unwrap();
          setUserNameAvailable(response.status === 1);
        } catch (err) {
          setUserNameAvailable(false);
          console.error("Error checking username:", err);
        } finally {
          setCheckingUsername(false);
        }
      } else if (debouncedUserName && debouncedUserName.length < 3) {
        setUserNameAvailable(false);
      }
    };

    if (debouncedUserName) {
      checkUserNameAvailability();
    }
  }, [debouncedUserName, checkAvailability]);

  const renderUsernameStatus = () => {
    if (checkingUsername) {
      return (
        <span className="text-blue-500 text-xs mt-1 ml-2">
          Checking availability...
        </span>
      );
    } else if (formData.userName && formData.userName.length < 3) {
      return (
        <span className="text-red-500 text-xs mt-1 ml-2">
          Username must be at least 3 characters
        </span>
      );
    } else if (userNameAvailable === false) {
      return (
        <span className="text-red-500 text-xs mt-1 ml-2">
          Username is not available
        </span>
      );
    } else if (userNameAvailable === true) {
      return (
        <span className="text-green-500 text-xs mt-1 ml-2">
          Username is available ✓
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-y-auto bg-white">
      {/* Left Side - Quote and Logo */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-white">
        {carouselImages.map((src, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
          >
            <img
              src={src}
              alt={`Login background ${idx + 1}`}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          {/* <div className="text-white text-2xl md:text-4xl font-bold p-8">
                        Welcome to Wribate
                        <p className="text-lg md:text-xl mt-4 font-normal text-gray-300">Your digital writing companion</p>
                    </div> */}
        </div>
      </div>

      {/* Right Side - Sign-up Form */}
      <div className="w-full md:w-1/2 min-h-screen py-4 px-8 bg-gray-100 overflow-y-auto">
        <div className="flex justify-between flex-col items-center p-4">
          <div className="mb-6 flex flex-row justify-center items-center md:mb-8">
            <div className=" h-20">
              <img src="/logo/logo.png" className="h-full w-full object-cover" alt="" />
            </div>
          </div>

        </div>

        <div className="bg-white border shadow-md p-6">
          <h2 className="text-2xl text-center text-gray-600 font-medium mb-6">
            Create Your Account
          </h2>

          {/* Social Login Icons */}
          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => handleProviderLogin(googleProvider)} 
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FcGoogle className="text-xl text-red-500" />
            </button>
            <button 
              onClick={() => handleProviderLogin(facebookProvider)} 
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaFacebook className="text-xl text-blue-600" />
            </button>
            <button 
              onClick={() => handleProviderLogin(twitterProvider)} 
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaXTwitter className="text-xl text-blue-400" />
            </button>
            <button 
              onClick={() => handleProviderLogin(githubProvider)} 
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaGithub className="text-xl" />
            </button>
            <button
              onClick={() => handleProviderLogin(yahooProvider)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaYahoo className="text-xl text-purple-600" />
            </button>
            <button
              onClick={() => handleProviderLogin(appleProvider)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaApple className="text-xl" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-gray-300 flex-grow"></div>
            <span className="text-gray-500 text-sm">
              Or continue with email address
            </span>
            <div className="h-px bg-gray-300 flex-grow"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <div className="bg-gray-100 rounded-lg flex items-center px-4 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-900"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="bg-transparent border-none w-full ml-3 focus:outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="mb-4">
              <div
                className={`bg-gray-100 rounded-lg flex items-center px-4 py-3 ${userNameAvailable === false && formData.userName.length >= 3
                  ? "border border-red-500"
                  : userNameAvailable === true
                    ? "border border-green-500"
                    : ""
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${userNameAvailable === false && formData.userName.length >= 3
                    ? "text-red-500"
                    : userNameAvailable === true
                      ? "text-green-500"
                      : "text-purple-900"
                    }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="User Name"
                  className="bg-transparent border-none w-full ml-3 focus:outline-none text-gray-700"
                  required
                />
                {checkingUsername && (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-blue-500"></div>
                )}
                {formData.userName && userNameAvailable === true && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              {renderUsernameStatus()}
            </div>

            {/* Email and OTP */}
            <div className="mb-4 flex gap-2">
              <div className="bg-gray-100 rounded-lg flex items-center px-4 py-3 flex-grow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-900"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="bg-transparent border-none w-full ml-3 focus:outline-none text-gray-700"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="whitespace-nowrap text-purple-900 font-medium px-3 hover:bg-gray-100 rounded-lg transition"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>

            {/* OTP Verification */}
            <div className="mb-4 flex gap-2">
              <div className="bg-gray-100 rounded-lg flex items-center px-4 py-3 flex-grow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-900"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Please enter OTP"
                  className="bg-transparent border-none w-full ml-3 focus:outline-none text-gray-700"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={verifying || !otpSent}
                className={`whitespace-nowrap font-medium px-3 rounded-lg transition ${otpVerified
                  ? "text-green-600 hover:bg-green-50"
                  : "text-purple-900 hover:bg-gray-100"
                  }`}
              >
                {verifying
                  ? "Verifying..."
                  : otpVerified
                    ? "Verified ✓"
                    : "Verify OTP"}
              </button>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="bg-gray-100 rounded-lg flex items-center px-4 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-900"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="bg-transparent border-none w-full ml-3 focus:outline-none text-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full text-white py-4 rounded-lg font-medium transition bg-blue-900 hover:bg-purple-600`}
            >
              {registering ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="text-gray-500 w-full text-center py-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;