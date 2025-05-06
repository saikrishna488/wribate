'use client';

import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { userAtom } from '../states/GlobalStates';
import { usePathname } from 'next/navigation';

const Render = () => {
  const [user, setUser] = useAtom(userAtom);
  const path = usePathname();

  if (path.includes('/admin')) return null;

  useEffect(() => {
    const fetchJWTUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/jwt`, {
          withCredentials: true,
        });
        const data = res.data;

        if (data.res && data.user) {
          toast.success("Welcome " + data.user.name);
          setUser(data.user);
        }
      } catch (err) {
        console.log("JWT login not active:", err.response?.data || err.message);
      }
    };

    const fetchFirebaseUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/decode-jwt`, {
          withCredentials: true,
        });
        const data = res.data;

        if (data.res && data.user) {
          toast.success("Welcome " + data.user.name);
          setUser(data.user);
        }
      } catch (err) {
        console.log("Firebase login not active:", err.response?.data || err.message);
      }
    };

    if (!user._id) {
      fetchJWTUser();      // attempt to get manual login
      fetchFirebaseUser(); // attempt to get provider login
    }
  }, []);

  return null;
};

export default Render;
