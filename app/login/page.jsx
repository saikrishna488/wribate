"use client"
import React, { useState, useEffect } from "react";
import { useLoginMutation } from "../services/authApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAtom } from "jotai";
import { userAtom } from "../states/globalStates";
import axios from "axios";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("alluarjun@gmail.com");
  const [password, setPassword] = useState("alluarjun123");
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shimmerPosition, setShimmerPosition] = useState(-100);
  const [user, setUser] = useAtom(userAtom);


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

    //navigate("/");
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
        className={`w-full md:w-1/2 h-screen bg-gray-100  p-8 flex flex-col items-center justify-center`}
      >
        <div className="max-w-md w-full mx-auto">
          <div className="mb-6 flex flex-row justify-center items-center md:mb-8">
            <div className=" h-20">
              <img src="/logo.PNG" className="h-full w-full object-cover" alt="" />
            </div>
          </div>

          <h2 className="text-3xl text-center font-bold mb-4">Sign in</h2>
          <p className="text-gray-500 text-center mb-6">Sign in with Open account</p>

          <div className="flex flex-row justify-center items-center gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 hover:bg-gray-50 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 hover:bg-gray-50 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="black"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span>Apple</span>
            </button>
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
