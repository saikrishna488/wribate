'use client';

import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { userAtom } from '../states/GlobalStates';
import { usePathname } from 'next/navigation';
import authHeader from '../utils/authHeader'

const Render = () => {
  const [user, setUser] = useAtom(userAtom);
  const path = usePathname();

  if (path.includes('/admin')) return null;

  useEffect(() => {
    const fetchJWTUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/jwt`, {
          withCredentials: true,
          headers: authHeader()
        },);
        const data = res.data;

        if (data.res && data.user) {
          toast.success("Welcome " + data.user.name);
          setUser(data.user);
        }
      } catch (err) {
        console.log("JWT login not active:", err.response?.data || err.message);
      }
    };

    if (!user._id) {
      fetchJWTUser();      
    }
  }, []);

  return null;
};

export default Render;
