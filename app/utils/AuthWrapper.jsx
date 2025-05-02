import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials, logout } from "./../app/features/authSlice";
import axios from "axios";
import Swal from "sweetalert2";

const AuthWrapper = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/user/getProfile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response);

      if (response.data.status === 1) {
        dispatch(setCredentials(response.data.message));
      } else {
        throw new Error("Invalid user details");
      }
    } catch (e) {
      console.log(e);
      localStorage.removeItem("token");
      dispatch(logout());
      showLoginAlert();
    } finally {
      setLoading(false);
    }
  };

  const showLoginAlert = () => {
    Swal.fire({
      title: "Login Required",
      text: "Please login to continue.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Back to Home",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/app/login");
      } else {
        navigate("/app");
      }
    });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <>{children}</> : null;
};

export default AuthWrapper;
