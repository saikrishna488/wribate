"use client"
import React, { useState, useEffect } from "react";
import { useLoginMutation } from "../services/authApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import axios from "axios";
import { auth, googleProvider, facebookProvider, githubProvider, appleProvider, twitterProvider, yahooProvider } from "../firebase";
import { signInWithPopup, TwitterAuthProvider } from "firebase/auth";
// Import icons from react-icons
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter, FaFacebook, FaYahoo, FaApple, FaGithub } from "react-icons/fa6";
import httpRequest from "../utils/httpRequest";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shimmerPosition, setShimmerPosition] = useState(-100);
  const [user, setUser] = useAtom(userAtom);
  const [country, setCountry] = useState(null);


  const carouselImages = [
    '/login/Slide1.PNG',
    '/login/Slide2.PNG',
    '/login/Slide3.PNG',
    '/login/Slide4.PNG',
  ];


  //fetch country
  const fetchCountry = async()=>{
    try{

      const res = await axios.get('https://ipapi.co/json/')
      const data = res.data;

      setCountry(data.country_name)
    }
    catch(err){
      console.log(err);
      toast.error("Error Occured")
    }
  }


  useEffect(()=>{
    fetchCountry()
  },[])

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



  //handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/login', {
        email,
        password
      },
        {
          withCredentials: true
        });

      const data = response.data;
      if (data.res) {
        setUser(data.user)
        localStorage.setItem("token", data?.token);
        toast.success("Login successful!", "success");
        router.push("/");
      }

    } catch (err) {
      // Handle error - e.g., show error message
      console.error("Login Failed:", err);
      toast.error(err?.data?.message || "Login failed. Please try again.", "error");
    }
  };




  // third party login
  const handleProviderLogin = async (provider) => {
    try {
      // Sign in with the selected provider
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the Firebase ID token
      const token = await user.getIdToken();  // This gives the Firebase ID token

      // Now, send the token to your backend using Axios
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/firebase', {
        token: token,
        country
      }, {
        withCredentials: true
      });

      if (response.data.res) {
        localStorage.setItem("token", response?.data?.token);
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
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

      {/* Right Side - Login Form */}
      <div
        className={`w-full md:w-1/2 h-screen bg-gray-100  sm:p-8 flex flex-col items-center justify-center`}
      >
        <div className="mb-6 flex flex-row justify-center items-center md:mb-8">
          <div className=" h-20">
            <img src="/logo/logo.png" className="h-full w-full object-cover" alt="" />
          </div>
        </div>
        <div className="sm:w-[70%] w-[95%] bg-white sm:mx-auto p-4 border shadow-md">


          <h2 className="text-3xl text-center font-bold mb-4">Sign in</h2>
          <p className="text-gray-500 text-center mb-6">Sign in with your exisitng account</p>

          {/* Social Login Buttons with react-icons */}
          {/* Social Login Icons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handleProviderLogin(googleProvider)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FcGoogle size={40} className="text-xl text-red-500" />
            </button>
            <button
              onClick={() => handleProviderLogin(facebookProvider)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaFacebook size={40} className="text-xl text-blue-600" />
            </button>
            <button
              onClick={() => handleProviderLogin(twitterProvider)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaXTwitter size={40} className="text-xl text-blue-400" />
            </button>
            {/* <button
              onClick={() => handleProviderLogin(githubProvider)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaGithub size={40} className="text-xl" />
            </button> */}
            <button
              onClick={() => handleProviderLogin(yahooProvider)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaYahoo size={40} className="text-xl text-purple-600" />
            </button>
            {/* <button
              onClick={() => handleProviderLogin(appleProvider)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FaApple size={40} className="text-xl" />
            </button> */}
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">
              Or continue with email address
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-lg text-white py-3 px-4 rounded-md shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Login
            </button>
          </form>
          <div className="text-center w-full mt-4">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;